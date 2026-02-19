# FoodExpress Docker Deployment

Complete Docker-based deployment for FoodExpress food delivery platform.

## 🚀 Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 20GB disk space

### 1. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

Required variables:
- `MYSQL_PASSWORD` - Database password
- `RAZORPAY_KEY_ID` - Payment gateway key
- `RAZORPAY_KEY_SECRET` - Payment gateway secret
- `MAIL_USERNAME` - Gmail for notifications
- `MAIL_PASSWORD` - Gmail app password

### 2. Deploy

**Linux/Mac:**
```bash
chmod +x scripts/*.sh
./scripts/deploy-prod.sh
```

**Windows:**
```cmd
scripts\deploy-prod.bat
```

### 3. Access Application

- **Frontend**: http://localhost
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

## 📦 What's Included

### Services
- **Frontend** (Nginx + React) - Port 80
- **API Gateway** - Port 8080
- **Eureka Server** - Port 8761
- **User Service** - Port 8081
- **Restaurant Service** - Port 8082
- **Order Service** - Port 8083
- **Delivery Service** - Port 8084
- **Payment Service** - Port 8085
- **Notification Service** - Port 8086

### Infrastructure
- **MySQL 8.0** - Port 3307
- **Kafka** - Port 9092
- **Zookeeper** - Port 2181

## 🛠️ Management Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f user-service

# Using helper script
./scripts/logs.sh user-service
```

### Health Check
```bash
# Run health check script
./scripts/health-check.sh

# Check specific service
curl http://localhost:8080/actuator/health
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart payment-service
```

### Stop Services
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v
```

### Scale Services
```bash
# Scale order service to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale order-service=3
```

## 🗄️ Database Management

### Initialize Database
```bash
# Create databases
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < sql/CREATE_DATABASES.sql

# Create admin user
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} user_db < sql/create-admin-user.sql
```

### Backup Database
```bash
# Backup all databases
docker exec foodexpress-mysql mysqldump -uroot -p${MYSQL_PASSWORD} --all-databases > backup.sql

# Backup specific database
docker exec foodexpress-mysql mysqldump -uroot -p${MYSQL_PASSWORD} user_db > user_db.sql
```

### Restore Database
```bash
# Restore from backup
docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < backup.sql
```

### Connect to MySQL
```bash
docker exec -it foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD}
```

## 📊 Monitoring

### Container Stats
```bash
# Real-time stats
docker stats

# Service status
docker-compose -f docker-compose.prod.yml ps
```

### Kafka Topics
```bash
# List topics
docker exec foodexpress-kafka kafka-topics --list --bootstrap-server localhost:9092

# Describe topic
docker exec foodexpress-kafka kafka-topics --describe --topic order-events --bootstrap-server localhost:9092
```

### Eureka Dashboard
Open http://localhost:8761 to see all registered services.

## 🔧 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Rebuild service
docker-compose -f docker-compose.prod.yml up -d --build [service-name]
```

### Database Connection Issues
```bash
# Test MySQL connection
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} -e "SELECT 1"

# Check network
docker network inspect foodexpress_foodexpress-network
```

### Port Already in Use
```bash
# Find process using port
# Linux/Mac
lsof -i :8080

# Windows
netstat -ano | findstr :8080

# Change port in docker-compose.prod.yml
ports:
  - "8081:8080"  # Use different external port
```

### Out of Memory
```bash
# Check memory usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
# Or add memory limits in docker-compose.prod.yml
```

## 🔐 Security

### Production Checklist
- [ ] Change default passwords
- [ ] Use strong MySQL password
- [ ] Configure SSL/TLS certificates
- [ ] Enable firewall rules
- [ ] Use secrets management
- [ ] Regular security updates
- [ ] Enable audit logging
- [ ] Configure rate limiting

### SSL/TLS Setup
For production, add SSL certificates:

```yaml
# In docker-compose.prod.yml
frontend:
  ports:
    - "443:443"
  volumes:
    - ./ssl:/etc/nginx/ssl:ro
```

## 📚 Documentation

- [Full Deployment Guide](docs/DEPLOYMENT.md)
- [Security Guidelines](docs/SECURITY.md)
- [Architecture Overview](docs/BACKEND_ARCHITECTURE.md)
- [API Documentation](docs/QUICK_REFERENCE.md)

## 🆘 Support

### Common Issues

**Issue**: Services not starting
**Solution**: Check logs and ensure all environment variables are set

**Issue**: Database connection failed
**Solution**: Wait 30 seconds for MySQL to initialize, check password

**Issue**: Kafka errors
**Solution**: Restart Kafka and Zookeeper services

### Get Help
- Check logs: `./scripts/logs.sh [service]`
- Run health check: `./scripts/health-check.sh`
- Review documentation in `/docs`

## 📝 Notes

- First startup takes 2-3 minutes for all services to initialize
- MySQL initialization scripts run only on first start
- Kafka topics are auto-created on first message
- Frontend is served by Nginx with API proxy configured
- All services use health checks for reliability

## 🔄 Updates

To update the application:

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🧹 Cleanup

```bash
# Remove all containers and networks
docker-compose -f docker-compose.prod.yml down

# Remove volumes (deletes data)
docker-compose -f docker-compose.prod.yml down -v

# Clean up unused images
docker image prune -a
```

## 📄 License

See [LICENSE](LICENSE) file for details.
