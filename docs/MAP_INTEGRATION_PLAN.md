# Map Integration - Implementation Plan 🗺️

## 🎯 Overview

Add visual map tracking to the food delivery platform using **React Leaflet** (open-source, no API key required) or **Google Maps** (requires API key but more features).

**Recommendation**: Start with React Leaflet (free, no limits) and can upgrade to Google Maps later if needed.

---

## 📋 What We'll Build

### 1. Customer Order Tracking Map
- Show restaurant location (pickup point)
- Show customer delivery location
- Show agent's current location (real-time)
- Draw route between points
- Display estimated delivery time
- Auto-update agent position

### 2. Agent Active Delivery Map
- Show current delivery route
- Show pickup and delivery locations
- Navigation assistance
- Distance to destination
- Optimal route suggestion

### 3. Restaurant Location Display
- Show restaurant on map in restaurant detail page
- Show delivery radius
- Help customers see if restaurant delivers to them

---

## 🏗️ Architecture

### Backend Changes (Delivery Service)

#### 1. Add Location Fields to Delivery Entity
```java
// delivery-service/src/main/java/com/fooddelivery/delivery/entity/Delivery.java
@Column(name = "pickup_latitude")
private Double pickupLatitude;

@Column(name = "pickup_longitude")
private Double pickupLongitude;

@Column(name = "delivery_latitude")
private Double deliveryLatitude;

@Column(name = "delivery_longitude")
private Double deliveryLongitude;

@Column(name = "agent_latitude")
private Double agentLatitude;

@Column(name = "agent_longitude")
private Double agentLongitude;

@Column(name = "estimated_distance_km")
private Double estimatedDistanceKm;

@Column(name = "estimated_time_minutes")
private Integer estimatedTimeMinutes;
```

