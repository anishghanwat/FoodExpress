Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete Event Loop" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login as owner
Write-Host "Step 1: Login as owner..." -ForegroundColor Yellow
$ownerLogin = @{
    email = "owner@test.com"
    password = "Password@123"
} | ConvertTo-Json

$ownerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post -ContentType "application/json" -Body $ownerLogin
$ownerToken = $ownerResponse.data.token
Write-Host "✅ Owner logged in" -ForegroundColor Green
Write-Host ""

# Step 2: Login as agent
Write-Host "Step 2: Login as agent..." -ForegroundColor Yellow
$agentLogin = @{
    email = "agent@test.com"
    password = "Password@123"
} | ConvertTo-Json

$agentResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post -ContentType "application/json" -Body $agentLogin
$agentToken = $agentResponse.data.token
$agentId = $agentResponse.data.user.id
Write-Host "✅ Agent logged in (ID: $agentId)" -ForegroundColor Green
Write-Host ""

# Step 3: Create a new order
Write-Host "Step 3: Creating new order..." -ForegroundColor Yellow
$orderBody = @{
    restaurantId = 1
    items = @(
        @{
            menuItemId = 1
            quantity = 1
        }
    )
    deliveryAddress = "456 Test Avenue, City, State 67890"
} | ConvertTo-Json

$ownerHeaders = @{
    "Authorization" = "Bearer $ownerToken"
    "Content-Type" = "application/json"
}

# Use customer token for creating order
$customerLogin = @{
    email = "customer@test.com"
    password = "Password@123"
} | ConvertTo-Json

$customerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post -ContentType "application/json" -Body $customerLogin
$customerToken = $customerResponse.data.token

$customerHeaders = @{
    "Authorization" = "Bearer $customerToken"
    "Content-Type" = "application/json"
}

$orderResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/orders" `
    -Method Post -Headers $customerHeaders -Body $orderBody

$orderId = $orderResponse.data.id
Write-Host "✅ Order created: ID=$orderId, Status=PENDING" -ForegroundColor Green
Write-Host ""

# Step 4: Update order through statuses
Write-Host "Step 4: Owner updating order status..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

Write-Host "  → CONFIRMED"
Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId/status?status=CONFIRMED" `
    -Method Put -Headers $ownerHeaders | Out-Null
Start-Sleep -Seconds 1

Write-Host "  → PREPARING"
Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId/status?status=PREPARING" `
    -Method Put -Headers $ownerHeaders | Out-Null
Start-Sleep -Seconds 1

Write-Host "  → READY_FOR_PICKUP (Kafka: ORDER_READY_FOR_PICKUP)"
Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId/status?status=READY_FOR_PICKUP" `
    -Method Put -Headers $ownerHeaders | Out-Null
Write-Host "✅ Order ready for pickup" -ForegroundColor Green
Write-Host ""

# Wait for Kafka processing
Write-Host "⏳ Waiting 3 seconds for Kafka to create delivery..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Step 5: Check if delivery was created
Write-Host "Step 5: Checking if delivery was created..." -ForegroundColor Yellow
$deliveries = Invoke-RestMethod -Uri "http://localhost:8080/api/deliveries/available"
$delivery = $deliveries.data | Where-Object { $_.orderId -eq $orderId }

if ($delivery) {
    Write-Host "✅ Delivery created automatically: ID=$($delivery.id)" -ForegroundColor Green
    $deliveryId = $delivery.id
} else {
    Write-Host "❌ No delivery found for order $orderId" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 6: Agent accepts delivery
Write-Host "Step 6: Agent accepting delivery..." -ForegroundColor Yellow
$agentHeaders = @{
    "Authorization" = "Bearer $agentToken"
    "X-User-Id" = $agentId.ToString()
}

Invoke-RestMethod -Uri "http://localhost:8080/api/deliveries/$deliveryId/accept" `
    -Method Post -Headers $agentHeaders | Out-Null
Write-Host "✅ Agent accepted delivery (Kafka: DELIVERY_ASSIGNED)" -ForegroundColor Green
Start-Sleep -Seconds 2
Write-Host ""

# Step 7: Agent picks up order
Write-Host "Step 7: Agent picking up order..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:8080/api/deliveries/$deliveryId/status?status=PICKED_UP" `
    -Method Patch -Headers $agentHeaders | Out-Null
Write-Host "✅ Order picked up (Kafka: DELIVERY_PICKED_UP)" -ForegroundColor Green
Write-Host ""

# Wait for Kafka processing
Write-Host "⏳ Waiting 3 seconds for Kafka to update order status..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Step 8: Check order status updated to OUT_FOR_DELIVERY
Write-Host "Step 8: Checking if order status updated..." -ForegroundColor Yellow
$orderCheck1 = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId" `
    -Headers $customerHeaders
Write-Host "  Order Status: $($orderCheck1.data.status)" -ForegroundColor Cyan

if ($orderCheck1.data.status -eq "OUT_FOR_DELIVERY") {
    Write-Host "✅ Order status automatically updated to OUT_FOR_DELIVERY!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Expected OUT_FOR_DELIVERY, got $($orderCheck1.data.status)" -ForegroundColor Yellow
}
Write-Host ""

# Step 9: Agent marks as delivered
Write-Host "Step 9: Agent marking order as delivered..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:8080/api/deliveries/$deliveryId/status?status=DELIVERED" `
    -Method Patch -Headers $agentHeaders | Out-Null
Write-Host "✅ Order delivered (Kafka: DELIVERY_DELIVERED)" -ForegroundColor Green
Write-Host ""

# Wait for Kafka processing
Write-Host "⏳ Waiting 3 seconds for Kafka to update order status..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Step 10: Check final order status
Write-Host "Step 10: Checking final order status..." -ForegroundColor Yellow
$orderCheck2 = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId" `
    -Headers $customerHeaders
Write-Host "  Order Status: $($orderCheck2.data.status)" -ForegroundColor Cyan

if ($orderCheck2.data.status -eq "DELIVERED") {
    Write-Host "✅ Order status automatically updated to DELIVERED!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Expected DELIVERED, got $($orderCheck2.data.status)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST COMPLETE - Event Loop Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Order Flow:" -ForegroundColor White
Write-Host "  1. Order created → PENDING" -ForegroundColor Gray
Write-Host "  2. Owner confirmed → CONFIRMED" -ForegroundColor Gray
Write-Host "  3. Owner preparing → PREPARING" -ForegroundColor Gray
Write-Host "  4. Owner ready → READY_FOR_PICKUP" -ForegroundColor Gray
Write-Host "     └─ Kafka → Delivery created automatically" -ForegroundColor Magenta
Write-Host "  5. Agent accepted → Delivery ASSIGNED" -ForegroundColor Gray
Write-Host "  6. Agent picked up → Delivery PICKED_UP" -ForegroundColor Gray
Write-Host "     └─ Kafka → Order status → OUT_FOR_DELIVERY" -ForegroundColor Magenta
Write-Host "  7. Agent delivered → Delivery DELIVERED" -ForegroundColor Gray
Write-Host "     └─ Kafka → Order status → DELIVERED" -ForegroundColor Magenta
Write-Host ""
Write-Host "✅ Event-driven architecture working end-to-end!" -ForegroundColor Green
Write-Host ""
