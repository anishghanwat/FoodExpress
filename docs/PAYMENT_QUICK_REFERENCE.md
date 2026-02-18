# Payment Integration - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

### 1. Get Stripe Keys
```
https://stripe.com → Sign up → Developers → API keys
Copy: pk_test_... and sk_test_...
```

### 2. Configure
```bash
# .env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY

# frontend/.env.development  
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
```

### 3. Start Services
```bash
cd payment-service && mvn spring-boot:run
cd frontend && npm run dev
```

### 4. Test
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVV: 123
```

---

## 🧪 Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ❌ Insufficient funds |
| 4000 0025 0000 3155 | 🔐 3D Secure |

---

## 📡 API Endpoints

```
POST /api/payments/create-intent    Create payment intent
POST /api/payments/confirm           Confirm payment
POST /api/payments/{id}/refund       Refund payment
GET  /api/payments/order/{orderId}   Get payment by order
GET  /api/payments/customer/{id}     Get customer payments
```

---

## 🔄 Payment Flow

### Card Payment
```
Address → Select Card → Proceed to Payment → 
Enter Card → Pay → Confirm → Create Order → Track
```

### Cash Payment
```
Address → Select Cash → Place Order → Track
```

---

## 🎨 UI Components

### PaymentForm
```jsx
<Elements stripe={stripePromise}>
  <PaymentForm
    amount={total}
    onSuccess={handleSuccess}
    onError={handleError}
  />
</Elements>
```

### Checkout Integration
```jsx
const [showPaymentForm, setShowPaymentForm] = useState(false);
const [paymentIntent, setPaymentIntent] = useState(null);

// Create intent
const response = await paymentService.createIntent({...});
setPaymentIntent(response);
setShowPaymentForm(true);

// Handle success
const handleSuccess = async (paymentMethod) => {
  await paymentService.confirmPayment(paymentIntent.paymentIntentId);
  await orderService.create(orderData);
};
```

---

## 🐛 Troubleshooting

### Payment Form Not Showing
```
✓ Check VITE_STRIPE_PUBLISHABLE_KEY in .env.development
✓ Restart frontend: npm run dev
✓ Check browser console for errors
```

### Payment Intent Creation Failed
```
✓ Check STRIPE_SECRET_KEY in .env
✓ Restart payment-service
✓ Check payment-service logs
✓ Verify Stripe Dashboard (test mode)
```

### Order Not Created After Payment
```
✓ Check order-service is running (port 8083)
✓ Check browser console
✓ Check order-service logs
✓ Verify API Gateway routing
```

---

## 📊 Payment States

```
PENDING     → Payment intent created
COMPLETED   → Payment successful
FAILED      → Payment failed
REFUNDED    → Payment refunded
```

---

## 🔐 Security Checklist

```
✅ Card details never stored
✅ Stripe handles PCI compliance
✅ Payment intent server-side
✅ Payment confirmation server-side
✅ API keys in environment variables
✅ HTTPS in production
```

---

## 📚 Documentation

```
PAYMENT_READY.md                          Quick start
STRIPE_SETUP_GUIDE.md                     Detailed setup
CHECKOUT_PAYMENT_INTEGRATION_COMPLETE.md  Implementation
PAYMENT_FLOW_GUIDE.md                     Visual flows
CHECKOUT_INTEGRATION_SUMMARY.md           Summary
```

---

## 🎯 Success Indicators

### Frontend
```
✅ Payment form appears
✅ Card validation works
✅ Success message shows
✅ Redirects to tracking
```

### Backend
```
✅ Payment in database
✅ Payment in Stripe Dashboard
✅ Order created
✅ Order linked to payment
```

---

## 💡 Quick Commands

### Test Payment API
```bash
curl -X POST http://localhost:8085/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{"orderId":1,"customerId":1,"amount":25.99,"currency":"usd","paymentMethod":"CARD"}'
```

### Check Payment Service
```bash
curl http://localhost:8085/actuator/health
```

### Run Test Script
```bash
cd scripts
.\test-payment-service.ps1
```

---

## 🔗 Quick Links

```
Stripe Dashboard:  https://dashboard.stripe.com
Test Payments:     https://dashboard.stripe.com/test/payments
API Keys:          https://dashboard.stripe.com/test/apikeys
Test Cards:        https://stripe.com/docs/testing
Stripe Docs:       https://stripe.com/docs
```

---

## 📱 Mobile Testing

```
Same flow as desktop
Use responsive design
Test on real devices
Verify card input works
Check redirect behavior
```

---

## 🎉 Quick Test Checklist

```
□ Stripe keys configured
□ Payment service running
□ Frontend running
□ Can login as customer
□ Can add items to cart
□ Can go to checkout
□ Can fill address
□ Can select card payment
□ Payment form appears
□ Can enter test card
□ Payment processes
□ Order created
□ Redirects to tracking
□ Payment in Stripe Dashboard
```

---

## 🚨 Common Mistakes

```
❌ Forgetting to restart services after .env changes
❌ Using live keys instead of test keys
❌ Not checking Stripe Dashboard
❌ Trying real cards in test mode
❌ Not reading error messages
```

---

## ✨ Pro Tips

```
💡 Always check Stripe Dashboard first
💡 Use test mode for development
💡 Read Stripe error messages carefully
💡 Test with different test cards
💡 Check browser console for errors
💡 Verify all services are running
💡 Use the test script for quick checks
```

---

## 🎯 One-Liner Commands

```bash
# Start payment service
cd payment-service && mvn spring-boot:run

# Start frontend
cd frontend && npm run dev

# Test payment API
curl -X POST http://localhost:8085/api/payments/create-intent -H "Content-Type: application/json" -d '{"orderId":1,"customerId":1,"amount":25.99,"currency":"usd","paymentMethod":"CARD"}'

# Check health
curl http://localhost:8085/actuator/health
```

---

## 📞 Need Help?

```
1. Check troubleshooting section
2. Review documentation
3. Check Stripe Dashboard
4. Review service logs
5. Test with different cards
```

---

**Keep this card handy for quick reference!** 📌
