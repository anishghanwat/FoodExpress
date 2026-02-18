# Payment Integration - Quick Test Guide

## 🚀 Start Testing in 3 Steps

### Step 1: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 2: Open Browser
Go to: **http://localhost:5173**

### Step 3: Test Payment
1. Login: `customer@test.com` / `Password@123`
2. Add items to cart
3. Checkout → Select "Card"
4. Enter: `4242 4242 4242 4242` (Exp: 12/25, CVV: 123)
5. Pay → Done! ✅

---

## 🧪 Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ❌ Insufficient Funds |

---

## ✅ What Should Happen

1. Payment form loads with Stripe Elements
2. Card details accepted
3. "Processing..." shown
4. Success message appears
5. Redirected to order tracking
6. Order created with status "PENDING"

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Payment form not showing | Check console, verify Stripe key in .env.development |
| "Invalid API Key" error | Check application.yml, restart payment service |
| CORS error | Already fixed! Restart API gateway if needed |
| Database error | Already fixed! Schema updated |

---

## 📊 Verify Success

### In Browser Console (F12)
```
✅ Payment intent created: pi_xxx...
✅ Payment confirmed successfully
✅ Order created: #123
```

### In Database
```sql
SELECT * FROM payment_db.payments ORDER BY id DESC LIMIT 1;
-- Should show: status = 'COMPLETED', payment_method = 'CARD'

SELECT * FROM order_db.orders ORDER BY id DESC LIMIT 1;
-- Should show: status = 'PENDING', linked to payment
```

---

## 🎯 Services Status

All should be running:
- ✅ MySQL (3306)
- ✅ Kafka (29092)
- ✅ API Gateway (8080)
- ✅ Payment Service (8085)
- ✅ Frontend (5173)

Check: `docker ps` and `curl http://localhost:8085/actuator/health`

---

## 📝 Quick Commands

```bash
# Test backend payment API
./scripts/test-payment-flow.ps1

# Start everything
./scripts/start-payment-testing.bat

# Check payment service
curl http://localhost:8085/actuator/health

# View latest payment
docker exec -it fooddelivery-mysql mysql -uroot -proot -e "SELECT * FROM payment_db.payments ORDER BY id DESC LIMIT 1;"
```

---

## 🎉 Success!

If you can complete a payment and see the order created, **you're done!**

Payment integration is working perfectly. 🚀

---

**Full Guide**: `docs/TEST_PAYMENT_FRONTEND.md`
**Next Steps**: `docs/WHATS_NEXT_PAYMENT.md`
