package com.fooddelivery.order.service;

import com.fooddelivery.order.dto.*;
import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderItem;
import com.fooddelivery.order.entity.OrderStatus;
import com.fooddelivery.order.event.OrderEvent;
import com.fooddelivery.order.event.OrderItemEvent;
import com.fooddelivery.order.producer.OrderEventProducer;
import com.fooddelivery.order.repository.OrderRepository;
import com.fooddelivery.order.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final java.util.Optional<OrderEventProducer> orderEventProducer;

    @Transactional
    public OrderDTO createOrder(Long userId, CreateOrderRequest request) {
        // Calculate totals
        double subtotal = request.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        double deliveryFee = 2.99; // Fixed for now, could be dynamic
        double tax = subtotal * 0.08; // 8% tax
        double totalAmount = subtotal + deliveryFee + tax;
        double grandTotal = totalAmount;

        // Create order
        Order order = new Order();
        order.setUserId(userId);
        order.setRestaurantId(request.getRestaurantId());
        order.setRestaurantName(request.getRestaurantName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerName(request.getCustomerName());
        order.setStatus(OrderStatus.PENDING);
        order.setSubtotal(subtotal);
        order.setTotal(totalAmount);
        order.setTotalAmount(totalAmount);
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setGrandTotal(grandTotal);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryInstructions(request.getDeliveryInstructions());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus("PENDING");

        Order savedOrder = orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = request.getItems().stream()
                .map(itemReq -> {
                    OrderItem item = new OrderItem();
                    item.setOrderId(savedOrder.getId());
                    item.setMenuItemId(itemReq.getMenuItemId());
                    item.setItemName(itemReq.getItemName());
                    item.setQuantity(itemReq.getQuantity());
                    item.setPrice(itemReq.getPrice());
                    item.setSubtotal(itemReq.getPrice() * itemReq.getQuantity());
                    item.setSpecialInstructions(itemReq.getSpecialInstructions());
                    return item;
                })
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        // Publish order created event to Kafka
        orderEventProducer.ifPresent(producer -> {
            try {
                producer.publishOrderCreated(savedOrder);
                log.info("Published ORDER_CREATED event for order: {}", savedOrder.getId());
            } catch (Exception e) {
                log.error("Failed to publish ORDER_CREATED event for order: {}", savedOrder.getId(), e);
            }
        });

        return convertToDTO(savedOrder, orderItems);
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return convertToDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return convertToDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getRestaurantOrders(Long restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
        return orders.stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    return convertToDTO(order, items);
                })
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        return convertToDTO(order, items);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        OrderStatus previousStatus = order.getStatus();
        order.setStatus(status);
        Order updated = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        // Publish specific event based on new status
        orderEventProducer.ifPresent(producer -> {
            try {
                switch (status) {
                    case CONFIRMED:
                        producer.publishOrderConfirmed(updated);
                        log.info("Published ORDER_CONFIRMED event for order: {}", orderId);
                        break;
                    case PREPARING:
                        producer.publishOrderPreparing(updated);
                        log.info("Published ORDER_PREPARING event for order: {}", orderId);
                        break;
                    case READY_FOR_PICKUP:
                        producer.publishOrderReadyForPickup(updated);
                        log.info("Published ORDER_READY_FOR_PICKUP event for order: {}", orderId);
                        break;
                    case OUT_FOR_DELIVERY:
                        producer.publishOrderOutForDelivery(updated);
                        log.info("Published ORDER_OUT_FOR_DELIVERY event for order: {}", orderId);
                        break;
                    case DELIVERED:
                        producer.publishOrderDelivered(updated);
                        log.info("Published ORDER_DELIVERED event for order: {}", orderId);
                        break;
                    case CANCELLED:
                        producer.publishOrderCancelled(updated);
                        log.info("Published ORDER_CANCELLED event for order: {}", orderId);
                        break;
                    default:
                        producer.publishOrderStatusChanged(updated, previousStatus);
                        log.info("Published ORDER_STATUS_CHANGED event for order: {} ({}->{})",
                                orderId, previousStatus, status);
                        break;
                }
            } catch (Exception e) {
                log.error("Failed to publish order status event for order: {}", orderId, e);
            }
        });

        return convertToDTO(updated, items);
    }

    @Transactional
    public OrderDTO cancelOrder(Long orderId, Long userId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Verify the order belongs to the user
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this order");
        }

        // Check if order can be cancelled
        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Cannot cancel a delivered order");
        }

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order is already cancelled");
        }

        // Only allow cancellation for PENDING and CONFIRMED orders
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalStateException(
                    "Cannot cancel order in " + order.getStatus() + " status. Please contact support.");
        }

        // Update order status
        OrderStatus previousStatus = order.getStatus();
        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        // Publish cancellation event
        orderEventProducer.ifPresent(producer -> {
            try {
                producer.publishOrderCancelled(updated);
                log.info("Published ORDER_CANCELLED event for order: {} (reason: {})", orderId, reason);
            } catch (Exception e) {
                log.error("Failed to publish ORDER_CANCELLED event for order: {}", orderId, e);
            }
        });

        log.info("Order {} cancelled by user {} (previous status: {}, reason: {})",
                orderId, userId, previousStatus, reason);

        return convertToDTO(updated, items);
    }

    private OrderDTO convertToDTO(Order order, List<OrderItem> items) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setRestaurantId(order.getRestaurantId());
        dto.setRestaurantName(order.getRestaurantName());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setTax(order.getTax());
        dto.setGrandTotal(order.getGrandTotal());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryInstructions(order.getDeliveryInstructions());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemDTO> itemDTOs = items.stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setOrderId(item.getOrderId());
                    itemDTO.setMenuItemId(item.getMenuItemId());
                    itemDTO.setItemName(item.getItemName());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setSubtotal(item.getSubtotal());
                    itemDTO.setSpecialInstructions(item.getSpecialInstructions());
                    return itemDTO;
                })
                .collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
