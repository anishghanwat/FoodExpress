package com.fooddelivery.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long orderId;
    private Long menuItemId;
    private String itemName;
    private Integer quantity;
    private Double price;
    private Double subtotal;
    private String specialInstructions;
}
