# Map Location Endpoint - Fix Instructions

## ✅ Build Complete!

The delivery service has been rebuilt successfully with the location endpoint code.

**JAR Location**: `delivery-service\target\delivery-service-1.0.0.jar`

---

## 🔧 Next Steps (Manual)

### Step 1: Stop the Current Delivery Service

Find the terminal/command prompt window that's running the delivery service and press `Ctrl+C` to stop it.

Look for a window showing logs like:
```
Started DeliveryServiceApplication in X.XXX seconds
```

### Step 2: Start the New Delivery Service

In PowerShell or Command Prompt, run:

```bash
java -jar delivery-service\target\delivery-service-1.0.0.jar
```

You should see output like:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.3.7)

...
Started DeliveryServiceApplication in X.XXX seconds
```

### Step 3: Wait for Service Registration

Wait 30 seconds for the service to register with Eureka Server.

You can verify registration at: http://localhost:8761

Look for `DELIVERY-SERVICE` in the list of registered applications.

### Step 4: Test the Fix

Refresh your frontend page (the order tracking page with the map).

The 404 errors should be gone and the map should load correctly.

---

## ✅ Verification

After restarting, check the browser console. You should see:

**Before (404 errors):**
```
❌ Error: 404 /api/deliveries/12/location
Error loading delivery location: AxiosError: Request failed with status code 404
```

**After (working):**
```
✅ Response: /api/deliveries/12/location
{success: true, data: {...}, message: 'Delivery location retrieved successfully'}
```

---

## 🧪 Test the Endpoint

Run this PowerShell script to verify:
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

## 🗺️ Using the Map Features

### For Customers (Order Tracking)

1. Place an order
2. Wait for owner to mark it ready
3. Wait for agent to accept
4. Go to "Track Order" page
5. You'll see the map with:
   - Restaurant location (pickup)
   - Your delivery location
   - Agent's real-time location (when they share it)

### For Agents (Active Deliveries)

1. Accept a delivery from the queue
2. Go to "Active Deliveries"
3. Click "Show Map" on a delivery
4. Click "Share Location" button
5. Allow browser location access
6. Your location will update automatically
7. Customer will see your location in real-time

---

## 🐛 Troubleshooting

### Issue: Still getting 404 errors

**Solution 1**: Check if service is running
```bash
curl http://localhost:8084/actuator/health
```

**Solution 2**: Check Eureka registration
- Open http://localhost:8761
- Look for DELIVERY-SERVICE
- If not there, wait 30 more seconds

**Solution 3**: Check the JAR name
Make sure you're running the correct JAR:
```bash
java -jar delivery-service\target\delivery-service-1.0.0.jar
```
(Not 0.0.1-SNAPSHOT)

### Issue: Map shows but no location data

This is normal! Location data is only available when:
1. Agent accepts the delivery
2. Agent clicks "Share Location"
3. Agent allows browser GPS access
4. GPS gets a position fix

The map will show "No location data yet" until the agent shares their location.

### Issue: "Unable to access jarfile"

**Cause**: JAR file doesn't exist or wrong path

**Solution**: Build the service first
```bash
cd delivery-service
mvn clean package -DskipTests
cd ..
```

Then run with correct path:
```bash
java -jar delivery-service\target\delivery-service-1.0.0.jar
```

---

## 📊 What Changed

### New Endpoint Added
```java
@GetMapping("/{deliveryId}/location")
public ResponseEntity<Map<String, Object>> getDeliveryWithLocation(@PathVariable Long deliveryId)
```

This endpoint returns delivery information including:
- Pickup location (lat/lng)
- Delivery location (lat/lng)
- Agent's current location (lat/lng)
- Distance to destination
- Estimated time of arrival
- Last location update timestamp

### Database Schema
The following columns were added to the `deliveries` table:
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

## 🎯 Success Criteria

After the fix, you should have:

- [x] Delivery service rebuilt
- [ ] Delivery service restarted
- [ ] Service registered with Eureka (wait 30s)
- [ ] No 404 errors in browser console
- [ ] Map component loads on order tracking page
- [ ] Location endpoint returns data (even if null)
- [ ] Agent can share location
- [ ] Customer can see agent location

---

## 📞 Need Help?

If you're still having issues:

1. Check all services are running:
   - Eureka Server (8761)
   - API Gateway (8080)
   - Delivery Service (8084)

2. Check the logs:
   - Delivery service terminal for errors
   - Browser console for frontend errors

3. Run diagnostics:
   ```bash
   powershell -ExecutionPolicy Bypass -File scripts\diagnose-map-issue.ps1
   ```

---

**Status**: Build complete, ready to restart  
**Next**: Stop old service, start new service  
**Time**: 2 minutes

