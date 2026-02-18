# Real-time Notifications System - Complete Plan

## 🎯 Overview

Implement a real-time notification system using WebSocket for instant updates and Kafka for event-driven notification delivery across all user roles (Customers, Agents, Restaurant Owners, Admins).

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Event Sources (Kafka)                         │
├─────────────────────────────────────────────────────────────────┤
│  Order Events  │  Payment Events  │  Delivery Events            │
└────────┬────────────────┬────────────────┬───────────────────────┘
         │                │                │
         ▼                ▼                ▼
    ┌────────────────────────────────────────┐
    │    Notification Service (Backend)       │
    │  - Kafka Consumers                      │
    │  - WebSocket Server                     │
    │  - Notification Logic                   │
    │  - Database Storage                     │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │         WebSocket Connections           │
    │  - Customer Connections                 │
    │  - Agent Connections                    │
    │  - Owner Connections                    │
    │  - Admin Connections                    │
    └────────┬───────────────────────────────┘
             │
             ▼
    ┌────────────────────────────────────────┐
    │         Frontend Clients                │
    │  - Real-time Updates                    │
    │  - Toast Notifications                  │
    │  - Notification Center                  │
    │  - Badge Counts                         │
    └────────────────────────────────────────┘
```

---

## 📋 Phase 1: Backend - Notification Service Enhancement

### 1.1 Kafka Integration

#### Kafka Topics to Consume
```
✅ order-events           → Order status changes
✅ payment-events         → Payment updates
✅ delivery-events        → Delivery status changes
🆕 notification-events    → General notifications
```

#### Event Consumers to Create

**File**: `notification-service/src/main/java/com/fooddelivery/notification/consumer/OrderEventConsumer.java`
```java
@KafkaListener(topics = "order-created")
public void handleOrderCreated(OrderEvent event) {
    // Notify customer: "Order placed successfully"
    // Notify restaurant: "New order received"
    // Notify admin: "New order in system"
}

@KafkaListener(topics = "order-confirmed")
public void handleOrderConfirmed(OrderEvent event) {
    // Notify customer: "Restaurant confirmed your order"
}

@KafkaListener(topics = "order-preparing")
public void handleOrderPreparing(OrderEvent event) {
    // Notify customer: "Your food is being prepared"
}

@KafkaListener(topics = "order-ready-for-pickup")
public void handleOrderReady(OrderEvent event) {
    // Notify customer: "Order ready for pickup"
    // Notify available agents: "New delivery available"
}
```

**File**: `notification-service/src/main/java/com/fooddelivery/notification/consumer/PaymentEventConsumer.java`
```java
@KafkaListener(topics = "payment-completed")
public void handlePaymentCompleted(PaymentEvent event) {
    // Notify customer: "Payment successful"
    // Notify admin: "Payment received"
}

@KafkaListener(topics = "payment-failed")
public void handlePaymentFailed(PaymentEvent event) {
    // Notify customer: "Payment failed, please retry"
}

@KafkaListener(topics = "payment-refunded")
public void handlePaymentRefunded(PaymentEvent event) {
    // Notify customer: "Refund processed"
}
```

**File**: `notification-service/src/main/java/com/fooddelivery/notification/consumer/DeliveryEventConsumer.java`
```java
@KafkaListener(topics = "delivery-assigned")
public void handleDeliveryAssigned(DeliveryEvent event) {
    // Notify customer: "Delivery agent assigned"
    // Notify agent: "New delivery assigned to you"
}

@KafkaListener(topics = "delivery-picked-up")
public void handleDeliveryPickedUp(DeliveryEvent event) {
    // Notify customer: "Agent picked up your order"
    // Notify restaurant: "Order picked up"
}

@KafkaListener(topics = "delivery-in-transit")
public void handleDeliveryInTransit(DeliveryEvent event) {
    // Notify customer: "Agent is on the way"
}

