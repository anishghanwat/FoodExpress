# Payment Flow - Visual Guide

## 🎯 Overview

This guide shows the complete payment flow from cart to order tracking.

---

## 🔄 Flow Diagrams

### Card Payment Flow (New)

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                          │
└─────────────────────────────────────────────────────────────┘

1. CART
   ├─ Items added
   ├─ Quantities adjusted
   └─ Click "Checkout"
         ↓
2. CHECKOUT PAGE - Delivery Address
   ├─ Fill address fields
   ├─ Enter phone number
   └─ Review order summary
         ↓
3. CHECKOUT PAGE - Payment Method
   ├─ Select "Credit/Debit Card"
   └─ Click "Proceed to Payment"
         ↓
4. BACKEND - Create Payment Intent
   ├─ POST /api/payments/create-intent
   ├─ Amount: $XX.XX
   ├─ Customer ID: X
   └─ Returns: clientSecret, paymentIntentId
         ↓
5. FRONTEND - Show Payment Form
   ├─ Stripe CardElement appears
   ├─ Test card info displayed
   └─ Security notice shown
         ↓
6. CUSTOMER - Enter Card Details
   ├─ Card: 4242 4242 4242 4242
   ├─ Expiry: 12/25
   ├─ CVV: 123
   └─ Click "Pay $XX.XX"
         ↓
7. STRIPE - Process Payment
   ├─ Validate card
   ├─ Check funds
   ├─ Create charge
   └─ Return payment method
         ↓
8. BACKEND - Confirm Payment
   ├─ POST /api/payments/confirm
   ├─ Update payment status: COMPLETED
   ├─ Store charge ID
   └─ Store receipt URL
         ↓
9. BACKEND - Create Order
   ├─ POST /api/orders
   ├─ Link payment ID
   ├─ Status: PENDING
   └─ Publish Kafka event
         ↓
10. FRONTEND - Success
    ├─ Clear cart
    ├─ Show success message
    └─ Redirect to /orders/{id}/track
         ↓
11. ORDER TRACKING PAGE
    ├─ Show order details
    ├─ Show payment status
    ├─ Show delivery status
    └─ Real-time updates
```

### Cash Payment Flow (Existing)

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                          │
└─────────────────────────────────────────────────────────────┘

1. CART
   ├─ Items added
   └─ Click "Checkout"
         ↓
2. CHECKOUT PAGE - Delivery Address
   ├─ Fill address fields
   └─ Enter phone number
         ↓
3. CHECKOUT PAGE - Payment Method
   ├─ Select "Cash on Delivery"
   └─ Click "Place Order"
         ↓
4. BACKEND - Create Order
   ├─ POST /api/orders
   ├─ Payment method: CASH
   ├─ Status: PENDING
   └─ Publish Kafka event
         ↓
5. FRONTEND - Success
    ├─ Clear cart
    ├─ Show success message
    └─ Redirect to /orders/{id}/track
         ↓
6. ORDER TRACKING PAGE
    ├─ Show order details
    ├─ Payment: Cash on Delivery
    └─ Show delivery status
```

---

## 🎨 UI States

### State 1: Initial Checkout

```
┌────────────────────────────────────────────────────────┐
│  Checkout                                    [Back]    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  📍 Delivery Address                                   │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Street Address: [123 Customer St          ]     │ │
│  │ Apartment:      [Apt 4B                   ]     │ │
│  │ City:           [City                     ]     │ │
│  │ State:          [State                    ]     │ │
│  │ ZIP:            [12345                    ]     │ │
│  │ Phone:          [+1234567890              ]     │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  💳 Payment Method                                     │
│  ┌──────────────┐  ┌──────────────┐                  │
│  │   💳 Card    │  │   💵 Cash    │                  │
│  │   Selected   │  │              │                  │
│  └──────────────┘  └──────────────┘                  │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │      [Proceed to Payment]                      │   │
│  └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### State 2: Payment Form Shown

```
┌────────────────────────────────────────────────────────┐
│  Checkout                                    [Back]    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  💳 Payment Method                                     │
│  ┌──────────────┐  ┌──────────────┐                  │
│  │   💳 Card    │  │   💵 Cash    │                  │
│  │   Selected   │  │              │                  │
│  └──────────────┘  └──────────────┘                  │
│                                                        │
│  ┌────────────────────────────────────────────────┐   │
│  │  💳 Card Details                               │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │ [Card Number                    ] 💳     │ │   │
│  │  │ [MM/YY    ] [CVV  ]                      │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  │                                                │   │
│  │  ℹ️ Test Cards:                                │   │
│  │  • Success: 4242 4242 4242 4242               │   │
│  │  • Decline: 4000 0000 0000 0002               │   │
│  │                                                │   │
│  │  🔒 Your payment is secure and encrypted      │   │
│  │                                                │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │      [Pay $28.98]                        │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### State 3: Processing Payment

