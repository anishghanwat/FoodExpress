# Quick Deployment Fix Guide

## Current Issue
- SSH connection timing out due to changing IP address
- CORS error preventing frontend from accessing backend API
- Need to restart api-gateway service with updated CORS configuration

## Solution: Use EC2 Instance Connect (Browser-Based Terminal)

### Step 1: Access Your Instance via Browser
1. Go to AWS Console → EC2 → Instances
2. Select your instance (3.110.98.241)
3. Click **"Connect"** button at the top
4. Choose **"EC2 Instance Connect"** tab
5. Click **"Connect"** - opens a browser-based terminal
6. No SSH key needed, no IP restrictions!

### Step 2: Restart API Gateway (Apply CORS Fix)
```bash
cd ~/FoodExpress
docker-compose -f docker-compose.prod.yml restart api-gateway
```

Wait 30-60 seconds for the service to fully restart.

### Step 3: Verify Services are Running
```bash
docker-compose -f docker-compose.prod.yml ps
```

All services should show "Up" status.

### Step 4: Test the Application
Open in browser: `http://3.110.98.241`

Try logging in with:
- Email: `customer@gmail.com`
- Password: `Password@123`

The CORS error should be gone!

---

## Alternative: Fix SSH Connection (Optional)

If you prefer SSH access:

### Option A: Allow Your Current IP
1. Find your current IP: https://whatismyipaddress.com/
2. AWS Console → EC2 → Security Groups
3. Find your instance's security group
4. Edit inbound rules → SSH rule
5. Change source to: `YOUR_CURRENT_IP/32`
6. Save rules

### Option B: Allow All IPs (Less Secure)
1. AWS Console → EC2 → Security Groups
2. Edit inbound rules → SSH rule
3. Change source to: `0.0.0.0/0`
4. Save rules

Then try SSH again:
```powershell
cd downloads
ssh -i "foodexpress-key.pem" ubuntu@ec2-3-110-98-241.ap-south-1.compute.amazonaws.com
```

---

## Useful Commands (Once Connected)

### View Logs
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f api-gateway
```

### Restart All Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Rebuild and Restart (After Code Changes)
```bash
cd ~/FoodExpress
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Check Service Health
```bash
# API Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:8081/actuator/health
```

---

## About Instance Reboots

**Q: Will everything be deleted if I reboot?**

**A: No!** Your data is safe:
- Docker containers will restart automatically (if configured with `restart: always`)
- Database data is stored in Docker volumes (persistent)
- Your code is in `/home/ubuntu/FoodExpress` (persistent)
- Environment files are preserved

However, containers might not auto-start. After reboot, run:
```bash
cd ~/FoodExpress
docker-compose -f docker-compose.prod.yml up -d
```

---

## Next Steps After CORS Fix

1. **Test all user flows:**
   - Customer: Browse restaurants, place order
   - Owner: Manage restaurants and menu
   - Agent: Accept and deliver orders
   - Admin: View dashboard

2. **Set up maintenance scripts** (see AWS_DEPLOYMENT_GUIDE.md)

3. **Configure domain name** (optional)

4. **Set up monitoring** (optional)

5. **Add CI/CD** (optional, after everything works)

---

## Quick Reference

- **Instance IP:** 3.110.98.241
- **Frontend:** http://3.110.98.241
- **API Gateway:** http://3.110.98.241:8080
- **Eureka Dashboard:** http://3.110.98.241:8761

**Test Users:**
- admin@gmail.com / Password@123
- owner@gmail.com / Password@123
- agent@gmail.com / Password@123
- customer@gmail.com / Password@123
