# Kafka Payment Flow - Visual Diagrams

## 🎨 Complete Payment Flow with Kafka

### Successful Payment Flow

```
┌──────────┐      ┌──────────────┐      ┌───────┐      ┌──────────────┐      ┌──────────────┐
│ Frontend │      │Payment Service│      │ Kafka │      │Order Service │      │Delivery Svc  │
└────┬─────┘      └──────┬───────┘      └───┬───┘      └──────┬───────┘      └──────┬───────┘
     │                   │                   │                 │                     │
     │ 1. Create Intent  │                   │                 │                     │
     ├──────────────────>│                   │                 │                     │
     │                   │                   │                 │                     │
     │                   │ 2. Create Stripe  │                 │                     │
     │                   │    PaymentIntent  │                 │                     │
     │                   │                   │                 │                     │
     │                   │ 3. Save Payment   │                 │                     │
     │                   │    (PENDING)      │                 │                     │
     │                   │                   │                 │                     │
     │                   │ 4. Publish Event  │                 │                     │
     │                   ├──────────────────>│                 │                     │
     │                   │ PAYMENT_INITIATED │                 │                     │
     │                   │                   │                 │                     │
     │                   │                   │ 5. Consume      │                     │
     │                   │                   ├────────────────>│                     │
     │                   │                   │                 │                     │
     │                   │                   │                 │ 6. Create Order     │
     │                   │                   │                 │    (PAYMENT_PENDING)│
     │                   │                   │                 │                     │
     │ 7. Return Client  │                   │                 │                     │
     │    Secret         │                   │                 │                     │
     │<──────────────────┤                   │                 │                     │
     │                   │                   │                 │                     │
     │ 8. Show Payment   │                   │                 │                     │
     │    Form (Stripe)  │                   │                 │                     │
     │                   │                   │                 │                     │
     │ 9. User Enters    │                   │                 │                     │
     │    Card Details   │                   │                 │                     │
     │                   │                   │                 │                     │
     │ 10. Confirm       │                   │                 │                     │
     │     Payment       │                   │                 │                     │
     ├──────────────────>│                   │                 │                     │
     │                   │                   │                 │                     │
     │                   │ 11. Confirm with  │                 │                     │
     │                   │     Stripe        │                 │                     │
     │                   │                   │                 │                     │
     │                   │ 12. Update Payment│                 │                     │
     │                   │     (COMPLETED)   │                 │                     │
     │                   │                   │                 │                     │
     │                   │ 13. Publish Event │                 │                     │
     │                   ├──────────────────>│                 │                     │
     │                   │ PAYMENT_COMPLETED │                 │                     │
     │                   │                   │                 │                     │
     │                   │                   │ 14. Consume     │                     │
     │                   │                   ├────────────────>│                     │
     │                   │                   │                 │                     │
     │                   │                   │                 │ 15. Update Order    │
     │                   │                   │                 │     (PENDING)       │
     │                   │                   │                 │                     │
     │                   │                   │                 │ 16. Publish Event   │
     │                   │                   │                 ├────────────────────>│
     │                   │                   │                 │ ORDER_CREATED       │
     │                   │                   │                 │                     │
     │                   │                   │                 │                     │ 17. Create
     │                   │                   │                 │                     │     Delivery
     │                   │                   │                 │                     │
     │ 18. Success!      │                   │                 │                     │
     │<──────────────────┤                   │                 │                     │
     │                   │                   │                 │                     │
     │ 19. Redirect to   │                   │                 │                     │
     │     Order Tracking│                   │                 │                     │
     │                   │                   │                 │                     │
```

---

### Failed Payment Flow

```
┌──────────┐      ┌──────────────┐      ┌───────┐      ┌──────────────┐
│ Frontend │      │Payment Service│      │ Kafka │      │Order Service │
└────┬─────┘      └──────┬───────┘      └───┬───┘      └──────┬───────┘
     │                   │                   │                 │
     │ 1-7. Same as      │                   │                 │
     │      Success Flow │                   │                 │
     │                   │                   │                 │
     │ 8. User Enters    │                   │                 │
     │    Invalid Card   │                   │                 │
     │                   │                   │                 │
     │ 9. Confirm        │                   │                 │
     │    Payment        │                   │                 │
     ├──────────────────>│                   │                 │
     │                   │                   │                 │
     │                   │ 10. Stripe        │                 │
     │                   │     Declines      │                 │
     │                   │                   │                 │
     │                   │ 11. Update Payment│                 │
     │                   │     (FAILED)      │                 │
     │                   │                   │                 │
     │                   │ 12. Publish Event │                 │
     │                   ├──────────────────>│                 │
     │                   │ PAYMENT_FAILED    │                 │
     │                   │                   │                 │
     │                   │                   │ 13. Consume     │
     │                   │                   ├────────────────>│
     │                   │                   │                 │
     │                   │                   │                 │ 14. Update Order
     │                   │                   │                 │     (PAYMENT_FAILED)
     │                   │                   │                 │
     │ 15. Error Message │                   │                 │
     │<──────────────────┤                   │                 │
     │                   │                   │                 │
     │ 16. Show Retry    │                   │                 │
     │     Option        │                   │                 │
     │                   │                   │                 │
```

