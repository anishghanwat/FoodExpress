# Docker Setup Guide - MySQL, Kafka, Zookeeper

## Overview

This project uses Docker to run infrastructure services:
- **MySQL 8.0** - Database for all microservices
- **Apache Kafka** - Message broker for event-driven communication
- **Zookeeper** - Coordination service for Kafka
- **Kafka UI** - Web interface for monitoring Kafka

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)
- At least 4GB RAM available for Docker

## Quick Start

### 1. Start Docker Infrastructure

```bash
docker-start.bat
```

This will:
- Start MySQL, Kafka, Zookeeper, and Kafka UI containers
- Create all required databases automatically
- Wait for services to be healthy
- Display service status and URLs

### 2. Verify Services

```bash
docker-compose ps
```

All services should show status as "Up" and "healthy".

### 3. Stop Docker Infrastructure

```bash
docker-stop.bat
```

## Service Details

### MySQL Database

**Container Name**: `fooddelivery-mysql`
**Port**: 3306
**Credentials**: root/root

**Databases Created Automatically**:
- user_db
- restaurant_db
- order_db
- delivery_db
- payment_db

**Connect via CLI**:
```bash
docker exec -it fooddelivery-mysql mysql -uroot -proot
```

**View Databases**:
```bash
docker exec fooddelivery-mysql mysql -uroot -proot -e "SHOW DATABASES;"
```

### Apache Kafka

**Container Name**: `fooddelivery-kafka`
**Ports**: 
- 9092 (internal)
- 29092 (external/localhost)

**Bootstrap Servers**: `localhost:29092`

**Topics** (auto-created):
- order-events
- payment-events
- delivery-events
- notification-events

### Zookeeper

**Container Name**: `fooddelivery-zookeeper`
**Port**: 2181

### Kafka UI

**Container Name**: `fooddelivery-kafka-ui`
**Port**: 8090
**URL**: http://localhost:8090

Features:
- View topics and messages
- Monitor consumer groups
- View broker information
- Create/delete topics

## Docker Commands

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d mysql
docker-compose up -d kafka
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes all data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker logs -f fooddelivery-mysql
docker logs -f fooddelivery-kafka
docker logs -f fooddelivery-zookeeper

# Or use the script
docker-logs.bat
```

### Check Status
```bash
# View running containers
docker-compose ps

# View resource usage
docker stats
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart mysql
docker-compose restart kafka
```

## Configuration

### Environment Variables

Create `.env` file in project root:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
KAFKA_BOOTSTRAP_SERVERS=localhost:29092
```

### MySQL Configuration

Database initialization script: `docker/mysql/init/01-create-databases.sql`

This script runs automatically when MySQL container starts for the first time.

### Kafka Configuration

Kafka is configured with:
- Single broker (suitable for development)
- Auto-create topics enabled
- Replication factor: 1
- Advertised listeners for both internal and external access

## Microservice Configuration

All microservices are configured to use Docker services with environment variable overrides:

### MySQL Connection
```yaml
spring:
  datasource:
    url: jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/database_name
    username: ${MYSQL_USER:root}
    password: ${MYSQL_PASSWORD:root}
```

### Kafka Connection
```yaml
spring:
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:29092}
```

## Running the Full Stack

### Step 1: Start Docker Infrastructure
```bash
docker-start.bat
```

Wait for all services to be healthy (~30 seconds).

### Step 2: Build Backend Services
```bash
build-all.bat
```

### Step 3: Start Backend Services
```bash
start-all.bat
```

### Step 4: Start Frontend
```bash
cd frontend
npm run dev
```

## Troubleshooting

### MySQL Connection Refused

**Problem**: Services can't connect to MySQL

**Solution**:
```bash
# Check if MySQL is running
docker ps | findstr mysql

# Check MySQL logs
docker logs fooddelivery-mysql

# Restart MySQL
docker-compose restart mysql
```

### Kafka Connection Issues

**Problem**: Services can't connect to Kafka

