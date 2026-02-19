-- Add location tracking fields to deliveries table
-- Run this migration to enable map tracking features

USE delivery_db;

-- Add location coordinate fields
ALTER TABLE deliveries 
ADD COLUMN pickup_latitude DECIMAL(10, 8) AFTER delivery_address,
ADD COLUMN pickup_longitude DECIMAL(11, 8) AFTER pickup_latitude,
ADD COLUMN delivery_latitude DECIMAL(10, 8) AFTER pickup_longitude,
ADD COLUMN delivery_longitude DECIMAL(11, 8) AFTER delivery_latitude,
ADD COLUMN agent_latitude DECIMAL(10, 8) AFTER delivery_longitude,
ADD COLUMN agent_longitude DECIMAL(11, 8) AFTER agent_latitude,
ADD COLUMN estimated_distance_km DECIMAL(5, 2) AFTER agent_longitude,
ADD COLUMN estimated_time_minutes INT AFTER estimated_distance_km,
ADD COLUMN last_location_update TIMESTAMP NULL AFTER estimated_time_minutes;

-- Add index for location queries
CREATE INDEX idx_agent_location ON deliveries(agent_latitude, agent_longitude);
CREATE INDEX idx_last_location_update ON deliveries(last_location_update);

-- Verify the changes
DESCRIBE deliveries;

SELECT 'Migration completed successfully!' AS status;
