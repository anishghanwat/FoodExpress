# Run All Backend Services - Complete Guide

## 🎯 Quick Start (3 Commands)

```bash
# 1. Create databases
mysql -u root -p < CREATE_DATABASES.sql

# 2. Build all services
build-all.bat

# 3. Start all services
start-all.bat
```

## 📋 Prerequisites

✅ Java 17 installed
✅ Maven installed
✅ MySQL running (localhost:3306)
✅ MySQL credentials: root/root

## 🗄️ Step 1: Create Databases

### Option A: Using SQL Script
```bash
mysql -u root -p < CREATE_DATABASES.sql
```

### Option B: Manual Creation
```sql
CREATE DATABASE user_db;
CREATE DATABASE restaurant_db;
CREATE DATABASE order_db;
CREATE DATABASE delivery_db;
CREATE DATABASE payment_db;
```

## 🔨 Step 2: Build All Services

Run the build script:
```bash
build-all.bat
```

This will build (in order):
1. Eureka Server
2. API Gateway
3. User Service
4. Restaurant Service
5. Order Service
6. Delivery Service
7. Payment Service
8. Notification Service

Build time: ~2-3 minutes

## 🚀 Step 3: Start All Services

Run the startup script:
```bash
start-all.bat
```

This will open 8 terminal windows, one for each service.

Wait 2-3 minutes for all services to start and register with Eureka.

## 🌐 Service URLs

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Eureka Server | 8761 | http://localhost:8761 | Service Registry |
| API Gateway | 8080 | http://localhost:8080 | API Gateway |
| User Service | 8081 | http://localhost:8081 | Authentication & Users |
| Restaurant Service | 8082 | http://localhost:8082 | Restaurants & Menu |
| Order Service | 8083 | http://localhost:8083 | Orders |
| Delivery Service | 8084 | http://localhost:8084 | Deliveries |
| Payment Service | 8085 | http://localhost:8085 | Payments |
| Notification Service | 8086 | http://localhost:8086 | Notifications |

## ✅ Verify Services

### 1. Check Eureka Dashboard
Open: http://localhost:8761

You should see all 7 services registered:
- API-GATEWAY
- USER-SERVICE
- RESTAURANT-SERVICE
- ORDER-SERVICE
- DELIVERY-SERVICE
- PAYMENT-SERVICE
- NOTIFICATION-SERVICE

### 2. Check Health Endpoints

```bash
# Eureka Server
curl http://localhost:8761/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:8081/actuator/health

# Restaurant Service
curl http://localhost:8082/actuator/health

# Order Service
curl http://localhost:8083/actuator/health

# Delivery Service
curl http://localhost:8084/actuator/health

# Payment Service
curl http://localhost:8085/actuator/health

# Notification Service
curl http://localhost:8086/actuator/health
```

## 🧪 Test API Endpoints

### Through API Gateway (Recommended)

All requests should go through the API Gateway (port 8080):

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "Password123",
    "role": "CUSTOMER"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Get Restaurants
```bash
curl http://localhost:8080/api/restaurants
```

#### Create Restaurant
```bash
curl -X POST http://localhost:8080/api/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "ownerId": 1,
    "name": "Pizza Palace",
    "description": "Best pizza in town",
    "address": "123 Main St",
    "phone": "1234567890",
    "email": "pizza@example.com",
    "cuisine": "Italian",
    "openingTime": "10:00",
    "closingTime": "22:00",
    "deliveryFee": 2.99
  }'
```

## 🔧 Configuration

### Update MySQL Password

If your MySQL password is different from `root123`, update these files:

- `user-service/src/main/resources/application.yml`
- `restaurant-service/src/main/resources/application.yml`
- `order-service/src/main/resources/application.yml`
- `delivery-service/src/main/resources/application.yml`
- `payment-service/src/main/resources/application.yml`

Change:
```yaml
spring:
  datasource:
    password: root123  # Change this
```

### Update Ports

If you need to change ports, update the `application.yml` file in each service:

```yaml
server:
  port: 8081  # Change this
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :8080

# Kill process
taskkill /PID <pid> /F
```

### Service Not Registering with Eureka

1. Check Eureka Server is running (http://localhost:8761)
2. Wait 30-60 seconds for registration
3. Check service logs for errors
4. Verify `eureka.client.service-url.defaultZone` in application.yml

### Database Connection Failed

1. Check MySQL is running
2. Verify databases exist: `SHOW DATABASES;`
3. Check credentials in application.yml
4. Ensure MySQL is listening on port 3306

### Build Failures

```bash
# Clean Maven cache
mvn clean

# Rebuild specific service
cd <service-name>
mvn clean install -DskipTests
```

## 🛑 Stop All Services

Close all terminal windows or press `Ctrl+C` in each terminal.

## 📊 Service Architecture

```
Frontend (Port 5173)
    ↓
API Gateway (Port 8080)
    ↓
┌─────────────────────────────────────┐
│  Eureka Server (Port 8761)          │
│  Service Registry & Discovery       │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Microservices                      │
│  - User Service (8081)              │
│  - Restaurant Service (8082)        │
│  - Order Service (8083)             │
│  - Delivery Service (8084)          │
│  - Payment Service (8085)           │
│  - Notification Service (8086)      │
└─────────────────────────────────────┘
    ↓
MySQL Databases
```

## 🎯 Next Steps

1. ✅ All services running
2. ✅ Registered with Eureka
3. ✅ API Gateway routing requests
4. 🔄 Update frontend to use API Gateway (port 8080)
5. 🔄 Test complete user flow
6. 🔄 Add authentication to protected endpoints
7. 🔄 Implement inter-service communication

## 📚 Documentation

- `BACKEND_ARCHITECTURE.md` - Complete architecture
- `BACKEND_IMPLEMENTATION_PLAN.md` - Implementation plan
- `SERVICE_BY_SERVICE_GUIDE.md` - Detailed service guide
- `BACKEND_QUICK_START.md` - Quick start guide
- `CURRENT_STATUS.md` - Current status

## 🎉 Success Indicators

✅ All 8 terminal windows open
✅ No errors in logs
✅ Eureka dashboard shows 7 services
✅ Health endpoints return {"status":"UP"}
✅ Can register/login through API Gateway
✅ Can create/get restaurants through API Gateway

## 💡 Tips

1. Always start Eureka Server first
2. Wait 30 seconds before starting other services
3. Use API Gateway (port 8080) for all frontend requests
4. Check Eureka dashboard to verify service registration
5. Use health endpoints to verify service status
6. Check service logs for errors

## 🚀 Production Deployment

For production:
1. Use environment variables for configuration
2. Enable security (JWT validation in API Gateway)
3. Use external configuration server
4. Add monitoring (Prometheus, Grafana)
5. Add logging aggregation (ELK Stack)
6. Use Docker containers
7. Deploy to Kubernetes

---

Last Updated: February 17, 2026
