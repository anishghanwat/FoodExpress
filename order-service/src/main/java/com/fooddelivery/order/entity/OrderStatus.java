package com.fooddelivery.order.entity;

public enum OrderStatus {
    PAYMENT_PENDING,      // Waiting for payment to complete
    PAYMENT_FAILED,       // Payment failed
    PENDING,              // Payment successful, order pending restaurant confirmation
    CONFIRMED,            // Restaurant confirmed
    PREPARING,            // Restaurant preparing food
    READY_FOR_PICKUP,     // Food ready for delivery agent
    OUT_FOR_DELIVERY,     // Delivery agent picked up
    DELIVERED,            // Delivered to customer
    CANCELLED,            // Order cancelled
    REFUNDED              // Payment refunded
}
