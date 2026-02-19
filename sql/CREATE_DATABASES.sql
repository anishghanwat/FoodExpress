-- Food Delivery System - Database Creation Script
-- Run this script in MySQL before starting the services

-- Create databases
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS restaurant_db;
CREATE DATABASE IF NOT EXISTS order_db;
CREATE DATABASE IF NOT EXISTS delivery_db;
CREATE DATABASE IF NOT EXISTS payment_db;

-- Show created databases
SHOW DATABASES;

-- Note: Tables will be auto-created by Spring Boot JPA (ddl-auto: update)
