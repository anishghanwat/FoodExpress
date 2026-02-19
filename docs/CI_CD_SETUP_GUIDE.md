# CI/CD Setup Guide - GitHub Actions

## When to Add CI/CD?

**Add CI/CD After:**
- ✅ Manual deployment is working
- ✅ You understand the deployment process
- ✅ Application is stable
- ✅ You're making frequent updates

**Benefits:**
- Automatic deployments on git push
- Consistent deployment process
- Faster iteration
- Reduced human error

---

## GitHub Actions CI/CD Pipeline

### Architecture

```
GitHub Push → GitHub Actions → Build → Test → Deploy to AWS EC2
```

### What Gets Automated

1. **Build**: Docker images built automatically
2. **Test**: Run tests (optional)
3. **Deploy**: Push to EC2 and restart services
4. **Notify**: Slack/Email notifications (optional)

---

## Setup Steps

### Step 1: Prepare EC2 for CI/CD

#### 1.1 Create Deployment User

SSH into your EC2 instance:

```bash
# Create deployment user
sudo adduser github-deploy
sudo usermod -aG docker github-deploy
sudo usermod -aG sudo github-deploy

# Switch to deployment user
sudo su - github-deploy

# Create SSH directory
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

#### 1.2 Generate SSH Key for GitHub Actions

```bash
# Generate key (no passphrase)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key

# Add to authorized_keys
cat ~/.ssh/github_actions_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Display private key (copy this)
cat ~/.ssh/github_actions_key
```

**Copy the entire private key** (including BEGIN and END lines)

### Step 2: Add Secrets to GitHub

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `EC2_HOST` | Your Elastic IP | Server IP address |
| `EC2_USERNAME` | `github-deploy` | Deployment user |
| `EC2_SSH_KEY` | Private key content | SSH key from Step 1.2 |
| `MYSQL_PASSWORD` | Your MySQL password | Database password |
| `MAIL_USERNAME` | Gmail address | Email for notifications |
| `MAIL_PASSWORD` | Gmail app password | 16-char app password |
| `RAZORPAY_KEY_ID` | Razorpay key | Payment gateway key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Payment gateway secret |

### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup SSH
      uses: webfactory/ssh-agent@v0.8.0
      with:
        ssh-private-key: ${{ secrets.EC2_SSH_KEY }}
    
    - name: Add EC2 to known hosts
      run: |
        mkdir -p ~/.ssh
        ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts
    
    - name: Deploy to EC2
      env:
        EC2_HOST: ${{ secrets.EC2_HOST }}
        EC2_USERNAME: ${{ secrets.EC2_USERNAME }}
        MYSQL_PASSWORD: ${{ secrets.MYSQL_PASSWORD }}
        MAIL_USERNAME: ${{ secrets.MAIL_USERNAME }}
        MAIL_PASSWORD: ${{ secrets.MAIL_PASSWORD }}
        RAZORPAY_KEY_ID: ${{ secrets.RAZORPAY_KEY_ID }}
        RAZORPAY_KEY_SECRET: ${{ secrets.RAZORPAY_KEY_SECRET }}
      run: |
        ssh $EC2_USERNAME@$EC2_HOST << 'EOF'
          cd ~/FoodExpress
          
          # Pull latest code
          git pull origin main
          
          # Update environment variables
          cat > .env.production << EOL
          MYSQL_HOST=mysql
          MYSQL_PORT=3306
          MYSQL_USER=root
          MYSQL_PASSWORD=${{ secrets.MYSQL_PASSWORD }}
          KAFKA_BOOTSTRAP_SERVERS=kafka:9092
          EUREKA_SERVER_URL=http://eureka-server:8761/eureka/
          MAIL_HOST=smtp.gmail.com
          MAIL_PORT=587
          MAIL_USERNAME=${{ secrets.MAIL_USERNAME }}
          MAIL_PASSWORD=${{ secrets.MAIL_PASSWORD }}
          MAIL_FROM_NAME=FoodExpress
          RAZORPAY_KEY_ID=${{ secrets.RAZORPAY_KEY_ID }}
          RAZORPAY_KEY_SECRET=${{ secrets.RAZORPAY_KEY_SECRET }}
          VITE_API_GATEWAY_URL=http://${{ secrets.EC2_HOST }}:8080
          VITE_WS_URL=ws://${{ secrets.EC2_HOST }}:8080/ws
          VITE_RAZORPAY_KEY_ID=${{ secrets.RAZORPAY_KEY_ID }}
          EOL
          
          # Load environment
          export $(cat .env.production | grep -v '^#' | xargs)
          
          # Rebuild and restart services
          docker-compose -f docker-compose.prod.yml up -d --build
          
          # Wait for services to be healthy
          sleep 30
          
          # Check status
          docker-compose -f docker-compose.prod.yml ps
        EOF
    
    - name: Verify Deployment
      run: |
        sleep 10
        curl -f http://${{ secrets.EC2_HOST }} || exit 1
        curl -f http://${{ secrets.EC2_HOST }}:8080/actuator/health || exit 1
    
    - name: Notify Success
      if: success()
      run: echo "✅ Deployment successful!"
    
    - name: Notify Failure
      if: failure()
      run: echo "❌ Deployment failed!"
```

