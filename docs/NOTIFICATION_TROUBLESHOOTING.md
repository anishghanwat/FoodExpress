# Notification System - Troubleshooting Guide

## ✅ Issues Fixed

### Issue 1: `global is not defined` Error
**Error**: `Uncaught ReferenceError: global is not defined`

**Cause**: SockJS-client requires the `global` variable which is not available in browser environments (Vite).

**Solution**: Added polyfill in `vite.config.js`:
```javascript
define: {
    global: 'globalThis',
}
```

**Status**: ✅ FIXED

### Issue 2: `react-router-dom` Import Error
**Error**: `The following dependencies are imported but could not be resolved: react-router-dom`

**Cause**: Project uses `react-router` instead of `react-router-dom`.

**Solution**: Changed imports in:
- `frontend/src/app/components/NotificationBell.jsx`
- `frontend/src/app/pages/Notifications.jsx`

From:
```javascript
import { useNavigate } from 'react-router-dom';
```

To:
```javascript
import { useNavigate } from 'react-router';
```

**Status**: ✅ FIXED

---

## 🐛 Common Issues & Solutions

### WebSocket Connection Issues

#### Issue: WebSocket not connecting
**Symptoms**:
- No "WebSocket connected" message in console
- No notifications appearing
- Connection errors in console

**Solutions**:
1. Check notification service is running:
   ```bash
   curl http://localhost:8086/actuator/health
   ```

2. Check CORS configuration in `WebSocketConfig.java`:
   ```java
   .setAllowedOrigins("http://localhost:5173", "http://localhost:3000")
   ```

3. Verify user is logged in (WebSocket connects after login)

4. Check browser console for detailed error messages

5. Try refreshing the page

#### Issue: WebSocket disconnects frequently
**Solutions**:
1. Check network stability
2. Verify notification service is stable
3. Check for firewall/proxy issues
4. Auto-reconnection should handle temporary disconnects

---

### Notification Not Appearing

#### Issue: No toast notifications
**Symptoms**:
- WebSocket connected
- No toast appearing after order placement

**Solutions**:
1. Check Sonner is installed:
   ```bash
   npm list sonner
   ```

2. Verify Toaster component in App.jsx:
   ```javascript
   import { Toaster } from 'sonner';
   <Toaster position="top-right" richColors closeButton />
   ```

3. Check NotificationContext is wrapping the app

4. Check browser console for errors

#### Issue: Bell badge not updating
**Solutions**:
1. Check NotificationContext is providing unreadCount
2. Verify WebSocket messages are being received (check console)
3. Check state updates in NotificationContext
4. Refresh the page

#### Issue: Notifications page empty
**Solutions**:
1. Check API endpoint is accessible:
   ```bash
   curl "http://localhost:8086/api/notifications?userId=1&page=0&size=10"
   ```

2. Verify notifications exist in database:
   ```sql
   SELECT * FROM notification_db.notifications WHERE user_id = 1;
   ```

3. Check network tab for API call errors

---

### Backend Issues

#### Issue: Notification service not starting
**Solutions**:
1. Check MySQL is running:
   ```bash
   docker ps | findstr mysql
   ```

2. Check Kafka is running:
   ```bash
   docker ps | findstr kafka
   ```

3. Check port 8086 is not in use:
   ```bash
   netstat -ano | findstr :8086
   ```

4. Check application.yml configuration

5. Check logs for errors:
   ```bash
   tail -f notification-service/logs/application.log
   ```

#### Issue: Kafka events not being consumed
**Solutions**:
1. Check Kafka topics exist:
   ```bash
   docker exec -it fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092
   ```

2. Check consumer group is active:
   ```bash
   docker exec -it fooddelivery-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group notification-service-group
   ```

3. Check notification service logs for consumer errors

4. Verify events are being published (check order/payment service logs)

#### Issue: Database connection failed
**Solutions**:
1. Check MySQL credentials in application.yml:
   ```yaml
   username: root
   password: root
   ```