@KafkaListener(topics = "delivery-delivered")
public void handleDeliveryDelivered(DeliveryEvent event) {
    // Notify customer: "Order delivered! Enjoy your meal"
    // Notify restaurant: "Order delivered successfully"
    // Notify agent: "Delivery completed"
}
```

### 1.2 Notification Entity & Repository

**File**: `notification-service/src/main/java/com/fooddelivery/notification/entity/Notification.java`
```java
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;           // Recipient
    private String userRole;       // CUSTOMER, AGENT, OWNER, ADMIN
    
    private String type;           // ORDER, PAYMENT, DELIVERY, SYSTEM
    private String title;          // "Order Confirmed"
    private String message;        // "Your order #123 has been confirmed"
    
    private String priority;       // LOW, MEDIUM, HIGH, URGENT
    private String category;       // INFO, SUCCESS, WARNING, ERROR
    
    private Long relatedEntityId;  // Order ID, Payment ID, etc.
    private String relatedEntityType; // ORDER, PAYMENT, DELIVERY
    
    private Boolean isRead;        // Read status
    private Boolean isSent;        // Sent via WebSocket
    
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private LocalDateTime sentAt;
    
    private Map<String, Object> metadata; // Additional data (JSON)
}
```

**File**: `notification-service/src/main/java/com/fooddelivery/notification/repository/NotificationRepository.java`
```java
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Long countByUserIdAndIsReadFalse(Long userId);
    List<Notification> findByUserIdAndUserRole(Long userId, String userRole);
}
```

### 1.3 WebSocket Configuration

**File**: `notification-service/src/main/java/com/fooddelivery/notification/config/WebSocketConfig.java`
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/notifications")
                .setAllowedOrigins("http://localhost:5173")
                .withSockJS();
    }
}
```

**WebSocket Channels:**
```
/topic/notifications          → Broadcast to all
/user/{userId}/queue/notifications → User-specific
/user/{userId}/queue/orders   → Order updates
/user/{userId}/queue/payments → Payment updates
/user/{userId}/queue/deliveries → Delivery updates
```

### 1.4 Notification Service

**File**: `notification-service/src/main/java/com/fooddelivery/notification/service/NotificationService.java`
```java
@Service
public class NotificationService {
    
    // Create and save notification
    public Notification createNotification(NotificationDTO dto);
    
    // Send via WebSocket
    public void sendToUser(Long userId, Notification notification);
    
    // Send to role (all admins, all agents, etc.)
    public void sendToRole(String role, Notification notification);
    
    // Mark as read
    public void markAsRead(Long notificationId);
    
    // Mark all as read for user
    public void markAllAsRead(Long userId);
    
    // Get unread count
    public Long getUnreadCount(Long userId);
    
    // Get user notifications (paginated)
    public Page<Notification> getUserNotifications(Long userId, Pageable pageable);
    
    // Delete notification
    public void deleteNotification(Long notificationId);
}
```

**File**: `notification-service/src/main/java/com/fooddelivery/notification/service/WebSocketNotificationService.java`
```java
@Service
public class WebSocketNotificationService {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public void sendToUser(Long userId, NotificationMessage message) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            message
        );
    }
    
    public void sendOrderUpdate(Long userId, OrderNotification notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/orders",
            notification
        );
    }
    
    public void sendPaymentUpdate(Long userId, PaymentNotification notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/payments",
            notification
        );
    }
    
    public void sendDeliveryUpdate(Long userId, DeliveryNotification notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/deliveries",
            notification
        );
    }
    
    public void broadcastToRole(String role, NotificationMessage message) {
        messagingTemplate.convertAndSend(
            "/topic/notifications/" + role.toLowerCase(),
            message
        );
    }
}
```

### 1.5 Notification Controller

**File**: `notification-service/src/main/java/com/fooddelivery/notification/controller/NotificationController.java`
```java
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    // Get user notifications
    GET /api/notifications
    GET /api/notifications/unread
    GET /api/notifications/count
    
    // Mark as read
    PUT /api/notifications/{id}/read
    PUT /api/notifications/read-all
    
    // Delete notification
    DELETE /api/notifications/{id}
    
    // Send test notification (admin only)
    POST /api/notifications/test
    
    // Get notification settings
    GET /api/notifications/settings
    PUT /api/notifications/settings
}
```

### 1.6 Notification Templates

