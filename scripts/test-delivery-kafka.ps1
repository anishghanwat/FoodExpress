Write-Host "========================================"
Write-Host "Testing Delivery Service Kafka Integration"
Write-Host "========================================"
Write-Host ""

# Step 1: Login
Write-Host "Step 1: Logging in as customer..."
$loginBody = @{
    email = "customer@test.com"
    password = "Password@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$token = $loginResponse.data.token
Write-Host "Token obtained: $($token.Substring(0,20))..."
Write-Host ""

# Step 2: Create order
Write-Host "Step 2: Creating new order..."
$orderBody = @{
    restaurantId = 1
    items = @(
        @{
            menuItemId = 1
            quantity = 2
        }
    )
    deliveryAddress = "123 Test St, City, State 12345"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$orderResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/orders" `
    -Method Post `
    -Headers $headers `
    -Body $orderBody

$orderId = $orderResponse.data.id
Write-Host "Order created with ID: $orderId"
Write-Host ""

# Step 3: Update to CONFIRMED
Write-Host "Step 3: Updating order to CONFIRMED..."
Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId/status?status=CONFIRMED" `
    -Method Put `
    -Headers $headers | Out-Null
Start-Sleep -Seconds 1

# Step 4: Update to PREPARING
Write-Host "Step 4: Updating order to PREPARING..."
Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId/status?status=PREPARING" `
    -Method Put `
    -Headers $headers | Out-Null
Start-Sleep -Seconds 1

# Step 5: Update to READY_FOR_PICKUP
Write-Host "Step 5: Updating order to READY_FOR_PICKUP..."
Write-Host "This should trigger Kafka event and create delivery record!"
Invoke-RestMethod -Uri "http://localhost:8080/api/orders/$orderId/status?status=READY_FOR_PICKUP" `
    -Method Put `
    -Headers $headers | Out-Null

Write-Host "Waiting 3 seconds for Kafka processing..."
Start-Sleep -Seconds 3
Write-Host ""

# Step 6: Check deliveries
Write-Host "Step 6: Checking if delivery was created..."
$deliveriesResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/deliveries/available" `
    -Method Get

Write-Host "Available deliveries:"
$deliveriesResponse.data | Where-Object { $_.orderId -eq $orderId } | ForEach-Object {
    Write-Host "  - Delivery ID: $($_.id)"
    Write-Host "    Order ID: $($_.orderId)"
    Write-Host "    Status: $($_.status)"
    Write-Host "    Delivery Address: $($_.deliveryAddress)"
    Write-Host "    Created At: $($_.createdAt)"
}

Write-Host ""
Write-Host "========================================"
Write-Host "Test Complete!"
Write-Host "Check the delivery-service logs for Kafka event processing"
Write-Host "========================================"
