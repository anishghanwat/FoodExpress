package com.fooddelivery.order.event;

import com.fooddelivery.order.entity.Order;
import com.fooddelivery.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {
    private String eventId;
    private String eventType;
    private LocalDateTime timestamp;
    private String source;

    // Order details
    private Long orderId;
    private Long userId; // Changed from customerId to match Order entity
    private Long restaurantId;
    private String customerEmail;
    private String customerName;
    private String restaurantName;
    private OrderStatus status;
    private OrderStatus previousStatus;

    // Amounts
    private Double subtotal;
    private Double deliveryFee;
    private Double totalAmount;

    // Addresses
    private String deliveryAddress;
    private String restaurantAddress;

    // Items
    private List<OrderItemEvent> items;

    // Constructor for creating events from Order entity
    public OrderEvent(String eventType, Order order) {
        this.eventId = UUID.randomUUID().toString();
        this.eventType = eventType;
        this.timestamp = LocalDateTime.now();
        this.source = "order-service";

        this.orderId = order.getId();
        this.userId = order.getUserId(); // Changed from customerId
        this.restaurantId = order.getRestaurantId();
        this.customerEmail = order.getCustomerEmail();
        this.customerName = order.getCustomerName();
        this.status = order.getStatus();
        this.subtotal = order.getSubtotal();
        this.deliveryFee = order.getDeliveryFee();
        this.totalAmount = order.getTotalAmount();
        this.deliveryAddress = order.getDeliveryAddress();

        // Items will be set separately if needed
        this.items = null;
    }

    // Constructor with previous status for status change events
    public OrderEvent(String eventType, Order order, OrderStatus previousStatus) {
        this(eventType, order);
        this.previousStatus = previousStatus;
    }
}
