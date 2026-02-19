# Kafka Payment Integration - Implementation Roadmap

## 🗺️ Step-by-Step Implementation Guide

This roadmap breaks down the Kafka payment integration into manageable phases with clear deliverables.

---

## 📅 Phase 1: Foundation (2 hours)

### Goal
Set up basic Kafka infrastructure for payment events

### Tasks

#### 1.1 Create Payment Event Classes
**Files to create:**
- `payment-service/src/main/java/com/fooddelivery/payment/event/PaymentEvent.java`
- `payment-service/src/main/java/com/fooddelivery/payment/event/PaymentEventType.java`

**What to include:**
- Event metadata (eventId, timestamp, source)
- Payment details (paymentId, orderId, userId)
- Amount and currency
- Status information
- Stripe IDs
- Error/failure information

#### 1.2 Create Kafka Configuration
**Files to create:**
- `payment-service/src/main/java/com/fooddelivery/payment/config/KafkaTopicConfig.java`
- `payment-service/src/main/java/com/fooddelivery/payment/config/KafkaProducerConfig.java`

**Topics to create:**
- payment-events
- payment-initiated
- payment-processing
- payment-completed
- payment-failed
- payment-cancelled
- payment-refund-initiated
- payment-refunded
- payment-webhook-received

#### 1.3 Create Event Producer
**File to create:**
- `payment-service/src/main/java/com/fooddelivery/payment/producer/PaymentEventProducer.java`

**Methods to implement:**
- publishPaymentInitiated()
- publishPaymentProcessing()
- publishPaymentCompleted()
- publishPaymentFailed()
- publishPaymentCancelled()
- publishRefundInitiated()
- publishRefundCompleted()

### Deliverables
- ✅ Payment event classes created
- ✅ Kafka topics configured
- ✅ Event producer ready
- ✅ Can publish events to Kafka

### Testing
```bash
# Start Kafka
docker-compose up -d

# Check topics created
docker exec -it fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092

# Should see all payment-* topics
```

---

## 📅 Phase 2: Payment Service Integration (2 hours)

### Goal
Integrate event publishing into payment service operations

### Tasks

#### 2.1 Update PaymentService
**File to update:**
- `payment-service/src/main/java/com/fooddelivery/payment/service/PaymentService.java`

**Changes:**
- Inject PaymentEventProducer
- Publish PAYMENT_INITIATED when creating payment intent
- Publish PAYMENT_PROCESSING when confirming payment
- Publish PAYMENT_COMPLETED on success
- Publish PAYMENT_FAILED on failure
- Publish PAYMENT_CANCELLED when cancelled

#### 2.2 Update StripeService
**File to update:**
- `payment-service/src/main/java/com/fooddelivery/payment/service/StripeService.java`

**Changes:**
- Add event publishing after Stripe operations
- Handle Stripe errors and publish PAYMENT_FAILED
- Add logging for all events

#### 2.3 Add Refund Event Publishing
**Changes:**
- Publish PAYMENT_REFUND_INITIATED when refund requested
- Publish PAYMENT_REFUNDED when refund completed

### Deliverables
- ✅ Payment service publishes events
- ✅ All payment operations trigger events
- ✅ Events contain correct data
- ✅ Logging in place

### Testing
```bash
# Test payment intent creation
./scripts/test-payment-flow.ps1

# Watch Kafka events
docker exec -it fooddelivery-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic payment-initiated \
  --from-beginning

# Should see PAYMENT_INITIATED event
```

---

## 📅 Phase 3: Order Service Consumer (2 hours)

### Goal
Make order service consume and react to payment events

### Tasks

#### 3.1 Update Kafka Consumer Config
**File to update:**
- `order-service/src/main/java/com/fooddelivery/order/config/KafkaConsumerConfig.java`

**Changes:**
- Add consumer factory for PaymentEvent
- Configure JSON deserialization
- Set consumer group ID

