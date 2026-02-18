# Kafka Payment Integration - Complete Plan

## 🎯 Overview

This plan integrates payment events into the existing Kafka event-driven architecture to enable:
- Asynchronous payment processing
- Decoupled service communication
- Event-driven order lifecycle management
- Payment failure handling and retries
- Audit trail for all payment transactions
- Real-time notifications for payment status

---

## 📊 Current Event Architecture

### Existing Topics
```
order-events              → General order events
order-created             → New order created
order-confirmed           → Restaurant confirmed order
order-preparing           → Restaurant preparing food
order-ready-for-pickup    → Food ready for pickup
order-out-for-delivery    → Delivery agent picked up
order-delivered           → Order delivered to customer
order-cancelled           → Order cancelled

delivery-events           → General delivery events
delivery-assigned         → Agent assigned to delivery
delivery-picked-up        → Agent picked up order
delivery-in-transit       → Agent on the way
delivery-delivered        → Delivery completed
delivery-cancelled        → Delivery cancelled
```

### Current Flow
```
Order Created → Order Confirmed → Order Preparing → 
Ready for Pickup → Out for Delivery → Delivered
```

---

## 🆕 Payment Event Architecture

### New Topics to Create

#### 1. payment-events (General Payment Events)
**Purpose**: Catch-all topic for all payment-related events
**Partitions**: 3
**Replicas**: 1
**Consumers**: Analytics service, audit service, notification service

#### 2. payment-initiated
**Purpose**: Payment process started
**When**: User clicks "Pay" button, payment intent created
**Payload**: orderId, userId, amount, currency, paymentMethod
**Consumers**: Order service (update order status to PAYMENT_PENDING)

#### 3. payment-processing
**Purpose**: Payment being processed by Stripe
**When**: Payment submitted to Stripe
**Payload**: paymentId, orderId, stripePaymentIntentId
**Consumers**: Notification service (show "Processing..." to user)

#### 4. payment-completed
**Purpose**: Payment successful
**When**: Stripe confirms payment success
**Payload**: paymentId, orderId, amount, transactionId, receiptUrl
**Consumers**: 
- Order service (create order, set status to PENDING)
- Notification service (send confirmation email/SMS)
- Analytics service (track revenue)

#### 5. payment-failed
**Purpose**: Payment failed
**When**: Stripe rejects payment (insufficient funds, declined card, etc.)
**Payload**: paymentId, orderId, failureReason, errorCode
**Consumers**:
- Order service (mark order as PAYMENT_FAILED)
- Notification service (notify user of failure)
- Retry service (schedule retry if applicable)

#### 6. payment-cancelled
**Purpose**: Payment cancelled by user
**When**: User cancels payment before completion
**Payload**: paymentId, orderId, cancelReason
**Consumers**: Order service (clean up pending order)

#### 7. payment-refund-initiated
**Purpose**: Refund process started
**When**: Order cancelled, refund requested
**Payload**: paymentId, orderId, refundAmount, reason
**Consumers**: 
- Payment service (process refund via Stripe)
- Notification service (notify user)

#### 8. payment-refunded
**Purpose**: Refund completed
**When**: Stripe confirms refund processed
**Payload**: paymentId, orderId, refundId, refundAmount
**Consumers**:
- Order service (update order status to REFUNDED)
- Notification service (send refund confirmation)
- Analytics service (track refunds)

#### 9. payment-webhook-received
**Purpose**: Stripe webhook event received
**When**: Stripe sends webhook notification
**Payload**: webhookId, eventType, stripeEventId, rawPayload
**Consumers**: Payment service (process webhook, update payment status)

---

## 🔄 Updated Order Lifecycle with Payments

### New Flow with Payment Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT PHASE                                 │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Checkout"
   ↓
2. Frontend: POST /api/payments/create-intent
   ↓
3. Payment Service: Create Stripe PaymentIntent
   ↓
4. Kafka: PAYMENT_INITIATED event
   ↓ (consumed by Order Service)
5. Order Service: Create order with status PAYMENT_PENDING
   ↓
6. Frontend: Show payment form (Stripe Elements)
   ↓
7. User enters card details
   ↓
8. Frontend: Confirm payment with Stripe
   ↓
9. Kafka: PAYMENT_PROCESSING event
   ↓
