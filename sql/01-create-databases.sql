-- Food Delivery System - Database Initialization Script
-- This script runs automatically when MySQL container starts for the first time

-- Create databases for all microservices
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS restaurant_db;
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS delivery_db;
CREATE DATABASE IF NOT EXISTS payment_db;

-- Grant privileges (optional, root already has all privileges)
GRANT ALL PRIVILEGES ON user_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON restaurant_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON order_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON delivery_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON payment_db.* TO 'root'@'%';

FLUSH PRIVILEGES;

-- Show created databases
SHOW DATABASES;