### Step 4: Test CI/CD Pipeline

1. Commit the workflow file:
```bash
git add .github/workflows/deploy.yml
git commit -m "Add CI/CD pipeline"
git push origin main
```

2. Go to GitHub → Actions tab
3. Watch the deployment run
4. Check logs for any errors

### Step 5: Verify Deployment

After GitHub Actions completes:

1. Check your application: http://`<your-ip>`
2. Verify services are running:
```bash
ssh github-deploy@<your-ip>
cd ~/FoodExpress
docker-compose -f docker-compose.prod.yml ps
```

---

## Advanced CI/CD Features

### Add Testing Stage

Update `.github/workflows/deploy.yml`:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Run Backend Tests
      run: |
        cd user-service
        mvn test
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Run Frontend Tests
      run: |
        cd frontend
        npm ci
        npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    # ... rest of deploy job
```

### Add Slack Notifications

1. Create Slack webhook
2. Add `SLACK_WEBHOOK` secret to GitHub
3. Add notification step:

```yaml
    - name: Notify Slack
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        text: 'Deployment ${{ job.status }}'
```

### Add Rollback Capability

```yaml
    - name: Rollback on Failure
      if: failure()
      run: |
        ssh $EC2_USERNAME@$EC2_HOST << 'EOF'
          cd ~/FoodExpress
          git reset --hard HEAD~1
          docker-compose -f docker-compose.prod.yml up -d --build
        EOF
```

### Add Environment-Specific Deployments

```yaml
on:
  push:
    branches:
      - main        # Production
      - develop     # Staging
      - feature/*   # Development

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Determine Environment
      run: |
        if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
          echo "ENV=production" >> $GITHUB_ENV
        elif [[ "${{ github.ref }}" == "refs/heads/develop" ]]; then
          echo "ENV=staging" >> $GITHUB_ENV
        else
          echo "ENV=development" >> $GITHUB_ENV
        fi
```

---

## Monitoring CI/CD

### GitHub Actions Dashboard
- View all workflow runs
- Check logs for each step
- See deployment history

### Set Up Alerts
1. GitHub → Settings → Notifications
2. Enable workflow notifications
3. Get email on failure

### Monitor Deployment Time
- Track how long deployments take
- Optimize slow steps
- Typical deployment: 5-10 minutes

---

## Best Practices

### 1. Use Staging Environment
- Test changes in staging first
- Deploy to production after verification

### 2. Implement Health Checks
- Verify services are healthy after deployment
- Rollback if health checks fail

### 3. Database Migrations
- Run migrations before deploying code
- Use versioned migration scripts
- Test migrations in staging

### 4. Zero-Downtime Deployment
- Use blue-green deployment
- Or rolling updates
- Keep old version running during deployment

### 5. Secrets Management
- Never commit secrets to git
- Use GitHub Secrets
- Rotate secrets regularly

### 6. Deployment Frequency
- Deploy small changes frequently
- Easier to debug issues
- Faster rollback if needed

---

## Troubleshooting CI/CD

### SSH Connection Failed
```bash
# Test SSH connection locally
ssh -i github_actions_key github-deploy@<your-ip>

# Check SSH key permissions
chmod 600 ~/.ssh/github_actions_key

# Verify key is in authorized_keys
cat ~/.ssh/authorized_keys
```

### Docker Build Failed
```bash
# Check Docker logs on EC2
docker-compose -f docker-compose.prod.yml logs

# Check disk space
df -h

# Clean up old images
docker system prune -a
```

### Services Not Starting
```bash
# Check service logs
docker-compose -f docker-compose.prod.yml logs <service-name>

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Check environment variables
cat .env.production
```

### Deployment Timeout
- Increase timeout in workflow
- Optimize Docker builds
- Use Docker layer caching

---

## Cost Considerations

### GitHub Actions Minutes
- Free tier: 2,000 minutes/month
- Each deployment: ~5-10 minutes
- ~200-400 deployments/month free

### Optimization
- Cache Docker layers
- Parallel builds
- Skip unnecessary steps

---

## Alternative CI/CD Options

### 1. AWS CodePipeline
- Native AWS service
- Integrates with CodeBuild, CodeDeploy
- More complex setup

### 2. Jenkins
- Self-hosted
- More control
- Requires maintenance

### 3. GitLab CI/CD
- If using GitLab
- Similar to GitHub Actions
- Built-in container registry

---

## Summary

### Manual Deployment (Start Here)
- ✅ Learn the system
- ✅ Understand deployment process
- ✅ Test thoroughly
- ⏱️ Time: 2-3 hours setup

### CI/CD (Add Later)
- ✅ Automate deployments
- ✅ Faster iterations
- ✅ Consistent process
- ⏱️ Time: 1-2 hours setup

**Recommendation**: Deploy manually first, add CI/CD after 1-2 weeks when you're comfortable with the system.

---

## Next Steps

1. ✅ Complete manual deployment
2. ✅ Test application thoroughly
3. ✅ Make a few manual updates
4. ✅ Set up GitHub Actions
5. ✅ Test CI/CD pipeline
6. ✅ Monitor and optimize

Good luck! 🚀
