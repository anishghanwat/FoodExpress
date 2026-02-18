# Simple Kafka Test - 3 Steps

## Step 1: Restart Order Service

Run this command:
```bash
scripts\restart-order-service.bat
```

Wait for the service to start (about 10 seconds).

## Step 2: Open Kafka UI

Open in your browser:
```
http://localhost:8090
```

1. Click "Topics" in the left menu
2. Click on "order-events" topic
3. Click "Messages" tab
4. Note the current message count (e.g., "13 messages")

## Step 3: Place a New Order

1. Go to http://localhost:5173
2. Login: `customer@test.com` / `Password@123`
3. Browse restaurants
4. Add items to cart
5. Complete checkout

## Step 4: Check Kafka UI

1. Go back to Kafka UI: http://localhost:8090
2. Refresh the "order-events" topic messages
3. You should see NEW messages (count increased)
4. Click on the NEWEST message (top of the list)

## What to Look For:

### ✅ SUCCESS - New Format:
```json
{
  "eventId": "some-uuid",
  "eventType": "ORDER_CREATED",  ← Should say ORDER_CREATED
  "timestamp": "2026-02-18T...",
  "source": "order-service",
  "orderId": 10,  ← New order number
  "userId": 6,  ← Should say userId (not customerId)
  "restaurantId": 1,
  "status": "PENDING",
  "subtotal": 25.99,
  "deliveryFee": 2.99,
  "totalAmount": 28.98,
  "deliveryAddress": "...",
  "items": null
}
```

### ❌ OLD Format (if you see this, service didn't restart):
```json
{
  "eventType": "ORDER_UPDATED",  ← Wrong
  "customerId": 6,  ← Wrong (should be userId)
  ...
}
```

## Troubleshooting:

### If you still see old format:

**Check 1:** Is the new service running?
```bash
# Check the order-service console window
# Look for: "Started OrderServiceApplication"
```

**Check 2:** Did it connect to Kafka?
```bash
# In order-service logs, look for:
# "✅ Connected to Kafka" or similar
```

**Check 3:** Force restart
```bash
# Find the process
netstat -ano | findstr :8083

# Kill it (replace XXXX with the PID)
taskkill /F /PID XXXX

# Start new one
cd order-service
java -jar target/order-service-1.0.0.jar
```

## Alternative: Watch Events in Console

If you prefer console output:

**Watch all events (including old):**
```bash
scripts\watch-kafka-events.bat
```

**Watch and place order:**
1. Run the watch script
2. Place order in browser
3. See event appear in console immediately

The console will show ALL events (old and new), but the newest ones will appear at the bottom.

## Success Criteria:

✅ New order creates event with `"eventType":"ORDER_CREATED"`
✅ Event uses `"userId"` not `"customerId"`
✅ Event appears in Kafka UI within 1-2 seconds
✅ Order service logs show: `✅ Published ORDER_CREATED to topic 'order-created'`

Once you see these, your Kafka integration is working perfectly!
