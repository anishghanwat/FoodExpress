# Map Location 404 Error - Quick Fix

## Problem
Frontend getting 404 error: `GET /api/deliveries/12/location`

## Diagnosis Complete
✅ Delivery service is running  
✅ API Gateway is running  
❌ Endpoint returns 404

## Root Cause
The delivery service needs to be restarted to load the location endpoint code.

## Quick Fix (2 minutes)

### Step 1: Stop Delivery Service
In the terminal running delivery service, press `Ctrl+C`

### Step 2: Restart Delivery Service
```bash
java -jar delivery-service\target\delivery-service-0.0.1-SNAPSHOT.jar
```

### Step 3: Wait for Registration
Wait 30 seconds for the service to register with Eureka.

### Step 4: Test
Refresh the frontend page and check if the map loads.

## Alternative: Rebuild First (if restart doesn't work)

If simple restart doesn't work, rebuild:

```bash
cd delivery-service
mvn clean package -DskipTests
cd ..
java -jar delivery-service\target\delivery-service-0.0.1-SNAPSHOT.jar
```

## Verify It Works

After restart, the console errors should stop and you should see:
- ✅ No more 404 errors in browser console
- ✅ Map component loads
- ✅ Location data fetches successfully (even if null)

## Why This Happens

The endpoint code exists in `DeliveryController.java`:
```java
@GetMapping("/{deliveryId}/location")
public ResponseEntity<Map<String, Object>> getDeliveryWithLocation(@PathVariable Long deliveryId)
```

But the running service doesn't have this code loaded yet. A restart loads the latest code.

## Next Steps

Once the endpoint works:
1. Agent can share location
2. Customer can see agent on map
3. Real-time tracking works

---

**Estimated Time**: 2 minutes  
**Difficulty**: Easy  
**Status**: Ready to fix
