# Frontend Payment Testing Guide

## ✅ What's Already Done

### Backend (Complete)
- ✅ Stripe SDK integrated
- ✅ Payment Service with Stripe integration
- ✅ Payment Controller with all endpoints
- ✅ Database schema updated (CARD method supported)
- ✅ Payment intent creation working
- ✅ CORS configured properly
- ✅ Stripe API keys configured

### Frontend (Complete)
- ✅ Stripe packages installed (@stripe/stripe-js, @stripe/react-stripe-js)
- ✅ PaymentForm component created
- ✅ Checkout page integrated with payment flow
- ✅ Payment service methods implemented
- ✅ Stripe publishable key configured

## 🧪 Manual Testing Steps

### Prerequisites
1. All services running:
   - ✅ MySQL (port 3306)
   - ✅ Kafka (port 29092)
   - ✅ Eureka Server (port 8761)
   - ✅ API Gateway (port 8080)
   - ✅ User Service (port 8081)
   - ✅ Restaurant Service (port 8082)
   - ✅ Order Service (port 8083)
   - ✅ Delivery Service (port 8084)
   - ✅ Payment Service (port 8085)
   - ✅ Frontend (port 5173)

2. Demo data loaded:
   - ✅ Demo users created
   - ✅ Restaurants with menu items

### Test Scenario 1: Successful Card Payment

#### Step 1: Start Frontend
```bash
cd frontend
npm run dev
```
Open http://localhost:5173

#### Step 2: Login as Customer
- Email: `customer@test.com`
- Password: `Password@123`

#### Step 3: Browse and Add Items
1. Click on a restaurant
2. Add 2-3 menu items to cart
3. Verify cart shows correct items and total

#### Step 4: Proceed to Checkout
1. Click "Checkout" or cart icon
2. Verify delivery address is shown
3. Verify order summary is correct

#### Step 5: Select Card Payment
1. Select "Card" as payment method
2. Click "Proceed to Payment"
3. Wait for payment form to load

#### Step 6: Enter Card Details
Use Stripe test card:
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **ZIP**: Any 5 digits (e.g., `12345`)

#### Step 7: Complete Payment
1. Click "Pay" button
2. Wait for processing (should take 2-3 seconds)
3. Verify success message appears
4. Verify redirect to order tracking page

#### Step 8: Verify Order Created
1. Check order tracking page shows new order
2. Verify order status is "PENDING"
3. Note the order ID

#### Step 9: Verify in Database
```sql
-- Check payment record
SELECT * FROM payment_db.payments ORDER BY id DESC LIMIT 1;

-- Check order record
SELECT * FROM order_db.orders ORDER BY id DESC LIMIT 1;

-- Verify payment is linked to order
SELECT o.id, o.status, p.status as payment_status, p.amount 
FROM order_db.orders o 
LEFT JOIN payment_db.payments p ON o.id = p.order_id 
ORDER BY o.id DESC LIMIT 1;
```

### Test Scenario 2: Failed Card Payment

#### Step 1-4: Same as Scenario 1

#### Step 5: Use Decline Test Card
- **Card Number**: `4000 0000 0000 0002` (Always declines)
- **Expiry**: Any future date
- **CVV**: Any 3 digits

#### Step 6: Verify Error Handling
1. Click "Pay" button
2. Verify error message appears
3. Verify user can retry with different card
4. Verify no order was created

### Test Scenario 3: Cash Payment (No Stripe)

#### Step 1-3: Same as Scenario 1

#### Step 4: Select Cash Payment
1. Select "Cash" as payment method
2. Click "Place Order" (not "Proceed to Payment")
3. Verify order created immediately
4. Verify no payment form shown

### Test Scenario 4: Payment History

#### Step 1: Navigate to Order History
1. Click on user profile/menu
2. Go to "Order History" or "My Orders"

#### Step 2: Verify Payment Details
1. See list of past orders
2. Click on an order
3. Verify payment details shown:
   - Payment method
   - Amount paid
   - Payment status
   - Transaction ID

## 🔍 What to Check

### Frontend Console
Open browser DevTools (F12) → Console tab

**Look for**:
- ✅ No JavaScript errors
- ✅ API calls successful (200 status)
- ✅ Payment intent created log
- ✅ Payment confirmed log

**Example logs**:
```
🚀 Request: POST /api/payments/create-intent
✅ Response: 200 /api/payments/create-intent
Payment intent created: pi_xxx...
```

