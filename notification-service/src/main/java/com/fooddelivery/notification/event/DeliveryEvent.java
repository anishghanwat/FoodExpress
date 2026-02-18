package com.fooddelivery.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEvent {
    private String eventId;
    private String eventType;
    private Long deliveryId;
    private Long orderId;
    private Long customerId;
    private Long agentId;
    private String deliveryStatus;
    private String pickupAddress;
    private String deliveryAddress;
    private LocalDateTime timestamp;
}
