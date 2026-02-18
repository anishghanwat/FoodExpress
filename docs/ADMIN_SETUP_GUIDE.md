# Admin Dashboard Setup Guide

## Issue
The admin endpoints are returning 404 because:
1. The new AdminController was added to user-service
2. The API Gateway needs to route `/api/admin/**` to user-service
3. Both services need to be rebuilt and restarted

## Quick Fix Steps

### Step 1: Rebuild API Gateway
```bash
rebuild-api-gateway.bat
```

Then restart API Gateway:
1. Stop the running api-gateway (Ctrl+C in its terminal)
2. Open new terminal
3. Run:
```bash
cd api-gateway
mvn spring-boot:run
```

### Step 2: Rebuild User Service
```bash
rebuild-user-service.bat
```

Then restart User Service:
1. Stop the running user-service (Ctrl+C in its terminal)
2. Open new terminal
3. Run:
```bash
cd user-service
mvn spring-boot:run
```

### Step 3: Verify Services
Wait for both services to register with Eureka (check http://localhost:8761)

### Step 4: Test Admin Endpoints

1. Login as admin user (you may need to create one first)
2. Navigate to http://localhost:5173/admin/dashboard
3. You should see:
   - Total users count
   - Total restaurants count
   - Active orders count
   - Total revenue

## Admin Endpoints Available

### User Management
- `GET /api/admin/users` - Get all users (with pagination)
- `GET /api/admin/users/{id}` - Get user by ID
- `GET /api/admin/users/search?query={query}` - Search users
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `POST /api/admin/users/{id}/suspend` - Suspend user
- `POST /api/admin/users/{id}/activate` - Activate user
- `GET /api/admin/stats` - Get platform stats

## Create Admin User

If you don't have an admin user, run this SQL:

```sql
-- Create admin user (password: Admin@123)
INSERT INTO users (name, email, phone, password, role, is_active, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@foodexpress.com',
    '1234567890',
    '$2a$10$YourBcryptHashHere',  -- You'll need to hash "Admin@123"
    'ADMIN',
    true,
    NOW(),
    NOW()
);
```

Or register through the UI and manually update the role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Testing the Admin Dashboard

1. Login with admin credentials
2. Navigate to `/admin/dashboard`
3. You should see:
   - Platform statistics
   - Quick action cards
   - Users by role breakdown

4. Navigate to `/admin/users`
5. You should see:
   - List of all users
   - Filter by role
   - Search functionality
   - Suspend/Activate buttons
   - Delete buttons

## Troubleshooting

### 404 Errors
- Make sure both user-service and api-gateway are rebuilt and restarted
- Check Eureka dashboard to ensure services are registered
- Check API Gateway logs for routing issues

### Frontend Errors
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors
- Verify API calls are going to correct endpoints

### Database Errors
- Ensure MySQL is running
- Check that user_db database exists
- Verify users table has all required columns

## What's Implemented

### Backend
✅ AdminController with full CRUD operations
✅ User management (list, search, update, delete, suspend, activate)
✅ Platform statistics
✅ Pagination support
✅ Role-based filtering

### Frontend
✅ AdminDashboard with real-time stats
✅ AdminUsers with full user management
✅ AdminRestaurants (basic implementation)
✅ AdminOrders (basic implementation)
✅ Clean, modern UI
✅ Responsive design

## Next Steps

After services are running:
1. Test user management features
2. Implement restaurant approval workflow
3. Add order monitoring features
4. Create analytics reports
5. Add platform settings
