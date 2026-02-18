-- Fix menu item availability
-- Run this in MySQL to make all menu items available

USE restaurant_db;

-- Update all menu items to be available
UPDATE menu_items SET available = true WHERE available = false OR available IS NULL;

-- Verify the update
SELECT id, name, available FROM menu_items LIMIT 10;
