# Real-time Notifications - Quick Test Guide 🚀

## ✅ Services Running

- **Frontend**: http://localhost:5174
- **Notification Service**: http://localhost:8086
- **WebSocket**: ws://localhost:8086/ws/notifications
- **API Gateway**: http://localhost:8080

---

## 🧪 Quick Test (5 minutes)

### Step 1: Open Application
```
http://localhost:5174
```

### Step 2: Login
```
Email:    customer@test.com
Password: Password@123
```

### Step 3: Open Browser Console
Press `F12` → Go to `Console` tab

Look for these messages:
```
✓ WebSocket connected for user: 1
✓ Subscribed to: /user/1/queue/notifications
✓ Subscribed to: /user/1/queue/orders
✓ Subscribed to: /user/1/queue/payments
✓ Subscribed to: /user/1/queue/deliveries
```

### Step 4: Place an Order
1. Click on any restaurant
2. Add items to cart
3. Click "Cart" button
4. Click "Proceed to Checkout"
5. Fill delivery address
6. Click "Proceed to Payment"
7. Enter card: `4242 4242 4242 4242`
8. Expiry: Any future date (e.g., 12/25)
9. CVV: Any 3 digits (e.g., 123)
10. Click "Pay Now"

### Step 5: Watch the Magic! ✨

**You should see:**

1. **Toast Notification** (top-right):
   - "Payment processing..." (blue)
   - "Payment successful!" (green)
   - "Order placed successfully!" (green)

2. **Bell Icon** (top navigation):
   - Red badge appears with number "2" or "3"

3. **Console Logs**:
   ```
   💳 Payment update: {title: "Payment Successful", ...}
   📦 Order update: {title: "Order Placed", ...}
   ```

4. **Click Bell Icon**:
   - Dropdown shows recent notifications
   - Unread notifications highlighted

5. **Click "View all notifications"**:
   - Full page with all notifications
   - Filter options (All, Unread, Orders, Payments, Delivery)

---

## 🎯 What to Test

### ✅ WebSocket Connection
- [ ] Console shows "WebSocket connected"
- [ ] Console shows 4 subscriptions
- [ ] No connection errors

### ✅ Real-time Notifications
- [ ] Toast appears for payment
- [ ] Toast appears for order
- [ ] Toasts auto-dismiss after 5 seconds
- [ ] Can click toast to view details

### ✅ NotificationBell
- [ ] Badge shows unread count
- [ ] Dropdown opens on click
- [ ] Shows recent 5 notifications
- [ ] Can mark as read
- [ ] Can view all

### ✅ Notifications Page
- [ ] Shows all notifications
- [ ] Filters work (All, Unread, etc.)
- [ ] Can mark as read
- [ ] Can mark all as read
- [ ] Can delete notifications
- [ ] Can refresh
- [ ] Time ago displays correctly

### ✅ Navigation
- [ ] Click notification navigates to order tracking
- [ ] Bell icon accessible from all pages
- [ ] Notifications page accessible

---

## 🐛 Troubleshooting

### WebSocket Not Connecting?
1. Check notification service is running:
   ```
   http://localhost:8086/actuator/health
   ```
2. Check browser console for errors
3. Try refreshing the page
4. Check if logged in

### No Notifications Appearing?
1. Check Kafka is running:
   ```
   docker ps | findstr kafka
   ```
2. Check notification service logs
3. Verify order was created successfully
4. Check payment was completed

### Toast Not Showing?
1. Check browser console for errors
2. Verify sonner is installed
3. Check NotificationContext is wrapped in App.jsx

---

## 📊 Expected Notification Flow

```
Order Placement
    ↓
Payment Intent Created
    ↓ (Kafka: payment-initiated)
Toast: "Payment processing..."
    ↓
Payment Completed
    ↓ (Kafka: payment-completed)
Toast: "Payment successful!"
    ↓
Order Created
    ↓ (Kafka: order-created)
Toast: "Order placed successfully!"
    ↓
Bell Badge: Shows "2" or "3"
    ↓
Dropdown: Shows notifications
    ↓
Page: Shows all notifications
```

---

## 🎨 Visual Indicators

### Toast Colors
- 🔵 **Blue**: Info (payment processing)
- 🟢 **Green**: Success (payment/order success)
- 🔴 **Red**: Error (payment failed)
- 🟡 **Yellow**: Warning

### Bell Badge
- **Red circle**: Unread count
- **No badge**: All read

### Notification Cards
- **Blue left border**: Unread
- **Gray left border**: Read
- **Blue dot**: Unread indicator

---

## 📝 Test Checklist

- [ ] Login successful
- [ ] WebSocket connected (check console)
- [ ] Place order
- [ ] Payment successful
- [ ] Toast notifications appear
- [ ] Bell badge updates
- [ ] Dropdown shows notifications
- [ ] Notifications page works
- [ ] Mark as read works
- [ ] Delete works
- [ ] Filters work
- [ ] Navigation works

---

## 🎉 Success Criteria

If you see:
- ✅ Toast notifications appearing
- ✅ Bell badge with number
- ✅ Notifications in dropdown
- ✅ Notifications on page
- ✅ Console logs showing WebSocket messages

**Congratulations! The notification system is working perfectly! 🎉**

---

## 📚 Next Steps

1. Test with multiple users
2. Test different notification types
3. Test reconnection (close/reopen browser)
4. Test on different browsers
5. Test on mobile devices

---

## 🆘 Need Help?

Check documentation:
- `docs/NOTIFICATION_SYSTEM_COMPLETE.md` - Full overview
- `docs/NOTIFICATION_FRONTEND_COMPLETE.md` - Frontend details
- `docs/NOTIFICATION_SERVICE_TEST_RESULTS.md` - Backend tests

---

**Happy Testing! 🚀**
