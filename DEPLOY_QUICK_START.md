# 🚀 Quick Deployment Guide

Get FoodExpress running in production with Docker in 5 minutes!

## Step 1: Prerequisites ✅

Install:
- Docker Desktop (includes Docker Compose)
- Git

Verify installation:
```bash
docker --version
docker-compose --version
```

## Step 2: Get the Code 📥

```bash
git clone https://github.com/Unmesh0070/FoodExpress.git
cd FoodExpress
```

## Step 3: Configure Environment 🔧

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
# Windows: notepad .env
# Linux/Mac: nano .env
```

**Required credentials:**
```bash
MYSQL_PASSWORD=your_secure_password
RAZORPAY_KEY_ID=rzp_test_SHk0nqdeDnb7Oc
RAZORPAY_KEY_SECRET=Ymt7tZ8XzLDZyNzA03RGH3B3
MAIL_USERNAME=Fooddelapp@gmail.com
MAIL_PASSWORD=ebxr vrbo rzkg hznp
```

## Step 4: Deploy 🚀

**Windows:**
```cmd
scripts\deploy-prod.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh
```

## Step 5: Initialize Database 💾

Wait 30 seconds for services to start, then:

```bash
# Windows (PowerShell)
$env:MYSQL_PASSWORD="your_password"
docker exec foodexpress-mysql mysql -uroot -p$env:MYSQL_PASSWORD user_db -e "source /docker-entrypoint-initdb.d/CREATE_DATABASES.sql"
docker exec foodexpress-mysql mysql -uroot -p$env:MYSQL_PASSWORD user_db -e "source /docker-entrypoint-initdb.d/create-admin-user.sql"

# Linux/Mac
export MYSQL_PASSWORD="your_password"
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < sql/CREATE_DATABASES.sql
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} user_db < sql/create-admin-user.sql
```

## Step 6: Access Application 🎉

Open your browser:
- **Frontend**: http://localhost
- **Admin Login**: admin@foodexpress.com / Admin@123
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

## 🎯 What's Running?

```
✓ Frontend (React + Nginx)      → http://localhost
✓ API Gateway                   → http://localhost:8080
✓ Eureka Server                 → http://localhost:8761
✓ User Service                  → Port 8081
✓ Restaurant Service            → Port 8082
✓ Order Service                 → Port 8083
✓ Delivery Service              → Port 8084
✓ Payment Service               → Port 8085
✓ Notification Service          → Port 8086
✓ MySQL Database                → Port 3307
✓ Kafka Message Broker          → Port 9092
```

## 🔍 Verify Deployment

```bash
# Check all services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Health check
curl http://localhost:8080/actuator/health
```

## 🛠️ Common Commands

```bash
# View logs for specific service
docker-compose -f docker-compose.prod.yml logs -f user-service

# Restart a service
docker-compose -f docker-compose.prod.yml restart payment-service

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🆘 Troubleshooting

### Services not starting?
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart everything
docker-compose -f docker-compose.prod.yml restart
```

### Port already in use?
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080

# Kill the process or change port in docker-compose.prod.yml
```

### Database connection failed?
```bash
# Wait 30 seconds for MySQL to initialize
# Check MySQL is running
docker-compose -f docker-compose.prod.yml ps mysql

# Test connection
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} -e "SELECT 1"
```

## 📚 Full Documentation

- [Complete Deployment Guide](docs/DEPLOYMENT.md)
- [Docker README](DOCKER_README.md)
- [Security Guidelines](docs/SECURITY.md)
- [Architecture Overview](docs/BACKEND_ARCHITECTURE.md)

## 🎓 Demo Users

After initialization, you can login with:

- **Admin**: admin@foodexpress.com / Admin@123
- **Customer**: customer@test.com / password123
- **Owner**: owner@test.com / password123
- **Agent**: agent@test.com / password123

## 🔐 Production Checklist

Before going live:
- [ ] Change all default passwords
- [ ] Use production Razorpay keys (rzp_live_xxx)
- [ ] Configure SSL/TLS certificates
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts
- [ ] Review security settings
- [ ] Test payment flow end-to-end
- [ ] Test email notifications
- [ ] Load test the application

## 🎉 You're Done!

Your FoodExpress platform is now running!

Visit http://localhost to start using the application.

For production deployment with custom domain and SSL, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

**Need Help?**
- Check logs: `docker-compose -f docker-compose.prod.yml logs`
- Run health check: `./scripts/health-check.sh`
- Review [Troubleshooting Guide](docs/DEPLOYMENT.md#troubleshooting)
