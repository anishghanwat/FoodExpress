# Frontend Backend Integration - Ready ✅

## Overview

The frontend is now fully configured and ready to integrate with the backend microservices through the API Gateway.

## Configuration

### Environment Variables

**Development** (`.env.development`):
```env
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
VITE_APP_NAME=Food Delivery System (Dev)
```

**Production** (`.env.production`):
```env
VITE_API_GATEWAY_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws
VITE_APP_NAME=Food Delivery System
```

## API Services Structure

All API services are located in `src/app/services/` and are ready for backend integration:

### 1. Core API Service (`api.js`)
- Axios instance with interceptors
- Automatic JWT token injection
- Backend response format handling: `{success, data, message, timestamp}`
- Error handling and toast notifications
- Request/response logging in development

### 2. Authentication Service (`authService.js`)
- ✅ Login: `POST /api/auth/login`
- ✅ Register: `POST /api/auth/register`
- ✅ Logout: `POST /api/auth/logout`
- ✅ Forgot Password: `POST /api/auth/forgot-password`
- ✅ Reset Password: `POST /api/auth/reset-password`
- ✅ Verify Email: `POST /api/auth/verify-email`

### 3. User Service (`userService.js`)
- ✅ Get Profile: `GET /api/users/profile`
- ✅ Update Profile: `PUT /api/users/profile`
- ✅ Get Addresses: `GET /api/users/addresses`
- ✅ Add Address: `POST /api/users/addresses`
- ✅ Update Address: `PUT /api/users/addresses/{id}`
- ✅ Delete Address: `DELETE /api/users/addresses/{id}`
- ✅ Upload Profile Picture: `POST /api/users/profile/picture`

### 4. Restaurant Service (`restaurantService.js`)
- ✅ Get All: `GET /api/restaurants`
- ✅ Search: `GET /api/restaurants/search?query=...`
- ✅ Get Featured: `GET /api/restaurants/featured`
- ✅ Get By ID: `GET /api/restaurants/{id}`
- ✅ Get Menu: `GET /api/restaurants/{id}/menu`
- ✅ Get Reviews: `GET /api/restaurants/{id}/reviews`
- ✅ Add Review: `POST /api/restaurants/{id}/reviews`
- ✅ Create: `POST /api/restaurants`
- ✅ Update: `PUT /api/restaurants/{id}`
- ✅ Delete: `DELETE /api/restaurants/{id}`
- ✅ Upload Image: `POST /api/restaurants/{id}/image`

### 5. Menu Service (`menuService.js`)
- ✅ Get By Restaurant: `GET /api/menu/restaurant/{restaurantId}`
- ✅ Get By ID: `GET /api/menu/{id}`
- ✅ Search: `GET /api/menu/items?query=...`
- ✅ Get Categories: `GET /api/menu/categories`
- ✅ Create: `POST /api/menu`
- ✅ Update: `PUT /api/menu/{id}`
- ✅ Delete: `DELETE /api/menu/{id}`
- ✅ Upload Image: `POST /api/menu/{id}/image`
- ✅ Toggle Availability: `PATCH /api/menu/{id}/availability`

### 6. Order Service (`orderService.js`)
- ✅ Create: `POST /api/orders`
- ✅ Get By ID: `GET /api/orders/{id}`
- ✅ Get Customer Orders: `GET /api/orders/customer`
- ✅ Get Restaurant Orders: `GET /api/orders/restaurant`
- ✅ Get Agent Orders: `GET /api/orders/agent`
- ✅ Track: `GET /api/orders/{id}/track`
- ✅ Update Status: `PATCH /api/orders/{id}`
- ✅ Cancel: `POST /api/orders/{id}/cancel`
- ✅ Rate: `POST /api/orders/{id}/rate`

