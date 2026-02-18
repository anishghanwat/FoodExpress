# Order Placement Debugging Guide

## Quick Test

### 1. Check if Order Service is Running
```bash
curl http://localhost:8083/actuator/health
```
Should return: `{"status":"UP"}`

### 2. Check if it's registered in Eureka
Open: http://localhost:8761
Look for: ORDER-SERVICE

### 3. Test Order Creation via curl

First, get your user ID from localStorage:
1. Open browser console (F12)
2. Type: `JSON.parse(localStorage.getItem('currentUser'))`
3. Note the `id` field

Then test the API directly:
```bash
curl -X POST http://localhost:8080/api/orders ^
  -H "Content-Type: application/json" ^
  -H "X-User-Id: 1" ^
  -d "{\"restaurantId\":1,\"deliveryAddress\":\"123 Test St\",\"deliveryInstructions\":\"Ring doorbell\",\"paymentMethod\":\"CARD\",\"items\":[{\"menuItemId\":1,\"itemName\":\"Margherita Pizza\",\"quantity\":1,\"price\":12.99,\"specialInstructions\":\"\"}]}"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "restaurantId": 1,
    "status": "PENDING",
    "totalAmount": 12.99,
    "deliveryFee": 2.99,
    "tax": 1.04,
    "grandTotal": 17.02,
    ...
  },
  "message": "Order created successfully",
  "timestamp": "..."
}
```

## Common Issues

### Issue 1: User ID not being sent
**Check**: Open browser DevTools → Network tab → Click on the order request → Check Headers
**Look for**: `X-User-Id` header

**Fix**: The user object might not have an `id` field. Check localStorage:
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('currentUser'));
console.log('User object:', user);
console.log('User ID:', user?.id);
```

### Issue 2: Order Service not running
**Check**: 
```bash
netstat -ano | findstr "8083"
```

**Fix**: Start it:
```bash
cd order-service
mvn spring-boot:run
```

### Issue 3: Wrong request format
The backend expects:
```json
{
  "restaurantId": 1,
  "deliveryAddress": "123 Main St",
  "deliveryInstructions": "Optional",
  "paymentMethod": "CARD",
  "items": [
    {
      "menuItemId": 1,
      "itemName": "Pizza",
      "quantity": 2,
      "price": 12.99,
      "specialInstructions": "Extra cheese"
    }
  ]
}
```

### Issue 4: API Gateway not routing
**Check**: API Gateway logs for routing errors

**Fix**: Verify route in `api-gateway/src/main/resources/application.yml`:
```yaml
- id: order-service
  uri: lb://order-service
  predicates:
    - Path=/api/orders/**
```

## Frontend Debugging

### Check if X-User-Id is being added

Add this to `frontend/src/app/services/api.js` request interceptor:
```javascript
console.log('Headers being sent:', config.headers);
console.log('User from storage:', storage.getUser());
```

### Check the order request payload

In `frontend/src/app/pages/Checkout.jsx` (or wherever order is created), add:
```javascript
console.log('Order data being sent:', orderData);
```

## Backend Debugging

### Check Order Service logs

Look for:
- Incoming request logs
- Any exceptions
- Database connection issues

### Check if database table exists

```bash
docker exec fooddelivery-mysql mysql -uroot -proot order_db -e "SHOW TABLES;"
```

Should show: `orders` and `order_items` tables

### Manually check database

```bash
docker exec fooddelivery-mysql mysql -uroot -proot order_db -e "SELECT * FROM orders;"
```

## Quick Fixes

### Fix 1: User ID field name mismatch

The backend might be expecting a different field. Check what the login response returns:

```javascript
// In AuthContext.jsx, after login
console.log('Login response:', response);
console.log('User data:', response.user);
```

If the user object has `userId` instead of `id`, update `api.js`:
```javascript
if (user && user.userId) {
    config.headers['X-User-Id'] = user.userId;
}
```

### Fix 2: Make X-User-Id optional

Update OrderController to get user ID from JWT token instead:
```java
@PostMapping
public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
        @RequestHeader(value = "X-User-Id", required = false) Long userId,
        @RequestBody CreateOrderRequest request) {
    // If userId not in header, extract from JWT token
    if (userId == null) {
        // TODO: Extract from JWT
        userId = 1L; // Temporary fallback
    }
    ...
}
```

## Test Checklist

- [ ] Order Service running on port 8083
- [ ] Order Service registered in Eureka
- [ ] User logged in (token in localStorage)
- [ ] User object has `id` field
- [ ] X-User-Id header being sent
- [ ] Cart has items
- [ ] Delivery address provided
- [ ] Payment method selected

## Success Indicators

When working correctly:
1. Network tab shows POST to `/api/orders`
2. Request headers include `X-User-Id: <number>`
3. Response status is 200
4. Response has `success: true`
5. Order appears in database
6. User is redirected to order confirmation/tracking page

---

**Next Step**: Run through this checklist and let me know which step fails!