```
┌────────────────────────────────────────────────────────┐
│  Checkout                                              │
├────────────────────────────────────────────────────────┤
│                                                        │
│  💳 Payment Method                                     │
│  ┌────────────────────────────────────────────────┐   │
│  │  💳 Card Details                               │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │ [4242 4242 4242 4242         ] 💳        │ │   │
│  │  │ [12/25    ] [123  ]                      │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  │                                                │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │      [⏳ Processing...]                   │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### State 4: Success

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│              ✅ Payment Successful!                    │
│                                                        │
│           Creating your order...                       │
│                                                        │
│              [Redirecting...]                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🔄 Backend Flow

### Payment Intent Creation

```
Frontend                Backend                 Stripe
   │                       │                       │
   │  POST /create-intent  │                       │
   ├──────────────────────>│                       │
   │                       │  Create PaymentIntent │
   │                       ├──────────────────────>│
   │                       │                       │
   │                       │  PaymentIntent Object │
   │                       │<──────────────────────┤
   │                       │                       │
   │  Save to DB           │                       │
   │  (status: PENDING)    │                       │
   │                       │                       │
   │  Return clientSecret  │                       │
   │<──────────────────────┤                       │
   │                       │                       │
```

### Payment Processing

```
Frontend                Backend                 Stripe
   │                       │                       │
   │  Enter card details   │                       │
   │  Click "Pay"          │                       │
   │                       │                       │
   │  Create PaymentMethod │                       │
   ├──────────────────────────────────────────────>│
   │                       │                       │
   │                       │  Validate & Process   │
   │                       │                       │
   │  PaymentMethod Object │                       │
   │<──────────────────────────────────────────────┤
   │                       │                       │
   │  POST /confirm        │                       │
   ├──────────────────────>│                       │
   │                       │  Retrieve PaymentIntent
   │                       ├──────────────────────>│
   │                       │                       │
   │                       │  PaymentIntent        │
   │                       │  (status: succeeded)  │
   │                       │<──────────────────────┤
   │                       │                       │
   │  Update DB            │                       │
   │  (status: COMPLETED)  │                       │
   │                       │                       │
   │  Success Response     │                       │
   │<──────────────────────┤                       │
   │                       │                       │
```

### Order Creation

```
Frontend                Order Service           Payment Service
   │                       │                       │
   │  POST /orders         │                       │
   ├──────────────────────>│                       │
   │                       │                       │
   │                       │  Verify Payment       │
   │                       ├──────────────────────>│
   │                       │                       │
   │                       │  Payment Status       │
   │                       │<──────────────────────┤
   │                       │                       │
   │  Create Order         │                       │
   │  (status: PENDING)    │                       │
   │                       │                       │
   │  Publish Kafka Event  │                       │
   │  (ORDER_CREATED)      │                       │
   │                       │                       │
   │  Order Response       │                       │
   │<──────────────────────┤                       │
   │                       │                       │
```

---

## 🎯 Decision Points

### Payment Method Selection

```
User selects payment method
         │
         ├─ Card?
         │    │
         │    ├─ Yes → Show "Proceed to Payment" button
         │    │         │
         │    │         ├─ Click → Create payment intent
         │    │         │           │
         │    │         │           └─ Show PaymentForm
         │    │         │
         │    │         └─ Enter card → Process payment
         │    │                         │
         │    │                         ├─ Success → Create order
         │    │                         │
         │    │                         └─ Failure → Show error
         │    │
         │    └─ No → Continue
         │
         └─ Cash?
              │
              └─ Yes → Show "Place Order" button
                       │
                       └─ Click → Create order directly
