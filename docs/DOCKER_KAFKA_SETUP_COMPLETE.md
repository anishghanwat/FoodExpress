# ✅ Docker + MySQL + Kafka + Zookeeper Setup Complete

## What Was Done

### 1. Docker Compose Configuration

Created `docker-compose.yml` with 4 services:

#### MySQL 8.0
- **Container**: fooddelivery-mysql
- **Port**: 3306
- **Credentials**: root/root
- **Auto-creates 5 databases**:
  - user_db
  - restaurant_db
  - order_db
  - delivery_db
  - payment_db
- **Persistent volume**: mysql-data
- **Health check**: Enabled

#### Apache Kafka
- **Container**: fooddelivery-kafka
- **Ports**: 9092 (internal), 29092 (external)
- **Bootstrap Servers**: localhost:29092
- **Auto-create topics**: Enabled
- **Replication factor**: 1 (dev mode)
- **Health check**: Enabled

#### Zookeeper
- **Container**: fooddelivery-zookeeper
- **Port**: 2181
- **For**: Kafka coordination
- **Health check**: Enabled

#### Kafka UI
- **Container**: fooddelivery-kafka-ui
- **Port**: 8090
- **URL**: http://localhost:8090
- **For**: Kafka monitoring and management

### 2. MySQL Initialization

Created `docker/mysql/init/01-create-databases.sql`:
- Automatically creates all 5 databases
- Runs on first container startup
- Grants privileges to root user

### 3. Backend Service Updates

Updated all service `application.yml` files:

#### Environment Variable Support
```yaml
datasource:
  url: jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/database_name
  username: ${MYSQL_USER:root}
  password: ${MYSQL_PASSWORD:root}
```

#### Kafka Configuration Added
Services with Kafka:
- Order Service
- Delivery Service
- Payment Service
- Notification Service

```yaml
kafka:
  bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:29092}
  consumer:
    group-id: service-name-group
    auto-offset-reset: earliest
  producer:
    key-serializer: StringSerializer
    value-serializer: JsonSerializer
```

### 4. Maven Dependencies

Added Kafka dependency to 4 services:
```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

### 5. Docker Management Scripts

#### docker-start.bat
- Starts all Docker services
- Waits for health checks
- Displays service status
- Verifies database creation

#### docker-stop.bat
- Stops all Docker services
- Preserves data volumes

#### docker-logs.bat
- Interactive log viewer
- View logs for specific service or all

### 6. Environment Configuration

Created `.env` file:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
KAFKA_BOOTSTRAP_SERVERS=localhost:29092
```

### 7. Documentation

Created comprehensive guides:
- `DOCKER_SETUP.md` - Docker infrastructure guide
- `COMPLETE_SETUP_GUIDE.md` - Full system setup
- `README.md` - Project overview
- `.gitignore` - Git ignore rules

## How to Use

### Start Everything

```bash
# 1. Start Docker infrastructure
docker-start.bat

# 2. Build backend services
build-all.bat

# 3. Start backend services
start-services-step-by-step.bat

# 4. Start frontend
cd frontend
npm run dev
```

### Verify Docker Services

```bash
# Check status
docker-compose ps

# All should show "Up" and "healthy"

# Check MySQL databases
docker exec fooddelivery-mysql mysql -uroot -proot -e "SHOW DATABASES;"

# Check Kafka topics
docker exec fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Access Services

- **MySQL**: localhost:3306 (root/root)
- **Kafka**: localhost:29092
- **Kafka UI**: http://localhost:8090
- **Zookeeper**: localhost:2181

## Kafka Topics

Auto-created when first message is published:
- `order-events` - Order lifecycle events
- `payment-events` - Payment processing
- `delivery-events` - Delivery tracking
- `notification-events` - User notifications

## Service Configuration

All backend services now support:

### MySQL Connection
- Uses environment variables
- Falls back to localhost defaults
- Auto-creates databases if not exist

### Kafka Connection
- Uses environment variables
- Falls back to localhost:29092
- Auto-creates topics
- JSON serialization for messages

## Event-Driven Architecture

### Order Flow Example

```
1. User places order
   → Order Service publishes "order-created" event to Kafka

2. Payment Service consumes event
   → Processes payment
   → Publishes "payment-completed" event

3. Delivery Service consumes event
   → Assigns delivery agent
   → Publishes "delivery-assigned" event

4. Notification Service consumes all events
   → Sends notifications to user
