# Map Location Endpoint - 404 Error Fix

## 🐛 Problem

The frontend is getting 404 errors when calling:
```
GET http://localhost:8080/api/deliveries/12/location
```

Error in console:
```
❌ Error: 404 /api/deliveries/12/location
Error loading delivery location: AxiosError: Request failed with status code 404
```

---

## 🔍 Root Cause

The endpoint exists in the code but may not be working due to:

1. **Database migration not applied** - Location columns don't exist in database
2. **Delivery service needs restart** - Code changes not loaded
3. **Service not registered** - API Gateway can't route to delivery service
4. **Delivery doesn't exist** - No delivery with ID 12 in database

---

## ✅ Solution

### Step 1: Diagnose the Issue

Run the diagnostic script:
```bash
powershell -ExecutionPolicy Bypass -File scripts\diagnose-map-issue.ps1
```

This will check:
- Is delivery service running?
- Is API Gateway running?
- Is database migration applied?
- Does the endpoint respond?

---

### Step 2: Apply Database Migration

If the migration wasn't applied, run:

```bash
mysql -u root -proot < sql\add-delivery-location-fields.sql
```

Or use the fix script:
```bash
scripts\fix-map-location-endpoint.bat
```

This adds these columns to the `deliveries` table:
- `pickup_latitude`
- `pickup_longitude`
- `delivery_latitude`
- `delivery_longitude`
- `agent_latitude`
- `agent_longitude`
- `estimated_distance_km`
- `estimated_time_minutes`
- `last_location_update`

---

### Step 3: Rebuild Delivery Service

```bash
cd delivery-service
mvn clean package -DskipTests
cd ..
```

---

### Step 4: Restart Delivery Service

1. **Stop** the delivery service (Ctrl+C in its terminal)

2. **Start** it again:
```bash
java -jar delivery-service\target\delivery-service-0.0.1-SNAPSHOT.jar
```

3. **Wait** 30 seconds for service registration with Eureka

---

### Step 5: Verify the Fix

Run the test script:
```bash
powershell -ExecutionPolicy Bypass -File scripts\test-map-location-endpoint.ps1
```

Expected output:
```
✓ Login successful!
✓ Endpoint working!
✓ Agent location found: (or warning if not set yet)
```

---

## 🧪 Manual Testing

### Test with cURL

```bash
# Get auth token first
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"customer@test.com\",\"password\":\"Password@123\"}"

# Use the token to test endpoint
curl -X GET http://localhost:8080/api/deliveries/12/location \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "X-User-Id: 6"
```

### Test in Browser Console

```javascript
// In browser console on the app
const response = await fetch('http://localhost:8080/api/deliveries/12/location', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'X-User-Id': localStorage.getItem('userId')
  }
});
const data = await response.json();
console.log(data);
```

---