**File**: `notification-service/src/main/java/com/fooddelivery/notification/template/NotificationTemplates.java`
```java
public class NotificationTemplates {
    
    // Order Templates
    public static final String ORDER_PLACED = "Order #%s placed successfully! Total: $%.2f";
    public static final String ORDER_CONFIRMED = "Restaurant confirmed your order #%s";
    public static final String ORDER_PREPARING = "Your order #%s is being prepared";
    public static final String ORDER_READY = "Order #%s is ready for pickup!";
    public static final String ORDER_PICKED_UP = "Delivery agent picked up your order #%s";
    public static final String ORDER_ON_THE_WAY = "Your order #%s is on the way!";
    public static final String ORDER_DELIVERED = "Order #%s delivered! Enjoy your meal 🎉";
    public static final String ORDER_CANCELLED = "Order #%s has been cancelled";
    
    // Payment Templates
    public static final String PAYMENT_SUCCESS = "Payment of $%.2f successful for order #%s";
    public static final String PAYMENT_FAILED = "Payment failed for order #%s. Please retry.";
    public static final String PAYMENT_REFUNDED = "Refund of $%.2f processed for order #%s";
    
    // Delivery Templates (Agent)
    public static final String NEW_DELIVERY_AVAILABLE = "New delivery available! Order #%s";
    public static final String DELIVERY_ASSIGNED = "Delivery #%s assigned to you";
    public static final String DELIVERY_COMPLETED = "Delivery #%s completed! Earnings: $%.2f";
    
    // Restaurant Templates (Owner)
    public static final String NEW_ORDER_RECEIVED = "New order #%s received! Total: $%.2f";
    public static final String ORDER_PICKED_UP_OWNER = "Order #%s picked up by delivery agent";
    
    // Admin Templates
    public static final String NEW_ORDER_ADMIN = "New order #%s in the system";
    public static final String PAYMENT_RECEIVED_ADMIN = "Payment of $%.2f received";
    public static final String NEW_USER_REGISTERED = "New %s registered: %s";
}
```

---

## 📋 Phase 2: Frontend - Real-time Notification System

### 2.1 WebSocket Client Setup

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
        
        // Subscribe to user-specific notifications
        this.subscribe(`/user/${userId}/queue/notifications`, this.handleNotification);
        this.subscribe(`/user/${userId}/queue/orders`, this.handleOrderUpdate);
        this.subscribe(`/user/${userId}/queue/payments`, this.handlePaymentUpdate);
        this.subscribe(`/user/${userId}/queue/deliveries`, this.handleDeliveryUpdate);
    }
    
    subscribe(destination, callback) {
        const subscription = this.stompClient.subscribe(destination, callback);
        this.subscriptions.set(destination, subscription);
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
        // Trigger toast notification
        // Update notification center
        // Update badge count
    }
}

export default new WebSocketService();
```

### 2.2 Notification Context

**File**: `frontend/src/app/context/NotificationContext.jsx`
```javascript
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connected, setConnected] = useState(false);
    const { user, token } = useAuth();
    
    useEffect(() => {
        if (user && token) {
            // Connect to WebSocket
            websocketService.connect(user.id, token);
            
            // Fetch initial notifications
            fetchNotifications();
            fetchUnreadCount();
        }
        
        return () => {
            websocketService.disconnect();
        };
    }, [user, token]);
    
    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(notification);
    };
    
    const markAsRead = async (notificationId) => {
        // API call
        // Update state
    };
    
    const markAllAsRead = async () => {
        // API call
        // Update state
    };
    
    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            connected,
            addNotification,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
