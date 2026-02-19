# Quick Reference Card

## 🚀 Start Everything (3 Commands)

```bash
docker-start.bat                    # Start MySQL, Kafka, Zookeeper
start-services-step-by-step.bat     # Start all backend services
cd frontend && npm run dev          # Start frontend
```

## 🌐 Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | - |
| Eureka | http://localhost:8761 | - |
| API Gateway | http://localhost:8080 | - |
| Kafka UI | http://localhost:8090 | - |
| MySQL | localhost:3306 | root/root |
| Kafka | localhost:29092 | - |

## 🔧 Quick Commands

### Docker
```bash
docker-start.bat          # Start infrastructure
docker-stop.bat           # Stop infrastructure
docker-logs.bat           # View logs
docker-compose ps         # Check status
```

### Backend
```bash
build-all.bat             # Build all services
start-all.bat             # Start all services
cd <service> && mvn spring-boot:run  # Start single service
```

### Frontend
```bash
cd frontend
npm install               # Install dependencies
npm run dev               # Start dev server
npm run build             # Build for production
```

## 🧪 Test API

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"9876543210","password":"Password123","role":"CUSTOMER"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
```

## 🗄️ Database Access

```bash
# MySQL CLI
docker exec -it fooddelivery-mysql mysql -uroot -proot

# Show databases
docker exec fooddelivery-mysql mysql -uroot -proot -e "SHOW DATABASES;"

# Query users
docker exec fooddelivery-mysql mysql -uroot -proot -e "USE user_db; SELECT * FROM users;"
```

## 📊 Kafka Commands

```bash
# List topics
docker exec fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092

# Create topic
docker exec fooddelivery-kafka kafka-topics --create --topic my-topic --bootstrap-server localhost:9092

# Consume messages
docker exec fooddelivery-kafka kafka-console-consumer --topic order-events --from-beginning --bootstrap-server localhost:9092
```

## 🐛 Troubleshooting

### Check Service Health
```bash
curl http://localhost:8080/actuator/health
docker-compose ps
docker logs fooddelivery-mysql
```

### Restart Services
```bash
docker-compose restart
docker-compose restart mysql
docker-compose restart kafka
```

### Clean Restart
```bash
docker-compose down -v
docker-compose up -d
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Docker services config |
| `.env` | Environment variables |
| `application.yml` | Service configuration |
| `.env.development` | Frontend config |

## 🔑 Default Credentials

- **MySQL**: root / root
- **All Databases**: root / root
- **Kafka**: No auth (dev mode)

## 📊 Service Ports

| Service | Port |
|---------|------|
| Eureka | 8761 |
| API Gateway | 8080 |
| User Service | 8081 |
| Restaurant Service | 8082 |
| Order Service | 8083 |
| Delivery Service | 8084 |
| Payment Service | 8085 |
| Notification Service | 8086 |
| Kafka UI | 8090 |
| MySQL | 3306 |
| Kafka | 29092 |
| Zookeeper | 2181 |
| Frontend | 5173 |

## 🎯 User Roles

- `CUSTOMER` - Browse and order
- `RESTAURANT_OWNER` - Manage restaurant
- `DELIVERY_AGENT` - Deliver orders
- `ADMIN` - System admin

## 📚 Documentation

- `README.md` - Project overview
- `COMPLETE_SETUP_GUIDE.md` - Full setup
- `DOCKER_SETUP.md` - Docker guide
- `INTEGRATION_TEST_GUIDE.md` - Testing
- `DOCKER_KAFKA_SETUP_COMPLETE.md` - Docker+Kafka summary

---

**Keep this card handy for daily development!**
