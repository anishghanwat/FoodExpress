package com.fooddelivery.order.consumer;

import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderStatus;
import com.fooddelivery.order.event.DeliveryEvent;
import com.fooddelivery.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryEventConsumer {
    
    private final OrderRepository orderRepository;
    
    @KafkaListener(
        topics = "delivery-picked-up",
        groupId = "order-service-group",
        containerFactory = "deliveryEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void consumeDeliveryPickedUp(DeliveryEvent event) {
        try {
            log.info("📦 Received DELIVERY_PICKED_UP event: deliveryId={}, orderId={}", 
                    event.getDeliveryId(), event.getOrderId());
            
            Order order = orderRepository.findById(event.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found: " + event.getOrderId()));
            
            if (order.getStatus() == OrderStatus.READY_FOR_PICKUP) {
                order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
                orderRepository.save(order);
                log.info("✅ Order status updated: orderId={}, status=OUT_FOR_DELIVERY", event.getOrderId());
            } else {
                log.warn("⚠️ Order status not updated. Current status: {}", order.getStatus());
            }
            
        } catch (Exception e) {
            log.error("❌ Error processing DELIVERY_PICKED_UP event for order: {}", 
                    event.getOrderId(), e);
        }
    }
    
    @KafkaListener(
        topics = "delivery-delivered",
        groupId = "order-service-group",
        containerFactory = "deliveryEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void consumeDeliveryDelivered(DeliveryEvent event) {
        try {
            log.info("📦 Received DELIVERY_DELIVERED event: deliveryId={}, orderId={}", 
                    event.getDeliveryId(), event.getOrderId());
            
            Order order = orderRepository.findById(event.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found: " + event.getOrderId()));
            
            if (order.getStatus() == OrderStatus.OUT_FOR_DELIVERY) {
                order.setStatus(OrderStatus.DELIVERED);
                orderRepository.save(order);
                log.info("✅ Order status updated: orderId={}, status=DELIVERED", event.getOrderId());
            } else {
                log.warn("⚠️ Order status not updated. Current status: {}", order.getStatus());
            }
            
        } catch (Exception e) {
            log.error("❌ Error processing DELIVERY_DELIVERED event for order: {}", 
                    event.getOrderId(), e);
        }
    }
    
    @KafkaListener(
        topics = "delivery-cancelled",
        groupId = "order-service-group",
        containerFactory = "deliveryEventKafkaListenerContainerFactory"
    )
    @Transactional
    public void consumeDeliveryCancelled(DeliveryEvent event) {
        try {
            log.info("🚫 Received DELIVERY_CANCELLED event: deliveryId={}, orderId={}", 
                    event.getDeliveryId(), event.getOrderId());
            
            Order order = orderRepository.findById(event.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found: " + event.getOrderId()));
            
            // Only cancel order if it's not already delivered
            if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.CANCELLED) {
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);
                log.info("✅ Order cancelled: orderId={}", event.getOrderId());
            }
            
        } catch (Exception e) {
            log.error("❌ Error processing DELIVERY_CANCELLED event for order: {}", 
                    event.getOrderId(), e);
        }
    }
}
