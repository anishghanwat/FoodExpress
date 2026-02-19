# Get Your Stripe API Keys - Step by Step

## 🎯 Current Issue

Error: `Invalid API Key provided: sk_test_*********here`

This means you need to replace the placeholder Stripe key with your actual key.

---

## 📝 Step-by-Step Guide

### Step 1: Sign Up for Stripe (2 minutes)

1. Go to https://stripe.com
2. Click "Sign up" (top right)
3. Fill in:
   - Email address
   - Full name
   - Country
   - Password
4. Click "Create account"
5. Verify your email (check inbox)

### Step 2: Access Dashboard (1 minute)

1. After email verification, you'll be in the Stripe Dashboard
2. Look at the top right corner
3. Make sure the toggle says **"Test mode"** (should be ON by default)
   - If it says "Live mode", click it to switch to "Test mode"

### Step 3: Get API Keys (1 minute)

1. In the left sidebar, click **"Developers"**
2. Click **"API keys"**
3. You'll see two keys:

   **Publishable key:**
   - Starts with `pk_test_`
   - Example: `pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...`
   - Click to copy

   **Secret key:**
   - Shows as `sk_test_••••••••••••••••`
   - Click **"Reveal test key"**
   - Starts with `sk_test_`
   - Example: `sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...`
   - Click to copy

### Step 4: Add Keys to .env File (1 minute)

1. Open `.env` file in project root
2. Find this line:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ```
3. Replace with your actual secret key:
   ```
   STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
   ```

4. Open `frontend/.env.development`
5. Find this line:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```
6. Replace with your actual publishable key:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
   ```

### Step 5: Restart Services (2 minutes)

**Restart payment-service:**
```bash
# Stop current payment-service (Ctrl+C)
cd payment-service
mvn spring-boot:run
```

**Restart frontend (if needed):**
```bash
# Stop current frontend (Ctrl+C)
cd frontend
npm run dev
```

---

## ✅ Verification

### Test the Keys

1. Go to checkout page
2. Fill delivery address
3. Select "Credit/Debit Card"
4. Click "Proceed to Payment"
5. Payment form should appear (no error!)

### Check Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. After creating payment intent, you should see it listed
3. Status will be "Incomplete" (normal - not yet paid)

---

## 🎯 What Your Keys Look Like

### ✅ Correct Format

**Secret Key (Backend):**
```
sk_test_[YOUR_ACTUAL_STRIPE_SECRET_KEY_HERE]
```
- Starts with `sk_test_`
- About 100+ characters long
- Mix of letters and numbers

**Publishable Key (Frontend):**
```
pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdefghijklmnopqrstuvwxyz
```
- Starts with `pk_test_`
- About 100+ characters long
- Mix of letters and numbers

### ❌ Wrong Format

```
sk_test_your_stripe_secret_key_here          ❌ Placeholder
sk_test_*********here                        ❌ Incomplete
sk_live_...                                  ❌ Live key (use test!)
```

---

## 🔐 Security Notes

### ✅ Safe to Use

- Test keys (sk_test_, pk_test_) are safe for development
- No real money involved
- Can be shared in development team
- Can be regenerated anytime

### ⚠️ Keep Secret

- Never commit to Git (already in .gitignore)
- Don't share publicly
- Don't use in screenshots
- Rotate if accidentally exposed

### 🚫 Never Use

- Live keys (sk_live_, pk_live_) in development
- Someone else's keys
- Expired or revoked keys

---

## 🐛 Troubleshooting

### "Invalid API Key" Error

**Cause:** Key is not correct or not set

**Solution:**
1. Check `.env` file has actual key (not placeholder)
2. Key should start with `sk_test_`
3. No extra spaces or quotes
4. Restart payment-service after changing

### "No such API key" Error

**Cause:** Key doesn't exist in Stripe

**Solution:**
1. Go to Stripe Dashboard
2. Developers → API keys
3. Copy the correct key
4. Make sure you're in Test mode

### Keys Not Working

**Checklist:**
- [ ] Signed up for Stripe account
- [ ] Email verified
- [ ] In Test mode (not Live mode)
- [ ] Copied correct keys (not placeholders)
- [ ] Added to correct files (.env and frontend/.env.development)
- [ ] No extra spaces or quotes
- [ ] Restarted payment-service
- [ ] Restarted frontend (if changed frontend .env)

---

## 📱 Quick Reference

### Where to Get Keys
```
https://dashboard.stripe.com/test/apikeys
```

### Where to Add Keys

**Backend:**
```
.env
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
```

**Frontend:**
```
frontend/.env.development
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY
```

### Restart Commands
```bash
# Payment Service
cd payment-service
mvn spring-boot:run

# Frontend
cd frontend
npm run dev
```

---

## 🎉 Success!

Once you've added your keys and restarted:

1. ✅ No "Invalid API Key" error
2. ✅ Payment intent created successfully
3. ✅ Payment form appears
4. ✅ Can enter test card
5. ✅ Payment visible in Stripe Dashboard

---

## 💡 Pro Tips

1. **Bookmark Stripe Dashboard** - You'll use it often
2. **Keep Test Mode ON** - Never use live mode in development
3. **Check Dashboard First** - If errors occur, check Stripe Dashboard logs
4. **Use Test Cards** - 4242 4242 4242 4242 for success
5. **Regenerate if Needed** - Can create new keys anytime

---

## 🚀 Ready?

1. Go to https://stripe.com
2. Sign up (2 min)
3. Get your keys (1 min)
4. Add to .env files (1 min)
5. Restart services (2 min)
6. Test payment! (1 min)

**Total: 7 minutes to get payment working!**
