package com.fooddelivery.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private Long restaurantId;
    private String restaurantName;
    private String customerEmail;
    private String customerName;
    private String deliveryAddress;
    private String deliveryInstructions;
    private String paymentMethod;
    private List<OrderItemRequest> items;
}
