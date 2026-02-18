# Testing Delivery Service Kafka Integration

## Prerequisites
- Docker running with Kafka
- Order Service running (with Kafka integration)
- Delivery Service needs to be restarted with new code

## Step 1: Restart Delivery Service

### Stop old delivery-service:
```bash
netstat -ano | findstr :8084
taskkill /F /PID <PID_NUMBER>
```

### Start new delivery-service:
```bash
cd delivery-service
java -jar target/delivery-service-1.0.0.jar
```

**Watch for these logs:**
```
✅ Started DeliveryServiceApplication
✅ Kafka topics created (delivery-events, delivery-assigned, etc.)
✅ Kafka consumer started for order-ready-for-pickup topic
```

## Step 2: Watch Kafka Events

Open a separate terminal and run:
```bash
scripts\watch-kafka-events.bat
```

This will show all events in real-time.

## Step 3: Complete Order Flow Test

### 3.1 Place an Order (Customer)
1. Go to http://localhost:5173
2. Login: `customer@test.com` / `Password@123`
3. Browse restaurants
4. Add items to cart
5. Complete checkout
6. Note the order number (e.g., Order #11)

**Expected Kafka Event:**
```json
{
  "eventType": "ORDER_CREATED",
  "orderId": 11,
  "status": "PENDING"
}
```

### 3.2 Confirm Order (Restaurant Owner)
1. Logout and login as: `owner@test.com` / `Password@123`
2. Go to "Orders" page
3. Find your order
4. Update status: PENDING → CONFIRMED

**Expected Kafka Event:**
```json
{
  "eventType": "ORDER_CONFIRMED",
  "orderId": 11,
  "status": "CONFIRMED"
}
```

### 3.3 Start Preparing (Restaurant Owner)
1. Update status: CONFIRMED → PREPARING

**Expected Kafka Event:**
```json
{
  "eventType": "ORDER_PREPARING",
  "orderId": 11,
  "status": "PREPARING"
}
```

### 3.4 Mark Ready for Pickup (Restaurant Owner) - KEY STEP!
1. Update status: PREPARING → READY_FOR_PICKUP

**Expected Kafka Events:**
```json
// From Order Service
{
  "eventType": "ORDER_READY_FOR_PICKUP",
  "orderId": 11,
  "status": "READY_FOR_PICKUP",
  "deliveryAddress": "123 Customer St..."
}
```

**Check Delivery Service Logs:**
```
📦 Received ORDER_READY_FOR_PICKUP event: orderId=11, restaurantId=1
✅ Created delivery record: deliveryId=1, orderId=11, status=ASSIGNED
```

**This is the magic moment!** The delivery service automatically created a delivery record.

### 3.5 Check Agent Queue
1. Logout and login as: `agent@test.com` / `Password@123`
2. Go to "Queue" page
3. **You should see the order automatically!**

The order appeared in the queue because:
- Order Service published ORDER_READY_FOR_PICKUP event
- Delivery Service consumed the event
- Delivery Service created a delivery record
- Agent queue shows deliveries with status ASSIGNED

### 3.6 Accept Delivery (Agent)
1. Click "Accept" on the order
2. Order moves to "Active Deliveries"

**Expected Kafka Events:**
```json
{
  "eventType": "DELIVERY_ASSIGNED",
  "deliveryId": 1,
  "orderId": 11,
  "agentId": 8,
  "status": "ASSIGNED"
}
```

**Check Delivery Service Logs:**
```
✅ Published DELIVERY_ASSIGNED to topic 'delivery-assigned'
✅ Published DELIVERY_ASSIGNED to topic 'delivery-events'
```

### 3.7 Mark as Picked Up (Agent)
1. In "Active Deliveries", click "Mark as Picked Up"

**Expected Kafka Events:**
```json
{
  "eventType": "DELIVERY_PICKED_UP",
  "deliveryId": 1,
  "orderId": 11,
  "agentId": 8,
  "status": "PICKED_UP"
}
```

### 3.8 Mark as Delivered (Agent)
1. Click "Mark as Delivered"

**Expected Kafka Events:**
```json
{
  "eventType": "DELIVERY_DELIVERED",
  "deliveryId": 1,
  "orderId": 11,
  "agentId": 8,
  "status": "DELIVERED"
}
```

## Step 4: Verify in Kafka UI

1. Open http://localhost:8090
2. Click "Topics"
3. Check these topics have new messages:
   - `order-ready-for-pickup` (1 message)
   - `delivery-events` (3 messages: ASSIGNED, PICKED_UP, DELIVERED)
   - `delivery-assigned` (1 message)
   - `delivery-picked-up` (1 message)
   - `delivery-delivered` (1 message)

## Step 5: Check Database

```sql
-- Check delivery was created
SELECT * FROM deliveries WHERE order_id = 11;

-- Should show:
-- id, order_id=11, agent_id=8, status=DELIVERED, 
-- restaurant_id=1, customer_id=6, delivery_address, etc.
```

## Success Criteria

✅ Order Service publishes ORDER_READY_FOR_PICKUP event
✅ Delivery Service logs show "📦 Received ORDER_READY_FOR_PICKUP event"
✅ Delivery Service logs show "✅ Created delivery record"
✅ Delivery record appears in database
✅ Order appears in agent queue automatically (no manual creation!)
✅ Agent can accept delivery
✅ Delivery Service publishes DELIVERY_ASSIGNED event
✅ Agent can update delivery status
✅ Delivery Service publishes DELIVERY_PICKED_UP event
✅ Delivery Service publishes DELIVERY_DELIVERED event
✅ All events visible in Kafka UI

## Troubleshooting

### Issue: Order doesn't appear in agent queue

**Check 1:** Is delivery-service running?
```bash
netstat -ano | findstr :8084
```

**Check 2:** Check delivery-service logs for errors
```
Look for: "❌ Error processing ORDER_READY_FOR_PICKUP event"
```

**Check 3:** Check if delivery was created in database
```sql
SELECT * FROM deliveries WHERE order_id = 11;
```

**Check 4:** Check Kafka consumer is running
```
Delivery service logs should show:
"Kafka consumer started for order-ready-for-pickup topic"
```

### Issue: Events not appearing in Kafka

**Check 1:** Is Kafka running?
```bash
docker ps --filter "name=kafka"
```

**Check 2:** Check delivery-service Kafka connection
```
Logs should show: "Connected to Kafka at localhost:29092"
```

**Check 3:** Manually check topic
```bash
docker exec fooddelivery-kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic delivery-events \
  --from-beginning
```

### Issue: Delivery Service won't start

**Check 1:** Port 8084 already in use?
```bash
netstat -ano | findstr :8084
taskkill /F /PID <PID>
```

**Check 2:** Check application.yml has Kafka config
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:29092
```

## Quick Test Script

Want to test quickly? Run this:

```bash
# Terminal 1: Watch Kafka events
scripts\watch-kafka-events.bat

# Terminal 2: Restart delivery service
cd delivery-service
java -jar target/delivery-service-1.0.0.jar

# Then follow the order flow in the browser
```

## What You're Testing

This test verifies the **event-driven architecture**:

1. **Loose Coupling**: Order Service doesn't call Delivery Service directly
2. **Async Communication**: Events flow through Kafka
3. **Automatic Reactions**: Delivery Service automatically creates deliveries
4. **Scalability**: Multiple delivery services could consume the same events
5. **Reliability**: Events are persisted in Kafka (can replay if needed)

This is the foundation of a microservices architecture!
