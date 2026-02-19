# FoodExpress Deployment Guide

Complete guide for deploying FoodExpress to production using Docker.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment Steps](#deployment-steps)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Scaling](#scaling)
- [Backup & Recovery](#backup--recovery)

## Prerequisites

### Required Software
- Docker 20.10+ and Docker Compose 2.0+
- 4GB+ RAM available
- 20GB+ disk space

### Required Credentials
- MySQL root password
- Razorpay API keys (Key ID and Secret)
- Gmail account with App Password for notifications
- (Optional) Domain name and SSL certificate

## Quick Start

### 1. Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd FoodExpress

# Create environment file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

### 2. Configure Environment Variables

Edit `.env` file with your production credentials:

```bash
# Database
MYSQL_USER=root
MYSQL_PASSWORD=your_secure_password_here
MYSQL_PORT=3307

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:9092

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password_here
MAIL_FROM_NAME=FoodExpress

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Deploy

**Linux/Mac:**
```bash
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh
```

**Windows:**
```cmd
scripts\deploy-prod.bat
```

### 4. Initialize Database

```bash
# Wait for MySQL to be ready (about 30 seconds)
docker exec foodexpress-mysql mysql -uroot -p[password] user_db < sql/CREATE_DATABASES.sql
docker exec foodexpress-mysql mysql -uroot -p[password] user_db < sql/create-admin-user.sql
docker exec foodexpress-mysql mysql -uroot -p[password] user_db < sql/create-demo-users.sql
```

### 5. Verify Deployment

Access the services:
- **Frontend**: http://localhost or http://your-domain.com
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

## Configuration

### Environment Variables

#### Database Configuration
```bash
MYSQL_USER=root                    # MySQL username
MYSQL_PASSWORD=secure_password     # MySQL password
MYSQL_PORT=3307                    # External MySQL port
```

#### Email Configuration
```bash
MAIL_HOST=smtp.gmail.com           # SMTP server
MAIL_PORT=587                      # SMTP port
MAIL_USERNAME=email@gmail.com      # Email address
MAIL_PASSWORD=app_password         # Gmail App Password
MAIL_FROM_NAME=FoodExpress         # Sender name
```

#### Payment Gateway
```bash
RAZORPAY_KEY_ID=rzp_live_xxx       # Razorpay Key ID
RAZORPAY_KEY_SECRET=secret_xxx     # Razorpay Secret
```

### Frontend Configuration

Update `frontend/.env` for production:

```bash
VITE_API_GATEWAY_URL=http://your-domain.com/api
VITE_WS_URL=ws://your-domain.com/ws
VITE_RAZORPAY_KEY_ID=rzp_live_xxx
```

## Deployment Steps

### Step 1: Build Images

```bash
docker-compose -f docker-compose.prod.yml build
```

This builds all microservices and frontend images.

### Step 2: Start Services

```bash
docker-compose -f docker-compose.prod.yml up -d
```

Services start in this order:
1. MySQL & Zookeeper
2. Kafka
3. Eureka Server
4. All Microservices
5. API Gateway
6. Frontend

### Step 3: Verify Health

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# Check specific service logs
docker-compose -f docker-compose.prod.yml logs -f user-service

# Check health endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8761/actuator/health
```

### Step 4: Initialize Data

```bash
# Create databases
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < sql/CREATE_DATABASES.sql

# Create admin user
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} user_db < sql/create-admin-user.sql

# Create demo users (optional)
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} user_db < sql/create-demo-users.sql

# Add sample restaurants (optional)
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} restaurant_db < sql/update-restaurant-data.sql
```

## Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f user-service

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 payment-service
```

### Service Health

```bash
# Check running containers
docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats

# Check Eureka dashboard
open http://localhost:8761
```

### Database Monitoring

```bash
# Connect to MySQL
docker exec -it foodexpress-mysql mysql -uroot -p

# Check database size
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} -e "
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;"
```

### Kafka Monitoring

```bash
# List topics
docker exec foodexpress-kafka kafka-topics --list --bootstrap-server localhost:9092

# Check consumer groups
docker exec foodexpress-kafka kafka-consumer-groups --list --bootstrap-server localhost:9092

# Describe topic
docker exec foodexpress-kafka kafka-topics --describe --topic order-events --bootstrap-server localhost:9092
```

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Restart specific service
docker-compose -f docker-compose.prod.yml restart [service-name]

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build [service-name]
```

### Database Connection Issues

```bash
# Check MySQL is running
docker-compose -f docker-compose.prod.yml ps mysql

# Test connection
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} -e "SELECT 1"

# Check network
docker network inspect foodexpress_foodexpress-network
```

### Kafka Issues

```bash
# Restart Kafka and Zookeeper
docker-compose -f docker-compose.prod.yml restart zookeeper kafka

# Check Kafka logs
docker-compose -f docker-compose.prod.yml logs kafka

# Verify topics
docker exec foodexpress-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Memory Issues

```bash
# Check memory usage
docker stats

# Increase memory limits in docker-compose.prod.yml
# Add under service:
  deploy:
    resources:
      limits:
        memory: 1G
      reservations:
        memory: 512M
```

## Scaling

### Horizontal Scaling

Scale specific services:

```bash
# Scale order service to 3 instances
docker-compose -f docker-compose.prod.yml up -d --scale order-service=3

# Scale multiple services
docker-compose -f docker-compose.prod.yml up -d \
  --scale order-service=3 \
  --scale payment-service=2 \
  --scale delivery-service=2
```

### Load Balancing

For production, use a reverse proxy like Nginx or Traefik:

```yaml
# Add to docker-compose.prod.yml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - ./ssl:/etc/nginx/ssl:ro
```

## Backup & Recovery

### Database Backup

```bash
# Backup all databases
docker exec foodexpress-mysql mysqldump -uroot -p${MYSQL_PASSWORD} --all-databases > backup_$(date +%Y%m%d).sql

# Backup specific database
docker exec foodexpress-mysql mysqldump -uroot -p${MYSQL_PASSWORD} user_db > user_db_backup.sql

# Automated daily backup
0 2 * * * docker exec foodexpress-mysql mysqldump -uroot -p${MYSQL_PASSWORD} --all-databases > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Database Restore

```bash
# Restore from backup
docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < backup_20260219.sql

# Restore specific database
docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} user_db < user_db_backup.sql
```

### Volume Backup

```bash
# Backup MySQL data volume
docker run --rm \
  -v foodexpress_mysql-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql-data-backup.tar.gz /data

# Restore volume
docker run --rm \
  -v foodexpress_mysql-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/mysql-data-backup.tar.gz -C /
```

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups automated
- [ ] Monitoring and alerting set up
- [ ] Log aggregation configured
- [ ] Security headers configured in nginx
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Admin user created
- [ ] Demo data removed (if applicable)
- [ ] Payment gateway in live mode
- [ ] Email service tested
- [ ] Load testing completed
- [ ] Disaster recovery plan documented

## Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Or use zero-downtime deployment
docker-compose -f docker-compose.prod.yml up -d --no-deps --build [service-name]
```

### Clean Up

```bash
# Remove stopped containers
docker-compose -f docker-compose.prod.yml down

# Remove volumes (WARNING: deletes data)
docker-compose -f docker-compose.prod.yml down -v

# Clean up unused images
docker image prune -a

# Clean up everything
docker system prune -a --volumes
```

## Support

For issues and questions:
- Check logs: `docker-compose -f docker-compose.prod.yml logs`
- Review documentation in `/docs`
- Open an issue on GitHub

## Security Notes

1. **Never commit .env file** - It contains sensitive credentials
2. **Use strong passwords** - Especially for database and admin accounts
3. **Enable SSL/TLS** - Use HTTPS in production
4. **Regular updates** - Keep Docker images and dependencies updated
5. **Network isolation** - Use Docker networks to isolate services
6. **Least privilege** - Services run as non-root users
7. **Secrets management** - Consider using Docker secrets or vault for production
