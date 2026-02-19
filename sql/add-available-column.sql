-- Add available column to menu_items table
USE restaurant_db;

-- Add the available column if it doesn't exist
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;

-- Set all existing items to available
UPDATE menu_items SET available = true WHERE available IS NULL;

-- Verify
SELECT id, name, available FROM menu_items LIMIT 10;
