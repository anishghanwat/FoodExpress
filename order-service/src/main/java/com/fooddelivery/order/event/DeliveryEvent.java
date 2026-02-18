package com.fooddelivery.order.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEvent {
    private String eventId;
    private LocalDateTime timestamp;
    private String eventType;
    private String source;
    
    // Delivery details
    private Long deliveryId;
    private Long orderId;
    private Long agentId;
    private Long restaurantId;
    private Long customerId;
    private String status;
    
    // Addresses
    private String pickupAddress;
    private String deliveryAddress;
    
    // Timing
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
    
    // Additional info
    private String currentLocation;
    private Double deliveryFee;
}