#### 3.2 Create Payment Event Consumer
**File to create:**
- `order-service/src/main/java/com/fooddelivery/order/consumer/PaymentEventConsumer.java`

**Methods to implement:**
- handlePaymentInitiated() - Create order with PAYMENT_PENDING
- handlePaymentCompleted() - Update to PENDING, publish ORDER_CREATED
- handlePaymentFailed() - Update to PAYMENT_FAILED
- handlePaymentRefunded() - Update to REFUNDED

#### 3.3 Add Idempotency
**File to create:**
- `order-service/src/main/java/com/fooddelivery/order/entity/ProcessedEvent.java`
- `order-service/src/main/java/com/fooddelivery/order/repository/ProcessedEventRepository.java`

**Changes:**
- Store processed event IDs
- Check before processing
- Skip duplicates

#### 3.4 Update OrderService
**File to update:**
- `order-service/src/main/java/com/fooddelivery/order/service/OrderService.java`

**New methods:**
- handlePaymentSuccess() - Update order after payment
- linkPaymentToOrder() - Associate payment with order
- canRefundOrder() - Check if order can be refunded

### Deliverables
- ✅ Order service consumes payment events
- ✅ Order status updates based on payment
- ✅ Idempotency implemented
- ✅ ORDER_CREATED published after payment

### Testing
```bash
# Test complete flow
# 1. Create payment intent
# 2. Confirm payment
# 3. Check order created

# Watch order events
docker exec -it fooddelivery-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic order-created \
  --from-beginning

# Should see ORDER_CREATED after PAYMENT_COMPLETED
```

---

## 📅 Phase 4: Refund Flow (1.5 hours)

### Goal
Implement complete refund flow with Kafka

### Tasks

#### 4.1 Update Order Cancellation
**File to update:**
- `order-service/src/main/java/com/fooddelivery/order/service/OrderService.java`

**Changes:**
- Check if order has payment
- Publish PAYMENT_REFUND_INITIATED event
- Update order status to CANCELLING

#### 4.2 Create Refund Consumer in Payment Service
**File to create:**
- `payment-service/src/main/java/com/fooddelivery/payment/consumer/RefundEventConsumer.java`

**Methods:**
- handleRefundInitiated() - Process refund via Stripe
- Publish PAYMENT_REFUNDED on success

#### 4.3 Add Refund Validation
**Changes:**
- Check payment status before refund
- Validate refund amount
- Handle partial refunds
- Add refund reason tracking

### Deliverables
- ✅ Order cancellation triggers refund
- ✅ Payment service processes refunds
- ✅ Order status updates to REFUNDED
- ✅ Complete refund audit trail

### Testing
```bash
# Test refund flow
# 1. Create order with payment
# 2. Cancel order
# 3. Verify refund processed
# 4. Check order status = REFUNDED

# Watch refund events
docker exec -it fooddelivery-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic payment-refunded \
  --from-beginning
```

---

## 📅 Phase 5: Error Handling & Resilience (1.5 hours)

### Goal
Add robust error handling and retry logic

### Tasks

#### 5.1 Add Retry Configuration
**Files to update:**
- `order-service/src/main/java/com/fooddelivery/order/config/KafkaConsumerConfig.java`
- `payment-service/src/main/java/com/fooddelivery/payment/config/KafkaConsumerConfig.java`

**Changes:**
- Configure retry policy
- Set exponential backoff
- Define max retry attempts

#### 5.2 Create Dead Letter Queue
**Files to update:**
- `order-service/src/main/java/com/fooddelivery/order/config/KafkaTopicConfig.java`
- `payment-service/src/main/java/com/fooddelivery/payment/config/KafkaTopicConfig.java`

**Topics to create:**
- payment-events-dlq
- order-events-dlq

#### 5.3 Add Compensation Logic
**File to create:**
- `order-service/src/main/java/com/fooddelivery/order/saga/PaymentSagaOrchestrator.java`

**Logic:**
- If order creation fails after payment → Refund
- If delivery creation fails → Cancel order and refund
- Track saga state

