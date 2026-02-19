# Integration Test Guide

## Prerequisites

✅ MySQL running with databases created
✅ All backend services running and registered with Eureka
✅ Frontend running on port 5173

## Test Checklist

### 1. Backend Health Check

```bash
# Check Eureka Dashboard
http://localhost:8761

# Should show 7 services:
# - API-GATEWAY
# - USER-SERVICE
# - RESTAURANT-SERVICE
# - ORDER-SERVICE
# - DELIVERY-SERVICE
# - PAYMENT-SERVICE
# - NOTIFICATION-SERVICE

# Check API Gateway
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}
```

### 2. Test Authentication API (Backend Only)

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"9876543210\",\"password\":\"Password123\",\"role\":\"CUSTOMER\"}"
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER"
    }
  },
  "message": "User registered successfully",
  "timestamp": "2026-02-17T..."
}
```

#### Login User
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Password123\"}"
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER"
    }
  },
  "message": "Login successful",
  "timestamp": "2026-02-17T..."
}
```

### 3. Test Frontend Authentication

#### A. Register New User
1. Open http://localhost:5173/register
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: Password123
   - Role: Customer
3. Click "Register"
4. **Check Browser Console**:
   - Should see: `🚀 Request: POST /api/auth/register`
   - Should see: `✅ Response: /api/auth/register {success: true, ...}`
5. **Check localStorage**:
   - Open DevTools → Application → Local Storage
   - Should see: `auth_token` with JWT value
   - Should see: `user_data` with user object
6. **Expected Result**: Redirect to home page or dashboard

#### B. Login Existing User
1. Open http://localhost:5173/login
2. Enter credentials:
   - Email: john@example.com
   - Password: Password123
3. Click "Login"
4. **Check Browser Console**:
   - Should see: `🚀 Request: POST /api/auth/login`
   - Should see: `✅ Response: /api/auth/login {success: true, ...}`
5. **Check localStorage**: Same as register
6. **Expected Result**: Redirect to home page or dashboard

#### C. Logout
1. Click logout button (if available in UI)
2. **Check Browser Console**:
   - Should see: `🚀 Request: POST /api/auth/logout`
3. **Check localStorage**: Should be cleared
4. **Expected Result**: Redirect to login page

### 4. Test Restaurant API (Backend Only)

#### Create Restaurant
```bash
curl -X POST http://localhost:8080/api/restaurants ^
  -H "Content-Type: application/json" ^
  -d "{\"ownerId\":1,\"name\":\"Pizza Palace\",\"description\":\"Best pizza in town\",\"address\":\"123 Main St\",\"phone\":\"1234567890\",\"email\":\"pizza@example.com\",\"cuisine\":\"Italian\",\"openingTime\":\"10:00\",\"closingTime\":\"22:00\",\"deliveryFee\":2.99}"
```

#### Get All Restaurants
```bash
curl http://localhost:8080/api/restaurants
```

Expected Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pizza Palace",
      "description": "Best pizza in town",
      "cuisine": "Italian",
      ...
    }
  ],
  "message": "Restaurants retrieved successfully",
  "timestamp": "2026-02-17T..."
}
```

### 5. Test Frontend Restaurant Browsing

1. Open http://localhost:5173/restaurants
2. **Check Browser Console**:
   - Should see: `🚀 Request: GET /api/restaurants`
   - Should see: `✅ Response: /api/restaurants [...]`
3. **Expected Result**: List of restaurants displayed

### 6. Test Protected Routes

#### A. Access Protected Route Without Login
1. Clear localStorage (logout if logged in)
2. Try to access: http://localhost:5173/orders
3. **Expected Result**: Redirect to /login

#### B. Access Protected Route With Login
1. Login as customer
2. Access: http://localhost:5173/orders
3. **Expected Result**: Page loads successfully

#### C. Access Role-Based Route
1. Login as CUSTOMER
2. Try to access: http://localhost:5173/owner/dashboard
3. **Expected Result**: Redirect or "Access Denied" message

### 7. Test Error Handling

#### A. Invalid Credentials
1. Go to http://localhost:5173/login
2. Enter wrong password
3. **Expected Result**: Error toast message displayed

#### B. Network Error
1. Stop backend services
2. Try to login
3. **Expected Result**: Error toast with network error message

#### C. Validation Error
1. Go to http://localhost:5173/register
2. Enter invalid email format
3. **Expected Result**: Form validation error displayed

### 8. Test Token Expiration

1. Login successfully
2. Wait 24 hours (or modify JWT expiration in backend to 1 minute for testing)
3. Make any API request
4. **Expected Result**: Redirect to login page

### 9. Test CORS

1. Open browser console
2. Make any API request from frontend
3. **Check Console**: Should NOT see CORS errors
4. **If CORS errors appear**:
   - Check backend SecurityConfig
   - Verify `http://localhost:5173` is allowed
   - Check API Gateway CORS configuration

### 10. Database Verification

#### Check User Created
```sql
USE user_db;
SELECT * FROM users;
```

Should show registered users with hashed passwords.

#### Check Restaurant Created
```sql
USE restaurant_db;
SELECT * FROM restaurants;
```

Should show created restaurants.

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Browser console shows CORS policy error

**Solution**:
- Verify backend SecurityConfig allows `http://localhost:5173`
- Check API Gateway CORS configuration
- Restart backend services

### Issue 2: 401 Unauthorized
**Symptom**: All API requests return 401

**Solution**:
- Check if token is stored in localStorage
- Verify token format in request headers
- Check token expiration
- Try logging in again

### Issue 3: Network Error
**Symptom**: API requests fail with network error

**Solution**:
- Verify all backend services are running
- Check Eureka dashboard
- Verify API Gateway is running on port 8080
- Check frontend .env.development has correct API_GATEWAY_URL

### Issue 4: Response Format Error
**Symptom**: Frontend can't parse backend response

**Solution**:
- Check backend returns: `{success, data, message, timestamp}`
- Verify API interceptor is extracting data correctly
- Check browser console for response structure

### Issue 5: Service Not Registered
**Symptom**: API Gateway can't route to service

**Solution**:
- Check Eureka dashboard for registered services
- Wait 30-60 seconds for service registration
- Restart the service
- Check service application.yml for Eureka configuration

## Success Criteria

✅ User can register via frontend
✅ User can login via frontend
✅ JWT token is stored in localStorage
✅ Protected routes work correctly
✅ Role-based routes work correctly
✅ API requests go through API Gateway
✅ Backend response format is handled correctly
✅ Error messages are displayed via toast
✅ CORS is working without errors
✅ Data is persisted in MySQL databases

## Next Steps After Successful Integration

1. Implement Restaurant List page with real data
2. Implement Restaurant Detail page with menu
3. Implement Add to Cart functionality
4. Implement Checkout and Order placement
5. Implement Order Tracking
6. Implement Delivery Agent features
7. Implement Restaurant Owner features
8. Implement Admin Panel

## Testing Tools

### Recommended Tools:
- **Postman**: For API testing
- **Browser DevTools**: For frontend debugging
- **MySQL Workbench**: For database inspection
- **Eureka Dashboard**: For service monitoring

### Useful Commands:
```bash
# Check running services
netstat -ano | findstr :8080
netstat -ano | findstr :8081

# Check MySQL
mysql -u root -proot -e "SHOW DATABASES;"

# Check logs
# Look at terminal windows where services are running
```

---

**Last Updated**: February 17, 2026
**Status**: Ready for Integration Testing
