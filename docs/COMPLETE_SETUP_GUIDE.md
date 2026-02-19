# Complete Setup Guide - Food Delivery System

## Overview

This guide covers the complete setup of the Food Delivery System with Docker infrastructure (MySQL, Kafka, Zookeeper), backend microservices, and frontend.

## Architecture

```
Frontend (React + Vite)
    ↓
API Gateway (Spring Cloud Gateway)
    ↓
Eureka Server (Service Discovery)
    ↓
Microservices (8 services)
    ↓
Docker Infrastructure
├── MySQL (Databases)
├── Kafka (Message Broker)
└── Zookeeper (Coordination)
```

## Prerequisites

### Required Software
- ✅ Java 17
- ✅ Maven 3.6+
- ✅ Node.js 18+ and npm
- ✅ Docker Desktop
- ✅ Git

### Verify Installation
```bash
java -version        # Should show Java 17
mvn -version         # Should show Maven 3.6+
node -version        # Should show Node 18+
docker -version      # Should show Docker
docker-compose -version
```

## Step-by-Step Setup

### Step 1: Start Docker Infrastructure (2 minutes)

```bash
# Start MySQL, Kafka, Zookeeper
docker-start.bat
```

**Wait for**: All services to show "healthy" status

**Verify**:
```bash
# Check services
docker-compose ps

# Check MySQL databases
docker exec fooddelivery-mysql mysql -uroot -proot -e "SHOW DATABASES;"

# Should show:
# - user_db
# - restaurant_db
# - order_db
# - delivery_db
# - payment_db
```

**Access Points**:
- MySQL: localhost:3306 (root/root)
- Kafka: localhost:29092
- Kafka UI: http://localhost:8090
- Zookeeper: localhost:2181

### Step 2: Build Backend Services (3 minutes)

```bash
# Build all 8 microservices
build-all.bat
```

This builds:
1. Eureka Server (Service Registry)
2. API Gateway
3. User Service
4. Restaurant Service
5. Order Service
6. Delivery Service
7. Payment Service
8. Notification Service

**Expected Output**: `BUILD SUCCESS` for all services

### Step 3: Start Backend Services (3 minutes)

```bash
# Start all services with proper delays
start-services-step-by-step.bat
```

This will:
1. Start Eureka Server (wait 30s)
2. Start API Gateway (wait 15s)
3. Start all 6 microservices (wait 15s each)

**Total startup time**: ~3 minutes

**Verify**:
- Open http://localhost:8761 (Eureka Dashboard)
- Should show 7 services registered:
  - API-GATEWAY
  - USER-SERVICE
  - RESTAURANT-SERVICE
  - ORDER-SERVICE
  - DELIVERY-SERVICE
  - PAYMENT-SERVICE
  - NOTIFICATION-SERVICE

### Step 4: Install Frontend Dependencies (1 minute)

```bash
cd frontend
npm install
```

### Step 5: Start Frontend (30 seconds)

```bash
# In frontend directory
npm run dev
```

**Access**: http://localhost:5173

## Quick Test

### Test 1: Backend Health Check

```bash
# API Gateway
curl http://localhost:8080/actuator/health

# Expected: {"status":"UP"}
```

### Test 2: Register User

**Via Frontend**:
1. Go to http://localhost:5173/register
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: Password123
   - Role: Customer
3. Click Register
4. Should redirect to home/dashboard

**Via API**:
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"9876543210\",\"password\":\"Password123\",\"role\":\"CUSTOMER\"}"
```

### Test 3: Login User

**Via Frontend**:
1. Go to http://localhost:5173/login
2. Enter: test@example.com / Password123
3. Click Login
4. Should redirect to home/dashboard

**Via API**:
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Password123\"}"
```

### Test 4: Verify Database

```bash
# Check user in database
docker exec fooddelivery-mysql mysql -uroot -proot -e "USE user_db; SELECT id, name, email, role FROM users;"
```

## Service URLs

### Infrastructure
| Service | URL | Credentials |
|---------|-----|-------------|
| MySQL | localhost:3306 | root/root |
| Kafka | localhost:29092 | - |
| Kafka UI | http://localhost:8090 | - |
| Zookeeper | localhost:2181 | - |

### Backend Services
| Service | Port | URL |
|---------|------|-----|
| Eureka Server | 8761 | http://localhost:8761 |
| API Gateway | 8080 | http://localhost:8080 |
| User Service | 8081 | http://localhost:8081 |
| Restaurant Service | 8082 | http://localhost:8082 |
| Order Service | 8083 | http://localhost:8083 |
| Delivery Service | 8084 | http://localhost:8084 |
| Payment Service | 8085 | http://localhost:8085 |
| Notification Service | 8086 | http://localhost:8086 |

### Frontend
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |

## Environment Configuration

### Backend Services

Services use environment variables with defaults:

```yaml
MYSQL_HOST: localhost (default)
MYSQL_PORT: 3306 (default)
MYSQL_USER: root (default)
MYSQL_PASSWORD: root (default)
KAFKA_BOOTSTRAP_SERVERS: localhost:29092 (default)
```

To override, create `.env` file or set environment variables.

### Frontend

Edit `frontend/.env.development`:
```env
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
VITE_APP_NAME=Food Delivery System (Dev)
```