### 7. Delivery Service (`deliveryService.js`)
- ✅ Get All: `GET /api/deliveries`
- ✅ Get By Order: `GET /api/deliveries/order/{orderId}`
- ✅ Get Agent Deliveries: `GET /api/deliveries/agent/{agentId}`
- ✅ Get Available: `GET /api/deliveries/available`
- ✅ Get Active: `GET /api/deliveries/active`
- ✅ Get History: `GET /api/deliveries/history`
- ✅ Create: `POST /api/deliveries`
- ✅ Accept: `POST /api/deliveries/{id}/accept`
- ✅ Update Status: `PUT /api/deliveries/{id}/status`
- ✅ Complete: `POST /api/deliveries/{id}/complete`
- ✅ Update Location: `PUT /api/deliveries/{id}/location`

### 8. Payment Service (`paymentService.js`)
- ✅ Get All: `GET /api/payments`
- ✅ Get By Order: `GET /api/payments/order/{orderId}`
- ✅ Get History: `GET /api/payments/history`
- ✅ Get Methods: `GET /api/payments/methods`
- ✅ Create: `POST /api/payments`
- ✅ Process: `POST /api/payments/{id}/process`
- ✅ Verify: `POST /api/payments/{id}/verify`
- ✅ Refund: `POST /api/payments/{id}/refund`

### 9. Notification Service (`notificationService.js`)
- ✅ Get All: `GET /api/notifications`
- ✅ Get Unread: `GET /api/notifications/unread`
- ✅ Mark As Read: `PUT /api/notifications/{id}/read`
- ✅ Mark All As Read: `PUT /api/notifications/read-all`
- ✅ Delete: `DELETE /api/notifications/{id}`
- ✅ Send: `POST /api/notifications/send`

### 10. Admin Service (`adminService.js`)
- ✅ User Management (CRUD + Suspend/Activate)
- ✅ Restaurant Management (CRUD + Approve/Reject/Suspend)
- ✅ Order Management (View + Update Status + Cancel + Refund)
- ✅ Analytics (Dashboard, Revenue, Orders, Users, Restaurants)

## Backend Response Format

All backend services return responses in this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-02-17T13:17:00"
}
```

The frontend API interceptor automatically extracts the `data` field for easier consumption.

## Authentication Flow

### 1. Login/Register
```javascript
import { authService } from '@/services';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
// Response: { token, user }
// Token is automatically stored in localStorage
// User is stored in AuthContext

// Register
const response = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  password: 'Password123',
  role: 'CUSTOMER'
});
```

### 2. Authenticated Requests
```javascript
// Token is automatically added to all requests via interceptor
const restaurants = await restaurantService.getAll();
```

### 3. Logout
```javascript
await authService.logout();
// Clears token, user data, and cart from localStorage
```

## Context Providers

### AuthContext
- Manages authentication state
- Provides: `user`, `isAuthenticated`, `login`, `register`, `logout`
- Automatically loads user from localStorage on mount
- Handles token storage

### CartContext
- Manages shopping cart state
- Provides: `cart`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- Persists cart to localStorage
- Calculates totals automatically

## Protected Routes

### PrivateRoute
Requires authentication:
```jsx
<PrivateRoute>
  <OrderHistory />
</PrivateRoute>
```

### RoleBasedRoute
Requires specific role:
```jsx
<RoleBasedRoute allowedRoles={['RESTAURANT_OWNER']}>
  <OwnerDashboard />
</RoleBasedRoute>
```

### GuestRoute
Only for non-authenticated users:
```jsx
<GuestRoute>
  <Login />
</GuestRoute>
```

## User Roles

```javascript
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  RESTAURANT_OWNER: 'RESTAURANT_OWNER',
  DELIVERY_AGENT: 'DELIVERY_AGENT',
  ADMIN: 'ADMIN',
};
```

## Order Status Flow

```javascript
PENDING → CONFIRMED → PREPARING → READY → PICKED_UP → ON_THE_WAY → DELIVERED
                                                    ↓
                                                CANCELLED