#### 2. Location Update Endpoint
```java
// POST /api/deliveries/{id}/location
// Update agent's current location
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

#### 3. Get Delivery with Location
```java
// GET /api/deliveries/{id}/location
// Returns full delivery info with all coordinates
```

#### 4. WebSocket Location Updates
```java
// Publish location updates via WebSocket
// Topic: /topic/delivery/{deliveryId}/location
```

---

### Frontend Changes

#### 1. Install Dependencies
```bash
npm install react-leaflet leaflet
# OR for Google Maps
npm install @react-google-maps/api
```

#### 2. Components to Create

**Core Map Components**:
```
frontend/src/app/components/map/
├── DeliveryMap.jsx           - Main map component
├── MapMarker.jsx             - Custom markers
├── RoutePolyline.jsx         - Route line between points
├── LocationTracker.jsx       - Track agent location
└── MapControls.jsx           - Zoom, center controls
```

**Integration Components**:
```
frontend/src/app/components/
├── OrderTrackingMap.jsx      - Map for customer order tracking
└── AgentDeliveryMap.jsx      - Map for agent active deliveries
```

#### 3. Services to Create
```
frontend/src/app/services/
├── locationService.js        - Location tracking & updates
└── mapService.js             - Map utilities (distance, ETA)
```

#### 4. Utils to Create
```
frontend/src/app/utils/
└── mapHelpers.js             - Distance calculation, geocoding
```

---

## 📝 Implementation Phases

### Phase 1: Backend - Location Storage (1 hour)

**Step 1.1**: Update Delivery Entity
- Add latitude/longitude fields
- Add distance and ETA fields
- Update DTOs

**Step 1.2**: Database Migration
```sql
ALTER TABLE deliveries 
ADD COLUMN pickup_latitude DECIMAL(10, 8),
ADD COLUMN pickup_longitude DECIMAL(11, 8),
ADD COLUMN delivery_latitude DECIMAL(10, 8),
ADD COLUMN delivery_longitude DECIMAL(11, 8),
ADD COLUMN agent_latitude DECIMAL(10, 8),
ADD COLUMN agent_longitude DECIMAL(11, 8),
ADD COLUMN estimated_distance_km DECIMAL(5, 2),
ADD COLUMN estimated_time_minutes INT;
```

**Step 1.3**: Location Update Endpoint
- Create LocationUpdateRequest DTO
- Add updateLocation method in DeliveryService
- Add endpoint in DeliveryController
- Publish location update event to Kafka

**Step 1.4**: WebSocket Location Broadcasting
- Update WebSocketNotificationService
- Broadcast location updates to subscribers
- Add location update event type

---

### Phase 2: Frontend - Basic Map Setup (1 hour)

**Step 2.1**: Install React Leaflet
```bash
cd frontend
npm install react-leaflet leaflet
```

**Step 2.2**: Create Base Map Component
```jsx
// components/map/DeliveryMap.jsx
- Initialize Leaflet map
- Set default center and zoom
- Add tile layer (OpenStreetMap)
- Handle map interactions
```

**Step 2.3**: Create Marker Components
```jsx
// components/map/MapMarker.jsx
- Restaurant marker (orange)
- Customer marker (green)
- Agent marker (blue, animated)
- Custom icons for each type
```

**Step 2.4**: Add Map Styles
```css
// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
```

---

### Phase 3: Customer Order Tracking Map (1.5 hours)

**Step 3.1**: Create OrderTrackingMap Component
```jsx
// components/OrderTrackingMap.jsx
- Show restaurant location (fixed)
- Show customer location (fixed)
- Show agent location (real-time)
- Draw route line
- Auto-center on agent
- Show distance and ETA
```

**Step 3.2**: Integrate with Order Tracking Page
```jsx
// pages/OrderTracking.jsx
- Add map above order details
- Subscribe to location updates via WebSocket
- Update agent marker position in real-time
- Show "Agent is X km away"
```

**Step 3.3**: Real-time Location Updates
```javascript
// services/locationService.js
- Subscribe to WebSocket location updates
- Update map markers
- Calculate distance from agent to customer
- Estimate time of arrival
```

---

### Phase 4: Agent Delivery Map (1 hour)

**Step 4.1**: Create AgentDeliveryMap Component
```jsx
// components/AgentDeliveryMap.jsx
- Show pickup location
- Show delivery location
- Show agent's current location
- Draw route
- Show distance to next point
```

**Step 4.2**: Integrate with Agent Active Page
```jsx
// pages/agent/AgentActive.jsx
- Add map to each delivery card
- Show mini-map or full-screen option
- Update agent location button
- "Share My Location" toggle
```

**Step 4.3**: Location Tracking
```javascript
// Use browser Geolocation API
navigator.geolocation.watchPosition()
- Get agent's GPS coordinates
- Send to backend every 30 seconds
- Update map in real-time
```

---

### Phase 5: Restaurant Location Display (30 minutes)

**Step 5.1**: Add Map to Restaurant Detail
```jsx
// pages/RestaurantDetail.jsx
- Show restaurant location on map
- Show delivery radius circle
- Static map (no real-time updates)
```

**Step 5.2**: Add Map to Restaurant Cards (Optional)
```jsx
// components/RestaurantCard.jsx
- Small map thumbnail
- Click to view full map
```

---

## 🎨 UI/UX Design

### Map Features

**Customer View (Order Tracking)**:
```
┌─────────────────────────────────┐
│  🗺️ Track Your Delivery         │
├─────────────────────────────────┤
│                                 │
│    🏪 Restaurant                │
│      ↓                          │
│      📍 Agent (moving)          │
│      ↓                          │
│    🏠 Your Location             │
│                                 │
├─────────────────────────────────┤
│ Agent is 2.5 km away            │
│ Estimated arrival: 8 minutes    │
└─────────────────────────────────┘
```

**Agent View (Active Delivery)**:
```
┌─────────────────────────────────┐
│  🗺️ Delivery Route              │
├─────────────────────────────────┤
│                                 │
│    📍 You are here              │
│      ↓ 1.2 km                   │
│    🏠 Customer                  │
│                                 │
├─────────────────────────────────┤
│ Distance: 1.2 km                │
│ ETA: 5 minutes                  │
│ [Share My Location] ✓           │
└─────────────────────────────────┘
```

### Map Markers

**Icons**:
- 🏪 Restaurant: Orange marker with restaurant icon
- 🏠 Customer: Green marker with home icon
- 📍 Agent: Blue marker with person icon (animated pulse)
- 🚗 Route: Dashed blue line

**Colors**:
- Restaurant: `#FF6B35` (orange)
- Customer: `#10B981` (green)
- Agent: `#3B82F6` (blue)
- Route: `#3B82F6` (blue, dashed)

