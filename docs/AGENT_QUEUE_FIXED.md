# Agent Queue Issue - RESOLVED ✅

## Problem
Order #12 was not appearing in the agent queue even though it was created and marked as READY_FOR_PICKUP.

## Root Cause Analysis

### Issue 1: Kafka Not Running
- Kafka container (`fooddelivery-kafka`) was stopped
- Without Kafka, ORDER_READY_FOR_PICKUP events couldn't be published or consumed

### Issue 2: Delivery Service Not Running
- The delivery-service wasn't started
- Without the delivery service, the Kafka consumer couldn't process ORDER_READY_FOR_PICKUP events
- No delivery records were being created for ready orders

### Issue 3: Missed Event
- Order #12 was marked as READY_FOR_PICKUP while both Kafka and delivery-service were down
- The ORDER_READY_FOR_PICKUP event was never published/consumed
- No delivery record was created in the delivery_db

## Solution Applied

### 1. Started Kafka
```bash
docker start fooddelivery-kafka
```

### 2. Started Delivery Service
```bash
cd delivery-service
mvn spring-boot:run
```

### 3. Manually Created Delivery Record
Since the Kafka event was missed, manually inserted the delivery record:
```sql
INSERT INTO deliveries (
    order_id, 
    restaurant_id, 
    customer_id, 
    pickup_address, 
    delivery_address, 
    status, 
    delivery_fee, 
    created_at, 
    updated_at
) VALUES (
    12, 
    2, 
    6, 
    '456 Oak Ave, Midtown', 
    '123 Customer St, Apt 4B, City, State 12345', 
    'ASSIGNED', 
    2.99, 
    NOW(), 
    NOW()
);
```

### 4. Cleaned Up Debug Code
- Removed console.log statements from `AgentQueue.jsx`
- Removed unused imports (`useAuth`, `orderService`)

### 5. Updated Diagnostic Script
- Fixed column name error (`user_id` → `customer_id`)
- Added Kafka status check
- Added Delivery Service status check
- Made order ID parameterizable
- Improved troubleshooting tips

## Verification

### API Response
```json
{
  "data": [
    {
      "id": 5,
      "orderId": 11,
      "status": "ASSIGNED",
      "pickupAddress": "Restaurant Address",
      "deliveryAddress": "123 Customer St, Apt 4B, City, State 12345"
    },
    {
      "id": 8,
      "orderId": 12,
      "status": "ASSIGNED",
      "pickupAddress": "456 Oak Ave, Midtown",
      "deliveryAddress": "123 Customer St, Apt 4B, City, State 12345"
    }
  ],
  "success": true
}
```

Order #12 now appears in the available deliveries! ✅

## Files Modified

1. **frontend/src/app/pages/agent/AgentQueue.jsx**
   - Removed debug console.log statements
   - Removed unused imports

2. **scripts/check-order-status.ps1**
   - Fixed column name error
   - Added Kafka and Delivery Service status checks
   - Made order ID parameterizable
   - Improved troubleshooting guidance

## How to Prevent This Issue

### Always Ensure Services Are Running
```bash
# Check Docker containers
docker ps

# Required containers:
# - fooddelivery-mysql (healthy)
# - fooddelivery-kafka (healthy)
# - fooddelivery-zookeeper (healthy)

# Start missing containers
docker start fooddelivery-kafka
```

### Always Ensure Microservices Are Running
```bash
# Use the start-all script
.\scripts\start-all.bat

# Or start individually
cd delivery-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run
```

### Monitor Service Health
```bash
# Check Eureka Dashboard
http://localhost:8761

# All services should be registered:
# - API-GATEWAY
# - USER-SERVICE
# - RESTAURANT-SERVICE
# - ORDER-SERVICE
# - DELIVERY-SERVICE
# - PAYMENT-SERVICE
# - NOTIFICATION-SERVICE
```

## Event Flow (Normal Operation)

1. **Customer places order** → Order status: PENDING
2. **Owner confirms order** → Order status: CONFIRMED
3. **Owner marks ready** → Order status: READY_FOR_PICKUP
4. **Order Service publishes Kafka event** → Topic: order-events
5. **Delivery Service consumes event** → Creates delivery record
6. **Delivery record created** → Status: ASSIGNED, agent_id: NULL
7. **Agent sees in queue** → GET /api/deliveries/available

## Diagnostic Commands

### Check Order Status
```bash
.\scripts\check-order-status.ps1 [orderId]
```

### Check Kafka Events
```bash
docker exec -it fooddelivery-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic order-events --from-beginning
```

### Check Delivery Service Logs
```bash
# If running in Docker
docker logs delivery-service --tail 50

# If running with Maven
# Check the terminal window where mvn spring-boot:run is running
```

### Manually Create Delivery Record (Emergency)
```sql
-- Get order details
SELECT id, status, restaurant_id, customer_id, delivery_address, total_amount 
FROM order_db.orders 
WHERE id = [ORDER_ID];

-- Get restaurant address
SELECT id, name, address 
FROM restaurant_db.restaurants 
WHERE id = [RESTAURANT_ID];

-- Create delivery record
INSERT INTO delivery_db.deliveries (
    order_id, restaurant_id, customer_id, 
    pickup_address, delivery_address, 
    status, delivery_fee, created_at, updated_at
) VALUES (
    [ORDER_ID], [RESTAURANT_ID], [CUSTOMER_ID],
    '[RESTAURANT_ADDRESS]', '[DELIVERY_ADDRESS]',
    'ASSIGNED', 2.99, NOW(), NOW()
);
```

## Status: RESOLVED ✅

- Kafka is running
- Delivery Service is running
- Order #12 delivery record created
- Order #12 now appears in agent queue
- Debug code cleaned up
- Diagnostic script improved
