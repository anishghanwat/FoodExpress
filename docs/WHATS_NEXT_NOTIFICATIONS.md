# What's Next: Real-time Notifications Frontend

## ✅ Backend Complete - What We Have

The notification service backend is fully implemented and tested:

- **Service**: Running on port 8086
- **Database**: notification_db with notifications table
- **Kafka**: Consuming 13 topics (order, payment, delivery events)
- **WebSocket**: Ready at ws://localhost:8086/ws/notifications
- **REST API**: 7 endpoints for notification management
- **Status**: ✅ ALL TESTS PASSED

## 🎯 Next Phase: Frontend Implementation

### Phase 1: WebSocket Client Setup (1.5 hours)

#### Install Dependencies
```bash
cd frontend
npm install sockjs-client @stomp/stompjs
```

#### Create WebSocket Service
**File**: `frontend/src/app/services/websocketService.js`

```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = new Map();
    }
    
    connect(userId, token) {
        const socket = new SockJS('http://localhost:8086/ws/notifications');
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.connect(
            { Authorization: `Bearer ${token}` },
            () => this.onConnected(userId),
            (error) => this.onError(error)
        );
    }
    
    onConnected(userId) {
        this.connected = true;
        console.log('WebSocket connected for user:', userId);
        
        // Subscribe to user-specific notifications
        this.subscribe(`/user/${userId}/queue/notifications`, this.handleNotification);
        this.subscribe(`/user/${userId}/queue/orders`, this.handleOrderUpdate);
        this.subscribe(`/user/${userId}/queue/payments`, this.handlePaymentUpdate);
        this.subscribe(`/user/${userId}/queue/deliveries`, this.handleDeliveryUpdate);
    }
    
    subscribe(destination, callback) {
        if (this.stompClient && this.connected) {
            const subscription = this.stompClient.subscribe(destination, callback);
            this.subscriptions.set(destination, subscription);
        }
    }
    
    disconnect() {
        if (this.stompClient) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
            this.stompClient.disconnect();
            this.connected = false;
        }
    }
    
    handleNotification(message) {
        const notification = JSON.parse(message.body);
        console.log('Received notification:', notification);
        // Trigger event or callback
        window.dispatchEvent(new CustomEvent('notification', { detail: notification }));
    }
    
    handleOrderUpdate(message) {
        const notification = JSON.parse(message.body);
        console.log('Order update:', notification);
        window.dispatchEvent(new CustomEvent('orderUpdate', { detail: notification }));
    }
    
    handlePaymentUpdate(message) {
        const notification = JSON.parse(message.body);
        console.log('Payment update:', notification);
        window.dispatchEvent(new CustomEvent('paymentUpdate', { detail: notification }));
    }
    
    handleDeliveryUpdate(message) {
        const notification = JSON.parse(message.body);
        console.log('Delivery update:', notification);
        window.dispatchEvent(new CustomEvent('deliveryUpdate', { detail: notification }));
    }
}

export default new WebSocketService();
```

