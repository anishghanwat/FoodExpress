# AWS Deployment Guide - FoodExpress

## Deployment Strategy

### Recommended Approach: Start Manual, Add CI/CD Later

**Phase 1: Manual Deployment (Start Here)**
- Deploy manually to understand the system
- Test and verify everything works
- Estimated time: 2-3 hours

**Phase 2: CI/CD (Optional - Add Later)**
- Automate deployments with GitHub Actions
- Add after you're comfortable with the system
- Estimated setup: 1-2 hours

---

## Phase 1: Manual AWS Deployment

### Architecture Overview

```
Internet
    ↓
Application Load Balancer (ALB)
    ↓
EC2 Instance (t3.medium or larger)
    ├── Docker Containers
    │   ├── Frontend (Nginx)
    │   ├── API Gateway
    │   ├── Microservices (7 services)
    │   ├── Eureka Server
    │   ├── MySQL
    │   ├── Kafka + Zookeeper
    │   └── Kafka UI (optional)
    └── Docker Compose
```

### Cost Estimate (Monthly)
- **EC2 t3.medium**: ~$30/month
- **Elastic IP**: Free (if attached)
- **EBS Storage (30GB)**: ~$3/month
- **Data Transfer**: ~$5-10/month
- **Total**: ~$40-45/month

### Prerequisites

1. **AWS Account** (Free tier eligible)
2. **Domain Name** (optional but recommended)
   - Can use Route 53 or external provider
   - Example: foodexpress.com
3. **Local Tools**
   - AWS CLI installed
   - SSH client (PuTTY for Windows)

---

## Step-by-Step Deployment

### Step 1: Create EC2 Instance

#### 1.1 Launch Instance
1. Go to AWS Console → EC2 → Launch Instance
2. **Name**: `foodexpress-server`
3. **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
4. **Instance Type**: `t3.medium` (2 vCPU, 4GB RAM)
   - t2.micro is too small for this stack
   - t3.medium is minimum recommended
5. **Key Pair**: Create new key pair
   - Name: `foodexpress-key`
   - Type: RSA
   - Format: `.pem` (for SSH) or `.ppk` (for PuTTY)
   - **Download and save securely!**

#### 1.2 Configure Storage
- **Size**: 30 GB
- **Type**: gp3 (General Purpose SSD)

#### 1.3 Configure Security Group
Create security group: `foodexpress-sg`

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | My IP | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Frontend |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Frontend (SSL) |
| Custom TCP | TCP | 8080 | 0.0.0.0/0 | API Gateway |
| Custom TCP | TCP | 8761 | My IP | Eureka Dashboard |

**Important**: Restrict port 22 to your IP only!

#### 1.4 Launch Instance
- Review and launch
- Wait for instance to be running
- Note the **Public IPv4 address**

### Step 2: Allocate Elastic IP (Recommended)

1. EC2 → Elastic IPs → Allocate Elastic IP address
2. Select the new IP → Actions → Associate Elastic IP address
3. Select your instance → Associate
4. **Note this IP** - this is your permanent server IP

### Step 3: Connect to Server

#### Windows (PuTTY)
1. Convert `.pem` to `.ppk` using PuTTYgen
2. Open PuTTY
3. Host: `ubuntu@<your-elastic-ip>`
4. Connection → SSH → Auth → Browse to `.ppk` file
5. Open

#### Windows (PowerShell) or Linux/Mac
```bash
# Set permissions (Linux/Mac)
chmod 400 foodexpress-key.pem

# Connect
ssh -i foodexpress-key.pem ubuntu@<your-elastic-ip>
```

### Step 4: Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes
exit
# Reconnect via SSH
```

### Step 5: Clone Repository

```bash
# Install git
sudo apt install git -y

# Clone your repository
git clone https://github.com/anishghanwat/FoodExpress.git
cd FoodExpress

# Verify files
ls -la
```

### Step 6: Configure Environment

```bash
# Copy production environment template
cp .env.example .env.production

# Edit with your production values
nano .env.production
```

**Required Configuration:**
```env
# Database
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=YOUR_STRONG_PASSWORD_HERE

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:9092

# Eureka
EUREKA_SERVER_URL=http://eureka-server:8761/eureka/

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_FROM_NAME=FoodExpress

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend
VITE_API_GATEWAY_URL=http://<your-elastic-ip>:8080
VITE_WS_URL=ws://<your-elastic-ip>:8080/ws
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Save**: Ctrl+O, Enter, Ctrl+X

### Step 7: Build and Deploy

