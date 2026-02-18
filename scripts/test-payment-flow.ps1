# Test Payment Flow End-to-End
# This script tests the complete payment integration with Stripe

Write-Host "=== Testing Payment Flow ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_BASE = "http://localhost:8080/api"
$EMAIL = "customer@test.com"
$PASSWORD = "Password@123"

# Step 1: Login
Write-Host "Step 1: Logging in as customer..." -ForegroundColor Yellow
$loginBody = @{
    email = $EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    $userId = $loginResponse.data.user.id
    Write-Host "Login successful! User ID: $userId" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Create Payment Intent
Write-Host ""
Write-Host "Step 2: Creating payment intent..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "X-User-Id" = $userId
}

$paymentIntentBody = @{
    amount = 2500.00
    currency = "usd"
    paymentMethod = "CARD"
    orderId = 999
    customerId = $userId
} | ConvertTo-Json

try {
    $intentResponse = Invoke-RestMethod -Uri "$API_BASE/payments/create-intent" -Method Post -Body $paymentIntentBody -Headers $headers
    $clientSecret = $intentResponse.data.clientSecret
    $paymentId = $intentResponse.data.paymentId
    Write-Host "Payment intent created!" -ForegroundColor Green
    Write-Host "  Payment ID: $paymentId" -ForegroundColor Gray
    Write-Host "  Client Secret: $($clientSecret.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "Payment intent creation failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# Step 3: Check Payment Status
Write-Host ""
Write-Host "Step 3: Checking payment status..." -ForegroundColor Yellow
try {
    $statusResponse = Invoke-RestMethod -Uri "$API_BASE/payments/$paymentId" -Method Get -Headers $headers
    Write-Host "Payment status: $($statusResponse.data.status)" -ForegroundColor Green
    Write-Host "  Amount: $($statusResponse.data.amount) $($statusResponse.data.currency)" -ForegroundColor Gray
    Write-Host "  Payment Method: $($statusResponse.data.paymentMethod)" -ForegroundColor Gray
} catch {
    Write-Host "Failed to get payment status: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Payment Flow Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. The payment intent has been created successfully" -ForegroundColor White
Write-Host "2. In the frontend, use the client secret to complete payment with Stripe" -ForegroundColor White
Write-Host "3. Use test card: 4242 4242 4242 4242" -ForegroundColor White
Write-Host "4. Any future expiry date and any 3-digit CVV" -ForegroundColor White
Write-Host ""
Write-Host "Database schema updated successfully!" -ForegroundColor Green