## Kafka Topics

Auto-created topics:
- `order-events` - Order lifecycle events
- `payment-events` - Payment processing events
- `delivery-events` - Delivery tracking events
- `notification-events` - Notification messages

**View topics**:
```bash
docker exec fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092
```

## Stopping Services

### Stop Frontend
Press `Ctrl+C` in frontend terminal

### Stop Backend Services
Close all service terminal windows or press `Ctrl+C` in each

### Stop Docker Infrastructure
```bash
docker-stop.bat
```

## Complete Restart

```bash
# 1. Stop everything
docker-stop.bat
# Close all backend service windows

# 2. Start Docker
docker-start.bat

# 3. Start Backend
start-services-step-by-step.bat

# 4. Start Frontend
cd frontend
npm run dev
```

## Troubleshooting

### Issue 1: Docker Services Won't Start

**Symptoms**: Containers exit immediately

**Solution**:
```bash
# Check logs
docker logs fooddelivery-mysql
docker logs fooddelivery-kafka

# Restart
docker-compose restart

# If still failing, remove and recreate
docker-compose down -v
docker-compose up -d
```

### Issue 2: Backend Service Won't Start

**Symptoms**: Service fails to connect to MySQL or Kafka

**Solution**:
```bash
# Verify Docker services are running
docker-compose ps

# Check if MySQL is accessible
docker exec fooddelivery-mysql mysql -uroot -proot -e "SELECT 1;"

# Check if Kafka is accessible
docker exec fooddelivery-kafka kafka-broker-api-versions --bootstrap-server localhost:9092

# Restart the failing service
```

### Issue 3: Service Not Registering with Eureka

**Symptoms**: Service doesn't appear in Eureka dashboard

**Solution**:
- Wait 30-60 seconds for registration
- Check service logs for errors
- Verify Eureka Server is running
- Restart the service

### Issue 4: Frontend Can't Connect to Backend

**Symptoms**: API calls fail with network error

**Solution**:
- Verify API Gateway is running (http://localhost:8080/actuator/health)
- Check Eureka dashboard shows all services
- Verify frontend .env.development has correct API_GATEWAY_URL
- Check browser console for CORS errors

### Issue 5: CORS Errors

**Symptoms**: Browser shows CORS policy error

**Solution**:
- Verify backend SecurityConfig allows http://localhost:5173
- Restart backend services
- Clear browser cache

## Development Workflow

### Daily Development

```bash
# 1. Start Docker (if not running)
docker-start.bat

# 2. Start backend services you're working on
cd user-service
mvn spring-boot:run

# 3. Start frontend
cd frontend
npm run dev
```

### Making Changes

**Backend**:
1. Make code changes
2. Stop service (Ctrl+C)
3. Rebuild: `mvn clean install`
4. Restart: `mvn spring-boot:run`

**Frontend**:
- Changes auto-reload with Vite HMR
- No restart needed

### Testing

**Backend API**:
```bash
# Use curl or Postman
curl http://localhost:8080/api/restaurants
```

**Frontend**:
- Open http://localhost:5173
- Use browser DevTools
- Check console for API calls

## Production Deployment

For production:

1. **Use managed services**:
   - AWS RDS for MySQL
   - AWS MSK or Confluent Cloud for Kafka
   - AWS ECS/EKS for microservices

2. **Update configuration**:
   - Use environment variables
   - Enable SSL/TLS
   - Add authentication
   - Configure secrets management

3. **Add monitoring**:
   - Prometheus + Grafana
   - ELK Stack for logs
   - Distributed tracing (Zipkin/Jaeger)

4. **Configure CI/CD**:
   - GitHub Actions
   - Jenkins
   - GitLab CI

## Useful Scripts

```bash
# Docker
docker-start.bat          # Start infrastructure
docker-stop.bat           # Stop infrastructure
docker-logs.bat           # View logs

# Backend
build-all.bat             # Build all services
start-all.bat             # Start all services (quick)
start-services-step-by-step.bat  # Start with delays

# Frontend
cd frontend
npm run dev               # Start dev server
npm run build             # Build for production
npm run preview           # Preview production build
```

## Documentation

- `DOCKER_SETUP.md` - Docker infrastructure guide
- `BACKEND_INTEGRATION_READY.md` - Frontend-backend integration
- `INTEGRATION_TEST_GUIDE.md` - Testing guide
- `READY_TO_TEST.md` - Quick test guide
- `RUN_ALL_SERVICES.md` - Backend services guide

## Summary

✅ Docker infrastructure with MySQL, Kafka, Zookeeper
✅ 8 backend microservices with Eureka and API Gateway
✅ React frontend with complete API integration
✅ Event-driven architecture with Kafka
✅ Auto-created databases and topics
✅ Health checks and monitoring
✅ Complete documentation

## Next Steps

1. ✅ Start Docker infrastructure
2. ✅ Build and start backend services
3. ✅ Start frontend
4. ✅ Test authentication
5. 🔄 Implement restaurant browsing
6. 🔄 Implement order placement
7. 🔄 Implement delivery tracking
8. 🔄 Implement payment processing

---

**Last Updated**: February 17, 2026
**Status**: Ready for Development
**Total Setup Time**: ~10 minutes
