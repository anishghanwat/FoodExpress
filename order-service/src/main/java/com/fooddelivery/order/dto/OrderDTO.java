package com.fooddelivery.order.dto;

import com.fooddelivery.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private Long restaurantId;
    private String restaurantName;
    private OrderStatus status;
    private Double totalAmount;
    private Double deliveryFee;
    private Double tax;
    private Double grandTotal;
    private String deliveryAddress;
    private String deliveryInstructions;
    private String paymentMethod;
    private String paymentStatus;
    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
