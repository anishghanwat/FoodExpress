-- Mark order as READY_FOR_PICKUP so it appears in agent queue
-- Replace 12 with your actual order ID

UPDATE orders 
SET status = 'READY_FOR_PICKUP', 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 12;

-- Verify the update
SELECT id, status, created_at, updated_at 
FROM orders 
WHERE id = 12;
