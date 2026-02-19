package com.fooddelivery.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentIntentResponse {
    private Long paymentId;
    private String clientSecret; // Keep for backward compatibility if needed, but we'll use orderId
    private String paymentIntentId; // Keep or replace
    private String razorpayOrderId;
    private String razorpayKeyId;
    private Double amount;
    private String currency;
    private String status;
}
