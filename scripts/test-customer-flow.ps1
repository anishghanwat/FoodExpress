# Test Customer Order Flow
# This script tests the complete customer journey from browsing to placing an order

$API_BASE = "http://localhost:8080"
$CUSTOMER_EMAIL = "customer@test.com"
$CUSTOMER_PASSWORD = "Password@123"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Customer Order Flow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as customer
Write-Host "Step 1: Login as customer..." -ForegroundColor Yellow
$loginBody = @{
    email = $CUSTOMER_EMAIL
    password = $CUSTOMER_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_BASE/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    $userId = $loginResponse.data.user.id
    Write-Host "✓ Login successful! User ID: $userId" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get restaurants
Write-Host "Step 2: Browse restaurants..." -ForegroundColor Yellow
try {
    $restaurants = Invoke-RestMethod -Uri "$API_BASE/api/restaurants" -Method Get
    $restaurantCount = $restaurants.data.Count
    Write-Host "✓ Found $restaurantCount restaurants" -ForegroundColor Green
    
    if ($restaurantCount -gt 0) {
        $restaurant = $restaurants.data[0]
        $restaurantId = $restaurant.id
        $restaurantName = $restaurant.name
        Write-Host "  Selected: $restaurantName (ID: $restaurantId)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ No restaurants found" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get restaurants: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Get menu items
Write-Host "Step 3: View restaurant menu..." -ForegroundColor Yellow
try {
    $menuItems = Invoke-RestMethod -Uri "$API_BASE/api/menu/restaurant/$restaurantId" -Method Get
    $menuCount = $menuItems.data.Count
    Write-Host "✓ Found $menuCount menu items" -ForegroundColor Green
    
    if ($menuCount -gt 0) {
        # Select first 2 available items
        $selectedItems = $menuItems.data | Where-Object { $_.isAvailable -eq $true } | Select-Object -First 2
        Write-Host "  Selected items:" -ForegroundColor Cyan
        foreach ($item in $selectedItems) {
            Write-Host "    - $($item.name) ($($item.price))" -ForegroundColor Cyan
        }
    } else {
        Write-Host "✗ No menu items found" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get menu items: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Create order
Write-Host "Step 4: Place order..." -ForegroundColor Yellow
$orderItems = @()
foreach ($item in $selectedItems) {
    $orderItems += @{
        menuItemId = $item.id
        itemName = $item.name
        quantity = 1
        price = $item.price
    }
}

$orderBody = @{
    restaurantId = $restaurantId
    items = $orderItems
    deliveryAddress = "123 Test St, Apt 4B, Test City, Test State 12345"
    deliveryInstructions = "Test order from PowerShell script"
    paymentMethod = "CASH"
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $token"
    "X-User-Id" = $userId.ToString()
    "Content-Type" = "application/json"
}

try {
    $orderResponse = Invoke-RestMethod -Uri "$API_BASE/api/orders" -Method Post -Body $orderBody -Headers $headers
    $orderId = $orderResponse.data.id
    $orderTotal = $orderResponse.data.totalAmount
    Write-Host "✓ Order placed successfully!" -ForegroundColor Green
    Write-Host "  Order ID: $orderId" -ForegroundColor Cyan
    Write-Host "  Total: `$$orderTotal" -ForegroundColor Cyan
    Write-Host "  Status: $($orderResponse.data.status)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "✗ Failed to place order: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# Step 5: Get order details
Write-Host "Step 5: Verify order details..." -ForegroundColor Yellow
try {
    $orderDetails = Invoke-RestMethod -Uri "$API_BASE/api/orders/$orderId" -Method Get -Headers $headers
    Write-Host "✓ Order retrieved successfully!" -ForegroundColor Green
    Write-Host "  Restaurant ID: $($orderDetails.data.restaurantId)" -ForegroundColor Cyan
    Write-Host "  Items: $($orderDetails.data.items.Count)" -ForegroundColor Cyan
    Write-Host "  Status: $($orderDetails.data.status)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get order details: $_" -ForegroundColor Red
    exit 1
}

# Step 6: Get customer orders
Write-Host "Step 6: View order history..." -ForegroundColor Yellow
try {
    $customerOrders = Invoke-RestMethod -Uri "$API_BASE/api/orders/customer" -Method Get -Headers $headers
    $orderCount = $customerOrders.data.Count
    Write-Host "✓ Found $orderCount orders in history" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get order history: $_" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Customer Flow Test Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  ✓ Customer login" -ForegroundColor Green
Write-Host "  ✓ Browse restaurants" -ForegroundColor Green
Write-Host "  ✓ View menu items" -ForegroundColor Green
Write-Host "  ✓ Place order" -ForegroundColor Green
Write-Host "  ✓ View order details" -ForegroundColor Green
Write-Host "  ✓ View order history" -ForegroundColor Green
Write-Host ""
Write-Host "Order ID: $orderId" -ForegroundColor Cyan
Write-Host "Total Amount: `$$orderTotal" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Check Kafka UI: http://localhost:8090" -ForegroundColor Cyan
Write-Host "  2. Login as owner (owner@test.com) to see the order" -ForegroundColor Cyan
Write-Host "  3. Update order status to READY_FOR_PICKUP" -ForegroundColor Cyan
Write-Host "  4. Login as agent (agent@test.com) to accept delivery" -ForegroundColor Cyan
Write-Host ""
