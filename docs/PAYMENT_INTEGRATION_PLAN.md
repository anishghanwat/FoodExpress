# Payment Integration - Implementation Plan

## 🎯 Goal
Integrate real payment processing into the FoodExpress platform to handle order payments, refunds, and payment history.

---

## 💳 Stripe vs Razorpay - Comparison

### Stripe ⭐⭐⭐ (RECOMMENDED)

#### Pros
- ✅ **Global reach** - Works in 40+ countries
- ✅ **Excellent documentation** - Best-in-class docs and examples
- ✅ **Strong Java SDK** - Official Spring Boot support
- ✅ **React integration** - Official React components (@stripe/react-stripe-js)
- ✅ **Test mode** - Easy testing with test cards
- ✅ **No setup fees** - Pay only per transaction
- ✅ **Webhooks** - Reliable event notifications
- ✅ **PCI compliance** - Stripe handles security
- ✅ **Developer friendly** - Great API design
- ✅ **International** - Multi-currency support

#### Cons
- ❌ Higher fees (2.9% + $0.30 per transaction)
- ❌ Requires international bank account for payouts
- ❌ May not work in all countries (check availability)

#### Best For
- International projects
- Projects targeting global audience
- Learning industry-standard payment integration
- Portfolio projects (recognized globally)

---

### Razorpay ⭐⭐

#### Pros
- ✅ **India-focused** - Best for Indian market
- ✅ **Lower fees** - 2% per transaction (no fixed fee)
- ✅ **UPI support** - Native UPI integration
- ✅ **Local payment methods** - Wallets, NetBanking, etc.
- ✅ **INR support** - Native Indian Rupee handling
- ✅ **Easy KYC** - Simple onboarding for Indian businesses
- ✅ **Good documentation** - Decent docs and examples

#### Cons
- ❌ India-only - Limited to Indian market
- ❌ Requires Indian business registration
- ❌ Less international recognition
- ❌ Smaller ecosystem compared to Stripe

#### Best For
- India-specific projects
- Targeting Indian customers only
- Need UPI/wallet integration
- Indian startups

---

## 🏆 Recommendation: **STRIPE**

### Why Stripe?
1. **Better for learning** - Industry standard, recognized globally
2. **Portfolio value** - Stripe experience is valuable
3. **Easier testing** - Excellent test mode with test cards
4. **Better documentation** - More examples and resources
5. **Future-proof** - Works globally if you expand
6. **No business registration needed** - Can use test mode indefinitely

### When to use Razorpay?
- You're specifically targeting Indian market
- You need UPI/wallet integration
- You have Indian business registration
- Lower transaction fees are critical

---

## 📋 Implementation Plan - Stripe Integration

### Phase 1: Setup & Configuration (30 minutes)

#### 1.1 Create Stripe Account
- Sign up at https://stripe.com
- Get API keys (Publishable & Secret)
- Enable test mode

#### 1.2 Add Dependencies
**Backend** (payment-service/pom.xml):
```xml
<dependency>
    <groupId>com.stripe</groupId>
    <artifactId>stripe-java</artifactId>
    <version>24.0.0</version>
</dependency>
```

**Frontend** (package.json):
```json
{
  "@stripe/stripe-js": "^2.4.0",
  "@stripe/react-stripe-js": "^2.4.0"
}
```

#### 1.3 Environment Configuration
**Backend** (application.yml):
```yaml
stripe:
  api-key: ${STRIPE_SECRET_KEY}
  webhook-secret: ${STRIPE_WEBHOOK_SECRET}
```

**Frontend** (.env):
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### Phase 2: Backend Implementation (2 hours)

#### 2.1 Payment Entity Enhancement
**File**: `payment-service/src/main/java/com/fooddelivery/payment/entity/Payment.java`

**Add fields**:
```java
private String stripePaymentIntentId;
private String stripeChargeId;
private String paymentMethodId;
private String currency; // "usd", "inr", etc.
private String receiptUrl;
private String failureReason;
private LocalDateTime paidAt;
```

#### 2.2 Stripe Configuration
**Create**: `payment-service/src/main/java/com/fooddelivery/payment/config/StripeConfig.java`

**Purpose**: Initialize Stripe with API key

#### 2.3 Stripe Service
**Create**: `payment-service/src/main/java/com/fooddelivery/payment/service/StripeService.java`

