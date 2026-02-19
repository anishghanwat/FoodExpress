# Check Order Status and Delivery Records

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Checking Order Status and Deliveries" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get order ID from parameter or default to 12
$orderId = if ($args.Count -gt 0) { $args[0] } else { 12 }

# Check order status
Write-Host "Order #$orderId Status:" -ForegroundColor Yellow
docker exec -it fooddelivery-mysql mysql -uroot -proot order_db -e "SELECT id, status, restaurant_id, customer_id, total_amount, created_at FROM orders WHERE id = $orderId;"
Write-Host ""

# Check if delivery record exists
Write-Host "Delivery Records for Order #$orderId:" -ForegroundColor Yellow
docker exec -it fooddelivery-mysql mysql -uroot -proot delivery_db -e "SELECT id, order_id, agent_id, status, created_at FROM deliveries WHERE order_id = $orderId;"
Write-Host ""

# Check all available deliveries
Write-Host "All Available Deliveries (agent_id IS NULL):" -ForegroundColor Yellow
docker exec -it fooddelivery-mysql mysql -uroot -proot delivery_db -e "SELECT id, order_id, agent_id, status, created_at FROM deliveries WHERE agent_id IS NULL ORDER BY created_at DESC LIMIT 5;"
Write-Host ""

# Check Kafka status
Write-Host "Kafka Status:" -ForegroundColor Yellow
docker ps --filter "name=kafka" --format "table {{.Names}}\t{{.Status}}"
Write-Host ""

# Check Delivery Service status
Write-Host "Delivery Service Status:" -ForegroundColor Yellow
$deliveryService = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*delivery-service*" }
if ($deliveryService) {
    Write-Host "✓ Delivery Service is running (PID: $($deliveryService.Id))" -ForegroundColor Green
} else {
    Write-Host "✗ Delivery Service is NOT running" -ForegroundColor Red
    Write-Host "Start it with: cd delivery-service && mvn spring-boot:run" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Troubleshooting Tips:" -ForegroundColor Yellow
Write-Host "1. If order status is not READY_FOR_PICKUP, update via Owner Dashboard" -ForegroundColor Cyan
Write-Host "2. If Kafka is not running: docker start fooddelivery-kafka" -ForegroundColor Cyan
Write-Host "3. If Delivery Service is not running: cd delivery-service && mvn spring-boot:run" -ForegroundColor Cyan
Write-Host "4. Check delivery-service logs: docker logs delivery-service --tail 50" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
