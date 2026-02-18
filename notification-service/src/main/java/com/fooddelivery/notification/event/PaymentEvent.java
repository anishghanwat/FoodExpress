package com.fooddelivery.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {
    private String eventId;
    private String eventType;
    private Long paymentId;
    private Long orderId;
    private Long userId; // Changed from customerId
    private String customerEmail;
    private String customerName;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private String stripePaymentIntentId;
    private String failureReason;
    private String cancelReason;
    private Double refundAmount;
    private String refundId;
    private LocalDateTime timestamp;
}