---

## 🔧 Technical Implementation

### React Leaflet Setup

**1. Basic Map Component**:
```jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function DeliveryMap({ 
  restaurantLocation, 
  customerLocation, 
  agentLocation 
}) {
  const center = [agentLocation.lat, agentLocation.lng];
  
  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {/* Restaurant Marker */}
      <Marker position={[restaurantLocation.lat, restaurantLocation.lng]}>
        <Popup>Restaurant</Popup>
      </Marker>
      
      {/* Customer Marker */}
      <Marker position={[customerLocation.lat, customerLocation.lng]}>
        <Popup>Delivery Location</Popup>
      </Marker>
      
      {/* Agent Marker */}
      <Marker position={[agentLocation.lat, agentLocation.lng]}>
        <Popup>Delivery Agent</Popup>
      </Marker>
      
      {/* Route Line */}
      <Polyline 
        positions={[
          [restaurantLocation.lat, restaurantLocation.lng],
          [agentLocation.lat, agentLocation.lng],
          [customerLocation.lat, customerLocation.lng]
        ]}
        color="#3B82F6"
        dashArray="5, 10"
      />
    </MapContainer>
  );
}
```

**2. Custom Markers**:
```javascript
const restaurantIcon = new L.Icon({
  iconUrl: '/icons/restaurant-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const agentIcon = new L.Icon({
  iconUrl: '/icons/agent-marker.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'agent-marker-pulse' // Add CSS animation
});
```

**3. Distance Calculation**:
```javascript
// utils/mapHelpers.js
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
```

**4. ETA Calculation**:
```javascript
export function calculateETA(distanceKm, avgSpeedKmh = 30) {
  const timeHours = distanceKm / avgSpeedKmh;
  const timeMinutes = Math.round(timeHours * 60);
  return timeMinutes;
}
```

---

## 📊 Data Flow

### Location Update Flow

```
Agent App (Browser)
    ↓ (Get GPS coordinates)
navigator.geolocation.watchPosition()
    ↓ (Every 30 seconds)
POST /api/deliveries/{id}/location
    ↓
Delivery Service
    ↓ (Save to database)
    ↓ (Publish event)
Kafka: delivery-location-updated
    ↓
Notification Service
    ↓ (Consume event)
    ↓ (Broadcast via WebSocket)
WebSocket: /topic/delivery/{id}/location
    ↓
Customer Browser
    ↓ (Update map)
Update agent marker position
```

---

## 🗄️ Database Schema

```sql
-- Add to deliveries table
ALTER TABLE deliveries 
ADD COLUMN pickup_latitude DECIMAL(10, 8),
ADD COLUMN pickup_longitude DECIMAL(11, 8),
ADD COLUMN delivery_latitude DECIMAL(10, 8),
ADD COLUMN delivery_longitude DECIMAL(11, 8),
ADD COLUMN agent_latitude DECIMAL(10, 8),
ADD COLUMN agent_longitude DECIMAL(11, 8),
ADD COLUMN estimated_distance_km DECIMAL(5, 2),
ADD COLUMN estimated_time_minutes INT,
ADD COLUMN last_location_update TIMESTAMP;

-- Add to restaurants table (if not exists)
ALTER TABLE restaurants
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN delivery_radius_km DECIMAL(5, 2) DEFAULT 5.0;

-- Add to users table (for customer addresses)
ALTER TABLE users
ADD COLUMN default_latitude DECIMAL(10, 8),
ADD COLUMN default_longitude DECIMAL(11, 8);
```

---

## 🧪 Testing Plan

### Manual Testing

**1. Customer Order Tracking**:
- [ ] Map loads correctly
- [ ] Restaurant marker shows
- [ ] Customer marker shows
- [ ] Agent marker shows
- [ ] Route line displays
- [ ] Agent marker updates in real-time
- [ ] Distance calculates correctly
- [ ] ETA displays correctly
- [ ] Map auto-centers on agent

**2. Agent Active Delivery**:
- [ ] Map shows on active delivery card
- [ ] Agent can share location
- [ ] Location updates every 30 seconds
- [ ] Distance to destination shows
- [ ] Route displays correctly