```

## Payment Methods

```javascript
export const PAYMENT_METHODS = {
  CARD: 'CARD',
  WALLET: 'WALLET',
  CASH: 'CASH',
  UPI: 'UPI',
};
```

## Usage Examples

### Example 1: Login User
```javascript
import { useAuth } from '@/context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // User is now authenticated
      // Redirect to dashboard
    } catch (error) {
      // Error is already shown via toast
    }
  };
}
```

### Example 2: Fetch Restaurants
```javascript
import { restaurantService } from '@/services';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAll({
          page: 1,
          limit: 10,
          cuisine: 'Italian'
        });
        setRestaurants(data);
      } catch (error) {
        // Error is already shown via toast
      }
    };
    
    fetchRestaurants();
  }, []);
}
```

### Example 3: Create Order
```javascript
import { orderService } from '@/services';
import { useCart } from '@/context/CartContext';

function Checkout() {
  const { cart, clearCart } = useCart();
  
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        restaurantId: cart.restaurantId,
        items: cart.items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: selectedAddress,
        paymentMethod: 'CARD',
        totalAmount: cart.total
      };
      
      const order = await orderService.create(orderData);
      clearCart();
      // Redirect to order tracking
    } catch (error) {
      // Error is already shown via toast
    }
  };
}
```

### Example 4: Track Order
```javascript
import { orderService } from '@/services';

function OrderTracking({ orderId }) {
  const [order, setOrder] = useState(null);
  
  useEffect(() => {
    const trackOrder = async () => {
      const data = await orderService.track(orderId);
      setOrder(data);
    };
    
    // Poll every 10 seconds
    const interval = setInterval(trackOrder, 10000);
    trackOrder();
    
    return () => clearInterval(interval);
  }, [orderId]);
}
```

## Error Handling

All errors are automatically handled by the API interceptor:
- 401 Unauthorized → Redirect to login
- 403 Forbidden → Show error toast
- 404 Not Found → Silent (no toast)
- 500 Server Error → Show error toast

Custom error handling:
```javascript
try {
  await restaurantService.create(data);
} catch (error) {
  if (error.response?.status === 400) {
    // Handle validation errors
    const errors = error.response.data.errors;
  }
}
```

## File Upload

```javascript
import { restaurantService } from '@/services';

const handleImageUpload = async (file) => {
  try {
    const response = await restaurantService.uploadImage(
      restaurantId,
      file,
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
      }
    );
    console.log('Image uploaded:', response.imageUrl);
  } catch (error) {
    // Error is already shown via toast
  }
};
```

## Testing Integration

### 1. Start Backend Services
```bash
# Create databases
mysql -u root -proot < CREATE_DATABASES.sql

# Start all services
start-services-step-by-step.bat

# Verify at http://localhost:8761
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Authentication
1. Go to http://localhost:5173/register
2. Register a new user
3. Check browser console for API calls
4. Check localStorage for token and user data
5. Verify redirect to dashboard

### 4. Test Restaurant Browsing
1. Go to http://localhost:5173/restaurants
2. Check API call to `/api/restaurants`
3. Verify restaurants are displayed

## Next Steps

1. ✅ Backend services running
2. ✅ Frontend services configured
3. 🔄 Test authentication flow
4. 🔄 Test restaurant browsing
5. 🔄 Test order placement
6. 🔄 Test delivery tracking
7. 🔄 Test payment processing
8. 🔄 Test admin panel

## Troubleshooting

### CORS Issues
- Backend SecurityConfig already allows `http://localhost:5173`
- Check browser console for CORS errors
- Verify API Gateway CORS configuration

### 401 Unauthorized
- Check if token is stored in localStorage
- Verify token format: `Bearer <token>`
- Check token expiration (24 hours)

### Network Errors
- Verify backend services are running
- Check Eureka dashboard: http://localhost:8761
- Verify API Gateway is running: http://localhost:8080

### Response Format Issues
- Backend returns: `{success, data, message, timestamp}`
- Frontend extracts `data` automatically
- Check browser console for response structure

## Summary

✅ All API services created and configured
✅ Backend response format handling implemented
✅ Authentication flow ready
✅ Protected routes configured
✅ Context providers ready
✅ Error handling implemented
✅ File upload support added
✅ All endpoints mapped to backend

The frontend is now fully ready to integrate with the backend microservices!

---

**Last Updated**: February 17, 2026
**Status**: Ready for Integration Testing
