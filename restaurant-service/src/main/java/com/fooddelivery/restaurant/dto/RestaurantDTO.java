package com.fooddelivery.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long id;
    private Long ownerId;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String imageUrl;
    private String cuisine;
    private Double rating;
    private Integer totalReviews;
    private Boolean isActive;
    private String openingTime;
    private String closingTime;
    private Double deliveryFee;
    private Integer estimatedDeliveryTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
