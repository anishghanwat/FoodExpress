package com.fooddelivery.delivery.dto;

import com.fooddelivery.delivery.entity.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {
    private Long id;
    private Long orderId;
    private Long agentId;
    private DeliveryStatus status;
    private String pickupAddress;
    private String deliveryAddress;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
    private String currentLocation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Location coordinates for map tracking
    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Double agentLatitude;
    private Double agentLongitude;
    private Double estimatedDistanceKm;
    private Integer estimatedTimeMinutes;
    private LocalDateTime lastLocationUpdate;
    
    // Additional fields for agent view
    private Double orderAmount;
    private String customerName;
    private String restaurantName;
    private Double deliveryFee;
}