```bash
# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# This will take 10-15 minutes for first build
# Monitor progress
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 8: Verify Services

```bash
# Check all services are running
docker-compose -f docker-compose.prod.yml ps

# Should see all services as "Up" and "healthy"
```

### Step 9: Seed Database

```bash
# Wait for MySQL to be fully ready (30 seconds)
sleep 30

# Seed the database
docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < sql/seed-dummy-data.sql

# Verify data
docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} -e "
SELECT 'Users:' as Info, COUNT(*) as Count FROM user_db.users 
UNION ALL 
SELECT 'Restaurants:', COUNT(*) FROM restaurant_db.restaurants 
UNION ALL 
SELECT 'Menu Items:', COUNT(*) FROM restaurant_db.menu_items;"
```

### Step 10: Test Application

1. **Frontend**: http://`<your-elastic-ip>`
2. **API Gateway**: http://`<your-elastic-ip>`:8080
3. **Eureka Dashboard**: http://`<your-elastic-ip>`:8761

**Test Login:**
- Email: `customer@gmail.com`
- Password: `Password@123`

### Step 11: Configure Domain (Optional)

#### Using Route 53
1. Go to Route 53 → Hosted Zones
2. Create hosted zone for your domain
3. Create A record:
   - Name: `@` (or subdomain like `app`)
   - Type: A
   - Value: Your Elastic IP
   - TTL: 300

#### Update Frontend URLs
```bash
nano .env.production
# Change:
VITE_API_GATEWAY_URL=http://yourdomain.com:8080
# Or use subdomain:
VITE_API_GATEWAY_URL=http://api.yourdomain.com

# Rebuild frontend
docker-compose -f docker-compose.prod.yml up -d --build frontend
```

### Step 12: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
```

---

## Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f user-service

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### Check Service Health
```bash
# Service status
docker-compose -f docker-compose.prod.yml ps

# Resource usage
docker stats

# Disk usage
df -h
```

### Restart Services
```bash
# Restart all
docker-compose -f docker-compose.prod.yml restart

# Restart specific service
docker-compose -f docker-compose.prod.yml restart user-service
```

### Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

### Backup Database
```bash
# Create backup
docker exec foodexpress-mysql mysqldump -uroot -p${MYSQL_PASSWORD} --all-databases > backup_$(date +%Y%m%d).sql

# Download to local machine (from your computer)
scp -i foodexpress-key.pem ubuntu@<elastic-ip>:~/FoodExpress/backup_*.sql ./
```

---

## Troubleshooting

### Services Not Starting
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check specific service
docker logs <container-name>

# Restart problematic service
docker-compose -f docker-compose.prod.yml restart <service-name>
```

### Out of Memory
```bash
# Check memory
free -h

# If low, add swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

### Database Connection Issues
```bash
# Check MySQL is running
docker-compose -f docker-compose.prod.yml ps mysql

# Check MySQL logs
docker logs foodexpress-mysql

# Restart MySQL
docker-compose -f docker-compose.prod.yml restart mysql
```

---

## Security Best Practices

1. **Change Default Passwords**
   - MySQL root password
   - All user account passwords

2. **Restrict Security Group**
   - Only allow SSH from your IP
   - Use VPN for admin access

3. **Enable Firewall**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8080/tcp
sudo ufw enable
```

4. **Regular Updates**
```bash
sudo apt update && sudo apt upgrade -y
```

5. **Setup Monitoring**
   - CloudWatch for EC2 metrics
   - Application logs
   - Database backups

---

## Cost Optimization

### Use Spot Instances (Advanced)
- Save up to 90% on EC2 costs
- Good for development/staging
- Not recommended for production initially

### Use RDS Instead of Docker MySQL (Optional)
- Managed database service
- Automatic backups
- Better for production
- Costs ~$15-30/month extra

### Use ECS/Fargate (Advanced)
- Container orchestration
- Auto-scaling
- Pay per use
- More complex setup

---

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Setup monitoring and alerts
3. ✅ Configure automated backups
4. ✅ Add SSL certificate
5. ✅ Setup custom domain
6. ⏭️ Consider adding CI/CD (Phase 2)

---

## Support

- **AWS Documentation**: https://docs.aws.amazon.com/
- **Docker Documentation**: https://docs.docker.com/
- **Project Issues**: https://github.com/anishghanwat/FoodExpress/issues

---

**Deployment Time**: 2-3 hours for first time
**Difficulty**: Intermediate
**Cost**: ~$40-45/month

Good luck with your deployment! 🚀