**Solution**:
```bash
# Check if Kafka is running
docker ps | findstr kafka

# Check Kafka logs
docker logs fooddelivery-kafka

# Verify Zookeeper is running
docker logs fooddelivery-zookeeper

# Restart Kafka
docker-compose restart kafka
```

### Port Already in Use

**Problem**: Port 3306, 9092, or 2181 already in use

**Solution**:
```bash
# Find process using port
netstat -ano | findstr :3306

# Kill process
taskkill /PID <pid> /F

# Or change port in docker-compose.yml
```

### Container Won't Start

**Problem**: Container exits immediately

**Solution**:
```bash
# View container logs
docker logs fooddelivery-mysql

# Remove container and volumes
docker-compose down -v

# Restart
docker-compose up -d
```

### Out of Disk Space

**Problem**: Docker runs out of space

**Solution**:
```bash
# Clean up unused containers, images, volumes
docker system prune -a --volumes

# View disk usage
docker system df
```

## Data Persistence

### MySQL Data

MySQL data is persisted in a Docker volume: `mysql-data`

**View volumes**:
```bash
docker volume ls
```

**Remove volume** (deletes all data):
```bash
docker-compose down -v
```

**Backup database**:
```bash
docker exec fooddelivery-mysql mysqldump -uroot -proot --all-databases > backup.sql
```

**Restore database**:
```bash
docker exec -i fooddelivery-mysql mysql -uroot -proot < backup.sql
```

### Kafka Data

Kafka data is stored in the container and will be lost when container is removed.

For production, add volumes for Kafka data persistence.

## Monitoring

### Kafka UI

Access: http://localhost:8090

Features:
- View all topics
- Monitor message flow
- Check consumer lag
- View broker metrics

### MySQL

Use any MySQL client:
- MySQL Workbench
- DBeaver
- phpMyAdmin (can add to docker-compose.yml)

Connection:
- Host: localhost
- Port: 3306
- User: root
- Password: root

## Production Considerations

For production deployment:

1. **Use external MySQL** (AWS RDS, Azure Database, etc.)
2. **Use managed Kafka** (Confluent Cloud, AWS MSK, etc.)
3. **Add authentication** to Kafka
4. **Enable SSL/TLS** for all connections
5. **Use secrets management** (not .env files)
6. **Add monitoring** (Prometheus, Grafana)
7. **Configure backups** for MySQL
8. **Increase replication factor** for Kafka
9. **Use persistent volumes** for Kafka data
10. **Set resource limits** for containers

## Docker Compose File Structure

```yaml
services:
  mysql:          # MySQL 8.0 database
  zookeeper:      # Kafka coordination
  kafka:          # Message broker
  kafka-ui:       # Kafka monitoring UI

networks:
  fooddelivery-network:  # Bridge network for all services

volumes:
  mysql-data:     # Persistent MySQL data
```

## Useful Commands

```bash
# Start infrastructure
docker-start.bat

# Stop infrastructure
docker-stop.bat

# View logs
docker-logs.bat

# Check status
docker-compose ps

# View resource usage
docker stats

# Access MySQL CLI
docker exec -it fooddelivery-mysql mysql -uroot -proot

# Access Kafka container
docker exec -it fooddelivery-kafka bash

# List Kafka topics
docker exec fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092

# Create Kafka topic
docker exec fooddelivery-kafka kafka-topics --create --topic test-topic --bootstrap-server localhost:9092

# View Kafka topic messages
docker exec fooddelivery-kafka kafka-console-consumer --topic test-topic --from-beginning --bootstrap-server localhost:9092
```

## Summary

✅ MySQL 8.0 with auto-created databases
✅ Apache Kafka for event-driven architecture
✅ Zookeeper for Kafka coordination
✅ Kafka UI for monitoring
✅ Health checks for all services
✅ Persistent data volumes
✅ Easy start/stop scripts
✅ Environment variable configuration

---

**Last Updated**: February 17, 2026
**Docker Compose Version**: 3.8
**Services**: 4 (MySQL, Kafka, Zookeeper, Kafka UI)
