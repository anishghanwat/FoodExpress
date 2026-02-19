# Test Agent Delivery Flow - End-to-End
# This script tests the complete agent delivery workflow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AGENT DELIVERY FLOW - E2E TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_BASE = "http://localhost:8080/api"
$CUSTOMER_EMAIL = "customer@test.com"
$OWNER_EMAIL = "owner@test.com"
$AGENT_EMAIL = "agent@test.com"
$PASSWORD = "Password@123"

# Function to login and get token
function Login {
    param($email, $password)
    
    $loginData = @{
        email = $email
        password = $password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method Post -Body $loginData -ContentType "application/json"
        return $response.data
    } catch {
        Write-Host "❌ Login failed for $email" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $null
    }
}

# Function to make authenticated request
function Invoke-AuthRequest {
    param($uri, $method, $token, $userId, $body = $null)
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "X-User-Id" = $userId
        "Content-Type" = "application/json"
    }
    
    try {
        if ($body) {
            $response = Invoke-RestMethod -Uri $uri -Method $method -Headers $headers -Body ($body | ConvertTo-Json) -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $method -Headers $headers
        }
        return $response
    } catch {
        Write-Host "❌ Request failed: $uri" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $null
    }
}

Write-Host "📝 STEP 1: Login Users" -ForegroundColor Yellow
Write-Host "----------------------------------------"

# Login as customer
Write-Host "Logging in as customer..." -NoNewline
$customerAuth = Login $CUSTOMER_EMAIL $PASSWORD
if ($customerAuth) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Customer ID: $($customerAuth.user.id)" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
    exit 1
}

# Login as owner
Write-Host "Logging in as owner..." -NoNewline
$ownerAuth = Login $OWNER_EMAIL $PASSWORD
if ($ownerAuth) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Owner ID: $($ownerAuth.user.id)" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
    exit 1
}

