package com.fooddelivery.payment.entity;

public enum PaymentMethod {
    CASH,
    CARD,           // Generic card payment (credit or debit)
    CREDIT_CARD,
    DEBIT_CARD,
    UPI,
    WALLET
}
