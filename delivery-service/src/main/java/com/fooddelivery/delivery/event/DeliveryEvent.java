package com.fooddelivery.delivery.event;

import com.fooddelivery.delivery.entity.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEvent {
    private String eventId;
    private String eventType;
    private LocalDateTime timestamp;
    private String source;
    
    // Delivery details
    private Long deliveryId;
    private Long orderId;
    private Long agentId;
    private String agentName;
    private DeliveryStatus status;
    private DeliveryStatus previousStatus;
    
    // Addresses
    private String pickupAddress;
    private String deliveryAddress;
    
    // Amounts
    private Double deliveryFee;
    
    // Location coordinates for map tracking
    private Double agentLatitude;
    private Double agentLongitude;
    private Double estimatedDistanceKm;
    private Integer estimatedTimeMinutes;
    
    // Constructor for creating events
    public DeliveryEvent(String eventType, Long deliveryId, Long orderId, Long agentId, DeliveryStatus status) {
        this.eventId = UUID.randomUUID().toString();
        this.eventType = eventType;
        this.timestamp = LocalDateTime.now();
        this.source = "delivery-service";
        this.deliveryId = deliveryId;
        this.orderId = orderId;
        this.agentId = agentId;
        this.status = status;
    }
}
