package com.fooddelivery.payment.dto;

import com.fooddelivery.payment.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentIntentRequest {
    private Long orderId;
    private Long customerId;
    private Double amount;
    private String currency;
    private PaymentMethod paymentMethod;
}