---

### Refund Flow (Order Cancelled)

```
┌──────────┐      ┌──────────────┐      ┌───────┐      ┌──────────────┐
│ Frontend │      │Order Service │      │ Kafka │      │Payment Service│
└────┬─────┘      └──────┬───────┘      └───┬───┘      └──────┬────────┘
     │                   │                   │                 │
     │ 1. Cancel Order   │                   │                 │
     ├──────────────────>│                   │                 │
     │                   │                   │                 │
     │                   │ 2. Check Payment  │                 │
     │                   │    Status         │                 │
     │                   │                   │                 │
     │                   │ 3. Publish Event  │                 │
     │                   ├──────────────────>│                 │
     │                   │ PAYMENT_REFUND_   │                 │
     │                   │ INITIATED         │                 │
     │                   │                   │                 │
     │                   │                   │ 4. Consume      │
     │                   │                   ├────────────────>│
     │                   │                   │                 │
     │                   │                   │                 │ 5. Process Refund
     │                   │                   │                 │    with Stripe
     │                   │                   │                 │
     │                   │                   │                 │ 6. Update Payment
     │                   │                   │                 │    (REFUNDED)
     │                   │                   │                 │
     │                   │                   │ 7. Publish Event│
     │                   │                   │<────────────────┤
     │                   │                   │ PAYMENT_REFUNDED│
     │                   │                   │                 │
     │                   │ 8. Consume        │                 │
     │                   │<──────────────────┤                 │
     │                   │                   │                 │
     │                   │ 9. Update Order   │                 │
     │                   │    (REFUNDED)     │                 │
     │                   │                   │                 │
     │ 10. Confirmation  │                   │                 │
     │<──────────────────┤                   │                 │
     │                   │                   │                 │
```

---

## 📊 Event Flow Matrix

### Who Publishes What

| Service | Event | When | Payload |
|---------|-------|------|---------|
| Payment Service | PAYMENT_INITIATED | Payment intent created | orderId, amount, userId |
| Payment Service | PAYMENT_PROCESSING | Payment submitted to Stripe | paymentId, stripeIntentId |
| Payment Service | PAYMENT_COMPLETED | Stripe confirms success | paymentId, orderId, receiptUrl |
| Payment Service | PAYMENT_FAILED | Stripe rejects payment | paymentId, orderId, failureReason |
| Payment Service | PAYMENT_CANCELLED | User cancels payment | paymentId, orderId, cancelReason |
| Payment Service | PAYMENT_REFUNDED | Refund processed | paymentId, orderId, refundId |
| Order Service | PAYMENT_REFUND_INITIATED | Order cancelled with payment | orderId, paymentId, reason |

### Who Consumes What

| Service | Event | Action |
|---------|-------|--------|
| Order Service | PAYMENT_INITIATED | Create order with PAYMENT_PENDING status |
| Order Service | PAYMENT_COMPLETED | Update order to PENDING, publish ORDER_CREATED |
| Order Service | PAYMENT_FAILED | Update order to PAYMENT_FAILED |
| Order Service | PAYMENT_REFUNDED | Update order to REFUNDED |
| Payment Service | PAYMENT_REFUND_INITIATED | Process refund via Stripe |
| Notification Service | PAYMENT_COMPLETED | Send confirmation email/SMS |
| Notification Service | PAYMENT_FAILED | Send failure notification |
| Notification Service | PAYMENT_REFUNDED | Send refund confirmation |
| Analytics Service | All Payment Events | Track metrics, generate reports |

---

## 🔄 State Transitions

### Payment States
```
                    ┌──────────────┐
                    │   PENDING    │ (Payment intent created)
                    └──────┬───────┘
                           │
                ┏━━━━━━━━━━┻━━━━━━━━━━┓
                ▼                      ▼
        ┌──────────────┐      ┌──────────────┐
        │  PROCESSING  │      │  CANCELLED   │ (User cancelled)
        └──────┬───────┘      └──────────────┘
               │
        ┏━━━━━━┻━━━━━━┓
        ▼              ▼
┌──────────────┐  ┌──────────────┐
│  COMPLETED   │  │    FAILED    │ (Stripe declined)
└──────┬───────┘  └──────────────┘
       │
       ▼
┌──────────────┐
│   REFUNDED   │ (Order cancelled)
└──────────────┘
```

### Order States (with Payment)
```
                    ┌──────────────────┐
                    │ PAYMENT_PENDING  │ (Waiting for payment)
                    └────────┬─────────┘
                             │
                  ┏━━━━━━━━━━┻━━━━━━━━━━┓
                  ▼                      ▼
        ┌──────────────────┐    ┌──────────────────┐
        │     PENDING      │    │ PAYMENT_FAILED   │ (Payment declined)
        └────────┬─────────┘    └──────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │    CONFIRMED     │ (Restaurant accepted)
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │    PREPARING     │ (Cooking food)
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ READY_FOR_PICKUP │ (Food ready)
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ OUT_FOR_DELIVERY │ (Agent picked up)
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │    DELIVERED     │ (Customer received)
        └──────────────────┘

        (Can be CANCELLED → REFUNDED at any stage before DELIVERED)
```

