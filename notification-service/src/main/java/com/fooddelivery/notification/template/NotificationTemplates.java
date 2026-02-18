package com.fooddelivery.notification.template;

public class NotificationTemplates {
    
    // Order Templates
    public static final String ORDER_PLACED = "Order #%s placed successfully! Total: $%.2f";
    public static final String ORDER_CONFIRMED = "Restaurant confirmed your order #%s";
    public static final String ORDER_PREPARING = "Your order #%s is being prepared";
    public static final String ORDER_READY = "Order #%s is ready for pickup!";
    public static final String ORDER_PICKED_UP = "Delivery agent picked up your order #%s";
    public static final String ORDER_ON_THE_WAY = "Your order #%s is on the way!";
    public static final String ORDER_DELIVERED = "Order #%s delivered! Enjoy your meal 🎉";
    public static final String ORDER_CANCELLED = "Order #%s has been cancelled";
    
    // Payment Templates
    public static final String PAYMENT_SUCCESS = "Payment of $%.2f successful for order #%s";
    public static final String PAYMENT_FAILED = "Payment failed for order #%s. Please retry.";
    public static final String PAYMENT_REFUNDED = "Refund of $%.2f processed for order #%s";
    public static final String PAYMENT_PROCESSING = "Processing payment of $%.2f for order #%s";
    
    // Delivery Templates (Agent)
    public static final String NEW_DELIVERY_AVAILABLE = "New delivery available! Order #%s";
    public static final String DELIVERY_ASSIGNED = "Delivery #%s assigned to you";
    public static final String DELIVERY_COMPLETED = "Delivery #%s completed! Earnings: $%.2f";
    
    // Restaurant Templates (Owner)
    public static final String NEW_ORDER_RECEIVED = "New order #%s received! Total: $%.2f";
    public static final String ORDER_PICKED_UP_OWNER = "Order #%s picked up by delivery agent";
    
    // Admin Templates
    public static final String NEW_ORDER_ADMIN = "New order #%s in the system";
    public static final String PAYMENT_RECEIVED_ADMIN = "Payment of $%.2f received";
    public static final String NEW_USER_REGISTERED = "New %s registered: %s";
    
    // Titles
    public static final String TITLE_ORDER_PLACED = "Order Placed";
    public static final String TITLE_ORDER_CONFIRMED = "Order Confirmed";
    public static final String TITLE_ORDER_PREPARING = "Order Preparing";
    public static final String TITLE_ORDER_READY = "Order Ready";
    public static final String TITLE_ORDER_PICKED_UP = "Order Picked Up";
    public static final String TITLE_ORDER_ON_THE_WAY = "Order On The Way";
    public static final String TITLE_ORDER_DELIVERED = "Order Delivered";
    public static final String TITLE_ORDER_CANCELLED = "Order Cancelled";
    
    public static final String TITLE_PAYMENT_SUCCESS = "Payment Successful";
    public static final String TITLE_PAYMENT_FAILED = "Payment Failed";
    public static final String TITLE_PAYMENT_REFUNDED = "Refund Processed";
    public static final String TITLE_PAYMENT_PROCESSING = "Payment Processing";
    
    public static final String TITLE_NEW_DELIVERY = "New Delivery Available";
    public static final String TITLE_DELIVERY_ASSIGNED = "Delivery Assigned";
    public static final String TITLE_DELIVERY_COMPLETED = "Delivery Completed";
    
    public static final String TITLE_NEW_ORDER = "New Order";
    public static final String TITLE_ORDER_PICKED_UP_OWNER = "Order Picked Up";
}
