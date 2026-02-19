package com.fooddelivery.payment.event;

import com.fooddelivery.payment.entity.Payment;
import com.fooddelivery.payment.entity.PaymentMethod;
import com.fooddelivery.payment.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Event object for payment-related events
 * Published to Kafka for event-driven communication
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
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String transactionId;

    // Amount details
    private Double amount;
    private String currency;

    // Status
    private PaymentStatus status;
    private PaymentStatus previousStatus;

    // Payment method
    private PaymentMethod paymentMethod;

    // Additional info
    private String receiptUrl;
    private String failureReason;
    private String errorCode;
    private String cancelReason;
    private String refundReason;
    private Double refundAmount;
    private String refundId;

    /**
     * Constructor to create event from Payment entity
     */
    public PaymentEvent(String eventType, Payment payment) {
        this.eventId = UUID.randomUUID().toString();
        this.eventType = eventType;
        this.timestamp = LocalDateTime.now();
        this.source = "payment-service";

        this.paymentId = payment.getId();
        this.orderId = payment.getOrderId();
        this.userId = payment.getCustomerId();
        this.razorpayOrderId = payment.getRazorpayOrderId();
        this.razorpayPaymentId = payment.getRazorpayPaymentId();
        this.transactionId = payment.getTransactionId();

        this.amount = payment.getAmount();
        this.currency = payment.getCurrency();

        this.status = payment.getStatus();
        this.paymentMethod = payment.getPaymentMethod();

        this.receiptUrl = payment.getReceiptUrl();
        this.failureReason = payment.getFailureReason();
    }

    /**
     * Constructor with previous status for status change events
     */
    public PaymentEvent(String eventType, Payment payment, PaymentStatus previousStatus) {
        this(eventType, payment);
        this.previousStatus = previousStatus;
    }

    /**
     * Constructor for refund events
     */
    public PaymentEvent(String eventType, Payment payment, Double refundAmount, String refundReason) {
        this(eventType, payment);
        this.refundAmount = refundAmount;
        this.refundReason = refundReason;
    }

    /**
     * Constructor for refund completed events
     */
    public PaymentEvent(String eventType, Payment payment, String refundId, Double refundAmount) {
        this(eventType, payment);
        this.refundId = refundId;
        this.refundAmount = refundAmount;
    }
}
