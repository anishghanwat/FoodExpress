# Security Guidelines

## Sensitive Credentials

This project uses environment variables to protect sensitive credentials. **Never commit actual credentials to version control.**

## Protected Credentials

### 1. Email Configuration (Notification Service)
- `MAIL_USERNAME` - Gmail account for sending notifications
- `MAIL_PASSWORD` - Gmail App Password (16-character)
- Location: `.env` file (gitignored)

### 2. Payment Gateway (Payment Service)
- `RAZORPAY_KEY_ID` - Razorpay API Key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API Secret
- Location: `.env` file (gitignored)

### 3. Database Credentials
- `MYSQL_USER` - Database username
- `MYSQL_PASSWORD` - Database password
- Location: `.env` file (gitignored)

## Setup Instructions

### 1. Create .env File
```bash
cp .env.example .env
```

### 2. Update Credentials
Edit `.env` and replace placeholder values with your actual credentials:
- Gmail credentials (for notifications)
- Razorpay keys (for payments)
- Database credentials

### 3. Gmail App Password Setup
1. Enable 2-Factor Authentication on your Google Account
2. Visit: https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use the 16-character password (without spaces) as `MAIL_PASSWORD`

### 4. Razorpay Setup
1. Sign up at: https://razorpay.com
2. Go to Settings > API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret to `.env`

## Running Services with Environment Variables

### Option 1: Using Batch Script (Windows)
```bash
scripts\start-notification-with-env.bat
```

### Option 2: Manual Environment Variables
```bash
# Windows CMD
set MAIL_USERNAME=your_email@gmail.com
set MAIL_PASSWORD=your_app_password
cd notification-service
mvn spring-boot:run

# Windows PowerShell
$env:MAIL_USERNAME='your_email@gmail.com'
$env:MAIL_PASSWORD='your_app_password'
cd notification-service
mvn spring-boot:run
```

## Files to Never Commit

The following files contain sensitive data and are in `.gitignore`:
- `.env`
- `.env.local`
- `.env.*.local`
- `frontend/.env.development`
- `frontend/.env.production`

## Best Practices

1. ✅ Use environment variables for all sensitive data
2. ✅ Keep `.env` file in `.gitignore`
3. ✅ Use `.env.example` as a template (without real credentials)
4. ✅ Rotate credentials regularly
5. ✅ Use different credentials for development and production
6. ✅ Never log sensitive credentials
7. ✅ Use App Passwords for Gmail (not your actual password)
8. ✅ Use Test keys for development, Live keys only in production

## Security Checklist

Before committing code:
- [ ] No hardcoded passwords in source files
- [ ] `.env` file is in `.gitignore`
- [ ] Only `.env.example` is committed (with placeholders)
- [ ] All sensitive configs use environment variables
- [ ] No API keys in frontend code (use backend proxy)

## Incident Response

If credentials are accidentally committed:
1. Immediately rotate all exposed credentials
2. Remove from git history: `git filter-branch` or BFG Repo-Cleaner
3. Force push to remote (if already pushed)
4. Notify team members
5. Review access logs for unauthorized usage

## Contact

For security concerns, contact the development team immediately.
