# Test Map Location Endpoint
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Map Location Endpoint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:8080"
$deliveryId = 12

# Get auth token (using customer account)
Write-Host "Step 1: Login to get auth token..." -ForegroundColor Yellow
$loginBody = @{
    email = "customer@test.com"
    password = "Password@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    $userId = $loginResponse.data.id
    Write-Host "✓ Login successful! Token: $($token.Substring(0, 20))..." -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Test GET /api/deliveries/{id}/location
Write-Host "Step 2: Test GET /api/deliveries/$deliveryId/location..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "X-User-Id" = $userId.ToString()
}

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/deliveries/$deliveryId/location" -Method Get -Headers $headers
    Write-Host "✓ Endpoint working!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
    
    # Check if location data exists
    if ($response.data.agentLatitude -and $response.data.agentLongitude) {
        Write-Host "✓ Agent location found:" -ForegroundColor Green
        Write-Host "  Latitude: $($response.data.agentLatitude)" -ForegroundColor White
        Write-Host "  Longitude: $($response.data.agentLongitude)" -ForegroundColor White
    } else {
        Write-Host "⚠ No agent location data yet (agent hasn't shared location)" -ForegroundColor Yellow
    }
    
    if ($response.data.deliveryLatitude -and $response.data.deliveryLongitude) {
        Write-Host "✓ Delivery location found:" -ForegroundColor Green
        Write-Host "  Latitude: $($response.data.deliveryLatitude)" -ForegroundColor White
        Write-Host "  Longitude: $($response.data.deliveryLongitude)" -ForegroundColor White
    } else {
        Write-Host "⚠ No delivery location data" -ForegroundColor Yellow
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "✗ Endpoint failed with status code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    
    if ($statusCode -eq 404) {
        Write-Host ""
        Write-Host "Possible causes:" -ForegroundColor Yellow
        Write-Host "1. Delivery service not running" -ForegroundColor White
        Write-Host "2. Database migration not applied" -ForegroundColor White
        Write-Host "3. Delivery ID $deliveryId doesn't exist" -ForegroundColor White
        Write-Host ""
        Write-Host "Solutions:" -ForegroundColor Yellow
        Write-Host "1. Run: scripts\fix-map-location-endpoint.bat" -ForegroundColor White
        Write-Host "2. Restart delivery service" -ForegroundColor White
        Write-Host "3. Check if delivery exists in database" -ForegroundColor White
    }
    
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
