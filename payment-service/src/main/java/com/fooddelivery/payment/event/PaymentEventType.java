package com.fooddelivery.payment.event;

/**
 * Constants for payment event types
 * Used to identify different payment lifecycle events
 */
public class PaymentEventType {
    
    // Payment lifecycle events
    public static final String PAYMENT_INITIATED = "PAYMENT_INITIATED";
    public static final String PAYMENT_PROCESSING = "PAYMENT_PROCESSING";
    public static final String PAYMENT_COMPLETED = "PAYMENT_COMPLETED";
    public static final String PAYMENT_FAILED = "PAYMENT_FAILED";
    public static final String PAYMENT_CANCELLED = "PAYMENT_CANCELLED";
    
    // Refund events
    public static final String PAYMENT_REFUND_INITIATED = "PAYMENT_REFUND_INITIATED";
    public static final String PAYMENT_REFUNDED = "PAYMENT_REFUNDED";
    
    // Webhook events
    public static final String PAYMENT_WEBHOOK_RECEIVED = "PAYMENT_WEBHOOK_RECEIVED";
    
    private PaymentEventType() {
        // Private constructor to prevent instantiation
    }
}