#### 5.4 Add Circuit Breaker (Optional)
**Dependencies:**
- Spring Cloud Circuit Breaker
- Resilience4j

**Apply to:**
- Stripe API calls
- Database operations
- Kafka publishing

### Deliverables
- ✅ Retry logic configured
- ✅ Dead letter queue set up
- ✅ Compensation transactions work
- ✅ System resilient to failures

### Testing
```bash
# Test failure scenarios
# 1. Stop order service
# 2. Create payment
# 3. Start order service
# 4. Verify event processed

# Test DLQ
# 1. Cause processing error
# 2. Verify event in DLQ after retries
```

---

## 📅 Phase 6: Monitoring & Observability (1 hour)

### Goal
Add comprehensive monitoring and logging

### Tasks

#### 6.1 Add Metrics
**Dependencies:**
- Micrometer
- Prometheus (optional)

**Metrics to track:**
- payment_events_published_total
- payment_events_consumed_total
- payment_event_processing_duration
- payment_event_failures_total
- payment_success_rate
- payment_refund_rate

#### 6.2 Add Structured Logging
**Changes:**
- Log all event publishing
- Log all event consumption
- Include correlation IDs
- Log processing duration

#### 6.3 Add Consumer Lag Monitoring
**Tools:**
- Kafka Manager (optional)
- Kafka Exporter for Prometheus (optional)

**Monitor:**
- Consumer lag per topic
- Processing rate
- Error rate

#### 6.4 Add Health Checks
**Endpoints:**
- /actuator/health/kafka
- /actuator/metrics/kafka.*

### Deliverables
- ✅ Metrics exposed
- ✅ Comprehensive logging
- ✅ Consumer lag visible
- ✅ Health checks working

### Testing
```bash
# Check metrics
curl http://localhost:8085/actuator/metrics/payment_events_published_total

# Check health
curl http://localhost:8085/actuator/health

# Check consumer lag
docker exec -it fooddelivery-kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --describe \
  --group order-service-group
```

---

## 📅 Phase 7: Testing & Validation (2 hours)

### Goal
Comprehensive testing of entire payment flow

### Tasks

#### 7.1 Unit Tests
**Files to create:**
- `PaymentEventProducerTest.java`
- `PaymentEventConsumerTest.java`
- `PaymentServiceKafkaTest.java`

**Test:**
- Event creation
- Event publishing
- Event consumption
- Idempotency

#### 7.2 Integration Tests
**Files to create:**
- `PaymentFlowIntegrationTest.java`
- `RefundFlowIntegrationTest.java`

**Test:**
- Complete payment flow
- Complete refund flow
- Error scenarios
- Retry logic

#### 7.3 Load Testing
**Tools:**
- JMeter or Gatling

**Test:**
- 100 concurrent payments
- 1000 payments/minute
- Consumer lag under load
- System stability

#### 7.4 Failure Testing
**Scenarios:**
- Kafka down
- Order service down
- Payment service down
- Database down
- Network issues

### Deliverables
- ✅ All unit tests passing
- ✅ Integration tests passing
- ✅ Load tests successful
- ✅ Failure scenarios handled

### Testing
```bash
# Run unit tests
cd payment-service
mvn test

cd order-service
mvn test

# Run integration tests
mvn verify -P integration-tests

# Load test
jmeter -n -t payment-load-test.jmx
```

---

## 📅 Phase 8: Documentation & Deployment (1 hour)

### Goal
Document everything and prepare for production

### Tasks

#### 8.1 Update Documentation
**Files to create/update:**
- API documentation
- Event schemas
- Troubleshooting guide
- Runbook for operations

#### 8.2 Create Monitoring Dashboard
**Tools:**
- Grafana (optional)
- Kibana (optional)

**Dashboards:**
- Payment metrics
- Kafka metrics
- Error rates
- Consumer lag

#### 8.3 Deployment Checklist
**Items:**
- [ ] All tests passing
- [ ] Kafka topics created
- [ ] Consumer groups configured
- [ ] Monitoring in place
- [ ] Alerts configured
- [ ] Rollback plan ready

