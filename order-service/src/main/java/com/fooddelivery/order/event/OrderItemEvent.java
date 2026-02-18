package com.fooddelivery.order.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemEvent {
    private Long menuItemId;
    private String itemName;
    private Integer quantity;
    private Double price;
}
