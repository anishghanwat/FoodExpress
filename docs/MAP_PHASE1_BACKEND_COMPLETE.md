# Map Integration - Phase 1 Backend Complete ✅

## 🎉 Overview

Phase 1 of the map integration is complete! The backend now supports location tracking for deliveries.

---

## ✅ What Was Implemented

### 1. Database Schema Updates
**File**: `sql/add-delivery-location-fields.sql`

Added location fields to `deliveries` table:
- `pickup_latitude` / `pickup_longitude` - Restaurant location
- `delivery_latitude` / `delivery_longitude` - Customer location  
- `agent_latitude` / `agent_longitude` - Agent's current location
- `estimated_distance_km` - Distance from agent to customer
- `estimated_time_minutes` - Estimated delivery time
- `last_location_update` - Timestamp of last location update

**Indexes added**:
- `idx_agent_location` - For location queries
- `idx_last_location_update` - For tracking updates

---

### 2. Entity Updates

**Delivery Entity** (`delivery-service/src/main/java/com/fooddelivery/delivery/entity/Delivery.java`):
- Added 9 new location-related fields
- All fields properly annotated with JPA

**DeliveryDTO** (`delivery-service/src/main/java/com/fooddelivery/delivery/dto/DeliveryDTO.java`):
- Added same location fields for API responses
- Includes distance and ETA calculations

**LocationUpdateRequest** (`delivery-service/src/main/java/com/fooddelivery/delivery/dto/LocationUpdateRequest.java`):
- New DTO for location update requests
- Contains latitude and longitude

---

### 3. Service Layer Updates

**DeliveryService** (`delivery-service/src/main/java/com/fooddelivery/delivery/service/DeliveryService.java`):

**New Methods**:
```java
// Update agent's current location
updateAgentLocation(Long deliveryId, Double latitude, Double longitude)

// Get delivery with all location data
getDeliveryWithLocation(Long deliveryId)

// Calculate distance between two points (Haversine formula)
calculateDistance(double lat1, double lon1, double lat2, double lon2)

// Calculate ETA based on distance (30 km/h average speed)
calculateETA(double distanceKm)
```

**Features**:
- Automatic distance calculation when location is updated
- Automatic ETA calculation
- Publishes location update events to Kafka
- Rounds distance to 2 decimal places

---

### 4. Kafka Integration

**KafkaTopicConfig** (`delivery-service/src/main/java/com/fooddelivery/delivery/config/KafkaTopicConfig.java`):
- Added new topic: `delivery-location-updated`
- 3 partitions, 1 replica

**DeliveryEventProducer** (`delivery-service/src/main/java/com/fooddelivery/delivery/producer/DeliveryEventProducer.java`):
- New method: `publishLocationUpdate(Delivery delivery)`
- Publishes to both specific topic and general events topic

**DeliveryEvent** (`delivery-service/src/main/java/com/fooddelivery/delivery/event/DeliveryEvent.java`):
- Added location fields:
  - `agentLatitude`
  - `agentLongitude`
  - `estimatedDistanceKm`
  - `estimatedTimeMinutes`

---

### 5. REST API Endpoints

**DeliveryController** (`delivery-service/src/main/java/com/fooddelivery/delivery/controller/DeliveryController.java`):

**New Endpoints**:

1. **Update Agent Location**
   ```
   POST /api/deliveries/{deliveryId}/location
   Headers: X-User-Id: {agentId}
   Body: {
     "latitude": 40.7128,
     "longitude": -74.0060
   }
   ```
   - Updates agent's current GPS coordinates
   - Calculates distance to customer
   - Calculates ETA
   - Publishes Kafka event
   - Returns updated delivery with distance/ETA

2. **Get Delivery with Location**
   ```
   GET /api/deliveries/{deliveryId}/location
   ```
   - Returns complete delivery info
   - Includes all location coordinates
   - Includes distance and ETA

---

## 🔧 Technical Details

### Distance Calculation (Haversine Formula)

```java
private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    final int R = 6371; // Earth's radius in kilometers
    
    double latDistance = Math.toRadians(lat2 - lat1);
    double lonDistance = Math.toRadians(lon2 - lon1);
    
    double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
            + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
            * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
    
    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    double distance = R * c;
    
    return Math.round(distance * 100.0) / 100.0; // Round to 2 decimal places
}
```

**Accuracy**: ±0.5% error (good enough for delivery tracking)

### ETA Calculation

```java
private int calculateETA(double distanceKm) {
    final double AVERAGE_SPEED_KMH = 30.0; // 30 km/h average
    double timeHours = distanceKm / AVERAGE_SPEED_KMH;
    int timeMinutes = (int) Math.ceil(timeHours * 60);
    return timeMinutes;
}
```

**Assumptions**:
- Average speed: 30 km/h (city driving)
- Rounds up to nearest minute
- Can be adjusted based on traffic, time of day, etc.

---

## 📊 Data Flow

### Location Update Flow

```
Agent App (Browser)
    ↓ Get GPS coordinates
navigator.geolocation.watchPosition()
    ↓ Every 30 seconds
POST /api/deliveries/{id}/location
    ↓
DeliveryController
    ↓
DeliveryService.updateAgentLocation()
    ↓ Calculate distance & ETA
    ↓ Save to database
    ↓ Publish Kafka event
delivery-location-updated topic
    ↓
Notification Service (will consume)
    ↓ Broadcast via WebSocket
Customer Browser
    ↓ Update map
Show agent's new position
```

---

## 🗄️ Database Migration

