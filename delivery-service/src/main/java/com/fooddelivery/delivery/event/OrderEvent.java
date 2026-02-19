package com.fooddelivery.delivery.event;

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
    private LocalDateTime timestamp;
    private String source;
    
    // Order details
    private Long orderId;
    private Long userId;
    private Long restaurantId;
    private String customerName;
    private String restaurantName;
    private String status;
    private String previousStatus;
    
    // Amounts
    private Double subtotal;
    private Double deliveryFee;
    private Double totalAmount;
    
    // Addresses
    private String deliveryAddress;
    private String restaurantAddress;
}