10. Stripe processes payment
    ↓
    ├─ SUCCESS ─────────────────┐
    │                           │
    │ 11. Kafka: PAYMENT_COMPLETED event
    │     ↓ (consumed by Order Service)
    │ 12. Order Service: Update order status to PENDING
    │     ↓
    │ 13. Kafka: ORDER_CREATED event
    │     ↓ (consumed by Delivery Service)
    │ 14. Continue normal order flow...
    │
    └─ FAILURE ─────────────────┐
                                │
      11. Kafka: PAYMENT_FAILED event
          ↓ (consumed by Order Service)
      12. Order Service: Update order status to PAYMENT_FAILED
          ↓
      13. Notification Service: Notify user
          ↓
      14. Frontend: Show error, allow retry

┌─────────────────────────────────────────────────────────────────┐
│                    ORDER PHASE                                   │
└─────────────────────────────────────────────────────────────────┘

ORDER_CREATED → ORDER_CONFIRMED → ORDER_PREPARING → 
READY_FOR_PICKUP → OUT_FOR_DELIVERY → DELIVERED

┌─────────────────────────────────────────────────────────────────┐
│                    REFUND PHASE (if cancelled)                   │
└─────────────────────────────────────────────────────────────────┘

1. User/Restaurant cancels order
   ↓
2. Order Service: Check if payment completed
   ↓
3. Kafka: PAYMENT_REFUND_INITIATED event
   ↓ (consumed by Payment Service)
4. Payment Service: Process refund via Stripe
   ↓
5. Stripe processes refund
   ↓
6. Kafka: PAYMENT_REFUNDED event
   ↓ (consumed by Order Service)
7. Order Service: Update order status to REFUNDED
   ↓
8. Notification Service: Send refund confirmation
```

---

## 📦 Event Payload Schemas

### PaymentEvent (Base Event)
```java
public class PaymentEvent {
    // Event metadata
    private String eventId;           // UUID
    private String eventType;         // PAYMENT_INITIATED, PAYMENT_COMPLETED, etc.
    private LocalDateTime timestamp;  // Event creation time
    private String source;            // "payment-service"
    
    // Payment details
    private Long paymentId;           // Payment record ID
    private Long orderId;             // Associated order ID
    private Long userId;              // Customer ID
    private String stripePaymentIntentId;  // Stripe payment intent ID
    private String stripeChargeId;    // Stripe charge ID (after completion)
    
    // Amount details
    private Double amount;            // Payment amount
    private String currency;          // "usd", "inr", etc.
    
    // Status
    private PaymentStatus status;     // PENDING, COMPLETED, FAILED, REFUNDED
    private PaymentStatus previousStatus;  // For status change events
    
    // Payment method
    private PaymentMethod paymentMethod;  // CARD, CASH, UPI, etc.
    private String paymentMethodId;   // Stripe payment method ID
    
    // Additional info
    private String receiptUrl;        // Stripe receipt URL
    private String failureReason;     // If payment failed
    private String errorCode;         // Stripe error code
    private String cancelReason;      // If cancelled
    private String refundReason;      // If refunded
    private Double refundAmount;      // Refund amount
    private String refundId;          // Stripe refund ID
}
```

### Event Types
```java
public class PaymentEventType {
    public static final String PAYMENT_INITIATED = "PAYMENT_INITIATED";
    public static final String PAYMENT_PROCESSING = "PAYMENT_PROCESSING";
    public static final String PAYMENT_COMPLETED = "PAYMENT_COMPLETED";
    public static final String PAYMENT_FAILED = "PAYMENT_FAILED";
    public static final String PAYMENT_CANCELLED = "PAYMENT_CANCELLED";
    public static final String PAYMENT_REFUND_INITIATED = "PAYMENT_REFUND_INITIATED";
    public static final String PAYMENT_REFUNDED = "PAYMENT_REFUNDED";
    public static final String PAYMENT_WEBHOOK_RECEIVED = "PAYMENT_WEBHOOK_RECEIVED";
}
```

---

## 🏗️ Implementation Components

### 1. Payment Service Components

#### KafkaTopicConfig.java
```java
@Configuration
public class KafkaTopicConfig {
    public static final String PAYMENT_EVENTS_TOPIC = "payment-events";
    public static final String PAYMENT_INITIATED_TOPIC = "payment-initiated";
    public static final String PAYMENT_PROCESSING_TOPIC = "payment-processing";
    public static final String PAYMENT_COMPLETED_TOPIC = "payment-completed";
    public static final String PAYMENT_FAILED_TOPIC = "payment-failed";
    public static final String PAYMENT_CANCELLED_TOPIC = "payment-cancelled";
    public static final String PAYMENT_REFUND_INITIATED_TOPIC = "payment-refund-initiated";
    public static final String PAYMENT_REFUNDED_TOPIC = "payment-refunded";
    public static final String PAYMENT_WEBHOOK_RECEIVED_TOPIC = "payment-webhook-received";
    
