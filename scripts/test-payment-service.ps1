# Test Payment Service
# This script tests the Stripe payment integration

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Payment Service Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if payment service is running
Write-Host "1. Checking if payment service is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8085/actuator/health" -Method GET -ErrorAction Stop
    Write-Host "   ✓ Payment service is running" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Payment service is not running" -ForegroundColor Red
    Write-Host "   Please start payment-service first:" -ForegroundColor Yellow
    Write-Host "   cd payment-service" -ForegroundColor White
    Write-Host "   mvn spring-boot:run" -ForegroundColor White
    exit 1
}

Write-Host ""

# Test create payment intent
Write-Host "2. Testing payment intent creation..." -ForegroundColor Yellow

$paymentData = @{
    orderId = 1
    customerId = 1
    amount = 25.99
    currency = "usd"
    paymentMethod = "CARD"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8085/api/payments/create-intent" `
        -Method POST `
        -ContentType "application/json" `
        -Body $paymentData `
        -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "   ✓ Payment intent created successfully" -ForegroundColor Green
        Write-Host "   Payment ID: $($response.data.paymentId)" -ForegroundColor White
        Write-Host "   Payment Intent ID: $($response.data.paymentIntentId)" -ForegroundColor White
        Write-Host "   Amount: `$$($response.data.amount)" -ForegroundColor White
        Write-Host "   Currency: $($response.data.currency)" -ForegroundColor White
        Write-Host "   Status: $($response.data.status)" -ForegroundColor White
        
        $paymentId = $response.data.paymentId
        $paymentIntentId = $response.data.paymentIntentId
        
        Write-Host ""
        Write-Host "3. Verifying payment in database..." -ForegroundColor Yellow
        
        # Get payment by ID
        $payment = Invoke-RestMethod -Uri "http://localhost:8085/api/payments/$paymentId" `
            -Method GET `
            -ErrorAction Stop
        
        if ($payment.success) {
            Write-Host "   ✓ Payment found in database" -ForegroundColor Green
            Write-Host "   Stripe Payment Intent ID: $($payment.data.stripePaymentIntentId)" -ForegroundColor White
        }
        
        Write-Host ""
        Write-Host "==================================" -ForegroundColor Cyan
        Write-Host "✓ All tests passed!" -ForegroundColor Green
        Write-Host "==================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Check Stripe Dashboard: https://dashboard.stripe.com/test/payments" -ForegroundColor White
        Write-Host "2. You should see your payment intent there" -ForegroundColor White
        Write-Host "3. Status will be 'Incomplete' (normal - not yet paid)" -ForegroundColor White
        Write-Host ""
        Write-Host "To test actual payment:" -ForegroundColor Yellow
        Write-Host "1. Go to checkout page in frontend" -ForegroundColor White
        Write-Host "2. Use test card: 4242 4242 4242 4242" -ForegroundColor White
        Write-Host "3. Expiry: 12/25, CVV: 123" -ForegroundColor White
        
    } else {
        Write-Host "   ✗ Failed to create payment intent" -ForegroundColor Red
        Write-Host "   Error: $($response.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ✗ Error creating payment intent" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        
        if ($statusCode -eq 400) {
            Write-Host ""
            Write-Host "   This usually means:" -ForegroundColor Yellow
            Write-Host "   - Stripe API key is not configured" -ForegroundColor White
            Write-Host "   - Stripe API key is invalid" -ForegroundColor White
            Write-Host ""
            Write-Host "   To fix:" -ForegroundColor Yellow
            Write-Host "   1. Sign up at https://stripe.com" -ForegroundColor White
            Write-Host "   2. Get your test API keys" -ForegroundColor White
            Write-Host "   3. Add to .env file:" -ForegroundColor White
            Write-Host "      STRIPE_SECRET_KEY=sk_test_your_key_here" -ForegroundColor White
            Write-Host "   4. Restart payment-service" -ForegroundColor White
        }
    }
    
    Write-Host "   Error details: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
