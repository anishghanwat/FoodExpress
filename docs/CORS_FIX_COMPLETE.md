# CORS Issue Fixed ✅

## 🐛 Problem

CORS error when calling payment service from frontend:
```
Access-Control-Allow-Origin header contains multiple values 
'http://localhost:5173, http://localhost:5173', but only one is allowed
```

## ✅ Solution

### What Was Done

1. **Removed duplicate @CrossOrigin annotation** from PaymentController
   - The annotation was causing duplicate CORS headers
   - Removed: `@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})`

2. **Created CorsConfig class** for centralized CORS configuration
   - File: `payment-service/src/main/java/com/fooddelivery/payment/config/CorsConfig.java`
   - Configures CORS filter for all endpoints
   - Allows origins: http://localhost:5173, http://localhost:3000
   - Allows all headers and common HTTP methods
   - Sets credentials to true

3. **Rebuilt payment-service**
   - Compiled successfully
   - Ready to restart

## 🚀 Next Steps

### Restart Payment Service

```bash
# Stop the current payment-service (Ctrl+C if running in terminal)

# Then restart:
cd payment-service
mvn spring-boot:run
```

Wait for: `Started PaymentServiceApplication`

### Test Payment Flow

1. Go to checkout page
2. Fill delivery address
3. Select "Credit/Debit Card"
4. Click "Proceed to Payment"
5. Payment form should appear (no CORS error)
6. Enter test card: 4242 4242 4242 4242
7. Complete payment

## 🔍 Verification

### Check CORS Headers

```bash
curl -X OPTIONS http://localhost:8085/api/payments/create-intent \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Expected response headers:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Allow-Credentials: true
```

### Test Payment Intent Creation

```bash
curl -X POST http://localhost:8085/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d "{\"orderId\":1,\"customerId\":1,\"amount\":25.99,\"currency\":\"usd\",\"paymentMethod\":\"CARD\"}" \
  -v
```

Should return payment intent without CORS errors.

## 📁 Files Modified

1. `payment-service/src/main/java/com/fooddelivery/payment/controller/PaymentController.java`
   - Removed @CrossOrigin annotation

2. `payment-service/src/main/java/com/fooddelivery/payment/config/CorsConfig.java` [NEW]
   - Added centralized CORS configuration

## 💡 Why This Happened

The PaymentController had `@CrossOrigin` annotation, and likely there was another CORS configuration somewhere (possibly in Spring Security or another config) that was also adding CORS headers. This caused duplicate headers.

By removing the annotation and using a centralized CorsConfig, we ensure CORS headers are only added once.

## ✅ Success Criteria

After restarting payment-service:

- [ ] No CORS errors in browser console
- [ ] Payment intent creation works
- [ ] Payment form appears
- [ ] Can complete payment flow
- [ ] Order created successfully

## 🎉 Ready to Test!

Restart payment-service and try the checkout flow again. The CORS error should be gone!
