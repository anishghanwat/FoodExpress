# Payment Method Enum Fix ✅

## 🐛 Problem

Frontend was sending `paymentMethod: "CARD"` but the backend enum only had:
- CASH
- CREDIT_CARD
- DEBIT_CARD
- UPI
- WALLET

Error: `Cannot deserialize value of type PaymentMethod from String "CARD"`

## ✅ Solution

Added `CARD` to the PaymentMethod enum:

```java
public enum PaymentMethod {
    CASH,
    CARD,           // Generic card payment (credit or debit)
    CREDIT_CARD,
    DEBIT_CARD,
    UPI,
    WALLET
}
```

## 🔄 Restart Required

Restart payment-service:
```bash
cd payment-service
mvn spring-boot:run
```

Wait for: `Started PaymentServiceApplication`

## ✅ Test Again

1. Go to checkout
2. Fill address
3. Select "Credit/Debit Card"
4. Click "Proceed to Payment"
5. Payment intent should be created successfully
6. Payment form should appear

The enum error should be gone!
