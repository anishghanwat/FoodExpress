# Stripe Payment Integration - Setup Guide

## 🎯 Overview

This guide will help you set up Stripe payment integration for the Food Delivery System. The backend implementation is complete, and you just need to configure your Stripe API keys.

---

## 📋 Prerequisites

- Stripe account (free to create)
- Backend services running (payment-service on port 8085)
- Frontend running (port 5173)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Click "Sign up" (top right)
3. Fill in your email and create password
4. Complete the registration

### Step 2: Get API Keys

1. After login, you'll be in the Stripe Dashboard
2. Make sure you're in **TEST MODE** (toggle in top right should say "Test mode")
3. Go to **Developers** → **API keys** (https://dashboard.stripe.com/test/apikeys)
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

### Step 3: Configure Backend

1. Open `.env` file in the project root
2. Replace the Stripe configuration:

```env
# Stripe Configuration (Payment Service)
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_CURRENCY=usd
```

3. Replace `sk_test_YOUR_ACTUAL_SECRET_KEY_HERE` with your actual secret key from Step 2

### Step 4: Configure Frontend

1. Open `frontend/.env.development`
2. Replace the Stripe configuration:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
```

3. Replace `pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE` with your actual publishable key from Step 2

### Step 5: Restart Services

```bash
# Stop payment-service if running
# Then rebuild and restart

cd payment-service
mvn clean install
mvn spring-boot:run
```

```bash
# Restart frontend
cd frontend
npm run dev
```

---

## ✅ Verify Setup

### Test Payment Flow

1. **Login** as customer (`customer@test.com` / `Password@123`)
2. **Browse restaurants** and add items to cart
3. **Go to checkout**
4. **Use test card**: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits (e.g., 123)
5. **Place order** - Payment should process successfully

### Check Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. You should see your test payment listed
3. Click on it to see details

---

## 🧪 Test Cards

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0025 0000 3155 | 3D Secure authentication |

**For all cards:**
- Use any future expiry date
- Use any 3-digit CVV
- Use any billing ZIP code

---

## 🔧 Current Implementation Status

### ✅ Completed (Backend)

- [x] Stripe dependency added to pom.xml
- [x] StripeConfig class created
- [x] StripeService with core payment methods
- [x] PaymentService with business logic
- [x] Payment entity updated with Stripe fields
- [x] PaymentController with new endpoints
- [x] DTOs for requests/responses
- [x] Environment configuration

### ✅ Completed (Frontend)

- [x] Stripe packages installed
- [x] Stripe utility created
- [x] PaymentForm component created
- [x] PaymentService updated
- [x] Environment configuration

### 🚧 To Be Implemented

- [ ] Update Checkout page to use PaymentForm
- [ ] Webhook handler for Stripe events
- [ ] Kafka events for payment status
- [ ] Order service integration
- [ ] Payment history page
- [ ] Refund flow UI

---

## 📡 API Endpoints

### Payment Service (Port 8085)

```
POST   /api/payments/create-intent    - Create payment intent
POST   /api/payments/confirm           - Confirm payment
POST   /api/payments/{id}/refund       - Refund payment
GET    /api/payments                   - Get all payments (admin)
GET    /api/payments/{id}              - Get payment by ID
GET    /api/payments/order/{orderId}   - Get payment by order
GET    /api/payments/customer/{customerId} - Get customer payments
```

---

## 🔐 Security Notes

### ✅ What We Do Right

- API keys stored in environment variables
- Never commit keys to Git
- Use test mode for development
- Stripe handles card data (PCI compliant)
- Only store Stripe IDs, not card details

### ⚠️ Important

- **Never** share your secret key
- **Never** commit `.env` file
- **Always** use test mode for development
- **Rotate** keys if accidentally exposed

---

## 🐛 Troubleshooting

### Payment Intent Creation Fails

**Error**: "No such API key"
- **Solution**: Check that STRIPE_SECRET_KEY is set correctly in `.env`
- **Verify**: Key starts with `sk_test_`

### Frontend Can't Load Stripe

**Error**: "Stripe.js failed to load"
- **Solution**: Check that VITE_STRIPE_PUBLISHABLE_KEY is set in `frontend/.env.development`
- **Verify**: Key starts with `pk_test_`
- **Restart**: Frontend dev server after changing .env

### Payment Succeeds but Order Not Created

**Issue**: Payment works but order creation fails
- **Cause**: Order service integration not yet implemented
- **Status**: Coming in next phase

---

## 📊 Database Schema

The Payment entity now includes these Stripe-specific fields:

```sql
stripe_payment_intent_id VARCHAR(255)  -- Stripe payment intent ID
stripe_charge_id VARCHAR(255)          -- Stripe charge ID
payment_method_id VARCHAR(255)         -- Stripe payment method ID
currency VARCHAR(3)                    -- Currency code (USD, EUR, etc.)
receipt_url VARCHAR(500)               -- Stripe receipt URL
failure_reason VARCHAR(255)            -- Failure reason if payment fails
paid_at TIMESTAMP                      -- When payment was completed
```

These are automatically created when payment-service starts (JPA auto-update).

---

## 🎯 Next Steps

1. **Get Stripe Keys** (5 min)
   - Sign up at stripe.com
   - Get test API keys
   - Configure .env files

2. **Test Basic Payment** (10 min)
   - Restart services
   - Test payment flow
   - Verify in Stripe dashboard

3. **Implement Checkout Integration** (30 min)
   - Update Checkout page
   - Add PaymentForm component
   - Handle payment success/failure

4. **Add Webhooks** (30 min)
   - Create webhook handler
   - Test with Stripe CLI
   - Handle payment events

5. **Order Integration** (1 hour)
   - Update order creation flow
   - Add payment status to orders
   - Implement Kafka events

---

## 📚 Resources

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe Docs**: https://stripe.com/docs
- **Test Cards**: https://stripe.com/docs/testing
- **API Reference**: https://stripe.com/docs/api
- **Stripe CLI**: https://stripe.com/docs/stripe-cli

---

## 💡 Tips

1. **Always use test mode** during development
2. **Check Stripe Dashboard** to debug payment issues
3. **Use Stripe CLI** for webhook testing
4. **Read error messages** - Stripe provides detailed errors
5. **Test different scenarios** with various test cards

---

## ✨ What's Working Now

After setup, you can:
- ✅ Create payment intents
- ✅ Process card payments
- ✅ View payment history
- ✅ Refund payments (via API)
- ✅ See payments in Stripe Dashboard

---

## 🎉 Ready to Go!

Once you've completed Steps 1-5 above, your Stripe integration will be ready for testing. The backend is fully implemented and waiting for your API keys!

**Need help?** Check the troubleshooting section or Stripe documentation.
