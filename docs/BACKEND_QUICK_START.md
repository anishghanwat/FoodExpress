# Backend Quick Start Guide

## ✅ Prerequisites

- Java 17 installed
- Maven installed
- MySQL running (localhost:3306)
- MySQL credentials: root/root (or update in application.yml)

## 🚀 Quick Start (3 Steps)

### Step 1: Create Database

```sql
CREATE DATABASE user_db;
```

### Step 2: Start Eureka Server

Open Terminal 1:
```bash
cd eureka-server
mvn spring-boot:run
```

Wait for: "Started EurekaServerApplication"
Verify at: http://localhost:8761

### Step 3: Start User Service

Open Terminal 2:
```bash
cd user-service
mvn spring-boot:run
```

Wait for: "Started UserServiceApplication"
Check Eureka dashboard - you should see "USER-SERVICE" registered

## 🧪 Test with Postman

### Register User

```http
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password123",
  "role": "CUSTOMER"
}
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER"
    }
  },
  "message": "User registered successfully",
  "timestamp": "2026-02-17T13:17:00"
}
```

### Login

```http
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "CUSTOMER"
    }
  },
  "message": "Login successful",
  "timestamp": "2026-02-17T13:17:00"
}
```

## 🌐 Test with Frontend

### Update Frontend Environment

Edit `frontend/.env.development`:
```env
VITE_API_GATEWAY_URL=http://localhost:8081
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Test Login

1. Go to http://localhost:5173/login
2. Enter credentials: john@example.com / Password123
3. Should redirect to dashboard based on role

## 📊 Service URLs

- Eureka Dashboard: http://localhost:8761
- User Service: http://localhost:8081
- User Service Health: http://localhost:8081/actuator/health
- Frontend: http://localhost:5173

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <pid> /F
```

### Database Connection Failed

1. Check MySQL is running
2. Verify database exists: `SHOW DATABASES;`
3. Check credentials in `user-service/src/main/resources/application.yml`

### Eureka Registration Failed

1. Ensure Eureka Server is running first
2. Check port 8761 is accessible
3. Wait 30 seconds for registration

### Frontend Can't Connect

1. Check CORS configuration in SecurityConfig.java
2. Verify User Service is running
3. Check frontend .env file
4. Open browser console for errors

## 🎉 Success Indicators

✅ Eureka Dashboard shows "USER-SERVICE" registered
✅ Postman register returns JWT token
✅ Postman login returns JWT token
✅ Frontend login redirects to dashboard
✅ No errors in terminal logs

## 📝 Available Roles

- CUSTOMER - Regular user
- RESTAURANT_OWNER - Restaurant owner
- DELIVERY_AGENT - Delivery person
- ADMIN - System administrator

## 🔐 JWT Token

The JWT token is returned in the response and should be stored in:
- Frontend: localStorage (handled by AuthContext)
- Postman: Copy token for future authenticated requests

Token expires in 24 hours (configurable in application.yml)

## 🚀 Next Steps

Once both services are running and tested:

1. Create API Gateway (routes all requests)
2. Build Restaurant Service (manage restaurants & menus)
3. Build Order Service (place & track orders)
4. Build Delivery Service (assign & track deliveries)
5. Build Payment Service (process payments)
6. Build Notification Service (send notifications)

## 📚 Documentation

- Full Architecture: `BACKEND_ARCHITECTURE.md`
- Implementation Plan: `BACKEND_IMPLEMENTATION_PLAN.md`
- Service Guide: `SERVICE_BY_SERVICE_GUIDE.md`
- Current Status: `CURRENT_STATUS.md`
