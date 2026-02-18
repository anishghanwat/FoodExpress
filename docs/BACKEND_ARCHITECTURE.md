# Food Delivery System - Backend Architecture

## 1. Technology Stack

### Core Technologies
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.x
- **Build Tool**: Maven
- **Database**: MySQL 8.0
- **Service Registry**: Eureka Server
- **API Gateway**: Spring Cloud Gateway
- **Messaging**: Apache Kafka
- **Caching**: Redis (optional)
- **Documentation**: Swagger/OpenAPI 3.0

### Spring Boot Dependencies
- Spring Web
- Spring Data JPA
- Spring Security
- Spring Cloud Netflix Eureka
- Spring Cloud Gateway
- Spring Kafka
- Spring Validation
- Lombok
- MapStruct (for DTO mapping)
- JWT (io.jsonwebtoken)

---

## 2. Microservices Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (React Frontend - Port 5173)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 8080)                 │
│              Routes requests to microservices                │
│              JWT Authentication & Authorization              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Service Registry (Port 8761)                │
│                    Eureka Server                             │
│              Service Discovery & Load Balancing              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ User Service │    │  Restaurant  │    │Order Service │
│  (Port 8081) │    │   Service    │    │ (Port 8083)  │
│              │    │ (Port 8082)  │    │              │
│ - Auth       │    │ - CRUD       │    │ - Create     │
│ - Register   │    │ - Menu Mgmt  │    │ - Track      │
│ - Profile    │    │ - Reviews    │    │ - Status     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  MySQL DB    │    │  MySQL DB    │    │  MySQL DB    │
│  user_db     │    │restaurant_db │    │  order_db    │
└──────────────┘    └──────────────┘    └──────────────┘

        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Delivery    │    │  Payment     │    │Notification  │
│   Service    │    │   Service    │    │  Service     │
│ (Port 8084)  │    │ (Port 8085)  │    │ (Port 8086)  │
│              │    │              │    │              │
│ - Assign     │    │ - Process    │    │ - Email      │
│ - Track      │    │ - Refund     │    │ - SMS        │
│ - Complete   │    │ - History    │    │ - Push       │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  MySQL DB    │    │  MySQL DB    │    │  MySQL DB    │
│ delivery_db  │    │ payment_db   │    │notification_db│
└──────────────┘    └──────────────┘    └──────────────┘

                    ┌──────────────┐
                    │    Kafka     │
                    │  (Port 9092) │
                    │              │
                    │ - Events     │
                    │ - Messages   │
                    └──────────────┘