    // Bean definitions for each topic...
}
```

#### KafkaProducerConfig.java
```java
@Configuration
public class KafkaProducerConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;
    
    // Producer configuration for PaymentEvent
    // JSON serialization
    // Idempotence enabled
    // Acks = all
}
```

#### PaymentEventProducer.java
```java
@Service
public class PaymentEventProducer {
    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;
    
    public void publishPaymentInitiated(Payment payment);
    public void publishPaymentProcessing(Payment payment);
    public void publishPaymentCompleted(Payment payment);
    public void publishPaymentFailed(Payment payment, String reason);
    public void publishPaymentCancelled(Payment payment, String reason);
    public void publishRefundInitiated(Payment payment, Double amount, String reason);
    public void publishRefundCompleted(Payment payment, String refundId);
    public void publishWebhookReceived(String webhookId, String eventType);
}
```

#### PaymentEvent.java
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {
    // All fields from schema above
    
    // Constructor from Payment entity
    public PaymentEvent(String eventType, Payment payment) {
        // Initialize all fields
    }
}
```

### 2. Order Service Components

#### KafkaConsumerConfig.java (Update)
```java
@Configuration
public class KafkaConsumerConfig {
    // Existing order event consumer config
    
    // Add payment event consumer config
    @Bean
    public ConsumerFactory<String, PaymentEvent> paymentEventConsumerFactory() {
        // JSON deserialization for PaymentEvent
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PaymentEvent> 
            paymentEventKafkaListenerContainerFactory() {
        // Container factory for payment events
    }
}
```

#### PaymentEventConsumer.java (New)
```java
@Service
public class PaymentEventConsumer {
    private final OrderService orderService;
    
    @KafkaListener(topics = "payment-initiated", groupId = "order-service-group")
    public void handlePaymentInitiated(PaymentEvent event) {
        // Create order with status PAYMENT_PENDING
        // Store payment intent ID
    }
    
    @KafkaListener(topics = "payment-completed", groupId = "order-service-group")
    public void handlePaymentCompleted(PaymentEvent event) {
        // Update order status to PENDING
        // Link payment to order
        // Publish ORDER_CREATED event
    }
    
    @KafkaListener(topics = "payment-failed", groupId = "order-service-group")
    public void handlePaymentFailed(PaymentEvent event) {
        // Update order status to PAYMENT_FAILED
        // Log failure reason
    }
    
    @KafkaListener(topics = "payment-refunded", groupId = "order-service-group")
    public void handlePaymentRefunded(PaymentEvent event) {
        // Update order status to REFUNDED
        // Update payment reference
    }
}
```

#### OrderService.java (Update)
```java
@Service
public class OrderService {
    private final PaymentEventProducer paymentEventProducer;
    
    public OrderDTO createOrderWithPayment(CreateOrderRequest request) {
        // 1. Validate order
        // 2. Calculate total
        // 3. Create order with status PAYMENT_PENDING
        // 4. Return order (payment intent created separately)
    }
    
    public void handlePaymentSuccess(Long orderId, Long paymentId) {
        // 1. Find order
        // 2. Update status to PENDING
        // 3. Link payment
        // 4. Publish ORDER_CREATED event
    }
    
    public void cancelOrderWithRefund(Long orderId, String reason) {
        // 1. Find order
        // 2. Check if payment completed
        // 3. If yes, publish PAYMENT_REFUND_INITIATED event
        // 4. Update order status to CANCELLING
    }
}
```

### 3. Notification Service Components (Optional)

