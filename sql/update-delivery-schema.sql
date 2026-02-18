-- Update delivery_db schema to add new fields
USE delivery_db;

-- Make agent_id nullable (it's null until agent accepts)
ALTER TABLE deliveries 
MODIFY COLUMN agent_id BIGINT NULL;

-- Show the updated schema
DESCRIBE deliveries;
