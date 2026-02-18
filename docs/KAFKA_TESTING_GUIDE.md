# Kafka Testing Guide - Step by Step

## Prerequisites
- Docker is running with Kafka, Zookeeper, and Kafka UI
- All microservices are built (especially order-service with new Kafka integration)

## Test 1: Verify Kafka is Running

### Step 1: Check Docker Containers
```bash
docker ps --filter "name=kafka"
```

**Expected Output:**
```
NAMES                   STATUS                 PORTS
fooddelivery-kafka-ui   Up X hours             0.0.0.0:8090->8080/tcp
fooddelivery-kafka      Up X hours (healthy)   0.0.0.0:9092->9092/tcp, 0.0.0.0:29092->29092/tcp
fooddelivery-zookeeper  Up X hours (healthy)   0.0.0.0:2181->2181/tcp
```

### Step 2: Open Kafka UI
1. Open browser: http://localhost:8090
2. You should see the Kafka UI dashboard
3. Click on "Topics" in the left menu

**Expected:** You should see 8 topics created by order-service:
- order-events
- order-created
- order-confirmed
- order-preparing
- order-ready-for-pickup
- order-out-for-delivery
- order-delivered
- order-cancelled

---

## Test 2: Start Order Service with Kafka

### Step 1: Run the restart script
```bash
scripts\restart-order-service.bat
```

### Step 2: Watch the logs
Look for these messages in the order-service console:
```
✅ Created Kafka topics successfully
✅ Connected to Kafka broker at localhost:29092
✅ Order Service started on port 8083
```

### Step 3: Verify topics in Kafka UI
1. Refresh http://localhost:8090
2. Click "Topics"
3. All 8 topics should now show "0 messages" (empty but ready)

---

## Test 3: Test ORDER_CREATED Event

### Method A: Using Frontend (Easiest)

**Step 1:** Start all required services
```bash
# Make sure these are running:
- Eureka Server (8761)
- API Gateway (8080)
- User Service (8081)
- Restaurant Service (8082)
- Order Service (8083)
- Frontend (5173)
```

**Step 2:** Login as customer
1. Go to http://localhost:5173
2. Login with: `customer@test.com` / `Password@123`

**Step 3:** Place an order
1. Browse restaurants
2. Add items to cart
3. Go to checkout
4. Complete the order

**Step 4:** Check Kafka UI
1. Go to http://localhost:8090
2. Click "Topics" → "order-created"
3. Click "Messages" tab
4. You should see your order event!

**Expected Event Data:**
```json
{
  "eventId": "uuid-here",
  "eventType": "ORDER_CREATED",
  "timestamp": "2026-02-18T00:45:30",
  "source": "order-service",
  "orderId": 123,
  "userId": 1,
  "restaurantId": 1,
  "status": "PENDING",
  "subtotal": 25.99,
  "deliveryFee": 2.99,
  "totalAmount": 28.98,
  "deliveryAddress": "123 Main St",
  "items": null
}
```

### Method B: Using API (Direct Test)

**Step 1:** Get authentication token
```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@test.com\",\"password\":\"Password@123\"}"
```

Copy the `token` from response.

**Step 2:** Create an order
```bash
curl -X POST http://localhost:8080/api/orders ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"restaurantId\":1,\"items\":[{\"menuItemId\":1,\"itemName\":\"Margherita Pizza\",\"quantity\":2,\"price\":12.99,\"specialInstructions\":\"Extra cheese\"}],\"deliveryAddress\":\"123 Test St\",\"deliveryInstructions\":\"Ring doorbell\",\"paymentMethod\":\"CREDIT_CARD\"}"
```

**Step 3:** Check order-service logs
Look for:
```
✅ Published ORDER_CREATED to topic 'order-created' | Order: 123 | Partition: 0
✅ Published ORDER_CREATED to topic 'order-events' | Order: 123 | Partition: 1
```

**Step 4:** Check Kafka UI
Same as Method A - check the messages in Kafka UI.

