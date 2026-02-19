package com.fooddelivery.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {
    private String eventId;
    private String eventType;
    private Long orderId;
    private Long userId; // Changed from customerId to match Order entity
    private String customerEmail;
    private String customerName;
    private Long restaurantId;
    private String restaurantName;
    private String orderStatus;
    private Double totalAmount;
    private LocalDateTime timestamp;
}