#### PaymentNotificationConsumer.java
```java
@Service
public class PaymentNotificationConsumer {
    
    @KafkaListener(topics = "payment-completed", groupId = "notification-service-group")
    public void handlePaymentCompleted(PaymentEvent event) {
        // Send payment confirmation email
        // Send SMS notification
        // Push notification to mobile app
    }
    
    @KafkaListener(topics = "payment-failed", groupId = "notification-service-group")
    public void handlePaymentFailed(PaymentEvent event) {
        // Send payment failure notification
        // Suggest retry or alternative payment method
    }
    
    @KafkaListener(topics = "payment-refunded", groupId = "notification-service-group")
    public void handlePaymentRefunded(PaymentEvent event) {
        // Send refund confirmation
        // Include refund timeline (5-10 business days)
    }
}
```

---

## 🔄 Integration Points

### 1. Payment Service → Kafka

**When**: Payment intent created
```java
public PaymentIntentResponse createPaymentIntent(CreatePaymentIntentRequest request) {
    // 1. Create Stripe payment intent
    // 2. Save payment record to database
    // 3. Publish PAYMENT_INITIATED event
    paymentEventProducer.publishPaymentInitiated(payment);
    // 4. Return client secret to frontend
}
```

**When**: Payment confirmed
```java
public PaymentDTO confirmPayment(String paymentIntentId) {
    // 1. Confirm payment with Stripe
    // 2. Update payment record
    // 3. Publish PAYMENT_COMPLETED event
    paymentEventProducer.publishPaymentCompleted(payment);
    // 4. Return payment details
}
```

**When**: Payment fails
```java
private void handlePaymentFailure(Payment payment, String reason) {
    // 1. Update payment status to FAILED
    // 2. Store failure reason
    // 3. Publish PAYMENT_FAILED event
    paymentEventProducer.publishPaymentFailed(payment, reason);
}
```

**When**: Refund requested
```java
public RefundResponse refundPayment(Long paymentId, RefundRequest request) {
    // 1. Validate payment can be refunded
    // 2. Publish PAYMENT_REFUND_INITIATED event
    paymentEventProducer.publishRefundInitiated(payment, request.getAmount(), request.getReason());
    // 3. Process refund with Stripe
    // 4. Publish PAYMENT_REFUNDED event
    paymentEventProducer.publishRefundCompleted(payment, refundId);
}
```

### 2. Order Service → Kafka (Listening)

**Listen**: PAYMENT_COMPLETED
```java
@KafkaListener(topics = "payment-completed")
public void handlePaymentCompleted(PaymentEvent event) {
    // 1. Find order by orderId
    // 2. Update order status: PAYMENT_PENDING → PENDING
    // 3. Link payment to order
    // 4. Publish ORDER_CREATED event (triggers delivery flow)
}
```

**Listen**: PAYMENT_FAILED
```java
@KafkaListener(topics = "payment-failed")
public void handlePaymentFailed(PaymentEvent event) {
    // 1. Find order by orderId
    // 2. Update order status to PAYMENT_FAILED
    // 3. Log failure reason
    // 4. Don't publish ORDER_CREATED (order won't proceed)
}
```

### 3. Order Service → Kafka (Publishing)

**When**: Order cancelled (with payment)
```java
public void cancelOrder(Long orderId, String reason) {
    Order order = findOrder(orderId);
    
    if (order.getPaymentId() != null && order.getStatus() != OrderStatus.PAYMENT_FAILED) {
        // Payment was completed, need refund
        PaymentEvent refundEvent = new PaymentEvent(
            PaymentEventType.PAYMENT_REFUND_INITIATED,
            order.getPaymentId(),
            orderId,
            order.getTotalAmount(),
            reason
        );
        kafkaTemplate.send("payment-refund-initiated", refundEvent);
    }
    
    // Update order status
    order.setStatus(OrderStatus.CANCELLED);
    orderRepository.save(order);
}
```

---

## 🔐 Error Handling & Resilience

### 1. Idempotency
**Problem**: Same event processed multiple times
**Solution**: 
- Use eventId (UUID) to track processed events
- Store processed event IDs in database
- Skip if event already processed