```

## Monitoring

### Kafka UI (http://localhost:8090)

Features:
- View all topics and messages
- Monitor consumer groups
- Check broker health
- View partition details
- Create/delete topics

### Eureka Dashboard (http://localhost:8761)

Shows:
- All registered microservices
- Service health status
- Instance information

## Data Persistence

### MySQL Data
- Stored in Docker volume: `mysql-data`
- Persists across container restarts
- Deleted only with `docker-compose down -v`

### Kafka Data
- Stored in container
- Lost when container is removed
- For production, add persistent volumes

## Development Benefits

### With Docker

✅ No local MySQL installation needed
✅ No local Kafka installation needed
✅ Consistent environment across team
✅ Easy cleanup and reset
✅ Isolated from other projects
✅ Production-like setup

### With Kafka

✅ Asynchronous communication
✅ Event-driven architecture
✅ Loose coupling between services
✅ Scalable message processing
✅ Event sourcing capability
✅ Real-time data streaming

## Production Considerations

For production deployment:

### MySQL
- Use managed service (AWS RDS, Azure Database)
- Enable SSL/TLS
- Configure backups
- Set up replication
- Use connection pooling

### Kafka
- Use managed service (Confluent Cloud, AWS MSK)
- Increase replication factor (3+)
- Enable authentication (SASL)
- Enable encryption (SSL/TLS)
- Configure retention policies
- Set up monitoring

### General
- Use Kubernetes for orchestration
- Add service mesh (Istio)
- Implement circuit breakers
- Add distributed tracing
- Set up centralized logging
- Configure auto-scaling

## Troubleshooting

### MySQL Connection Issues

```bash
# Check if MySQL is running
docker ps | findstr mysql

# Check MySQL logs
docker logs fooddelivery-mysql

# Test connection
docker exec fooddelivery-mysql mysql -uroot -proot -e "SELECT 1;"

# Restart MySQL
docker-compose restart mysql
```

### Kafka Connection Issues

```bash
# Check if Kafka is running
docker ps | findstr kafka

# Check Kafka logs
docker logs fooddelivery-kafka

# Check Zookeeper
docker logs fooddelivery-zookeeper

# List topics
docker exec fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092

# Restart Kafka
docker-compose restart kafka
```

### Port Conflicts

```bash
# Find process using port
netstat -ano | findstr :3306
netstat -ano | findstr :9092

# Kill process
taskkill /PID <pid> /F

# Or change port in docker-compose.yml
```

## Useful Commands

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart mysql

# Remove everything including volumes
docker-compose down -v

# View resource usage
docker stats
```

### MySQL

```bash
# Access MySQL CLI
docker exec -it fooddelivery-mysql mysql -uroot -proot

# Run SQL command
docker exec fooddelivery-mysql mysql -uroot -proot -e "SHOW DATABASES;"

# Backup database
docker exec fooddelivery-mysql mysqldump -uroot -proot --all-databases > backup.sql

# Restore database
docker exec -i fooddelivery-mysql mysql -uroot -proot < backup.sql
```

### Kafka

```bash
# List topics
docker exec fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092

# Create topic
docker exec fooddelivery-kafka kafka-topics --create --topic test-topic --bootstrap-server localhost:9092

# Describe topic
docker exec fooddelivery-kafka kafka-topics --describe --topic test-topic --bootstrap-server localhost:9092

# Produce message
docker exec -it fooddelivery-kafka kafka-console-producer --topic test-topic --bootstrap-server localhost:9092

# Consume messages
docker exec fooddelivery-kafka kafka-console-consumer --topic test-topic --from-beginning --bootstrap-server localhost:9092

# List consumer groups
docker exec fooddelivery-kafka kafka-consumer-groups --list --bootstrap-server localhost:9092
```

## Summary

✅ Docker Compose with 4 services configured
✅ MySQL 8.0 with auto-created databases
✅ Apache Kafka for event streaming
✅ Zookeeper for Kafka coordination
✅ Kafka UI for monitoring
✅ All backend services updated for Docker
✅ Kafka integration in 4 services
✅ Environment variable configuration
✅ Health checks enabled
✅ Persistent data volumes
✅ Management scripts created
✅ Complete documentation

## Next Steps

1. ✅ Start Docker infrastructure
2. ✅ Build backend services
3. ✅ Start backend services
4. ✅ Test authentication
5. 🔄 Implement Kafka event producers
6. 🔄 Implement Kafka event consumers
7. 🔄 Test event-driven flows
8. 🔄 Add monitoring and alerting

---

**Status**: ✅ Docker + Kafka Setup Complete
**Date**: February 17, 2026
**Services**: MySQL, Kafka, Zookeeper, Kafka UI
**Backend Services Updated**: 8
**Kafka Integration**: 4 services
**Documentation**: Complete