```

### Error Handling

```
Payment Processing
         │
         ├─ Payment Intent Creation Failed?
         │    │
         │    ├─ Yes → Show error message
         │    │         │
         │    │         └─ User can retry
         │    │
         │    └─ No → Continue
         │
         ├─ Card Validation Failed?
         │    │
         │    ├─ Yes → Show validation error
         │    │         │
         │    │         └─ User can correct
         │    │
         │    └─ No → Continue
         │
         ├─ Payment Processing Failed?
         │    │
         │    ├─ Yes → Show error message
         │    │         │
         │    │         └─ User can retry
         │    │
         │    └─ No → Continue
         │
         └─ Order Creation Failed?
              │
              ├─ Yes → Show error message
              │         │
              │         └─ Payment already processed
              │             │
              │             └─ Contact support
              │
              └─ No → Success!
```

---

## 📊 Data Flow

### Payment Data

```
Frontend Form Data
├─ address: "123 Customer St"
├─ city: "City"
├─ state: "State"
├─ zipCode: "12345"
├─ phone: "+1234567890"
└─ paymentMethod: "CARD"
         ↓
Payment Intent Request
├─ orderId: 0 (temporary)
├─ customerId: 1
├─ amount: 28.98
├─ currency: "usd"
└─ paymentMethod: "CARD"
         ↓
Payment Intent Response
├─ paymentId: 1
├─ clientSecret: "pi_xxx_secret_xxx"
├─ paymentIntentId: "pi_xxx"
├─ amount: 28.98
├─ currency: "USD"
└─ status: "PENDING"
         ↓
Stripe CardElement
├─ cardNumber: "4242 4242 4242 4242"
├─ expiry: "12/25"
└─ cvv: "123"
         ↓
Payment Method Object
├─ id: "pm_xxx"
├─ type: "card"
└─ card: { brand, last4, ... }
         ↓
Payment Confirmation
├─ paymentIntentId: "pi_xxx"
└─ status: "COMPLETED"
         ↓
Order Creation
├─ restaurantId: 1
├─ items: [...]
├─ deliveryAddress: "123 Customer St, ..."
├─ paymentMethod: "CARD"
└─ paymentId: 1
         ↓
Order Response
├─ id: 5
├─ status: "PENDING"
├─ total: 28.98
└─ estimatedDelivery: "30-45 min"
```

---

## 🔐 Security Flow

```
1. User enters card details
   ├─ Card data goes directly to Stripe
   ├─ Never touches our servers
   └─ Stripe returns payment method token
         ↓
2. Frontend sends token to backend
   ├─ Token is safe to transmit
   └─ Cannot be used to charge card again
         ↓
3. Backend confirms with Stripe
   ├─ Uses secret API key
   ├─ Verifies payment succeeded
   └─ Updates database
         ↓
4. Order created
   ├─ Links to payment ID
   ├─ No card details stored
   └─ Only Stripe IDs stored
```

---

## 🎉 Success Indicators

### Visual Indicators

```
✅ Payment form appears
✅ Card validation works
✅ "Processing..." shows during payment
✅ Success message appears
✅ Cart badge shows 0
✅ Redirected to tracking page
```

### Backend Indicators

```
✅ Payment intent in database (status: PENDING)
✅ Payment intent in Stripe Dashboard
✅ Payment confirmed (status: COMPLETED)
✅ Charge ID stored
✅ Order created
✅ Order linked to payment
```

### User Experience

```
✅ Smooth transition between steps
✅ Clear error messages
✅ Loading states visible
✅ Can retry on failure
✅ Order tracking works
```

---

## 📱 Mobile Flow

Same flow as desktop, but:
- Single column layout
- Larger touch targets
- Simplified payment form
- Bottom sheet for payment
- Optimized for thumb reach

---

## 🎯 Quick Reference

### Test Cards

| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ❌ Insufficient funds |

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| POST /api/payments/create-intent | Create payment intent |
| POST /api/payments/confirm | Confirm payment |
| POST /api/orders | Create order |
| GET /api/orders/{id} | Get order details |

### States

| State | Description |
|-------|-------------|
| Initial | Address form, payment method selection |
| Payment Form | Stripe CardElement visible |
| Processing | Payment being processed |
| Success | Order created, redirecting |
| Error | Error message, can retry |

---

This visual guide helps understand the complete payment flow from start to finish!