```

### 2.3 Notification Components

**File**: `frontend/src/app/components/NotificationBell.jsx`
```javascript
// Bell icon with badge count
// Dropdown with recent notifications
// "View All" link to notification center
```

**File**: `frontend/src/app/components/NotificationCenter.jsx`
```javascript
// Full notification list
// Filter by type (all, orders, payments, deliveries)
// Mark as read/unread
// Delete notifications
// Pagination
```

**File**: `frontend/src/app/components/NotificationToast.jsx`
```javascript
// Toast notifications using react-hot-toast or sonner
// Auto-dismiss after 5 seconds
// Click to view details
// Different styles for success/error/info/warning
```

**File**: `frontend/src/app/components/NotificationItem.jsx`
```javascript
// Single notification display
// Icon based on type
// Time ago (e.g., "2 minutes ago")
// Read/unread indicator
// Click to mark as read and navigate
```

### 2.4 Notification Pages

**File**: `frontend/src/app/pages/Notifications.jsx`
```javascript
// Customer notification center
// List all notifications
// Filter and search
// Mark as read/unread
// Delete notifications
```

**File**: `frontend/src/app/pages/admin/AdminNotifications.jsx`
```javascript
// Admin notification center
// System-wide notifications
// Send broadcast notifications
// Notification analytics
// User notification management
```

**File**: `frontend/src/app/pages/agent/AgentNotifications.jsx`
```javascript
// Agent notification center
// Delivery-related notifications
// New delivery alerts
// Earnings notifications
```

**File**: `frontend/src/app/pages/owner/OwnerNotifications.jsx`
```javascript
// Restaurant owner notification center
// New order alerts
// Order status updates
// Revenue notifications
```

---

## 📋 Phase 3: Notification Types & Triggers

### 3.1 Customer Notifications

| Event | Trigger | Message | Priority |
|-------|---------|---------|----------|
| Order Placed | Order created | "Order #123 placed successfully!" | HIGH |
| Payment Success | Payment completed | "Payment successful for order #123" | HIGH |
| Payment Failed | Payment failed | "Payment failed. Please retry." | URGENT |
| Order Confirmed | Restaurant confirms | "Restaurant confirmed your order" | MEDIUM |
| Order Preparing | Order status change | "Your food is being prepared" | MEDIUM |
| Order Ready | Ready for pickup | "Order ready for pickup!" | HIGH |
| Agent Assigned | Delivery assigned | "Delivery agent assigned" | MEDIUM |
| Order Picked Up | Agent picks up | "Agent picked up your order" | MEDIUM |
| On The Way | Delivery in transit | "Your order is on the way!" | HIGH |
| Delivered | Delivery completed | "Order delivered! Enjoy 🎉" | HIGH |
| Order Cancelled | Order cancelled | "Order #123 cancelled" | HIGH |
| Refund Processed | Payment refunded | "Refund of $25.99 processed" | HIGH |

### 3.2 Agent Notifications

| Event | Trigger | Message | Priority |
|-------|---------|---------|----------|
| New Delivery Available | Order ready | "New delivery available nearby!" | URGENT |
| Delivery Assigned | Assigned to agent | "Delivery #456 assigned to you" | HIGH |
| Pickup Reminder | 5 min after assign | "Don't forget to pick up order #123" | MEDIUM |
| Delivery Completed | Delivery done | "Delivery completed! Earned $5.00" | HIGH |
| Daily Earnings | End of day | "Today's earnings: $45.00" | LOW |

### 3.3 Restaurant Owner Notifications

| Event | Trigger | Message | Priority |
|-------|---------|---------|----------|
| New Order | Order created | "New order #123 received!" | URGENT |
| Order Picked Up | Agent picks up | "Order #123 picked up" | MEDIUM |
| Order Delivered | Delivery complete | "Order #123 delivered successfully" | LOW |
| Daily Summary | End of day | "Today: 25 orders, $450 revenue" | LOW |
| Low Stock Alert | Inventory low | "Item 'Burger' running low" | MEDIUM |

### 3.4 Admin Notifications

| Event | Trigger | Message | Priority |
|-------|---------|---------|----------|
| New Order | Order created | "New order #123 in system" | LOW |
| Payment Received | Payment complete | "Payment of $25.99 received" | LOW |
| New User | User registers | "New customer registered" | LOW |
| New Restaurant | Restaurant added | "New restaurant: Pizza Palace" | MEDIUM |
| System Alert | Error/Issue | "High error rate detected" | URGENT |
| Daily Report | End of day | "Daily summary: 100 orders" | LOW |

---

## 📋 Phase 4: Database Schema

### 4.1 Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    category VARCHAR(20) DEFAULT 'INFO',
    
    related_entity_id BIGINT,
    related_entity_type VARCHAR(50),
    
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    
    metadata JSON,
    
    INDEX idx_user_id (user_id),
    INDEX idx_user_role (user_role),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_user_unread (user_id, is_read)
);
```

