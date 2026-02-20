# CI/CD Setup Guide

This guide will help you set up automatic deployments using GitHub Actions. Every time you push to the `main` branch, your code will automatically deploy to AWS EC2.

## Prerequisites

- GitHub repository: https://github.com/anishghanwat/FoodExpress
- AWS EC2 instance running at: 13.205.67.100
- SSH key file: `foodexpress-key.pem`

## Setup Steps

### Step 1: Add GitHub Secrets

You need to add two secrets to your GitHub repository:

1. Go to your GitHub repository: https://github.com/anishghanwat/FoodExpress
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

#### Secret 1: EC2_HOST

- Name: `EC2_HOST`
- Value: `13.205.67.100`
- Click **Add secret**

#### Secret 2: EC2_SSH_KEY

- Name: `EC2_SSH_KEY`
- Value: Your SSH private key content
- Click **Add secret**

**To get your SSH key content:**

On Windows (PowerShell):
```powershell
cd downloads
Get-Content foodexpress-key.pem | clip
```

This copies the key to your clipboard. Paste it into the GitHub secret value field.

The key should look like:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(many lines)
...
-----END RSA PRIVATE KEY-----
```

### Step 2: Test the Workflow

Once you've added both secrets:

1. Make a small change to any file (like adding a comment)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test CI/CD deployment"
   git push origin main
   ```

3. Go to your GitHub repository
4. Click the **Actions** tab
5. You'll see your deployment running!

### Step 3: Monitor Deployment

The workflow will:
1. ✅ Pull latest code on EC2
2. ✅ Update environment variables
3. ✅ Rebuild Docker images
4. ✅ Restart all services
5. ✅ Show service status

This takes about 5-10 minutes.

## How It Works

Every time you push to `main`:
- GitHub Actions connects to your EC2 instance via SSH
- Pulls the latest code
- Rebuilds and restarts Docker containers
- Your app is automatically updated!

## Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Click **Deploy to AWS EC2** workflow
3. Click **Run workflow** button
4. Select `main` branch
5. Click **Run workflow**

## Troubleshooting

### Deployment fails with "Permission denied"

Your SSH key might be wrong. Make sure you copied the entire key including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

### Deployment fails with "Host key verification failed"

The workflow will automatically accept the host key on first run.

### Services don't start after deployment

SSH into your EC2 instance and check:
```bash
cd ~/FoodExpress
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
```

## What Gets Deployed

- ✅ All backend microservices (Java Spring Boot)
- ✅ Frontend (React + Vite)
- ✅ Database migrations (automatic)
- ✅ Environment configuration

## Deployment Time

- First deployment: ~10 minutes (builds all images)
- Subsequent deployments: ~5 minutes (uses cached layers)

## Best Practices

1. **Test locally first** before pushing to main
2. **Use feature branches** for development
3. **Merge to main** only when ready to deploy
4. **Monitor the Actions tab** after pushing

## Advanced: Deploy Specific Services

To deploy only specific services, modify the workflow to rebuild only what changed. This is more advanced and can be added later.

## Next Steps

After CI/CD is working:

1. Set up staging environment (optional)
2. Add automated tests before deployment
3. Set up Slack/Discord notifications for deployments
4. Add rollback capability

---

Your CI/CD is now set up! Every push to `main` automatically deploys to production. 🚀
