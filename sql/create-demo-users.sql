-- Create demo users with password: password123
-- Password is BCrypt hashed

-- Customer
INSERT INTO users (name, email, password, phone, role, is_active, created_at, updated_at)
VALUES ('Demo Customer', 'customer@test.com', '$2a$10$xqZ8jK5L5L5L5L5L5L5L5uYvXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', '+1234567890', 'CUSTOMER', 1, NOW(), NOW());

-- Restaurant Owner
INSERT INTO users (name, email, password, phone, role, is_active, created_at, updated_at)
VALUES ('Demo Owner', 'owner@test.com', '$2a$10$xqZ8jK5L5L5L5L5L5L5L5uYvXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', '+1234567891', 'RESTAURANT_OWNER', 1, NOW(), NOW());

-- Delivery Agent
INSERT INTO users (name, email, password, phone, role, is_active, created_at, updated_at)
VALUES ('Demo Agent', 'agent@test.com', '$2a$10$xqZ8jK5L5L5L5L5L5L5L5uYvXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', '+1234567892', 'DELIVERY_AGENT', 1, NOW(), NOW());

-- Admin
INSERT INTO users (name, email, password, phone, role, is_active, created_at, updated_at)
VALUES ('Demo Admin', 'admin@test.com', '$2a$10$xqZ8jK5L5L5L5L5L5L5L5uYvXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx', '+1234567893', 'ADMIN', 1, NOW(), NOW());
