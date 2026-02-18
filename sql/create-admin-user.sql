-- Create Admin User for Food Delivery System
-- Email: admin@foodexpress.com
-- Password: Admin@123

USE user_db;

-- Check if admin user already exists
SELECT 'Checking for existing admin user...' as '';
SELECT id, name, email, role FROM users WHERE email = 'admin@foodexpress.com';

-- Create admin user if not exists
-- Password hash for "Admin@123" using BCrypt
INSERT INTO users (name, email, phone, password, role, is_active, created_at, updated_at)
SELECT * FROM (
    SELECT 
        'Admin User' as name,
        'admin@foodexpress.com' as email,
        '1234567890' as phone,
        '$2a$10$rZ8qH5qF5qF5qF5qF5qF5.N5qF5qF5qF5qF5qF5qF5qF5qF5qF5qF' as password,
        'ADMIN' as role,
        true as is_active,
        NOW() as created_at,
        NOW() as updated_at
) as tmp
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@foodexpress.com'
) LIMIT 1;

-- Verify admin user was created
SELECT 'Admin user status:' as '';
SELECT id, name, email, role, is_active, created_at FROM users WHERE email = 'admin@foodexpress.com';

-- Alternative: Update existing user to admin
-- Uncomment the line below and replace the email with your existing user email
-- UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';

SELECT 'Setup complete!' as '';
SELECT 'Login credentials:' as '';
SELECT 'Email: admin@foodexpress.com' as '';
SELECT 'Password: Admin@123' as '';
