# Restart User Service - CORS Fix Applied

## ✅ What Was Fixed

**Problem**: 
```
Access-Control-Allow-Origin header contains multiple values 
'http://localhost:5173, http://localhost:5173', but only one is allowed
```

**Root Cause**: Both API Gateway and User Service were adding CORS headers.

**Solution**: 
- Disabled CORS in User Service SecurityConfig
- API Gateway now handles all CORS centrally
- User Service rebuilt successfully

## 🔄 Restart User Service

### Option 1: If User Service is Currently Running

1. **Stop the User Service**:
   - Go to the terminal window running User Service
   - Press `Ctrl+C` to stop it

2. **Start User Service Again**:
   ```bash
   cd user-service
   mvn spring-boot:run
   ```

3. **Wait for startup** (about 10-15 seconds):
   - Look for: `Started UserServiceApplication in X seconds`
   - Look for: `DiscoveryClient_USER-SERVICE - registration status: 204`

### Option 2: If User Service is Not Running

Just start it:
```bash
cd user-service
mvn spring-boot:run
```

## ✅ Verify the Fix

### 1. Check Service is Running
Open: http://localhost:8761 (Eureka Dashboard)
- You should see `USER-SERVICE` registered

### 2. Test Registration from Frontend

1. **Open Frontend**: http://localhost:5173
2. **Click "Sign Up"**
3. **Fill the form**:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: Password123
   - Role: Customer
4. **Click "Create Account"**

### 3. Expected Result

✅ **Success**: 
- No CORS error in browser console
- Registration successful
- Redirected to home page or dashboard
- User stored in database

❌ **If Still Failing**:
- Check browser console for errors
- Check User Service logs for errors
- Verify API Gateway is running on port 8080
- Verify Eureka Server is running on port 8761

## 🔍 Troubleshooting

### Check if Services are Running

```bash
# Check Eureka Server
curl http://localhost:8761/actuator/health

# Check API Gateway
curl http://localhost:8080/actuator/health

# Check User Service
curl http://localhost:8081/actuator/health
```

All should return: `{"status":"UP"}`

### Test Registration via curl

```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"9876543210\",\"password\":\"Password123\",\"role\":\"CUSTOMER\"}"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      "role": "CUSTOMER"
    }
  },
  "message": "User registered successfully",
  "timestamp": "2026-02-17T15:30:00"
}
```

## 📝 What Changed in Code

### user-service/src/main/java/com/fooddelivery/user/config/SecurityConfig.java

**Before**:
```java
.cors(cors -> cors.configurationSource(corsConfigurationSource()))
```

**After**:
```java
// CORS is handled by API Gateway, so we disable it here
.cors(cors -> cors.disable())
```

This ensures only the API Gateway adds CORS headers, preventing duplicates.

## 🎯 Next Steps After Successful Registration

1. **Test Login**:
   - Use the same credentials to login
   - Verify JWT token is received and stored

2. **Start Remaining Services**:
   - Restaurant Service (port 8082)
   - Order Service (port 8083)
   - Delivery Service (port 8084)
   - Payment Service (port 8085)
   - Notification Service (port 8086)

3. **Test Full Integration**:
   - Browse restaurants
   - Add items to cart
   - Place orders
   - Track deliveries

## 📚 Related Files

- `user-service/src/main/java/com/fooddelivery/user/config/SecurityConfig.java` - CORS disabled
- `api-gateway/src/main/java/com/fooddelivery/gateway/config/GatewayConfig.java` - CORS configured
- `frontend/src/app/services/authService.js` - Frontend auth service
- `CURRENT_STATUS.md` - Overall system status

---

**Status**: User Service rebuilt with CORS fix ✅  
**Action Required**: Restart User Service and test registration  
**Expected Time**: 2 minutes