**Run this SQL script**:
```bash
mysql -u root -p < sql/add-delivery-location-fields.sql
```

**Or manually**:
```sql
USE delivery_db;

ALTER TABLE deliveries 
ADD COLUMN pickup_latitude DECIMAL(10, 8),
ADD COLUMN pickup_longitude DECIMAL(11, 8),
ADD COLUMN delivery_latitude DECIMAL(10, 8),
ADD COLUMN delivery_longitude DECIMAL(11, 8),
ADD COLUMN agent_latitude DECIMAL(10, 8),
ADD COLUMN agent_longitude DECIMAL(11, 8),
ADD COLUMN estimated_distance_km DECIMAL(5, 2),
ADD COLUMN estimated_time_minutes INT,
ADD COLUMN last_location_update TIMESTAMP NULL;

CREATE INDEX idx_agent_location ON deliveries(agent_latitude, agent_longitude);
CREATE INDEX idx_last_location_update ON deliveries(last_location_update);
```

---

## 🧪 Testing

### Manual API Testing

**1. Update Location**:
```bash
curl -X POST http://localhost:8080/api/deliveries/1/location \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 2" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderId": 5,
    "agentId": 2,
    "status": "IN_TRANSIT",
    "agentLatitude": 40.7128,
    "agentLongitude": -74.0060,
    "estimatedDistanceKm": 2.5,
    "estimatedTimeMinutes": 5,
    "lastLocationUpdate": "2026-02-18T16:30:00"
  },
  "message": "Location updated successfully"
}
```

**2. Get Delivery Location**:
```bash
curl http://localhost:8080/api/deliveries/1/location
```

---

## 📝 Files Modified

### Created:
1. `sql/add-delivery-location-fields.sql` - Database migration
2. `delivery-service/src/main/java/com/fooddelivery/delivery/dto/LocationUpdateRequest.java` - Location DTO

### Modified:
1. `delivery-service/src/main/java/com/fooddelivery/delivery/entity/Delivery.java` - Added location fields
2. `delivery-service/src/main/java/com/fooddelivery/delivery/dto/DeliveryDTO.java` - Added location fields
3. `delivery-service/src/main/java/com/fooddelivery/delivery/service/DeliveryService.java` - Added location methods
4. `delivery-service/src/main/java/com/fooddelivery/delivery/controller/DeliveryController.java` - Added location endpoints
5. `delivery-service/src/main/java/com/fooddelivery/delivery/producer/DeliveryEventProducer.java` - Added location event
6. `delivery-service/src/main/java/com/fooddelivery/delivery/event/DeliveryEvent.java` - Added location fields
7. `delivery-service/src/main/java/com/fooddelivery/delivery/config/KafkaTopicConfig.java` - Added location topic

---

## ✅ Success Criteria

- [x] Database schema updated with location fields
- [x] Entity and DTO updated
- [x] Location update endpoint created
- [x] Distance calculation implemented (Haversine)
- [x] ETA calculation implemented
- [x] Kafka event publishing working
- [x] API endpoints tested
- [x] Documentation complete

---

## 🚀 Next Steps

### Phase 2: Frontend - Basic Map Setup (Next)
1. Install React Leaflet
2. Create base map component
3. Create custom markers
4. Add map styles

### Phase 3: Customer Order Tracking Map
1. Create OrderTrackingMap component
2. Integrate with OrderTracking page
3. Real-time location updates via WebSocket
4. Show distance and ETA

### Phase 4: Agent Delivery Map
1. Create AgentDeliveryMap component
2. Integrate with AgentActive page
3. Add "Share My Location" feature
4. Use browser GPS tracking

---

## 📚 API Documentation

### POST /api/deliveries/{deliveryId}/location

**Description**: Update agent's current GPS location

**Headers**:
- `X-User-Id`: Agent ID (required)
- `Content-Type`: application/json

**Request Body**:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderId": 5,
    "agentId": 2,
    "status": "IN_TRANSIT",
    "pickupAddress": "123 Restaurant St",
    "deliveryAddress": "456 Customer Ave",
    "agentLatitude": 40.7128,
    "agentLongitude": -74.0060,
    "estimatedDistanceKm": 2.5,
    "estimatedTimeMinutes": 5,
    "lastLocationUpdate": "2026-02-18T16:30:00"
  },
  "message": "Location updated successfully",
  "timestamp": "2026-02-18T16:30:00"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "data": null,
  "message": "Delivery not found with id: 1",
  "timestamp": "2026-02-18T16:30:00"
}
```

---

### GET /api/deliveries/{deliveryId}/location

**Description**: Get delivery with all location data

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderId": 5,
    "agentId": 2,
    "status": "IN_TRANSIT",
    "pickupLatitude": 40.7589,
    "pickupLongitude": -73.9851,
    "deliveryLatitude": 40.7614,
    "deliveryLongitude": -73.9776,
    "agentLatitude": 40.7128,
    "agentLongitude": -74.0060,
    "estimatedDistanceKm": 2.5,
    "estimatedTimeMinutes": 5,
    "lastLocationUpdate": "2026-02-18T16:30:00"
  },
  "message": "Delivery location retrieved successfully",
  "timestamp": "2026-02-18T16:30:00"
}
```

---

## 🎉 Phase 1 Complete!

Backend location tracking is fully implemented and ready for frontend integration!

**Status**: ✅ COMPLETE  
**Next**: Phase 2 - Frontend Basic Map Setup  
**Estimated Time for Phase 2**: 1 hour

---

**Implemented By**: Kiro AI Assistant  
**Date**: February 18, 2026  
**Version**: 1.0.0