#### Create Notification Context
**File**: `frontend/src/app/context/NotificationContext.jsx`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import websocketService from '../services/websocketService';
import { toast } from 'sonner';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connected, setConnected] = useState(false);
    const { user, token } = useAuth();
    
    useEffect(() => {
        if (user && token) {
            // Connect to WebSocket
            websocketService.connect(user.id, token);
            setConnected(true);
            
            // Fetch initial notifications
            fetchNotifications();
            fetchUnreadCount();
            
            // Listen for new notifications
            window.addEventListener('notification', handleNewNotification);
            window.addEventListener('orderUpdate', handleNewNotification);
            window.addEventListener('paymentUpdate', handleNewNotification);
            window.addEventListener('deliveryUpdate', handleNewNotification);
        }
        
        return () => {
            websocketService.disconnect();
            setConnected(false);
            window.removeEventListener('notification', handleNewNotification);
            window.removeEventListener('orderUpdate', handleNewNotification);
            window.removeEventListener('paymentUpdate', handleNewNotification);
            window.removeEventListener('deliveryUpdate', handleNewNotification);
        };
    }, [user, token]);
    
    const handleNewNotification = (event) => {
        const notification = event.detail;
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(notification);
    };
    
    const showToast = (notification) => {
        const toastOptions = {
            duration: 5000,
        };
        
        switch (notification.category) {
            case 'SUCCESS':
                toast.success(notification.title, { description: notification.message, ...toastOptions });
                break;
            case 'ERROR':
                toast.error(notification.title, { description: notification.message, ...toastOptions });
                break;
            case 'WARNING':
                toast.warning(notification.title, { description: notification.message, ...toastOptions });
                break;
            default:
                toast.info(notification.title, { description: notification.message, ...toastOptions });
        }
    };
    
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:8086/api/notifications?userId=${user.id}&page=0&size=20`);
            const data = await response.json();
            setNotifications(data.content || []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };
    
    const fetchUnreadCount = async () => {
        try {
            const response = await fetch(`http://localhost:8086/api/notifications/count?userId=${user.id}`);
            const data = await response.json();
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };
    
    const markAsRead = async (notificationId) => {
        try {
            await fetch(`http://localhost:8086/api/notifications/${notificationId}/read`, {
                method: 'PUT'
            });
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };
    
    const markAllAsRead = async () => {
        try {
            await fetch(`http://localhost:8086/api/notifications/read-all?userId=${user.id}`, {
                method: 'PUT'
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };
    
    const deleteNotification = async (notificationId) => {
        try {
            await fetch(`http://localhost:8086/api/notifications/${notificationId}`, {
                method: 'DELETE'
            });
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };
    
    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            connected,
            markAsRead,
            markAllAsRead,
            deleteNotification,
            refreshNotifications: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
```

### Phase 2: Notification Components (2 hours)

#### 1. NotificationBell Component
**File**: `frontend/src/app/components/NotificationBell.jsx`

- Bell icon with badge showing unread count
- Dropdown showing recent 5 notifications
- "View All" link to notification center
- Click to mark as read

#### 2. NotificationCenter Component
**File**: `frontend/src/app/components/NotificationCenter.jsx`

- Full list of notifications
- Filter by type (all, orders, payments, deliveries)
- Mark as read/unread
- Delete notifications
- Pagination
- Empty state

#### 3. NotificationItem Component
**File**: `frontend/src/app/components/NotificationItem.jsx`

- Display notification with icon
- Show time ago (e.g., "2 minutes ago")
- Read/unread indicator
- Click to mark as read and navigate
- Delete button

### Phase 3: Notification Pages (2 hours)

#### 1. Customer Notifications Page
**File**: `frontend/src/app/pages/Notifications.jsx`

- All customer notifications
- Filter and search
- Mark as read/unread
- Delete notifications

#### 2. Agent Notifications Page
**File**: `frontend/src/app/pages/agent/AgentNotifications.jsx`

- Delivery-related notifications
- New delivery alerts
- Earnings notifications

#### 3. Owner Notifications Page
**File**: `frontend/src/app/pages/owner/OwnerNotifications.jsx`

- New order alerts
- Order status updates
- Revenue notifications

#### 4. Admin Notifications Page
**File**: `frontend/src/app/pages/admin/AdminNotifications.jsx`

- System-wide notifications
- Send broadcast notifications
- Notification analytics

### Phase 4: Integration (2 hours)

#### Update App.jsx
```javascript
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'sonner';

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    {/* Your routes */}
                </Router>
                <Toaster position="top-right" />
            </NotificationProvider>
        </AuthProvider>
    );
}
```

#### Add NotificationBell to Navigation
```javascript
import NotificationBell from './components/NotificationBell';

// In your navigation component
<NotificationBell />
```

## 📊 Testing Checklist

### Backend Tests (Already Done ✅)
- [x] Service health check
- [x] Database connection
- [x] Kafka consumers active
- [x] WebSocket server running
- [x] REST API endpoints working

### Frontend Tests (To Do)
- [ ] WebSocket connection successful
- [ ] Receive real-time notifications
- [ ] Toast notifications appear
- [ ] Badge count updates
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Delete notification works
- [ ] Notification center displays correctly
- [ ] Filter notifications works
- [ ] Pagination works

### Integration Tests (To Do)
- [ ] Place order → Receive notification
- [ ] Complete payment → Receive notification
- [ ] Delivery assigned → Receive notification
- [ ] Order delivered → Receive notification
- [ ] Multiple users receive correct notifications
- [ ] Reconnection after disconnect

## 🚀 Quick Start Commands

### Start Backend Services
```bash
# Start all services
scripts\start-all.bat

# Or start notification service only
scripts\start-notification-service.bat
```

### Start Frontend
```bash
cd frontend
npm install sockjs-client @stomp/stompjs
npm run dev
```

### Test Notification Flow
1. Login as customer (customer@test.com / Password@123)
2. Place an order
3. Complete payment
4. Watch for real-time notifications
5. Check notification center

## 📚 Documentation

- **Backend Implementation**: `docs/REALTIME_NOTIFICATIONS_BACKEND_COMPLETE.md`
- **Test Results**: `docs/NOTIFICATION_SERVICE_TEST_RESULTS.md`
- **Implementation Summary**: `docs/NOTIFICATION_IMPLEMENTATION_SUMMARY.md`
- **Original Plan**: `docs/REALTIME_NOTIFICATIONS_PLAN.md`

## 🎯 Success Criteria

### Backend (Complete ✅)
- [x] Service running and healthy
- [x] Database connected
- [x] Kafka consumers active
- [x] WebSocket server ready
- [x] REST API working
- [x] Event consumers implemented
- [x] Notification logic complete

### Frontend (To Implement)
- [ ] WebSocket client connected
- [ ] Real-time notifications working
- [ ] Toast notifications appearing
- [ ] Notification center functional
- [ ] Badge count accurate
- [ ] Mark as read working
- [ ] All user roles supported

## 💡 Tips for Implementation

1. **Start Simple**: Implement basic WebSocket connection first
2. **Test Incrementally**: Test each component as you build it
3. **Use Console Logs**: Log WebSocket messages to debug
4. **Handle Errors**: Add proper error handling for connection failures
5. **Reconnection**: Implement automatic reconnection on disconnect
6. **Performance**: Use pagination for large notification lists
7. **UX**: Show loading states and empty states

## 🎉 Ready to Build!

The backend is complete and tested. You can now start implementing the frontend components to receive and display real-time notifications!

**Estimated Time**: 7-8 hours for complete frontend implementation
**Priority**: High (enhances user experience significantly)
**Complexity**: Medium (WebSocket + React state management)
