# AWS Deployment - Quick Start Guide

## 🎯 Recommended Path

### Start with Manual Deployment
**Why?** Learn the system, understand what's happening, test thoroughly.

**Time**: 2-3 hours  
**Cost**: ~$40/month  
**Difficulty**: Intermediate

### Add CI/CD Later (Optional)
**When?** After 1-2 weeks of manual deployments when you're comfortable.

**Time**: 1-2 hours  
**Benefit**: Automatic deployments on git push

---

## 📋 Quick Checklist

### Before You Start
- [ ] AWS Account created
- [ ] Credit card added (for billing)
- [ ] Domain name (optional)
- [ ] Gmail account for notifications
- [ ] Razorpay account for payments

### What You'll Create
- [ ] EC2 Instance (t3.medium)
- [ ] Elastic IP
- [ ] Security Group
- [ ] Docker containers (15 total)

---

## 🚀 5-Minute Overview

### 1. Create EC2 Instance (10 min)
```
AWS Console → EC2 → Launch Instance
- Ubuntu 22.04
- t3.medium
- 30GB storage
- Security group: ports 22, 80, 443, 8080
```

### 2. Connect & Install Docker (5 min)
```bash
ssh -i key.pem ubuntu@<ip>
curl -fsSL https://get.docker.com | sh
```

### 3. Clone & Configure (5 min)
```bash
git clone https://github.com/anishghanwat/FoodExpress.git
cd FoodExpress
cp .env.example .env.production
nano .env.production  # Edit with your values
```

### 4. Deploy (15 min)
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 5. Seed Database (2 min)
```bash
docker exec -i foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} < sql/seed-dummy-data.sql
```

### 6. Test (2 min)
```
Open: http://<your-ip>
Login: customer@gmail.com / Password@123
```

**Total Time**: ~40 minutes (excluding build time)

---

## 📚 Detailed Guides

### For Manual Deployment
👉 **Read**: `docs/AWS_DEPLOYMENT_GUIDE.md`
- Complete step-by-step instructions
- Troubleshooting tips
- Security best practices
- Cost optimization

### For CI/CD Setup
👉 **Read**: `docs/CI_CD_SETUP_GUIDE.md`
- GitHub Actions setup
- Automated deployments
- Testing integration
- Monitoring

---

## 💰 Cost Breakdown

### Monthly Costs
| Service | Cost |
|---------|------|
| EC2 t3.medium | ~$30 |
| EBS Storage (30GB) | ~$3 |
| Data Transfer | ~$5-10 |
| **Total** | **~$40-45** |

### Ways to Save
- Use t3.small for testing (~$15/month)
- Stop instance when not in use
- Use spot instances (advanced)

---

## 🔑 Required Credentials

### Gmail (for notifications)
1. Enable 2FA on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character password (no spaces)

### Razorpay (for payments)
1. Sign up: https://razorpay.com
2. Get test keys from dashboard
3. Later: Get production keys

### AWS
1. Create account: https://aws.amazon.com
2. Add payment method
3. Note: Free tier available

---

## 🎓 Learning Path

### Week 1: Manual Deployment
- [ ] Day 1-2: Deploy to AWS
- [ ] Day 3-4: Test all features
- [ ] Day 5-6: Monitor and optimize
- [ ] Day 7: Make manual updates

### Week 2: Automation (Optional)
- [ ] Day 8-9: Setup CI/CD
- [ ] Day 10-11: Test automated deployments
- [ ] Day 12-14: Monitor and refine

---

## 🆘 Quick Troubleshooting

### Services won't start
```bash
docker-compose -f docker-compose.prod.yml logs
docker-compose -f docker-compose.prod.yml restart
```

### Out of memory
```bash
free -h
# Add swap if needed (see full guide)
```

### Can't connect to server
- Check security group allows your IP
- Verify Elastic IP is associated
- Check SSH key permissions

### Database connection failed
```bash
docker logs foodexpress-mysql
docker-compose -f docker-compose.prod.yml restart mysql
```

---

## 📞 Support Resources

### Documentation
- AWS Deployment: `docs/AWS_DEPLOYMENT_GUIDE.md`
- CI/CD Setup: `docs/CI_CD_SETUP_GUIDE.md`
- Pre-Deployment: `PRE_DEPLOYMENT_CHECKLIST.md`

### External Resources
- AWS Documentation: https://docs.aws.amazon.com/
- Docker Documentation: https://docs.docker.com/
- GitHub Issues: https://github.com/anishghanwat/FoodExpress/issues

---

## ✅ Success Criteria

After deployment, you should be able to:
- [ ] Access frontend at http://`<your-ip>`
- [ ] Login with test accounts
- [ ] Browse restaurants
- [ ] Add items to cart
- [ ] Place orders
- [ ] Track deliveries
- [ ] Receive email notifications

---

## 🎯 Next Steps

1. **Read the full guide**: `docs/AWS_DEPLOYMENT_GUIDE.md`
2. **Prepare credentials**: Gmail, Razorpay, AWS
3. **Follow step-by-step**: Don't skip steps
4. **Test thoroughly**: Use all features
5. **Monitor**: Check logs and metrics
6. **Optimize**: Improve performance
7. **Add CI/CD**: When comfortable (optional)

---

## 🚨 Important Notes

### Security
- Change all default passwords
- Restrict SSH to your IP only
- Use strong passwords
- Enable firewall
- Setup SSL certificate

### Backups
- Backup database regularly
- Keep backups off-server
- Test restore process

### Monitoring
- Check logs daily
- Monitor resource usage
- Set up alerts
- Track errors

---

**Ready to deploy?** Start with `docs/AWS_DEPLOYMENT_GUIDE.md`

**Questions?** Check the troubleshooting section or create an issue on GitHub.

**Good luck! 🚀**