2. Check database exists:
   ```sql
   SHOW DATABASES LIKE 'notification_db';
   ```

3. Create database if missing:
   ```sql
   CREATE DATABASE notification_db;
   ```

4. Check MySQL is accessible:
   ```bash
   mysql -u root -p -h localhost -P 3306
   ```

---

### Frontend Issues

#### Issue: Build errors
**Solutions**:
1. Clear node_modules and reinstall:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check all dependencies are installed:
   ```bash
   npm install sockjs-client @stomp/stompjs date-fns sonner
   ```

3. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

#### Issue: Import errors
**Solutions**:
1. Check import paths are correct
2. Verify files exist
3. Check for typos in import statements
4. Use correct package names (react-router vs react-router-dom)

---

## 🔍 Debugging Tips

### Enable Debug Logging

**Backend (application.yml)**:
```yaml
logging:
  level:
    com.fooddelivery.notification: DEBUG
    org.springframework.kafka: DEBUG
    org.springframework.web.socket: DEBUG
```

**Frontend (websocketService.js)**:
```javascript
this.stompClient.debug = (str) => {
    console.log('STOMP:', str);
};
```

### Check WebSocket Connection

**Browser Console**:
```javascript
// Check if WebSocket is connected
window.addEventListener('websocket-connected', (e) => {
    console.log('WebSocket connected:', e.detail);
});

// Check for errors
window.addEventListener('websocket-error', (e) => {
    console.error('WebSocket error:', e.detail);
});
```

### Monitor Kafka Events

**Watch Kafka topics**:
```bash
# Watch order events
docker exec -it fooddelivery-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic order-created --from-beginning

# Watch payment events
docker exec -it fooddelivery-kafka kafka-console-consumer --bootstrap-server localhost:9092 --topic payment-completed --from-beginning
```

### Check Database

**Query notifications**:
```sql
-- Get all notifications
SELECT * FROM notification_db.notifications ORDER BY created_at DESC LIMIT 10;

-- Get unread count
SELECT COUNT(*) FROM notification_db.notifications WHERE user_id = 1 AND is_read = FALSE;

-- Get by type
SELECT * FROM notification_db.notifications WHERE type = 'ORDER' ORDER BY created_at DESC;
```

---

## 🆘 Still Having Issues?

### Checklist
- [ ] All services running (docker-compose, backend services)
- [ ] Frontend dev server running
- [ ] User logged in
- [ ] Browser console open (F12)
- [ ] No errors in console
- [ ] WebSocket connected message visible
- [ ] Notification service logs show no errors
- [ ] Kafka topics exist and have messages
- [ ] Database has notifications table

### Get Help
1. Check all documentation in `docs/` folder
2. Review implementation files
3. Check service logs for detailed errors
4. Test each component individually
5. Verify configuration files

---

## 📊 Health Check Commands

```bash
# Check all services
curl http://localhost:8761/actuator/health  # Eureka
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8086/actuator/health  # Notification Service

# Check Docker services
docker ps

# Check Kafka
docker exec -it fooddelivery-kafka kafka-topics --list --bootstrap-server localhost:9092

# Check MySQL
docker exec -it fooddelivery-mysql mysql -u root -proot -e "SHOW DATABASES;"

# Check frontend
curl http://localhost:5173
```

---

## ✅ Verification Steps

After fixing any issue:

1. **Restart services**:
   ```bash
   # Backend
   scripts\start-all.bat
   
   # Frontend
   cd frontend
   npm run dev
   ```

2. **Clear browser cache**: Ctrl+Shift+Delete

3. **Test WebSocket connection**: Check console for "WebSocket connected"

4. **Place test order**: Verify notifications appear

5. **Check all features**:
   - Toast notifications
   - Bell badge
   - Dropdown
   - Notifications page
   - Mark as read
   - Delete

---

**Last Updated**: February 18, 2026  
**Status**: All known issues resolved ✅