```java
@Service
public class PaymentEventConsumer {
    private final ProcessedEventRepository processedEventRepository;
    
    @KafkaListener(topics = "payment-completed")
    public void handlePaymentCompleted(PaymentEvent event) {
        // Check if already processed
        if (processedEventRepository.existsByEventId(event.getEventId())) {
            log.info("Event {} already processed, skipping", event.getEventId());
            return;
        }
        
        // Process event
        orderService.handlePaymentSuccess(event.getOrderId(), event.getPaymentId());
        
        // Mark as processed
        processedEventRepository.save(new ProcessedEvent(event.getEventId()));
    }
}
```

### 2. Retry Logic
**Problem**: Temporary failures (network, database)
**Solution**: 
- Configure retry policy in Kafka consumer
- Exponential backoff
- Dead letter queue for permanent failures

```java
@Bean
public ConcurrentKafkaListenerContainerFactory<String, PaymentEvent> 
        paymentEventKafkaListenerContainerFactory() {
    factory.setCommonErrorHandler(new DefaultErrorHandler(
        new FixedBackOff(1000L, 3L)  // Retry 3 times with 1 second delay
    ));
    return factory;
}
```

### 3. Dead Letter Queue
**Problem**: Events that can't be processed after retries
**Solution**: Send to DLQ for manual investigation

```java
@Bean
public NewTopic paymentEventsDLQ() {
    return TopicBuilder.name("payment-events-dlq")
            .partitions(1)
            .replicas(1)
            .build();
}
```

### 4. Compensation Transactions
**Problem**: Payment succeeded but order creation failed
**Solution**: Implement saga pattern with compensation

```java
@Service
public class PaymentSagaOrchestrator {
    
    public void handlePaymentCompleted(PaymentEvent event) {
        try {
            // Step 1: Update order status
            orderService.updateOrderStatus(event.getOrderId(), OrderStatus.PENDING);
            
            // Step 2: Create delivery record
            deliveryService.createDelivery(event.getOrderId());
            
            // Step 3: Send notifications
            notificationService.sendOrderConfirmation(event.getOrderId());
            
        } catch (Exception e) {
            // Compensation: Refund payment
            log.error("Order creation failed after payment, initiating refund", e);
            paymentService.refundPayment(event.getPaymentId(), "Order creation failed");
        }
    }
}
```

---

## 📊 Monitoring & Observability

### 1. Metrics to Track
```
payment_events_published_total{event_type="PAYMENT_COMPLETED"}
payment_events_consumed_total{event_type="PAYMENT_COMPLETED"}
payment_event_processing_duration_seconds
payment_event_failures_total
payment_refund_rate
payment_success_rate
```

### 2. Logging
```java
@KafkaListener(topics = "payment-completed")
public void handlePaymentCompleted(PaymentEvent event) {
    log.info("Processing payment completed event: eventId={}, orderId={}, paymentId={}, amount={}", 
        event.getEventId(), event.getOrderId(), event.getPaymentId(), event.getAmount());
    
    try {
        orderService.handlePaymentSuccess(event.getOrderId(), event.getPaymentId());
        log.info("Successfully processed payment completed event: eventId={}", event.getEventId());
    } catch (Exception e) {
        log.error("Failed to process payment completed event: eventId={}", event.getEventId(), e);
        throw e;
    }
}
```

### 3. Kafka Monitoring
- Consumer lag monitoring
- Topic partition distribution
- Message throughput
- Error rates

---

## 🧪 Testing Strategy

### 1. Unit Tests
```java
@Test
public void testPaymentCompletedEventPublished() {
    // Given
    Payment payment = createTestPayment();
    
    // When
    paymentService.confirmPayment(payment.getStripePaymentIntentId());
    
    // Then
    verify(kafkaTemplate).send(
        eq("payment-completed"),
        argThat(event -> 
            event.getEventType().equals("PAYMENT_COMPLETED") &&
            event.getPaymentId().equals(payment.getId())
        )
    );
}
```

### 2. Integration Tests
```java
@SpringBootTest
@EmbeddedKafka
public class PaymentEventIntegrationTest {
    
    @Test
    public void testPaymentCompletedFlowEndToEnd() {
        // 1. Create payment intent
        // 2. Confirm payment
        // 3. Verify PAYMENT_COMPLETED event published
        // 4. Verify order status updated to PENDING
        // 5. Verify ORDER_CREATED event published
    }
}
```