**Methods**:
- `createPaymentIntent(amount, currency, orderId)` - Create payment intent
- `confirmPayment(paymentIntentId)` - Confirm payment
- `cancelPayment(paymentIntentId)` - Cancel payment
- `refundPayment(chargeId, amount)` - Process refund
- `getPaymentStatus(paymentIntentId)` - Check status

#### 2.4 Payment Service Enhancement
**Update**: `payment-service/src/main/java/com/fooddelivery/payment/service/PaymentService.java`

**New methods**:
- `initiatePayment(orderId, amount, userId)` - Start payment flow
- `processPayment(paymentIntentId, paymentMethodId)` - Process payment
- `handlePaymentSuccess(paymentIntentId)` - Success handler
- `handlePaymentFailure(paymentIntentId, reason)` - Failure handler
- `refundPayment(paymentId, amount, reason)` - Refund processing

#### 2.5 Payment Controller Enhancement
**Update**: `payment-service/src/main/java/com/fooddelivery/payment/controller/PaymentController.java`

**New endpoints**:
```java
POST   /api/payments/create-intent        // Create payment intent
POST   /api/payments/confirm               // Confirm payment
POST   /api/payments/{id}/refund           // Refund payment
GET    /api/payments/order/{orderId}       // Get payment by order
GET    /api/payments/user/{userId}         // Get user payment history
POST   /api/payments/webhook               // Stripe webhook handler
```

#### 2.6 Webhook Handler
**Create**: `payment-service/src/main/java/com/fooddelivery/payment/webhook/StripeWebhookHandler.java`

**Handle events**:
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed
- `payment_intent.canceled` - Payment cancelled

#### 2.7 Kafka Events
**Create**: `payment-service/src/main/java/com/fooddelivery/payment/event/PaymentEvent.java`

**Events to publish**:
- `PAYMENT_INITIATED` - Payment started
- `PAYMENT_COMPLETED` - Payment successful
- `PAYMENT_FAILED` - Payment failed
- `PAYMENT_REFUNDED` - Refund processed

---

### Phase 3: Order Service Integration (1 hour)

#### 3.1 Update Order Creation Flow
**File**: `order-service/src/main/java/com/fooddelivery/order/service/OrderService.java`

**Changes**:
```java
// Before: Create order directly
// After: Create order with PAYMENT_PENDING status

public OrderDTO createOrder(CreateOrderRequest request) {
    // 1. Create order with status PAYMENT_PENDING
    // 2. Call payment service to create payment intent
    // 3. Return order with payment intent client secret
    // 4. Frontend uses client secret to collect payment
}
```

#### 3.2 Payment Event Consumer
**Create**: `order-service/src/main/java/com/fooddelivery/order/consumer/PaymentEventConsumer.java`

**Listen for**:
- `PAYMENT_COMPLETED` → Update order status to PENDING
- `PAYMENT_FAILED` → Update order status to PAYMENT_FAILED
- `PAYMENT_REFUNDED` → Update order status to REFUNDED

#### 3.3 Order Status Enhancement
**Update**: `order-service/src/main/java/com/fooddelivery/order/entity/OrderStatus.java`

**Add statuses**:
```java
PAYMENT_PENDING,    // Waiting for payment
PAYMENT_FAILED,     // Payment failed
PENDING,            // Payment successful, order pending
CONFIRMED,          // Restaurant confirmed
// ... existing statuses
REFUNDED            // Payment refunded
```

---

### Phase 4: Frontend Implementation (1.5 hours)

#### 4.1 Stripe Setup
**Create**: `frontend/src/app/utils/stripe.js`

**Purpose**: Initialize Stripe with publishable key

#### 4.2 Payment Component
**Create**: `frontend/src/app/components/PaymentForm.jsx`

**Features**:
- Stripe CardElement for card input
- Payment processing with loading state
- Error handling and display
- Success confirmation

#### 4.3 Checkout Page Enhancement
**Update**: `frontend/src/app/pages/Checkout.jsx`

**Changes**:
```javascript
// Before: Place order directly
// After: 
// 1. Create payment intent
// 2. Show payment form
// 3. Collect payment details
// 4. Confirm payment
// 5. Create order on success
```

