package com.fooddelivery.order.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Payment event received from payment-service via Kafka
 * Mirror of payment-service PaymentEvent for deserialization
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {
    
    // Event metadata
    private String eventId;
    private String eventType;
    private LocalDateTime timestamp;
    private String source;
    
    // Payment details
    private Long paymentId;
    private Long orderId;
    private Long userId;
    private String stripePaymentIntentId;
    private String stripeChargeId;
    
    // Amount details
    private Double amount;
    private String currency;
    
    // Status (using String to avoid enum dependency)
    private String status;
    private String previousStatus;
    
    // Payment method
    private String paymentMethod;
    private String paymentMethodId;
    
    // Additional info
    private String receiptUrl;
    private String failureReason;
    private String errorCode;
    private String cancelReason;
    private String refundReason;
    private Double refundAmount;
    private String refundId;
}
