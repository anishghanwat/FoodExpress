package com.fooddelivery.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {
    private Long menuItemId;
    private String itemName;
    private Integer quantity;
    private Double price;
    private String specialInstructions;
}
