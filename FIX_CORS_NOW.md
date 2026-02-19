# Fix CORS Error - Step by Step

## The Problem
Your frontend at `http://3.110.98.241` cannot connect to the API at `http://3.110.98.241:8080` due to CORS restrictions.

## The Solution
The CORS fix is already in your code. You just need to restart the api-gateway service on EC2.

---

## Steps to Fix (5 minutes)

### Step 1: Access EC2 via Browser
1. Open AWS Console: https://console.aws.amazon.com/ec2/
2. Click on "Instances" in the left sidebar
3. Find your instance (IP: 3.110.98.241)
4. Select it (checkbox)
5. Click the "Connect" button at the top
6. Choose "EC2 Instance Connect" tab
7. Click "Connect" button
8. A new browser tab opens with a terminal - you're in!

### Step 2: Pull Latest Code
```bash
cd ~/FoodExpress
git pull origin main
```

### Step 3: Setup Helper Scripts (One-time)
```bash
bash scripts/ec2-setup-scripts.sh
source ~/.bashrc
```

This creates shortcuts like `fd-restart`, `fd-logs`, `fd-health`.

### Step 4: Restart API Gateway
```bash
fd-restart api-gateway
```

Or the full command:
```bash
docker-compose -f docker-compose.prod.yml restart api-gateway
```

Wait 30-60 seconds for it to restart.

### Step 5: Verify It's Working
```bash
fd-health
```

You should see "✅ API Gateway (8080): UP"

### Step 6: Test in Browser
1. Open: http://3.110.98.241
2. Try to login with:
   - Email: `customer@gmail.com`
   - Password: `Password@123`

The CORS error should be GONE! 🎉

---

## If You Still See CORS Error

### Check 1: Is API Gateway Running?
```bash
docker ps | grep api-gateway
```

Should show "Up" status.

### Check 2: View API Gateway Logs
```bash
fd-logs api-gateway
```

Look for any errors. Press Ctrl+C to exit.

### Check 3: Restart All Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

Wait 2-3 minutes, then test again.

---

## Useful Commands

After running the setup script, you have these shortcuts:

```bash
fd-health      # Check if all services are running
fd-restart     # Restart all services
fd-logs        # View logs for all services
fd-update      # Pull latest code and rebuild
fd-ps          # Show service status
fd-cd          # Go to FoodExpress directory
```

---

## About SSH Connection Issues

**Why SSH keeps timing out:**
Your IP address changes frequently, and the security group only allows specific IPs.

**Solution:**
Use EC2 Instance Connect (browser-based terminal) instead. It doesn't require SSH keys or IP whitelisting.

**If you really need SSH:**
1. Find your current IP: https://whatismyipaddress.com/
2. AWS Console → EC2 → Security Groups
3. Find your instance's security group
4. Edit inbound rules → SSH rule
5. Change source to your current IP (or 0.0.0.0/0 for all IPs)
6. Save

---

## About Instance Reboots

**Q: Will I lose data if I reboot the instance?**

**A: No!** Everything is preserved:
- Docker volumes (database data)
- Your code in ~/FoodExpress
- Environment files

After reboot, just start the services:
```bash
cd ~/FoodExpress
docker-compose -f docker-compose.prod.yml up -d
```

---

## Next Steps After CORS Fix

1. Test all user roles:
   - Customer: Browse and order
   - Owner: Manage restaurants
   - Agent: Deliver orders
   - Admin: View dashboard

2. Check the seed data:
   - 15 restaurants with menus
   - All owned by owner@gmail.com

3. Monitor logs for any errors:
   ```bash
   fd-logs
   ```

4. Set up a domain name (optional)

5. Add CI/CD automation (optional)

---

## Quick Reference

**Instance IP:** 3.110.98.241

**Access URLs:**
- Frontend: http://3.110.98.241
- API Gateway: http://3.110.98.241:8080
- Eureka Dashboard: http://3.110.98.241:8761

**Test Users:**
- admin@gmail.com / Password@123
- owner@gmail.com / Password@123
- agent@gmail.com / Password@123
- customer@gmail.com / Password@123

**GitHub Repo:**
https://github.com/anishghanwat/FoodExpress

---

## Need Help?

If something doesn't work:

1. Check service health: `fd-health`
2. View logs: `fd-logs`
3. Restart services: `fd-restart`
4. Check this guide: `DEPLOY_QUICK_START.md`