---

## 🎯 Topic Architecture

### Topic Structure
```
payment-events/                    (General payment events - all types)
├── partition-0
├── partition-1
└── partition-2

payment-initiated/                 (Payment process started)
├── partition-0
├── partition-1
└── partition-2

payment-processing/                (Payment being processed)
├── partition-0
├── partition-1
└── partition-2

payment-completed/                 (Payment successful)
├── partition-0
├── partition-1
└── partition-2

payment-failed/                    (Payment failed)
├── partition-0
├── partition-1
└── partition-2

payment-cancelled/                 (Payment cancelled)
├── partition-0
├── partition-1
└── partition-2

payment-refund-initiated/          (Refund requested)
├── partition-0
├── partition-1
└── partition-2

payment-refunded/                  (Refund completed)
├── partition-0
├── partition-1
└── partition-2

payment-webhook-received/          (Stripe webhook received)
├── partition-0
├── partition-1
└── partition-2

payment-events-dlq/                (Dead letter queue)
└── partition-0
```

### Partition Strategy
- **Key**: orderId (ensures all events for same order go to same partition)
- **Benefit**: Maintains event ordering per order
- **Partitions**: 3 (can scale up based on load)

---

## 🔍 Event Tracing Example

### Successful Order with Payment

```
Timeline: Complete event flow for Order #123

T+0ms    │ Frontend: User clicks "Pay"
         │
T+50ms   │ Payment Service: POST /api/payments/create-intent
         │ ├─ Create Stripe PaymentIntent
         │ ├─ Save Payment #456 (PENDING)
         │ └─ Publish: PAYMENT_INITIATED
         │    ├─ eventId: evt_001
         │    ├─ orderId: 123
         │    ├─ paymentId: 456
         │    └─ amount: 2500.00
         │
T+100ms  │ Order Service: Consume PAYMENT_INITIATED
         │ ├─ Create Order #123 (PAYMENT_PENDING)
         │ └─ Link to Payment #456
         │
T+150ms  │ Frontend: Show Stripe payment form
         │
T+5000ms │ User: Enters card details and clicks "Pay"
         │
T+5050ms │ Frontend: POST /api/payments/confirm
         │
T+5100ms │ Payment Service: Confirm with Stripe
         │ ├─ Stripe processes payment
         │ ├─ Update Payment #456 (COMPLETED)
         │ └─ Publish: PAYMENT_COMPLETED
         │    ├─ eventId: evt_002
         │    ├─ orderId: 123
         │    ├─ paymentId: 456
         │    ├─ stripeChargeId: ch_xxx
         │    └─ receiptUrl: https://...
         │
T+5150ms │ Order Service: Consume PAYMENT_COMPLETED
         │ ├─ Update Order #123 (PENDING)
         │ ├─ Link Payment #456
         │ └─ Publish: ORDER_CREATED
         │    ├─ eventId: evt_003
         │    ├─ orderId: 123
         │    └─ status: PENDING
         │
T+5200ms │ Delivery Service: Consume ORDER_CREATED
         │ └─ Create Delivery #789 (PENDING)
         │
T+5250ms │ Notification Service: Consume PAYMENT_COMPLETED
         │ ├─ Send confirmation email
         │ └─ Send SMS notification
         │
T+5300ms │ Frontend: Redirect to order tracking
         │
         │ ✅ Order successfully placed with payment!
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
```
┌─────────────────────────────────────────────────────────┐
│                    Kafka Cluster                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Partition 0  │  │ Partition 1  │  │ Partition 2  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Order Service │  │Order Service │  │Order Service │
│  Instance 1  │  │  Instance 2  │  │  Instance 3  │
└──────────────┘  └──────────────┘  └──────────────┘

Each instance consumes from different partition
→ Parallel processing
→ Higher throughput
→ Better fault tolerance
```

---

## 🎯 Key Takeaways

### Benefits
1. **Decoupling**: Services don't directly call each other
2. **Reliability**: Events persisted, no data loss
3. **Scalability**: Easy to add consumers and scale
4. **Audit Trail**: Complete history of all payment events
5. **Flexibility**: Easy to add new features (analytics, notifications)

### Challenges
1. **Eventual Consistency**: Order status may lag
2. **Complexity**: More moving parts to manage
3. **Debugging**: Harder to trace issues across services
4. **Idempotency**: Must handle duplicate events

### Best Practices
1. Always use unique event IDs
2. Implement idempotency checks
3. Use orderId as partition key
4. Add comprehensive logging
5. Monitor consumer lag
6. Set up dead letter queues
7. Test failure scenarios

---

**This architecture provides a robust, scalable, and maintainable payment system integrated with Kafka event streaming.**
