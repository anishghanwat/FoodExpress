# Test Notification Flow - End to End
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Notification Flow (End-to-End)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8086"
$apiGateway = "http://localhost:8080"

# Step 1: Check initial notification count
Write-Host "Step 1: Check initial notification count" -ForegroundColor Yellow
try {
    $initialCount = Invoke-RestMethod -Uri "$baseUrl/api/notifications/count?userId=1" -Method Get
    Write-Host "✓ Initial unread count: $($initialCount.unreadCount)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get initial count" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Login as customer
Write-Host "Step 2: Login as customer" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "customer@test.com"
        password = "Password@123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$apiGateway/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    $userId = $loginResponse.user.id
    Write-Host "✓ Logged in as customer (User ID: $userId)" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Get restaurants
Write-Host "Step 3: Get available restaurants" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $restaurants = Invoke-RestMethod -Uri "$apiGateway/api/restaurants" -Method Get -Headers $headers
    $restaurantId = $restaurants[0].id
    Write-Host "✓ Found restaurant (ID: $restaurantId)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get restaurants: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Get menu items
Write-Host "Step 4: Get menu items" -ForegroundColor Yellow
try {
    $menuItems = Invoke-RestMethod -Uri "$apiGateway/api/restaurants/$restaurantId/menu" -Method Get -Headers $headers
    $menuItemId = $menuItems[0].id
    $itemPrice = $menuItems[0].price
    Write-Host "✓ Found menu item (ID: $menuItemId, Price: `$$itemPrice)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get menu items: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 5: Create order
Write-Host "Step 5: Create order" -ForegroundColor Yellow
try {
    $orderBody = @{
        restaurantId = $restaurantId
        deliveryAddress = "123 Test Street"
        items = @(
            @{
                menuItemId = $menuItemId
                quantity = 2
            }
        )
    } | ConvertTo-Json

    $orderResponse = Invoke-RestMethod -Uri "$apiGateway/api/orders" -Method Post -Body $orderBody -ContentType "application/json" -Headers $headers
    $orderId = $orderResponse.data.id
    $totalAmount = $orderResponse.data.totalAmount
    Write-Host "✓ Order created (ID: $orderId, Total: `$$totalAmount)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create order: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Create payment intent
Write-Host "Step 6: Create payment intent" -ForegroundColor Yellow
try {
    $paymentBody = @{
        orderId = $orderId
        amount = $totalAmount
        currency = "usd"
    } | ConvertTo-Json

    $paymentResponse = Invoke-RestMethod -Uri "$apiGateway/api/payments/create-intent" -Method Post -Body $paymentBody -ContentType "application/json" -Headers $headers
    $paymentIntentId = $paymentResponse.clientSecret
    Write-Host "✓ Payment intent created" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create payment intent: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 7: Wait for Kafka events to be processed
Write-Host "Step 7: Waiting for Kafka events to be processed..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "✓ Wait complete" -ForegroundColor Green
Write-Host ""

# Step 8: Check notification count after order
Write-Host "Step 8: Check notification count after order" -ForegroundColor Yellow
try {
    $finalCount = Invoke-RestMethod -Uri "$baseUrl/api/notifications/count?userId=$userId" -Method Get
    Write-Host "✓ Final unread count: $($finalCount.unreadCount)" -ForegroundColor Green
    
    $newNotifications = $finalCount.unreadCount - $initialCount.unreadCount
    if ($newNotifications -gt 0) {
        Write-Host "✓ $newNotifications new notification(s) created!" -ForegroundColor Green
    } else {
        Write-Host "⚠ No new notifications created" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Failed to get final count" -ForegroundColor Red
}
Write-Host ""

# Step 9: Get unread notifications
Write-Host "Step 9: Get unread notifications" -ForegroundColor Yellow
try {
    $notifications = Invoke-RestMethod -Uri "$baseUrl/api/notifications/unread?userId=$userId" -Method Get
    Write-Host "✓ Retrieved $($notifications.Count) unread notification(s)" -ForegroundColor Green
    
    if ($notifications.Count -gt 0) {
        Write-Host "`nLatest Notifications:" -ForegroundColor Cyan
        foreach ($notif in $notifications | Select-Object -First 3) {
            Write-Host "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
            Write-Host "  ID: $($notif.id)" -ForegroundColor Gray
            Write-Host "  Type: $($notif.type)" -ForegroundColor Cyan
            Write-Host "  Title: $($notif.title)" -ForegroundColor Yellow
            Write-Host "  Message: $($notif.message)" -ForegroundColor White
            Write-Host "  Priority: $($notif.priority)" -ForegroundColor Magenta
            Write-Host "  Category: $($notif.category)" -ForegroundColor Blue
            Write-Host "  Created: $($notif.createdAt)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Failed to get notifications: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Order ID: $orderId" -ForegroundColor Gray
Write-Host "User ID: $userId" -ForegroundColor Gray
Write-Host "Total Amount: `$$totalAmount" -ForegroundColor Gray
Write-Host "New Notifications: $newNotifications" -ForegroundColor Green
Write-Host ""
Write-Host "Notification flow test complete!" -ForegroundColor Green
Write-Host ""