---

## Test 4: Test Order Status Updates

### Step 1: Login as restaurant owner
1. Go to http://localhost:5173
2. Login with: `owner@test.com` / `Password@123`

### Step 2: Go to Owner Dashboard
1. Click "Orders" in the navigation
2. You should see the order you just placed

### Step 3: Update order status
1. Click on the order
2. Change status from "PENDING" to "CONFIRMED"
3. Click "Update Status"

### Step 4: Check Kafka UI
1. Go to http://localhost:8090
2. Click "Topics" → "order-confirmed"
3. Click "Messages" tab
4. You should see the ORDER_CONFIRMED event!

### Step 5: Test all status transitions
Continue updating the order status:
- CONFIRMED → PREPARING (check `order-preparing` topic)
- PREPARING → READY_FOR_PICKUP (check `order-ready-for-pickup` topic)
- READY_FOR_PICKUP → OUT_FOR_DELIVERY (check `order-out-for-delivery` topic)
- OUT_FOR_DELIVERY → DELIVERED (check `order-delivered` topic)

Each status change should publish an event to its specific topic AND to `order-events`.

---

## Test 5: Monitor Events in Real-Time

### Using Kafka Console Consumer

**Terminal 1:** Watch order-created events
```bash
docker exec -it fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-created ^
  --from-beginning
```

**Terminal 2:** Watch all order events
```bash
docker exec -it fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-events ^
  --from-beginning
```

**Terminal 3:** Place orders through frontend

You'll see events appear in real-time in the console!

---

## Test 6: Verify Event Structure

### Check a message in Kafka UI:

1. Go to http://localhost:8090
2. Topics → order-created → Messages
3. Click on a message to expand it

**Verify these fields exist:**
- ✅ eventId (UUID)
- ✅ eventType (ORDER_CREATED)
- ✅ timestamp
- ✅ source (order-service)
- ✅ orderId
- ✅ userId
- ✅ restaurantId
- ✅ status
- ✅ subtotal
- ✅ deliveryFee
- ✅ totalAmount
- ✅ deliveryAddress

---

## Troubleshooting

### Problem: No topics visible in Kafka UI

**Solution:**
```bash
# Restart order-service to create topics
scripts\restart-order-service.bat

# Or manually create a topic
docker exec fooddelivery-kafka kafka-topics ^
  --bootstrap-server localhost:9092 ^
  --create --topic test-topic ^
  --partitions 3 --replication-factor 1
```

### Problem: Events not appearing in Kafka

**Check 1:** Order service logs for errors
```
Look for: "❌ Failed to publish event"
```

**Check 2:** Kafka connection in order-service
```bash
# Check application.yml has correct Kafka config
spring:
  kafka:
    bootstrap-servers: localhost:29092
```

**Check 3:** Kafka is healthy
```bash
docker ps --filter "name=kafka"
# Status should be "healthy"
```

### Problem: "Connection refused" errors

**Solution:**
```bash
# Restart Kafka
docker restart fooddelivery-kafka

# Wait 30 seconds for it to be healthy
docker ps --filter "name=kafka"

# Then restart order-service
scripts\restart-order-service.bat
```

---

## Success Criteria

✅ Kafka UI accessible at http://localhost:8090
✅ 8 topics visible in Kafka UI
✅ Order service starts without Kafka errors
✅ Creating an order publishes to `order-created` and `order-events`
✅ Updating order status publishes to specific topic
✅ Events contain all required fields
✅ Events visible in Kafka UI within 1-2 seconds
✅ Multiple events can be published without errors

---

## Next Steps After Testing

Once Kafka is working:
1. ✅ Order Service publishes events (COMPLETED)
2. ⏳ Add Kafka consumer to Delivery Service
3. ⏳ Add Kafka consumer to Notification Service
4. ⏳ Test end-to-end event flow
5. ⏳ Add WebSocket for real-time frontend updates
