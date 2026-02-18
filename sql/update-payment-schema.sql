-- Update payment_method column to accommodate new enum values
-- This fixes the "Data truncated for column 'payment_method'" error

USE payment_db;

-- Check current column definition
DESCRIBE payments;

-- Alter the payment_method column to use VARCHAR with enough length
ALTER TABLE payments 
MODIFY COLUMN payment_method VARCHAR(20) NOT NULL;

-- Verify the change
DESCRIBE payments;

SELECT 'Payment schema updated successfully!' as status;
