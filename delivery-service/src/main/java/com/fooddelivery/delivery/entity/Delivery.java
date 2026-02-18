package com.fooddelivery.delivery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long orderId;
    
    private Long agentId;
    
    private Long restaurantId;
    
    private Long customerId;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status = DeliveryStatus.ASSIGNED;
    
    @Column(nullable = false)
    private String pickupAddress;
    
    @Column(nullable = false)
    private String deliveryAddress;
    
    private Double deliveryFee;
    
    private LocalDateTime pickupTime;
    
    private LocalDateTime deliveryTime;
    
    private String currentLocation;
    
    // Location coordinates for map tracking
    @Column(name = "pickup_latitude")
    private Double pickupLatitude;
    
    @Column(name = "pickup_longitude")
    private Double pickupLongitude;
    
    @Column(name = "delivery_latitude")
    private Double deliveryLatitude;
    
    @Column(name = "delivery_longitude")
    private Double deliveryLongitude;
    
    @Column(name = "agent_latitude")
    private Double agentLatitude;
    
    @Column(name = "agent_longitude")
    private Double agentLongitude;
    
    @Column(name = "estimated_distance_km")
    private Double estimatedDistanceKm;
    
    @Column(name = "estimated_time_minutes")
    private Integer estimatedTimeMinutes;
    
    @Column(name = "last_location_update")
    private LocalDateTime lastLocationUpdate;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
