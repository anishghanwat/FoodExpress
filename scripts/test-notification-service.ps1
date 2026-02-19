# Test Notification Service
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Notification Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8086"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/actuator/health" -Method Get
    Write-Host "✓ Service is healthy" -ForegroundColor Green
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Service health check failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get Unread Count (for user 1)
Write-Host "Test 2: Get Unread Count" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/notifications/count?userId=1" -Method Get
    Write-Host "✓ Unread count retrieved" -ForegroundColor Green
    Write-Host "  User ID: $($response.userId)" -ForegroundColor Gray
    Write-Host "  Unread Count: $($response.unreadCount)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to get unread count" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Unread Notifications
Write-Host "Test 3: Get Unread Notifications" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/notifications/unread?userId=1" -Method Get
    Write-Host "✓ Unread notifications retrieved" -ForegroundColor Green
    Write-Host "  Count: $($response.Count)" -ForegroundColor Gray
    if ($response.Count -gt 0) {
        Write-Host "  Latest notification:" -ForegroundColor Gray
        Write-Host "    - Title: $($response[0].title)" -ForegroundColor Gray
        Write-Host "    - Message: $($response[0].message)" -ForegroundColor Gray
        Write-Host "    - Type: $($response[0].type)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to get unread notifications" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get All Notifications (paginated)
Write-Host "Test 4: Get All Notifications (Paginated)" -ForegroundColor Yellow
try {
    $url = "$baseUrl/api/notifications?userId=1&page=0&size=5"
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "✓ Notifications retrieved" -ForegroundColor Green
    Write-Host "  Total Elements: $($response.totalElements)" -ForegroundColor Gray
    Write-Host "  Total Pages: $($response.totalPages)" -ForegroundColor Gray
    Write-Host "  Current Page: $($response.number)" -ForegroundColor Gray
    Write-Host "  Page Size: $($response.size)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to get notifications" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service URL: $baseUrl" -ForegroundColor Gray
Write-Host "WebSocket: ws://localhost:8086/ws/notifications" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Create an order to trigger notifications" -ForegroundColor Gray
Write-Host "2. Check Kafka topics for events" -ForegroundColor Gray
Write-Host "3. Verify notifications are created in database" -ForegroundColor Gray
Write-Host "4. Test WebSocket connection from frontend" -ForegroundColor Gray
Write-Host ""
