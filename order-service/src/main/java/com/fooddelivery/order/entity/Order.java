package com.fooddelivery.order.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long userId;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "restaurant_name")
    private String restaurantName;

    @Column(nullable = false)
    private Long restaurantId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(nullable = false)
    private Double subtotal;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private Double deliveryFee;

    @Column(nullable = false)
    private Double tax;

    @Column(nullable = false)
    private Double grandTotal;

    @Column(nullable = false)
    private String deliveryAddress;

    private String deliveryInstructions;

    private String paymentMethod;

    private String paymentStatus;

    private Long paymentId; // Link to payment record

    private Long deliveryAgentId;

    private LocalDateTime estimatedDeliveryTime;

    private LocalDateTime actualDeliveryTime;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