### 4.2 Notification Settings Table
```sql
CREATE TABLE notification_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    
    order_notifications BOOLEAN DEFAULT TRUE,
    payment_notifications BOOLEAN DEFAULT TRUE,
    delivery_notifications BOOLEAN DEFAULT TRUE,
    marketing_notifications BOOLEAN DEFAULT FALSE,
    
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 📋 Phase 5: Implementation Checklist

### Backend (Notification Service)

#### Kafka Integration
- [ ] Add Kafka dependencies to pom.xml
- [ ] Create KafkaConsumerConfig
- [ ] Create OrderEventConsumer
- [ ] Create PaymentEventConsumer
- [ ] Create DeliveryEventConsumer
- [ ] Test event consumption

#### WebSocket Setup
- [ ] Add WebSocket dependencies
- [ ] Create WebSocketConfig
- [ ] Create WebSocketNotificationService
- [ ] Test WebSocket connections
- [ ] Add authentication/authorization

#### Database & Entities
- [ ] Create Notification entity
- [ ] Create NotificationSettings entity
- [ ] Create NotificationRepository
- [ ] Create NotificationSettingsRepository
- [ ] Run database migrations

#### Services
- [ ] Create NotificationService
- [ ] Create NotificationTemplates
- [ ] Create NotificationMapper
- [ ] Add notification logic to consumers
- [ ] Test notification creation

#### Controllers
- [ ] Create NotificationController
- [ ] Add REST endpoints
- [ ] Add validation
- [ ] Test API endpoints

### Frontend

#### WebSocket Client
- [ ] Install sockjs-client and @stomp/stompjs
- [ ] Create WebSocketService
- [ ] Create NotificationContext
- [ ] Connect on user login
- [ ] Handle reconnection

#### Components
- [ ] Create NotificationBell component
- [ ] Create NotificationCenter component
- [ ] Create NotificationToast component
- [ ] Create NotificationItem component
- [ ] Add to navigation bar

#### Pages
- [ ] Create Notifications page (customer)
- [ ] Create AdminNotifications page
- [ ] Create AgentNotifications page
- [ ] Create OwnerNotifications page
- [ ] Add routes

#### Integration
- [ ] Connect to WebSocket on login
- [ ] Handle incoming notifications
- [ ] Show toast notifications
- [ ] Update badge counts
- [ ] Mark as read functionality

### Testing
- [ ] Test order notifications
- [ ] Test payment notifications
- [ ] Test delivery notifications
- [ ] Test WebSocket reconnection
- [ ] Test notification persistence
- [ ] Test mark as read
- [ ] Test delete notifications
- [ ] Load testing (multiple users)

---

## 📊 Notification Flow Examples

### Example 1: Order Placement Flow
```
1. Customer places order
   ↓
2. Order Service: ORDER_CREATED event → Kafka
   ↓
3. Notification Service: Consumes event
   ↓
4. Creates notifications:
   - Customer: "Order #123 placed successfully!"
   - Restaurant: "New order #123 received!"
   - Admin: "New order in system"
   ↓
5. Saves to database
   ↓
6. Sends via WebSocket to connected users
   ↓
7. Frontend: Shows toast + updates notification center
```

### Example 2: Delivery Assignment Flow
```
1. Agent accepts delivery
   ↓
2. Delivery Service: DELIVERY_ASSIGNED event → Kafka
   ↓
3. Notification Service: Consumes event
   ↓
4. Creates notifications:
   - Customer: "Delivery agent assigned to your order"
   - Agent: "Delivery #456 assigned to you"
   - Restaurant: "Order #123 assigned to agent"
   ↓
5. Sends via WebSocket
   ↓
6. Frontend: Real-time updates for all parties
```

---

## 🎯 Success Criteria

### Functional
- ✅ Notifications sent in real-time via WebSocket
- ✅ Notifications persisted in database
- ✅ Users can view notification history
- ✅ Users can mark notifications as read
- ✅ Badge count shows unread notifications
- ✅ Toast notifications for important events
- ✅ Different notification types for different roles
- ✅ Kafka events trigger notifications

### Non-Functional
- ✅ WebSocket connection stable
- ✅ Reconnection on disconnect
- ✅ Notification delivery < 1 second
- ✅ Supports 1000+ concurrent connections
- ✅ Mobile responsive
- ✅ Accessible (screen reader support)

---

## 🚀 Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| Phase 1 | Backend Kafka Integration | 2 hours |
| Phase 1 | Backend WebSocket Setup | 2 hours |
| Phase 1 | Notification Service Logic | 2 hours |
| Phase 2 | Frontend WebSocket Client | 1.5 hours |
| Phase 2 | Notification Components | 2 hours |
| Phase 2 | Notification Pages | 2 hours |
| Phase 3 | Integration & Testing | 2 hours |
| Phase 4 | Admin Notification Features | 1.5 hours |
| **Total** | | **15 hours (2-3 days)** |

---

## 📚 Dependencies

### Backend
```xml
<!-- WebSocket -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Kafka (already added) -->
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

### Frontend
```json
{
  "sockjs-client": "^1.6.1",
  "@stomp/stompjs": "^7.0.0",
  "react-hot-toast": "^2.4.1"
}
```

---

## 🎉 Benefits

1. **Real-time Updates**: Users see changes instantly without refreshing
2. **Better UX**: Immediate feedback on actions
3. **Reduced Server Load**: No polling, only push notifications
4. **Event-Driven**: Leverages existing Kafka infrastructure
5. **Scalable**: WebSocket supports thousands of connections
6. **Persistent**: Notifications saved for offline users
7. **Flexible**: Easy to add new notification types

---

**Ready to implement?** This plan provides everything needed for a complete real-time notification system with Kafka and WebSocket integration!