**Flow**:
```
Cart → Checkout → Payment Form → Process Payment → 
Success → Create Order → Redirect to Tracking
```

#### 4.4 Payment Service
**Update**: `frontend/src/app/services/paymentService.js`

**Methods**:
```javascript
createPaymentIntent(orderId, amount)
confirmPayment(paymentIntentId, paymentMethodId)
getPaymentStatus(paymentIntentId)
getPaymentHistory(userId)
requestRefund(paymentId, reason)
```

#### 4.5 Payment History Page
**Create**: `frontend/src/app/pages/PaymentHistory.jsx`

**Features**:
- List all payments
- Show payment status
- Display receipt links
- Filter by date/status

---

### Phase 5: Testing (1 hour)

#### 5.1 Test Cards (Stripe)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
3D Secure: 4000 0025 0000 3155
```

#### 5.2 Test Scenarios
1. **Successful Payment**
   - Add items to cart
   - Proceed to checkout
   - Enter test card
   - Verify payment success
   - Verify order created
   - Check payment record

2. **Failed Payment**
   - Use decline test card
   - Verify error message
   - Verify order not created
   - Verify payment record shows failed

3. **Refund Flow**
   - Place successful order
   - Cancel order
   - Verify refund initiated
   - Check refund status
   - Verify payment record updated

4. **Webhook Testing**
   - Use Stripe CLI for local testing
   - Trigger webhook events
   - Verify event handling
   - Check database updates

---

## 📊 Database Schema Changes

### Payment Table Updates
```sql
ALTER TABLE payments ADD COLUMN stripe_payment_intent_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN stripe_charge_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN payment_method_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE payments ADD COLUMN receipt_url VARCHAR(500);
ALTER TABLE payments ADD COLUMN failure_reason VARCHAR(255);
ALTER TABLE payments ADD COLUMN paid_at TIMESTAMP;

-- Add indexes
CREATE INDEX idx_payment_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_order_id ON payments(order_id);
CREATE INDEX idx_user_id ON payments(user_id);
```

### Order Table Updates
```sql
ALTER TABLE orders ADD COLUMN payment_id BIGINT;
ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50);

-- Add foreign key
ALTER TABLE orders ADD CONSTRAINT fk_payment 
  FOREIGN KEY (payment_id) REFERENCES payments(id);
```

---

## 🔄 Updated Flow Diagrams

### Current Flow (Without Payment)
```
Customer → Cart → Checkout → Place Order → Order Created (PENDING)
```

### New Flow (With Payment)
```
Customer → Cart → Checkout → 
  ↓
Create Payment Intent (PAYMENT_PENDING)
  ↓
Show Payment Form
  ↓
Enter Card Details
  ↓
Process Payment
  ↓
  ├─ Success → Order Status: PENDING → Kafka Event → Continue Flow
  └─ Failure → Show Error → Retry or Cancel
```

### Refund Flow
```
Order Cancelled (PENDING/CONFIRMED only)
  ↓
Check if Payment Completed
  ↓
Initiate Refund via Stripe
  ↓
Stripe Processes Refund
  ↓
Webhook: charge.refunded
  ↓
Update Payment Status: REFUNDED
  ↓
Update Order Status: REFUNDED
  ↓
