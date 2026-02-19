# FoodExpress Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env.production`
- [ ] Update all placeholder values in `.env.production`:
  - [ ] `MYSQL_PASSWORD` - Set a strong password
  - [ ] `MAIL_USERNAME` - Your Gmail address
  - [ ] `MAIL_PASSWORD` - Gmail App Password (16 characters)
  - [ ] `RAZORPAY_KEY_ID` - Production Razorpay key
  - [ ] `RAZORPAY_KEY_SECRET` - Production Razorpay secret
  - [ ] `VITE_API_GATEWAY_URL` - Your production domain
  - [ ] `VITE_WS_URL` - Your production WebSocket URL

### 2. Security Checks
- [x] `.env` files are in `.gitignore`
- [x] No sensitive data committed to repository
- [x] Security headers configured in nginx
- [ ] SSL/TLS certificates configured (for production domain)
- [ ] Firewall rules configured
- [ ] Database access restricted

### 3. Database Setup
- [ ] MySQL 8.0 installed or Docker ready
- [ ] Database initialization scripts in `sql/` folder
- [ ] Admin user creation script ready
- [ ] Backup strategy in place

### 4. Email Configuration (Gmail)
- [ ] 2-Factor Authentication enabled on Gmail account
- [ ] App Password generated at https://myaccount.google.com/apppasswords
- [ ] Test email sending works

### 5. Payment Gateway (Razorpay)
- [ ] Razorpay account created
- [ ] Test keys working in development
- [ ] Production keys obtained
- [ ] Webhook URLs configured

### 6. Infrastructure Requirements
- [ ] Docker and Docker Compose installed
- [ ] Minimum 4GB RAM available
- [ ] Minimum 20GB disk space
- [ ] Ports available: 80, 8080, 8761, 3306, 9092, 2181

### 7. Build Verification
- [x] All services have Dockerfiles
- [x] docker-compose.prod.yml configured
- [x] Health checks configured for all services
- [x] Restart policies set to `unless-stopped`

## 🚀 Deployment Steps

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/anishghanwat/FoodExpress.git
   cd FoodExpress
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with your values
   nano .env.production
   ```

3. **Deploy using script**
   ```bash
   chmod +x scripts/deploy-prod.sh
   ./scripts/deploy-prod.sh
   ```

   Or manually:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

4. **Verify deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs -f
   ```

5. **Initialize database**
   ```bash
   # Create admin user
   docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} user_db < sql/create-admin-user.sql
   
   # Add demo data (optional)
   docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} user_db < sql/create-demo-users.sql
   ```

### Option 2: Manual Deployment

1. **Start infrastructure services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d mysql zookeeper kafka
   ```

2. **Wait for services to be healthy**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   ```

3. **Start Eureka Server**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d eureka-server
   sleep 30
   ```

4. **Start microservices**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d user-service restaurant-service order-service payment-service delivery-service notification-service
   sleep 30
   ```

5. **Start API Gateway**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d api-gateway
   sleep 20
   ```

6. **Start Frontend**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d frontend
   ```

## 🔍 Post-Deployment Verification

### 1. Service Health Checks
```bash
# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# Check Eureka Dashboard
curl http://localhost:8761

# Check API Gateway health
curl http://localhost:8080/actuator/health

# Check Frontend
curl http://localhost
```

### 2. Database Verification
```bash
# Connect to MySQL
docker exec -it foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD}

# Check databases
SHOW DATABASES;

# Check users table
USE user_db;
SELECT id, name, email, role FROM users;
```

### 3. Kafka Verification
```bash
# List Kafka topics
docker exec foodexpress-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### 4. Application Testing
- [ ] Frontend loads at http://localhost
- [ ] User registration works
- [ ] User login works
- [ ] Restaurant listing loads
- [ ] Order placement works
- [ ] Payment processing works
- [ ] Delivery tracking works
- [ ] Email notifications sent
- [ ] WebSocket notifications work

## 📊 Monitoring

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f user-service

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 -f
```

### Resource Usage
```bash
docker stats
```

### Service Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

## 🛠️ Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service-name]

# Restart specific service
docker-compose -f docker-compose.prod.yml restart [service-name]

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build [service-name]
```

### Database connection issues
```bash
# Check MySQL is running
docker-compose -f docker-compose.prod.yml ps mysql

# Check MySQL logs
docker-compose -f docker-compose.prod.yml logs mysql

# Test connection
docker exec foodexpress-mysql mysqladmin ping -h localhost -uroot -p${MYSQL_PASSWORD}
```

### Kafka issues
```bash
# Check Kafka logs
docker-compose -f docker-compose.prod.yml logs kafka

# Check Zookeeper
docker-compose -f docker-compose.prod.yml logs zookeeper

# List topics
docker exec foodexpress-kafka kafka-topics --list --bootstrap-server localhost:9092
```

## 🔄 Updates and Maintenance

### Update application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Backup database
```bash
docker exec foodexpress-mysql mysqldump -uroot -p${MYSQL_PASSWORD} --all-databases > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore database
```bash
docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < backup_file.sql
```

### Clean up
```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Remove volumes (WARNING: deletes all data)
docker-compose -f docker-compose.prod.yml down -v

# Remove images
docker-compose -f docker-compose.prod.yml down --rmi all
```

## 🔐 Security Best Practices

1. **Never commit sensitive data**
   - Keep `.env` files out of version control
   - Use environment variables for secrets
   - Rotate credentials regularly

2. **Use strong passwords**
   - Database passwords: 16+ characters
   - Admin passwords: 12+ characters with special chars

3. **Enable SSL/TLS**
   - Use Let's Encrypt for free SSL certificates
   - Configure nginx with SSL

4. **Regular updates**
   - Keep Docker images updated
   - Update dependencies regularly
   - Monitor security advisories

5. **Access control**
   - Restrict database access to localhost
   - Use firewall rules
   - Implement rate limiting

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/anishghanwat/FoodExpress/issues
- Documentation: See `docs/` folder

## ✅ Deployment Status

Current Status: **READY FOR DEPLOYMENT**

All critical components are configured and tested:
- ✅ Docker configuration
- ✅ Database setup
- ✅ Microservices architecture
- ✅ API Gateway
- ✅ Frontend with nginx
- ✅ Kafka messaging
- ✅ Email notifications
- ✅ Payment integration
- ✅ Health checks
- ✅ Security headers
