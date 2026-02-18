# Agent Delivery Flow - Manual Testing Guide

## 🎯 Quick Manual Test (5 Minutes)

This guide walks you through testing the complete agent delivery flow manually in the browser.

---

## Prerequisites

1. All services running (`scripts\start-all.bat`)
2. Frontend running (`cd frontend && npm run dev`)
3. Demo users created (customer, owner, agent)

---

## Test Steps

### 1️⃣ Customer: Place Order

**Login**: http://localhost:5173/login
- Email: `customer@test.com`
- Password: `Password@123`

**Steps**:
1. Click "Browse Restaurants"
2. Select any restaurant
3. Add 1-2 items to cart
4. Click "Checkout"
5. Enter delivery address: `123 Test St, Test City, TC 12345`
6. Use test card: `4242 4242 4242 4242`
7. Expiry: Any future date (e.g., `12/25`)
8. CVV: Any 3 digits (e.g., `123`)
9. Click "Place Order"
10. ✅ Order should be created with status "PENDING"
11. **Note the Order ID** (e.g., Order #5)

---

### 2️⃣ Owner: Confirm & Mark Ready

**Logout** and **Login as Owner**:
- Email: `owner@test.com`
- Password: `Password@123`

**Steps**:
1. Go to "Owner Dashboard" → "Orders"
2. Find your order (should show "PENDING")
3. Click "Confirm Order"
4. ✅ Status changes to "CONFIRMED"
5. Click "Mark as Ready"
6. ✅ Status changes to "READY_FOR_PICKUP"
7. Wait 2-3 seconds for delivery to be created

---

### 3️⃣ Agent: View Queue

**Logout** and **Login as Agent**:
- Email: `agent@test.com`
- Password: `Password@123`

**Steps**:
1. Go to "Agent Dashboard" → "Queue"
2. ✅ You should see your order in the queue
3. Verify details:
   - Order ID matches
   - Pickup address (restaurant address)
   - Delivery address (customer address)
   - Earnings shown (e.g., $2.99)

---

### 4️⃣ Agent: Accept Delivery

**In Queue Page**:
1. Click "Accept Delivery" button
2. ✅ Toast notification: "Delivery accepted!"
3. ✅ Delivery disappears from queue
4. Go to "Active Deliveries"

---

### 5️⃣ Agent: Manage Active Delivery

**In Active Deliveries Page**:
1. ✅ You should see the accepted delivery
2. Status badge shows "ASSIGNED" (blue)
3. Click "Mark as Picked Up"
4. ✅ Status changes to "PICKED_UP" (purple)
5. ✅ Toast notification: "Delivery status updated"
6. Click "Start Delivery"
7. ✅ Status changes to "IN_TRANSIT" (orange)
8. Click "Mark as Delivered"
9. ✅ Status changes to "DELIVERED" (green)
10. ✅ Delivery disappears from active list

---

### 6️⃣ Agent: View History

**In Agent Dashboard**:
1. Go to "History"
2. ✅ You should see the completed delivery
3. Verify:
   - Statistics updated (Total: 1, Earnings: $2.99)
   - Delivery card shows all details
   - Status badge shows "DELIVERED" (green)
   - Earnings displayed correctly

**Try Date Filters**:
- Click "Today" → Should show the delivery
- Click "This Week" → Should show the delivery
- Click "This Month" → Should show the delivery
- Click "All Time" → Should show all deliveries

---

### 7️⃣ Customer: Verify Order Status

**Logout** and **Login as Customer**:
- Email: `customer@test.com`
- Password: `Password@123`

**Steps**:
1. Go to "Order History"
2. Find your order
3. ✅ Status should be "DELIVERED"
4. Click "Track Order" or "View Details"
5. ✅ Should show delivery timeline

---

### 8️⃣ Check Notifications (All Users)

**Customer Notifications**:
- Order confirmed
- Order ready for pickup
- Order picked up
- Order in transit
- Order delivered

**Agent Notifications**:
- Delivery assigned
- (Optional) Delivery reminders

**Owner Notifications**:
- New order received
- Order picked up by agent

---

## ✅ Success Criteria

### Queue Page
- [ ] Shows available deliveries
- [ ] Accept button works
- [ ] Delivery disappears after accept
- [ ] Empty state when no deliveries
- [ ] Auto-refresh works (15s)

### Active Page
- [ ] Shows accepted deliveries
- [ ] "Mark as Picked Up" button works
- [ ] "Start Delivery" button works
- [ ] "Mark as Delivered" button works
- [ ] Status badges update correctly
- [ ] Time tracking displays
- [ ] Delivery disappears after delivered
- [ ] Empty state when no active deliveries

### History Page
- [ ] Shows completed deliveries
- [ ] Statistics calculate correctly
- [ ] Date filters work
- [ ] Earnings display correctly
- [ ] Empty state when no history

### Notifications
- [ ] Customer receives all notifications
- [ ] Agent receives notifications
- [ ] Owner receives notifications
- [ ] Toast notifications appear
- [ ] Notification bell updates

### Order Status Sync
- [ ] Order status updates to OUT_FOR_DELIVERY when picked up
- [ ] Order status updates to DELIVERED when delivered
- [ ] Customer can see updated status

---

## 🐛 Troubleshooting

### Delivery Not Appearing in Queue
**Possible Causes**:
1. Order not marked as "READY_FOR_PICKUP"
2. Delivery already assigned to another agent
3. Kafka event not processed

**Solutions**:
- Check order status in Owner Orders page
- Check Kafka logs: `scripts\watch-kafka-events.bat`
- Restart delivery-service: `scripts\restart-delivery-service.bat`

### Accept Button Not Working
**Possible Causes**:
1. Delivery already accepted
2. Network error
3. Agent not authenticated

**Solutions**:
- Refresh the page
- Check browser console for errors
- Verify agent is logged in
- Check API Gateway logs

### Status Update Not Working
**Possible Causes**:
1. Invalid status transition
2. Delivery not found
3. Network error

**Solutions**:
- Check current status (must follow: ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED)
- Refresh the page
- Check browser console
- Check delivery-service logs

### Notifications Not Appearing
**Possible Causes**:
1. WebSocket not connected
2. Notification service down
3. Kafka events not published

**Solutions**:
- Check browser console for WebSocket connection
- Verify notification-service is running
- Check Kafka topics: `scripts\watch-kafka-events.bat`
- Restart notification-service: `scripts\start-notification-service.bat`

---

## 🔍 Verification Commands

### Check Kafka Events
```bash
scripts\watch-kafka-events.bat
```

### Check Delivery Service Logs
```bash
docker logs fooddelivery-delivery-service
```

### Check Notification Service Logs
```bash
docker logs fooddelivery-notification-service
```

### Check Order Status
```bash
scripts\check-order-status.ps1 -orderId 5
```

---

## 📊 Expected Timeline

| Step | Action | Time | Status |
|------|--------|------|--------|
| 1 | Customer places order | 0:00 | PENDING |
| 2 | Owner confirms order | 0:30 | CONFIRMED |
| 3 | Owner marks ready | 1:00 | READY_FOR_PICKUP |
| 4 | Delivery created | 1:03 | ASSIGNED (no agent) |
| 5 | Agent accepts | 2:00 | ASSIGNED (with agent) |
| 6 | Agent picks up | 3:00 | PICKED_UP |
| 7 | Agent in transit | 4:00 | IN_TRANSIT |
| 8 | Agent delivers | 5:00 | DELIVERED |

---

## 🎉 Success!

If all steps work correctly, you have successfully tested the complete agent delivery flow!

**What's Working**:
- ✅ Order creation and payment
- ✅ Owner order management
- ✅ Delivery creation via Kafka
- ✅ Agent queue system
- ✅ Agent acceptance
- ✅ Status progression
- ✅ Real-time notifications
- ✅ Order status synchronization
- ✅ Delivery history tracking
- ✅ Earnings calculation

**Next Steps**:
- Test with multiple orders
- Test with multiple agents
- Test edge cases (cancellations, errors)
- Add map integration (future)
- Add location tracking (future)

---

## 📚 Related Documentation

- `docs/AGENT_DELIVERY_FLOW_COMPLETE.md` - Complete implementation details
- `docs/NOTIFICATION_SYSTEM_COMPLETE.md` - Notification system
- `scripts/test-agent-delivery-flow.ps1` - Automated test script
- `docs/NEXT_PRIORITY_FEATURES.md` - Future enhancements

---

**Last Updated**: February 18, 2026  
**Status**: ✅ Complete and Ready for Testing