## 📊 Expected Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 12,
    "orderId": 15,
    "agentId": 7,
    "status": "IN_TRANSIT",
    "pickupAddress": "123 Restaurant St",
    "deliveryAddress": "456 Customer Ave",
    "pickupLatitude": 40.7128,
    "pickupLongitude": -74.0060,
    "deliveryLatitude": 40.7589,
    "deliveryLongitude": -73.9851,
    "agentLatitude": 40.7350,
    "agentLongitude": -73.9950,
    "estimatedDistanceKm": 2.5,
    "estimatedTimeMinutes": 5,
    "lastLocationUpdate": "2026-02-18T16:35:00"
  },
  "message": "Delivery location retrieved successfully",
  "timestamp": "2026-02-18T16:35:06"
}
```

### No Location Data Yet

```json
{
  "success": true,
  "data": {
    "id": 12,
    "orderId": 15,
    "agentId": 7,
    "status": "ASSIGNED",
    "pickupAddress": "123 Restaurant St",
    "deliveryAddress": "456 Customer Ave",
    "pickupLatitude": null,
    "pickupLongitude": null,
    "deliveryLatitude": null,
    "deliveryLongitude": null,
    "agentLatitude": null,
    "agentLongitude": null,
    "estimatedDistanceKm": null,
    "estimatedTimeMinutes": null,
    "lastLocationUpdate": null
  },
  "message": "Delivery location retrieved successfully",
  "timestamp": "2026-02-18T16:35:06"
}
```

This is normal if the agent hasn't shared their location yet.

---

## 🔧 Troubleshooting

### Issue: Still getting 404 after restart

**Check service registration:**
```bash
# Check Eureka dashboard
http://localhost:8761
```

Look for `DELIVERY-SERVICE` in the registered instances.

**Solution:** Wait 30-60 seconds for service to register, then try again.

---

### Issue: Database migration fails

**Error:** `Column already exists`

**Solution:** Migration was already applied. Skip to Step 3 (rebuild).

---

### Issue: Delivery ID 12 doesn't exist

**Check database:**
```sql
USE delivery_db;
SELECT * FROM deliveries;
```

**Solution:** Use an existing delivery ID from the query results.

---

### Issue: Location data is null

**This is normal!** Location data is only populated when:
1. Agent accepts the delivery
2. Agent clicks "Share Location" in the app
3. Agent's GPS updates their position

**To populate location data:**
1. Login as agent
2. Go to Active Deliveries
3. Click "Show Map"
4. Click "Share Location"
5. Allow browser location access
6. Wait a few seconds for GPS update

---

## 🎯 Quick Fix (All-in-One)

If you just want to fix it quickly:

```bash
# Run this one command
scripts\fix-map-location-endpoint.bat
```

Then:
1. Stop delivery service (Ctrl+C)
2. Start delivery service again
3. Wait 30 seconds
4. Refresh the frontend page

---

## 📝 Files Involved

### Backend
- `delivery-service/src/main/java/com/fooddelivery/delivery/controller/DeliveryController.java`
  - Contains `GET /{deliveryId}/location` endpoint
- `delivery-service/src/main/java/com/fooddelivery/delivery/service/DeliveryService.java`
  - Contains `getDeliveryWithLocation()` method
- `sql/add-delivery-location-fields.sql`
  - Database migration script

### Frontend
- `frontend/src/app/components/OrderTrackingMap.jsx`
  - Calls the location endpoint
- `frontend/src/app/services/locationService.js`
  - Contains `getDeliveryLocation()` method

---

## ✅ Verification Checklist

After applying the fix, verify:

- [ ] Database has location columns
- [ ] Delivery service is running
- [ ] API Gateway is running
- [ ] Endpoint returns 200 (not 404)
- [ ] Response has location fields (even if null)
- [ ] Frontend map loads without errors
- [ ] Agent can share location
- [ ] Customer can see agent location

---

## 🚀 Next Steps

Once the endpoint is working:

1. **Test the full flow:**
   - Customer places order
   - Owner marks ready
   - Agent accepts delivery
   - Agent shares location
   - Customer sees map with agent location

2. **Verify real-time updates:**
   - Agent location updates every 5-10 seconds
   - Customer map refreshes every 15 seconds
   - Distance and ETA calculate correctly

3. **Test on mobile:**
   - GPS tracking works on mobile devices
   - Map is responsive
   - Location sharing works

---

## 📞 Still Having Issues?

If the endpoint still doesn't work after following all steps:

1. Check all services are running:
   - Eureka Server (8761)
   - API Gateway (8080)
   - Delivery Service (8084)
   - MySQL (3306)

2. Check logs:
   - Delivery service logs for errors
   - API Gateway logs for routing issues
   - Browser console for frontend errors

3. Verify database:
   - Columns exist
   - Delivery records exist
   - No database connection errors

4. Try a different delivery ID:
   - Query database for existing IDs
   - Use an ID that definitely exists

---

**Status**: Ready to fix  
**Estimated Time**: 5-10 minutes  
**Difficulty**: Easy