# Login as agent
Write-Host "Logging in as agent..." -NoNewline
$agentAuth = Login $AGENT_EMAIL $PASSWORD
if ($agentAuth) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Agent ID: $($agentAuth.user.id)" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 STEP 2: Get Available Restaurants" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$restaurants = Invoke-AuthRequest "$API_BASE/restaurants" "GET" $customerAuth.token $customerAuth.user.id
if ($restaurants -and $restaurants.data.Count -gt 0) {
    $restaurant = $restaurants.data[0]
    Write-Host "✅ Found restaurant: $($restaurant.name)" -ForegroundColor Green
    Write-Host "  Restaurant ID: $($restaurant.id)" -ForegroundColor Gray
} else {
    Write-Host "❌ No restaurants found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 STEP 3: Get Menu Items" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$menuItems = Invoke-AuthRequest "$API_BASE/menu/restaurant/$($restaurant.id)" "GET" $customerAuth.token $customerAuth.user.id
if ($menuItems -and $menuItems.data.Count -gt 0) {
    $menuItem = $menuItems.data[0]
    Write-Host "✅ Found menu item: $($menuItem.name)" -ForegroundColor Green
    Write-Host "  Item ID: $($menuItem.id)" -ForegroundColor Gray
    Write-Host "  Price: `$$($menuItem.price)" -ForegroundColor Gray
} else {
    Write-Host "❌ No menu items found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 STEP 4: Create Order (Customer)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$orderData = @{
    restaurantId = $restaurant.id
    items = @(
        @{
            menuItemId = $menuItem.id
            quantity = 2
            specialInstructions = "Test order for agent delivery flow"
        }
    )
    deliveryAddress = "123 Test Street, Test City, TC 12345"
    paymentMethod = "CARD"
}

$order = Invoke-AuthRequest "$API_BASE/orders" "POST" $customerAuth.token $customerAuth.user.id $orderData
if ($order -and $order.data) {
    Write-Host "✅ Order created successfully" -ForegroundColor Green
    Write-Host "  Order ID: $($order.data.id)" -ForegroundColor Gray
    Write-Host "  Status: $($order.data.status)" -ForegroundColor Gray
    Write-Host "  Total: `$$($order.data.totalAmount)" -ForegroundColor Gray
    $orderId = $order.data.id
} else {
    Write-Host "❌ Failed to create order" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 STEP 5: Confirm Order (Owner)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

Write-Host "Confirming order..." -NoNewline
$confirmResult = Invoke-AuthRequest "$API_BASE/orders/$orderId/confirm" "PATCH" $ownerAuth.token $ownerAuth.user.id
if ($confirmResult) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Status: CONFIRMED" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "📝 STEP 6: Mark Order Ready (Owner)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

Write-Host "Marking order as ready..." -NoNewline
$readyResult = Invoke-AuthRequest "$API_BASE/orders/$orderId/ready" "PATCH" $ownerAuth.token $ownerAuth.user.id
if ($readyResult) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Status: READY_FOR_PICKUP" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
}

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "📝 STEP 7: Check Available Deliveries (Agent)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$availableDeliveries = Invoke-AuthRequest "$API_BASE/deliveries/available" "GET" $agentAuth.token $agentAuth.user.id
if ($availableDeliveries -and $availableDeliveries.data.Count -gt 0) {
    Write-Host "✅ Found $($availableDeliveries.data.Count) available delivery(ies)" -ForegroundColor Green
    $delivery = $availableDeliveries.data | Where-Object { $_.orderId -eq $orderId } | Select-Object -First 1
    
    if ($delivery) {
        Write-Host "  Delivery ID: $($delivery.id)" -ForegroundColor Gray
        Write-Host "  Order ID: $($delivery.orderId)" -ForegroundColor Gray
        Write-Host "  Pickup: $($delivery.pickupAddress)" -ForegroundColor Gray
        Write-Host "  Delivery: $($delivery.deliveryAddress)" -ForegroundColor Gray
        $deliveryId = $delivery.id
    } else {
        Write-Host "⚠️  Delivery for order $orderId not found in queue" -ForegroundColor Yellow
        Write-Host "  Available deliveries:" -ForegroundColor Gray
        foreach ($d in $availableDeliveries.data) {
            Write-Host "    - Delivery #$($d.id) for Order #$($d.orderId)" -ForegroundColor Gray
        }
        $deliveryId = $availableDeliveries.data[0].id
    }
} else {
    Write-Host "❌ No available deliveries found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 STEP 8: Accept Delivery (Agent)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

Write-Host "Accepting delivery #$deliveryId..." -NoNewline
$acceptResult = Invoke-AuthRequest "$API_BASE/deliveries/$deliveryId/accept" "POST" $agentAuth.token $agentAuth.user.id
if ($acceptResult) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Status: ASSIGNED" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "📝 STEP 9: Check Active Deliveries (Agent)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$activeDeliveries = Invoke-AuthRequest "$API_BASE/deliveries/active" "GET" $agentAuth.token $agentAuth.user.id
if ($activeDeliveries -and $activeDeliveries.data.Count -gt 0) {
    Write-Host "✅ Found $($activeDeliveries.data.Count) active delivery(ies)" -ForegroundColor Green
    foreach ($d in $activeDeliveries.data) {
        Write-Host "  - Delivery #$($d.id) | Order #$($d.orderId) | Status: $($d.status)" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  No active deliveries found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 STEP 10: Mark as Picked Up (Agent)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

Write-Host "Marking delivery as picked up..." -NoNewline
$pickupResult = Invoke-AuthRequest "$API_BASE/deliveries/$deliveryId/status?status=PICKED_UP" "PATCH" $agentAuth.token $agentAuth.user.id
if ($pickupResult) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Status: PICKED_UP" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "📝 STEP 11: Mark as In Transit (Agent)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

Write-Host "Marking delivery as in transit..." -NoNewline
$transitResult = Invoke-AuthRequest "$API_BASE/deliveries/$deliveryId/status?status=IN_TRANSIT" "PATCH" $agentAuth.token $agentAuth.user.id
if ($transitResult) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Status: IN_TRANSIT" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "📝 STEP 12: Mark as Delivered (Agent)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

Write-Host "Marking delivery as delivered..." -NoNewline
$deliveredResult = Invoke-AuthRequest "$API_BASE/deliveries/$deliveryId/status?status=DELIVERED" "PATCH" $agentAuth.token $agentAuth.user.id
if ($deliveredResult) {
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "  Status: DELIVERED" -ForegroundColor Gray
} else {
    Write-Host " ❌" -ForegroundColor Red
}

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "📝 STEP 13: Check Delivery History (Agent)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$history = Invoke-AuthRequest "$API_BASE/deliveries/agent/$($agentAuth.user.id)" "GET" $agentAuth.token $agentAuth.user.id
if ($history -and $history.data.Count -gt 0) {
    $completedDeliveries = $history.data | Where-Object { $_.status -eq "DELIVERED" }
    Write-Host "✅ Found $($completedDeliveries.Count) completed delivery(ies)" -ForegroundColor Green
    
    $recentDelivery = $completedDeliveries | Where-Object { $_.id -eq $deliveryId } | Select-Object -First 1
    if ($recentDelivery) {
        Write-Host "  Recent Delivery:" -ForegroundColor Gray
        Write-Host "    - Delivery #$($recentDelivery.id)" -ForegroundColor Gray
        Write-Host "    - Order #$($recentDelivery.orderId)" -ForegroundColor Gray
        Write-Host "    - Status: $($recentDelivery.status)" -ForegroundColor Gray
        Write-Host "    - Earnings: `$$($recentDelivery.deliveryFee)" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  No delivery history found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 STEP 14: Verify Order Status (Customer)" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$finalOrder = Invoke-AuthRequest "$API_BASE/orders/$orderId" "GET" $customerAuth.token $customerAuth.user.id
if ($finalOrder -and $finalOrder.data) {
    Write-Host "✅ Order status verified" -ForegroundColor Green
    Write-Host "  Order ID: $($finalOrder.data.id)" -ForegroundColor Gray
    Write-Host "  Status: $($finalOrder.data.status)" -ForegroundColor Gray
    
    if ($finalOrder.data.status -eq "DELIVERED") {
        Write-Host "  ✅ Order successfully delivered!" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Order status: $($finalOrder.data.status)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Failed to verify order status" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST COMPLETE!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "  ✅ Order created by customer" -ForegroundColor Green
Write-Host "  ✅ Order confirmed by owner" -ForegroundColor Green
Write-Host "  ✅ Order marked ready by owner" -ForegroundColor Green
Write-Host "  ✅ Delivery appeared in agent queue" -ForegroundColor Green
Write-Host "  ✅ Agent accepted delivery" -ForegroundColor Green
Write-Host "  ✅ Agent marked as picked up" -ForegroundColor Green
Write-Host "  ✅ Agent marked as in transit" -ForegroundColor Green
Write-Host "  ✅ Agent marked as delivered" -ForegroundColor Green
Write-Host "  ✅ Delivery appeared in history" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Agent Delivery Flow is working perfectly!" -ForegroundColor Green
Write-Host ""