**3. Restaurant Location**:
- [ ] Map shows on restaurant detail
- [ ] Restaurant marker displays
- [ ] Delivery radius circle shows

### Automated Testing
```bash
# Test location update endpoint
scripts/test-location-updates.ps1

# Test WebSocket location broadcasting
scripts/test-location-websocket.ps1
```

---

## 📦 Dependencies

### Backend
```xml
<!-- No new dependencies needed -->
<!-- Using existing WebSocket and Kafka setup -->
```

### Frontend
```json
{
  "dependencies": {
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4"
  }
}
```

---

## 🚀 Implementation Order

### Day 1 (2-3 hours)
1. ✅ Backend: Add location fields to Delivery entity
2. ✅ Backend: Create location update endpoint
3. ✅ Backend: Add WebSocket location broadcasting
4. ✅ Database: Run migration script
5. ✅ Frontend: Install React Leaflet
6. ✅ Frontend: Create base DeliveryMap component

### Day 2 (2-3 hours)
7. ✅ Frontend: Create OrderTrackingMap component
8. ✅ Frontend: Integrate with OrderTracking page
9. ✅ Frontend: Add real-time location updates
10. ✅ Frontend: Create AgentDeliveryMap component
11. ✅ Frontend: Integrate with AgentActive page
12. ✅ Frontend: Add location tracking for agents

### Day 3 (1 hour)
13. ✅ Frontend: Add map to RestaurantDetail page
14. ✅ Testing: Manual testing all features
15. ✅ Documentation: Update docs
16. ✅ Polish: UI/UX improvements

**Total Estimated Time**: 5-6 hours

---

## 🎯 Success Criteria

### Functional Requirements
- [ ] Customer can see delivery on map
- [ ] Agent location updates in real-time
- [ ] Distance and ETA calculate correctly
- [ ] Agent can share location
- [ ] Restaurant location displays
- [ ] Route line shows between points
- [ ] Map auto-centers on agent

### Non-Functional Requirements
- [ ] Map loads in < 2 seconds
- [ ] Location updates every 30 seconds
- [ ] Smooth marker animations
- [ ] Responsive on mobile
- [ ] Works offline (cached tiles)
- [ ] No API rate limits (using OpenStreetMap)

---

## 🔮 Future Enhancements

### Phase 2 (Later)
- [ ] Upgrade to Google Maps for better features
- [ ] Turn-by-turn navigation for agents
- [ ] Traffic-aware routing
- [ ] Multiple delivery batching
- [ ] Geofencing (auto-update status when near location)
- [ ] Historical route replay
- [ ] Heatmap of popular delivery areas

---

## 📚 Resources

### React Leaflet
- Docs: https://react-leaflet.js.org/
- Examples: https://react-leaflet.js.org/docs/example-popup-marker/
- Leaflet: https://leafletjs.com/

### OpenStreetMap
- Tiles: https://wiki.openstreetmap.org/wiki/Tile_servers
- Free to use, no API key required

### Alternative: Google Maps
- Docs: https://developers.google.com/maps/documentation/javascript
- Requires API key (free tier: 28,000 map loads/month)
- Better features but costs money at scale

---

## 💡 Key Decisions

### Why React Leaflet?
✅ Free and open-source
✅ No API key required
✅ No usage limits
✅ Good performance
✅ Easy to customize
✅ Large community

### Why Not Google Maps?
❌ Requires API key
❌ Costs money after free tier
❌ Usage limits
✅ Better features (traffic, places, etc.)
✅ More accurate
✅ Better mobile experience

**Decision**: Start with React Leaflet, can upgrade to Google Maps later if needed.

---

## 🎉 Expected Outcome

After implementation, users will have:

**Customers**:
- Visual tracking of their delivery
- See agent's real-time location
- Know exactly when food will arrive
- Professional, modern experience

**Agents**:
- See delivery route on map
- Know distance to destination
- Share location with customers
- Better navigation

**Platform**:
- More professional appearance
- Better user engagement
- Competitive feature
- Foundation for advanced features

---

**Ready to start?** Let's begin with Phase 1: Backend Location Storage! 🚀
