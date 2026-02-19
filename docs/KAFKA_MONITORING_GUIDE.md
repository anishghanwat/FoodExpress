# Kafka Monitoring Guide

## How to See Kafka Running

### 1. Kafka UI (Recommended - Visual Interface)

**URL:** http://localhost:8090

This provides a web-based interface where you can:
- ✅ View all Kafka topics
- ✅ Browse messages in each topic in real-time
- ✅ Monitor consumer groups
- ✅ Check broker health and performance
- ✅ View topic configurations and partitions
- ✅ Search and filter messages

**Topics Created by Order Service:**
- `order-events` - All order events (centralized)
- `order-created` - New order events
- `order-confirmed` - Restaurant confirmed orders
- `order-preparing` - Orders being prepared
- `order-ready-for-pickup` - Orders ready for delivery
- `order-out-for-delivery` - Orders out for delivery
- `order-delivered` - Completed deliveries
- `order-cancelled` - Cancelled orders

### 2. Docker Commands

**Check Kafka container status:**
```bash
docker ps --filter "name=kafka"
```

**View Kafka logs:**
```bash
docker logs fooddelivery-kafka --tail 100
```

**View Kafka UI logs:**
```bash
docker logs fooddelivery-kafka-ui --tail 50
```

**Follow Kafka logs in real-time:**
```bash
docker logs -f fooddelivery-kafka
```

### 3. Check Topics via Command Line

**List all topics:**
```bash
docker exec fooddelivery-kafka kafka-topics --bootstrap-server localhost:9092 --list
```

**Describe a specific topic:**
```bash
docker exec fooddelivery-kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic order-events
```

**Consume messages from a topic:**
```bash
docker exec fooddelivery-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic order-events --from-beginning
```

### 4. Test Kafka Integration

**Step 1:** Start the order-service
```bash
cd order-service
java -jar target/order-service-1.0.0.jar
```

**Step 2:** Place an order through the frontend or API

**Step 3:** Check Kafka UI at http://localhost:8090
- Navigate to Topics
- Click on `order-created` or `order-events`
- View the messages tab to see the published events

**Step 4:** Check order-service logs for Kafka publishing messages:
```
✅ Published ORDER_CREATED to topic 'order-created' | Order: 123 | Partition: 0
✅ Published ORDER_CREATED to topic 'order-events' | Order: 123 | Partition: 1
```

## Event Flow

```
Customer Places Order
    ↓
Order Service creates order in DB
    ↓
Order Service publishes to Kafka:
    - order-created topic
    - order-events topic
    ↓
[Future] Consumers react:
    - Notification Service → Send email/SMS
    - Delivery Service → Show in agent queue
    - Analytics Service → Track metrics
```

## Troubleshooting

**Kafka not starting:**
```bash
# Check if Zookeeper is running first
docker ps --filter "name=zookeeper"

# Restart Kafka
docker restart fooddelivery-kafka
```

**Can't access Kafka UI:**
```bash
# Check if UI is running
docker ps --filter "name=kafka-ui"

# Restart UI
docker restart fooddelivery-kafka-ui
```

**Topics not created:**
- Topics are auto-created when order-service starts
- Check order-service logs for errors
- Verify Kafka connection in order-service/src/main/resources/application.yml

## Next Steps

After verifying Kafka is working:
1. ✅ Order Service publishes events (COMPLETED)
2. ⏳ Add Kafka consumers to Delivery Service
3. ⏳ Add Kafka consumers to Notification Service
4. ⏳ Add Kafka consumers to Payment Service
5. ⏳ Implement real-time notifications to frontend via WebSocket