### 3. Consumer Tests
```java
@Test
public void testPaymentCompletedConsumer() {
    // Given
    PaymentEvent event = createPaymentCompletedEvent();
    
    // When
    paymentEventConsumer.handlePaymentCompleted(event);
    
    // Then
    Order order = orderRepository.findById(event.getOrderId()).get();
    assertEquals(OrderStatus.PENDING, order.getStatus());
    assertEquals(event.getPaymentId(), order.getPaymentId());
}
```

---

## 📋 Implementation Checklist

### Phase 1: Payment Service Kafka Setup
- [ ] Create PaymentEvent class
- [ ] Create PaymentEventType constants
- [ ] Create KafkaTopicConfig with all payment topics
- [ ] Create KafkaProducerConfig
- [ ] Create PaymentEventProducer
- [ ] Update PaymentService to publish events
- [ ] Add event publishing to all payment operations
- [ ] Add logging for all events

### Phase 2: Order Service Kafka Integration
- [ ] Update KafkaConsumerConfig for PaymentEvent
- [ ] Create PaymentEventConsumer
- [ ] Implement handlePaymentInitiated
- [ ] Implement handlePaymentCompleted
- [ ] Implement handlePaymentFailed
- [ ] Implement handlePaymentRefunded
- [ ] Update OrderService for payment integration
- [ ] Add idempotency checks
- [ ] Add error handling

### Phase 3: Refund Flow
- [ ] Implement refund event publishing
- [ ] Create refund consumer in payment service
- [ ] Update order cancellation logic
- [ ] Add refund validation
- [ ] Add compensation logic

### Phase 4: Testing
- [ ] Unit tests for event producers
- [ ] Unit tests for event consumers
- [ ] Integration tests for payment flow
- [ ] Test idempotency
- [ ] Test error scenarios
- [ ] Test refund flow
- [ ] Load testing

### Phase 5: Monitoring
- [ ] Add metrics for event publishing
- [ ] Add metrics for event consumption
- [ ] Add consumer lag monitoring
- [ ] Add error rate tracking
- [ ] Set up alerts

---

## 🚀 Benefits of Kafka Integration

### 1. Decoupling
- Payment service doesn't need to know about order service
- Services can be deployed independently
- Easier to add new consumers (analytics, notifications)

### 2. Reliability
- Events are persisted in Kafka
- Automatic retries on failure
- No data loss even if consumer is down

### 3. Scalability
- Multiple consumers can process events in parallel
- Easy to add more partitions for higher throughput
- Services can scale independently

### 4. Audit Trail
- All payment events are logged
- Easy to replay events for debugging
- Complete history of payment lifecycle

### 5. Real-time Processing
- Immediate notification of payment status
- Fast order creation after payment
- Real-time analytics

---

## ⚠️ Important Considerations

### 1. Event Ordering
- Use orderId as partition key to ensure order
- Events for same order go to same partition
- Processed in order within partition

### 2. Eventual Consistency
- Order status may lag behind payment status
- Design UI to handle eventual consistency
- Show "Processing..." states appropriately

### 3. Duplicate Events
- Kafka may deliver same event multiple times
- Always implement idempotency
- Use unique event IDs

### 4. Schema Evolution
- Plan for event schema changes
- Use versioning in event types
- Maintain backward compatibility

---

## 📚 Next Steps After Implementation

1. **Add Analytics Consumer**
   - Track payment success rates
   - Monitor refund rates
   - Revenue analytics

2. **Add Notification Consumer**
   - Email confirmations
   - SMS notifications
   - Push notifications

3. **Add Fraud Detection Consumer**
   - Monitor suspicious patterns
   - Flag high-risk transactions
   - Automatic blocking

4. **Add Reporting Consumer**
   - Daily payment reports
   - Monthly revenue reports
   - Reconciliation reports

---

## 🎯 Success Criteria

Payment Kafka integration is successful when:
- ✅ All payment events published to Kafka
- ✅ Order service consumes payment events
- ✅ Order status updates based on payment events
- ✅ Refund flow works end-to-end
- ✅ No duplicate processing (idempotency works)
- ✅ Error handling and retries work
- ✅ All tests passing
- ✅ Monitoring in place

---

**Ready to implement?** This plan provides everything needed for a robust, event-driven payment system integrated with Kafka.

**Estimated Time**: 6-8 hours
**Complexity**: Medium-High
**Value**: High (scalable, reliable, decoupled architecture)