#### 8.4 Create Runbook
**Include:**
- How to restart services
- How to check consumer lag
- How to replay events
- How to handle DLQ messages
- Emergency procedures

### Deliverables
- ✅ Complete documentation
- ✅ Monitoring dashboard
- ✅ Deployment checklist
- ✅ Runbook ready

---

## 📊 Implementation Timeline

| Phase | Duration | Dependencies | Risk |
|-------|----------|--------------|------|
| Phase 1: Foundation | 2 hours | None | Low |
| Phase 2: Payment Service | 2 hours | Phase 1 | Low |
| Phase 3: Order Service | 2 hours | Phase 2 | Medium |
| Phase 4: Refund Flow | 1.5 hours | Phase 3 | Medium |
| Phase 5: Error Handling | 1.5 hours | Phase 4 | High |
| Phase 6: Monitoring | 1 hour | Phase 5 | Low |
| Phase 7: Testing | 2 hours | All phases | Medium |
| Phase 8: Documentation | 1 hour | Phase 7 | Low |

**Total Estimated Time: 13 hours**

---

## 🎯 Success Criteria

### Phase Completion Criteria

**Phase 1 Complete When:**
- [ ] All event classes created
- [ ] Kafka topics visible in Kafka
- [ ] Event producer can publish to topics

**Phase 2 Complete When:**
- [ ] Payment operations publish events
- [ ] Events visible in Kafka topics
- [ ] Event payloads correct

**Phase 3 Complete When:**
- [ ] Order service consumes payment events
- [ ] Order status updates correctly
- [ ] ORDER_CREATED published after payment

**Phase 4 Complete When:**
- [ ] Order cancellation triggers refund
- [ ] Refund processed via Stripe
- [ ] Order status updates to REFUNDED

**Phase 5 Complete When:**
- [ ] Retries work on failure
- [ ] DLQ receives failed events
- [ ] Compensation transactions work

**Phase 6 Complete When:**
- [ ] Metrics exposed and accurate
- [ ] Logs comprehensive and structured
- [ ] Consumer lag monitored

**Phase 7 Complete When:**
- [ ] All tests passing
- [ ] Load tests successful
- [ ] Failure scenarios handled

**Phase 8 Complete When:**
- [ ] Documentation complete
- [ ] Monitoring dashboard ready
- [ ] Deployment checklist done

---

## 🚀 Quick Start Commands

### Start Implementation
```bash
# 1. Create feature branch
git checkout -b feature/kafka-payment-integration

# 2. Start with Phase 1
# Create event classes first

# 3. Test as you go
# Don't move to next phase until current phase works
```

### Verify Each Phase
```bash
# After Phase 1
docker exec -it fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092

# After Phase 2
./scripts/test-payment-flow.ps1

# After Phase 3
# Test complete payment → order flow

# After Phase 4
# Test order cancellation → refund flow
```

---

## ⚠️ Important Notes

### Before Starting
1. Ensure Kafka is running and healthy
2. Backup database before testing
3. Have rollback plan ready
4. Test in development first

### During Implementation
1. Commit after each phase
2. Test thoroughly before moving on
3. Document any issues encountered
4. Keep existing functionality working

### After Completion
1. Monitor closely for first few days
2. Check consumer lag regularly
3. Review error logs
4. Gather feedback from team

---

## 📚 Resources Needed

### Tools
- Kafka (already in docker-compose)
- Kafka CLI tools
- Database client
- API testing tool (Postman/Insomnia)

### Documentation
- Kafka documentation
- Spring Kafka documentation
- Stripe API documentation
- Your existing codebase

### Team
- Backend developer (you!)
- QA for testing
- DevOps for deployment (optional)

---

**Ready to start?** Begin with Phase 1 and work through each phase systematically. Don't skip phases or rush - each builds on the previous one.

**Estimated completion: 2-3 days** (working 4-6 hours per day)