Kafka Event: PAYMENT_REFUNDED
```

---

## 🔐 Security Considerations

### 1. API Key Management
- ✅ Store in environment variables
- ✅ Never commit to Git
- ✅ Use different keys for test/production
- ✅ Rotate keys periodically

### 2. Webhook Security
- ✅ Verify webhook signatures
- ✅ Use webhook secret
- ✅ Validate event authenticity
- ✅ Idempotency handling

### 3. PCI Compliance
- ✅ Never store card details
- ✅ Use Stripe Elements (PCI compliant)
- ✅ Let Stripe handle sensitive data
- ✅ Only store Stripe IDs

### 4. Amount Validation
- ✅ Validate amount on backend
- ✅ Prevent amount manipulation
- ✅ Check minimum/maximum limits
- ✅ Currency validation

---

## 📝 Implementation Checklist

### Backend
- [ ] Add Stripe dependency to pom.xml
- [ ] Create StripeConfig class
- [ ] Create StripeService class
- [ ] Update Payment entity
- [ ] Update PaymentService
- [ ] Update PaymentController
- [ ] Create WebhookHandler
- [ ] Create PaymentEvent class
- [ ] Create PaymentEventProducer
- [ ] Update OrderService for payment flow
- [ ] Create PaymentEventConsumer in order-service
- [ ] Update OrderStatus enum
- [ ] Update database schema
- [ ] Add environment variables
- [ ] Test all endpoints

### Frontend
- [ ] Install Stripe packages
- [ ] Create stripe.js utility
- [ ] Create PaymentForm component
- [ ] Update Checkout page
- [ ] Update paymentService.js
- [ ] Create PaymentHistory page
- [ ] Add payment status badges
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success animations
- [ ] Test payment flow
- [ ] Test error scenarios

### Testing
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test refund flow
- [ ] Test webhook handling
- [ ] Test concurrent payments
- [ ] Test edge cases
- [ ] Load testing

### Documentation
- [ ] API documentation
- [ ] Setup instructions
- [ ] Test card numbers
- [ ] Webhook setup guide
- [ ] Troubleshooting guide

---

## 💰 Cost Estimation

### Stripe Fees
- **Per transaction**: 2.9% + $0.30
- **Example**: $20 order = $0.88 fee (4.4%)
- **Monthly volume**: 1000 orders × $20 = $20,000
- **Monthly fees**: ~$880

### Development Time
- **Backend**: 2 hours
- **Frontend**: 1.5 hours
- **Testing**: 1 hour
- **Documentation**: 0.5 hours
- **Total**: ~5 hours

---

## 🚀 Quick Start Commands

### 1. Get Stripe Keys
```bash
# Sign up at https://stripe.com
# Go to Developers → API Keys
# Copy Publishable Key and Secret Key
```

### 2. Set Environment Variables
```bash
# Backend (.env or application.yml)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend (.env)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Install Dependencies
```bash
# Backend (in payment-service directory)
# Add to pom.xml and run:
mvn clean install

# Frontend
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 4. Test Webhook Locally
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8085/api/payments/webhook
```

---

## 📚 Resources

### Stripe Documentation
- Official Docs: https://stripe.com/docs
- Java SDK: https://stripe.com/docs/api/java
- React Integration: https://stripe.com/docs/stripe-js/react
- Webhooks: https://stripe.com/docs/webhooks
- Test Cards: https://stripe.com/docs/testing

### Code Examples
- Spring Boot + Stripe: https://github.com/stripe-samples/accept-a-payment
- React + Stripe: https://github.com/stripe-samples/react-elements-card-payment

---

## 🎯 Success Criteria

### Functional
- ✅ Customer can pay with credit/debit card
- ✅ Payment success creates order
- ✅ Payment failure shows error
- ✅ Refunds work for cancelled orders
- ✅ Payment history is visible
- ✅ Webhooks update order status

### Non-Functional
- ✅ Payment processing < 3 seconds
- ✅ Secure (PCI compliant)
- ✅ Error messages are user-friendly
- ✅ Loading states during processing
- ✅ Mobile responsive payment form

---

## 🔄 Next Steps After Payment

Once payment is integrated:
1. **Email receipts** - Send payment confirmation emails
2. **Invoice generation** - PDF invoices for orders
3. **Payment analytics** - Revenue tracking dashboard
4. **Multiple payment methods** - Add wallets, UPI, etc.
5. **Subscription support** - For premium features
6. **Split payments** - Restaurant commission handling

---

## ⚠️ Important Notes

### For Development
- Use Stripe **test mode** - No real money
- Test cards work only in test mode
- Webhook testing requires Stripe CLI or ngrok

### For Production
- Switch to **live mode** keys
- Complete Stripe account verification
- Set up proper webhook endpoints
- Enable 3D Secure for security
- Monitor transactions in Stripe Dashboard

### Common Pitfalls
- ❌ Storing card details (never do this!)
- ❌ Not validating amounts on backend
- ❌ Ignoring webhook signature verification
- ❌ Not handling payment failures gracefully
- ❌ Forgetting to test refund flow

---

## 🎉 Ready to Implement?

This plan gives you everything needed to integrate Stripe payments. The implementation is straightforward and well-documented.

**Estimated Time**: 5 hours total
**Difficulty**: Medium
**Value**: High (complete transaction flow)

Would you like me to start implementing this step by step?
