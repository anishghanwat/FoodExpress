# Testing Kafka Integration - Complete Flow

## Current Status
✅ Database schema updated - `agent_id` is now nullable
✅ Delivery Service Kafka consumer is running and listening for events
✅ Order Service Kafka producer is publishing events

## Test the Complete Flow

### Method 1: Using Frontend UI (Recommended)

1. **Start the frontend** (if not already running):
   ```bash
   cd frontend
   npm run dev
   ```

2. **Login as Restaurant Owner**:
   - Go to http://localhost:5173
   - Login with: `owner@test.com` / `Password@123`
   - Navigate to "Orders" page

3. **Place an order as Customer** (in a different browser/incognito):
   - Go to http://localhost:5173
   - Login with: `customer@test.com` / `Password@123`
   - Browse restaurants and place an order
   - Note the order ID

4. **Update Order Status (as Owner)**:
   - Go back to owner dashboard
   - Find the new order
   - Update status: PENDING → CONFIRMED → PREPARING → READY_FOR_PICKUP
   - **When you click READY_FOR_PICKUP, Kafka event is published!**

5. **Check Delivery Created (as Agent)**:
   - Open another browser/incognito window
   - Login with: `agent@test.com` / `Password@123`
   - Navigate to "Queue" page
   - You should see the new delivery automatically created!

### Method 2: Using API Directly

1. **Watch Kafka events in real-time**:
   ```bash
   scripts\watch-latest-events.bat
   ```

2. **Watch delivery-service logs**:
   ```bash
   # In delivery-service directory
   mvn spring-boot:run
   # Look for: "📦 Received ORDER_READY_FOR_PICKUP event"
   ```

3. **Update an existing order to READY_FOR_PICKUP**:
   ```bash
   # Get owner token first
   curl -X POST http://localhost:8080/api/auth/login ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"owner@test.com\",\"password\":\"Password@123\"}"
   
   # Update order 2 to READY_FOR_PICKUP
   curl -X PUT "http://localhost:8080/api/orders/2/status?status=READY_FOR_PICKUP" ^
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Check if delivery was created**:
   ```bash
   curl http://localhost:8080/api/deliveries/available
   ```

### What to Look For

#### In Delivery Service Logs:
```
📦 Received ORDER_READY_FOR_PICKUP event: orderId=X, restaurantId=Y
✅ Created delivery record: deliveryId=Z, orderId=X, status=ASSIGNED
```

#### In Kafka UI (http://localhost:8090):
- Topic: `order-ready-for-pickup`
- Should see new messages when orders are marked READY_FOR_PICKUP

#### In Agent Queue:
- New deliveries appear automatically
- Status: ASSIGNED
- Shows order details, pickup address, delivery address

## Troubleshooting

### No delivery created?
1. Check delivery-service is running: `http://localhost:8084/actuator/health`
2. Check Kafka is running: `docker ps | findstr kafka`
3. Check delivery-service logs for errors
4. Verify order status is actually READY_FOR_PICKUP

### Delivery created but not showing in Agent Queue?
1. Check the delivery status is ASSIGNED
2. Verify agent is logged in correctly
3. Check browser console for API errors

### Kafka consumer not receiving events?
1. Restart delivery-service
2. Check Kafka topics exist: Use Kafka UI at http://localhost:8090
3. Verify order-service is publishing events (check order-service logs)

## Expected Behavior

1. **Order Service** publishes `OrderEvent` to `order-ready-for-pickup` topic
2. **Delivery Service** consumes the event via `OrderEventConsumer`
3. **Delivery Service** creates a new `Delivery` record with:
   - orderId
   - restaurantId
   - customerId
   - status = ASSIGNED
   - agentId = null (until agent accepts)
   - deliveryAddress
   - pickupAddress
   - deliveryFee = 2.99 (default)
4. **Agent** sees the delivery in their queue
5. **Agent** can accept the delivery (sets agentId)
6. **Agent** can update status: PICKED_UP → IN_TRANSIT → DELIVERED

## Next Steps

Once this is working:
- [ ] Add delivery event publishing when agent accepts/updates delivery
- [ ] Update order status when delivery status changes
- [ ] Add real-time notifications
- [ ] Add delivery tracking for customers
