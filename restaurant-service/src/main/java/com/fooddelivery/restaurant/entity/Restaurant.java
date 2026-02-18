package com.fooddelivery.restaurant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long ownerId;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String address;
    
    @Column(nullable = false)
    private String phone;
    
    private String email;
    
    private String imageUrl;
    
    @Column(nullable = false)
    private String cuisine;
    
    @Column(nullable = false)
    private Double rating = 0.0;
    
    @Column(nullable = false)
    private Integer totalReviews = 0;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private String openingTime;
    
    @Column(nullable = false)
    private String closingTime;
    
    @Column(nullable = false)
    private Double deliveryFee = 0.0;
    
    @Column(nullable = false)
    private Integer estimatedDeliveryTime = 30;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