### Network Tab
Open browser DevTools (F12) → Network tab

**Check these requests**:
1. `POST /api/payments/create-intent` → 200 OK
2. Stripe API calls (to api.stripe.com) → 200 OK
3. `POST /api/payments/confirm` → 200 OK
4. `POST /api/orders` → 201 Created

### Backend Logs

#### Payment Service Logs
```bash
# Check payment service is processing requests
# Look for:
- "Creating payment intent for order..."
- "Payment intent created: pi_xxx"
- "Confirming payment: pi_xxx"
- "Payment confirmed successfully"
```

#### Order Service Logs
```bash
# Check order creation
# Look for:
- "Creating order for user..."
- "Order created with ID: xxx"
- "Publishing order event..."
```

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid API Key"
**Symptom**: Payment intent creation fails with 401 error

**Solution**:
1. Check `payment-service/src/main/resources/application.yml`
2. Verify Stripe secret key is correct
3. Restart payment service

### Issue 2: "CORS Error"
**Symptom**: Request blocked by CORS policy

**Solution**:
1. Check `api-gateway/src/main/resources/application.yml`
2. Verify CORS configuration includes `http://localhost:5173`
3. Restart API gateway

### Issue 3: Payment Form Not Showing
**Symptom**: After clicking "Proceed to Payment", nothing happens

**Solution**:
1. Check browser console for errors
2. Verify Stripe publishable key in `frontend/.env.development`
3. Check if payment intent was created (Network tab)
4. Verify `showPaymentForm` state is true

### Issue 4: "Data truncated for column 'payment_method'"
**Symptom**: Payment intent created but fails to save

**Solution**:
✅ Already fixed! Database schema updated to VARCHAR(20)

### Issue 5: Order Not Created After Payment
**Symptom**: Payment succeeds but no order appears

**Solution**:
1. Check `handlePaymentSuccess` function in Checkout.jsx
2. Verify `handlePlaceOrder` is called after payment confirmation
3. Check order service logs for errors
4. Verify Kafka is running (order events)

## 📊 Success Indicators

### ✅ Payment Flow Working If:
1. Payment intent created (check console/network)
2. Stripe payment form appears
3. Card details accepted
4. Payment processes without errors
5. Success message shown
6. Order created in database
7. Redirected to order tracking
8. Payment record in database with status "COMPLETED"
9. Order record linked to payment

### ✅ Error Handling Working If:
1. Invalid card shows error message
2. Network errors show user-friendly message
3. User can retry payment
4. Failed payments don't create orders
5. Loading states shown during processing

## 🎯 Next Steps After Testing

### If Everything Works:
1. ✅ Test with different card types
2. ✅ Test with different amounts
3. ✅ Test concurrent payments (multiple users)
4. ✅ Test on mobile devices
5. ✅ Document any edge cases found

### If Issues Found:
1. Note the exact error message
2. Check browser console
3. Check backend logs
4. Check database state
5. Share error details for debugging

## 🚀 Quick Test Command

Run this to test backend payment flow:
```bash
./scripts/test-payment-flow.ps1
```

This verifies:
- ✅ Login works
- ✅ Payment intent creation works
- ✅ Payment record saved to database
- ✅ Payment status retrievable

## 📝 Test Checklist

- [ ] Frontend starts without errors
- [ ] Can login as customer
- [ ] Can browse restaurants
- [ ] Can add items to cart
- [ ] Cart shows correct total
- [ ] Can proceed to checkout
- [ ] Delivery address shown
- [ ] Can select "Card" payment method
- [ ] "Proceed to Payment" button works
- [ ] Payment form loads (Stripe Elements)
- [ ] Can enter card details
- [ ] Card validation works
- [ ] "Pay" button processes payment
- [ ] Loading state shown during processing
- [ ] Success message appears
- [ ] Order created successfully
- [ ] Redirected to order tracking
- [ ] Order appears in order history
- [ ] Payment details visible
- [ ] Can test with decline card
- [ ] Error message shown for failed payment
- [ ] Can retry after failure
- [ ] Cash payment still works
- [ ] No console errors
- [ ] All API calls successful

## 🎉 Ready to Test!

Everything is set up and ready. Just follow the test scenarios above and verify each step works as expected.

**Start here**: http://localhost:5173

**Test credentials**: customer@test.com / Password@123

**Test card**: 4242 4242 4242 4242

Good luck! 🚀