```

---

## 3. Service Details

### 3.1 Eureka Server (Port 8761)
**Purpose**: Service discovery and registration

**Responsibilities**:
- Register all microservices
- Health check monitoring
- Load balancing
- Service discovery

**Dependencies**:
- spring-cloud-starter-netflix-eureka-server

---

### 3.2 API Gateway (Port 8080)
**Purpose**: Single entry point for all client requests

**Responsibilities**:
- Route requests to appropriate microservices
- JWT token validation
- CORS configuration
- Rate limiting
- Request/response logging
- Circuit breaker pattern

**Routes**:
```
/api/auth/**        → User Service
/api/users/**       → User Service
/api/restaurants/** → Restaurant Service
/api/menus/**       → Restaurant Service
/api/orders/**      → Order Service
/api/payments/**    → Payment Service
/api/delivery/**    → Delivery Service
/api/notifications/**→ Notification Service
```

**Dependencies**:
- spring-cloud-starter-gateway
- spring-cloud-starter-netflix-eureka-client
- spring-boot-starter-security
- jjwt (JWT library)

---

### 3.3 User Service (Port 8081)
**Purpose**: User management and authentication

**Database**: user_db

**Entities**:
- User (id, name, email, phone, password, role, status, createdAt, updatedAt)
- Address (id, userId, label, addressLine1, addressLine2, city, state, pinCode, landmark)
- RefreshToken (id, userId, token, expiryDate)

**Endpoints**:
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/logout            - Logout user
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/forgot-password   - Send password reset email
POST   /api/auth/reset-password    - Reset password
POST   /api/auth/verify-email      - Verify email address

GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update user profile
GET    /api/users/addresses        - Get user addresses
POST   /api/users/addresses        - Add new address
PUT    /api/users/addresses/{id}   - Update address
DELETE /api/users/addresses/{id}   - Delete address

Admin endpoints:
GET    /api/admin/users            - Get all users
GET    /api/admin/users/{id}       - Get user by ID
PUT    /api/admin/users/{id}/status- Update user status
DELETE /api/admin/users/{id}       - Delete user
```

**Dependencies**:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- mysql-connector-java
- jjwt
- spring-boot-starter-mail

---

### 3.4 Restaurant Service (Port 8082)
**Purpose**: Restaurant and menu management

**Database**: restaurant_db

**Entities**:
- Restaurant (id, ownerId, name, description, cuisine, address, phone, email, rating, isOpen, openingTime, closingTime, deliveryTime, minimumOrder, deliveryFee, imageUrl, status, createdAt, updatedAt)
- MenuCategory (id, restaurantId, name, description, displayOrder)
- MenuItem (id, categoryId, name, description, price, imageUrl, isVegetarian, isAvailable, preparationTime)
- Review (id, restaurantId, userId, orderId, rating, comment, createdAt)

**Endpoints**:
```
Public endpoints:
GET    /api/restaurants                    - Get all restaurants (with filters)
GET    /api/restaurants/search             - Search restaurants
GET    /api/restaurants/featured           - Get featured restaurants
GET    /api/restaurants/{id}               - Get restaurant by ID
GET    /api/restaurants/{id}/menu          - Get restaurant menu
GET    /api/restaurants/{id}/reviews       - Get restaurant reviews
POST   /api/restaurants/{id}/reviews       - Add review

Owner endpoints:
POST   /api/restaurants                    - Create restaurant
PUT    /api/restaurants/{id}               - Update restaurant
DELETE /api/restaurants/{id}               - Delete restaurant
POST   /api/restaurants/{id}/image         - Upload restaurant image

GET    /api/menus/categories               - Get categories
POST   /api/menus/categories               - Create category
PUT    /api/menus/categories/{id}          - Update category
DELETE /api/menus/categories/{id}          - Delete category

GET    /api/menus/items                    - Get menu items
POST   /api/menus/items                    - Create menu item
PUT    /api/menus/items/{id}               - Update menu item
DELETE /api/menus/items/{id}               - Delete menu item
POST   /api/menus/items/{id}/image         - Upload item image

Admin endpoints:
GET    /api/admin/restaurants              - Get all restaurants
PUT    /api/admin/restaurants/{id}/status  - Update restaurant status
```

**Dependencies**:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- mysql-connector-java
- spring-kafka (for events)

---

### 3.5 Order Service (Port 8083)
**Purpose**: Order management and tracking

**Database**: order_db

**Entities**:
- Order (id, customerId, restaurantId, deliveryAgentId, items, subtotal, deliveryFee, tax, discount, total, status, deliveryAddress, specialInstructions, paymentMethod, paymentStatus, createdAt, updatedAt, deliveredAt)
- OrderItem (id, orderId, menuItemId, name, price, quantity, subtotal)
- OrderStatusHistory (id, orderId, status, timestamp, notes)

**Endpoints**:
```
Customer endpoints:
POST   /api/orders                         - Create order
GET    /api/orders/customer                - Get customer orders
GET    /api/orders/{id}                    - Get order by ID
GET    /api/orders/{id}/track              - Track order
POST   /api/orders/{id}/cancel             - Cancel order
POST   /api/orders/{id}/rate               - Rate order

Restaurant endpoints:
GET    /api/orders/restaurant              - Get restaurant orders
PUT    /api/orders/{id}/status             - Update order status
POST   /api/orders/{id}/accept             - Accept order
POST   /api/orders/{id}/reject             - Reject order

Agent endpoints:
GET    /api/orders/agent                   - Get agent orders
GET    /api/orders/agent/available         - Get available orders
POST   /api/orders/{id}/accept-delivery    - Accept delivery
POST   /api/orders/{id}/pickup             - Mark as picked up
POST   /api/orders/{id}/deliver            - Mark as delivered

Admin endpoints:
GET    /api/admin/orders                   - Get all orders
GET    /api/admin/orders/stats             - Get order statistics
```

**Dependencies**:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- mysql-connector-java
- spring-kafka (for events)

---

### 3.6 Payment Service (Port 8085)
**Purpose**: Payment processing

**Database**: payment_db

**Entities**:
- Payment (id, orderId, userId, amount, paymentMethod, transactionId, status, createdAt, updatedAt)
- PaymentMethod (id, userId, type, cardLast4, expiryMonth, expiryYear, isDefault)

**Endpoints**:
```
POST   /api/payments/process               - Process payment
GET    /api/payments/history               - Get payment history
GET    /api/payments/methods               - Get saved payment methods
POST   /api/payments/methods               - Add payment method
DELETE /api/payments/methods/{id}          - Delete payment method
POST   /api/payments/{id}/refund           - Process refund

Admin endpoints:
GET    /api/admin/payments                 - Get all payments
GET    /api/admin/payments/stats           - Get payment statistics
```

**Dependencies**:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- mysql-connector-java
- Payment gateway SDK (Stripe/Razorpay)

---

### 3.7 Delivery Service (Port 8084)
**Purpose**: Delivery agent and tracking management

**Database**: delivery_db

**Entities**:
- DeliveryAgent (id, userId, vehicleType, vehicleNumber, licenseNumber, isAvailable, currentLocation, rating, totalDeliveries)
- Delivery (id, orderId, agentId, pickupLocation, deliveryLocation, status, pickupTime, deliveryTime, distance, earnings)
- Location (id, deliveryId, latitude, longitude, timestamp)

**Endpoints**:
```
Agent endpoints:
GET    /api/delivery/available             - Get available deliveries
POST   /api/delivery/{id}/accept           - Accept delivery
PUT    /api/delivery/{id}/location         - Update location
POST   /api/delivery/{id}/complete         - Complete delivery
GET    /api/delivery/active                - Get active delivery
GET    /api/delivery/history               - Get delivery history
GET    /api/delivery/earnings              - Get earnings

Admin endpoints:
GET    /api/admin/delivery/agents          - Get all agents
GET    /api/admin/delivery/stats           - Get delivery statistics
```

**Dependencies**:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- mysql-connector-java
- spring-kafka (for location updates)

---

### 3.8 Notification Service (Port 8086)
**Purpose**: Send notifications to users

**Database**: notification_db

**Entities**:
- Notification (id, userId, type, title, message, isRead, createdAt)
- EmailLog (id, userId, subject, body, status, sentAt)

**Endpoints**:
```
GET    /api/notifications                  - Get user notifications
GET    /api/notifications/unread           - Get unread notifications
PUT    /api/notifications/{id}/read        - Mark as read
DELETE /api/notifications/{id}             - Delete notification
```

**Kafka Consumers**:
- Order created → Send confirmation email
- Order status changed → Send status update
- Payment successful → Send receipt
- Delivery assigned → Notify agent

**Dependencies**:
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-mail
- spring-kafka
- mysql-connector-java

---

## 4. Security Architecture

### 4.1 JWT Authentication
```
1. User logs in with credentials
2. User Service validates and generates JWT token
3. Token contains: userId, email, role, expiry
4. Token sent to client
5. Client includes token in Authorization header
6. API Gateway validates token
7. Request forwarded to microservice with user info
```

### 4.2 Role-Based Access Control (RBAC)
```
Roles:
- CUSTOMER: Can browse, order, track
- RESTAURANT_OWNER: Can manage restaurant, menu, orders
- DELIVERY_AGENT: Can accept deliveries, update location
- ADMIN: Full system access
```

### 4.3 Security Configuration
- CORS enabled for frontend (http://localhost:5173)
- HTTPS in production
- Password encryption (BCrypt)
- JWT token expiry: 24 hours
- Refresh token expiry: 7 days
- Rate limiting on API Gateway
- SQL injection prevention (JPA)
- XSS protection

---

## 5. Database Schema

### Common Fields (All Tables)
- id: BIGINT PRIMARY KEY AUTO_INCREMENT
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

### Relationships
- User 1:N Address
- User 1:N Order
- Restaurant 1:N MenuCategory
- MenuCategory 1:N MenuItem
- Restaurant 1:N Review
- Order 1:N OrderItem
- Order 1:N OrderStatusHistory
- User 1:N Payment
- DeliveryAgent 1:N Delivery

---

## 6. Kafka Topics

```
order-created          - New order placed
order-status-changed   - Order status updated
payment-completed      - Payment successful
delivery-assigned      - Delivery assigned to agent
delivery-location      - Agent location update
notification-email     - Send email notification
notification-sms       - Send SMS notification
```

---

## 7. API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-02-17T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2026-02-17T12:00:00Z"
}
```

---

## 8. Development Environment

### Prerequisites
- JDK 17
- Maven 3.8+
- MySQL 8.0
- Kafka 3.x
- Docker (optional)
- Postman (for API testing)

### Port Allocation
- 8761: Eureka Server
- 8080: API Gateway
- 8081: User Service
- 8082: Restaurant Service
- 8083: Order Service
- 8084: Delivery Service
- 8085: Payment Service
- 8086: Notification Service
- 3306: MySQL
- 9092: Kafka
- 2181: Zookeeper

---

## 9. Deployment Strategy

### Local Development
```bash
# Start Eureka Server
# Start API Gateway
# Start all microservices
# Services auto-register with Eureka
```

### Docker Compose
```yaml
services:
  - mysql
  - kafka
  - zookeeper
  - eureka-server
  - api-gateway
  - user-service
  - restaurant-service
  - order-service
  - delivery-service
  - payment-service
  - notification-service
```

### Production (Kubernetes)
- Each service as a deployment
- MySQL as StatefulSet
- Kafka as StatefulSet
- Load balancer for API Gateway
- Auto-scaling based on load

---

## 10. Monitoring & Logging

### Tools
- Spring Boot Actuator (health checks)
- Prometheus (metrics)
- Grafana (dashboards)
- ELK Stack (logging)
- Zipkin (distributed tracing)

### Metrics to Monitor
- Request rate
- Response time
- Error rate
- Database connections
- Kafka lag
- Service health

---

## 11. Testing Strategy

### Unit Tests
- JUnit 5
- Mockito
- Test coverage > 80%

### Integration Tests
- TestContainers (MySQL, Kafka)
- MockMvc for API testing
- @SpringBootTest

### E2E Tests
- Postman collections
- Newman (CLI runner)

---

## 12. CI/CD Pipeline

```
1. Code commit → GitHub
2. GitHub Actions triggered
3. Run tests
4. Build Docker images
5. Push to Docker Hub
6. Deploy to staging
7. Run E2E tests
8. Deploy to production (manual approval)
```

---

Last Updated: February 17, 2026
