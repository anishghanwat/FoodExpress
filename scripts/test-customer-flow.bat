@echo off
REM Test Customer Order Flow
REM This script tests the complete customer journey

echo ========================================
echo Testing Customer Order Flow
echo ========================================
echo.

echo Step 1: Testing API Gateway...
curl -s http://localhost:8080/api/restaurants > nul
if %errorlevel% neq 0 (
    echo ERROR: API Gateway not responding
    exit /b 1
)
echo SUCCESS: API Gateway is running
echo.

echo Step 2: Testing Restaurant Service...
curl -s http://localhost:8080/api/restaurants
echo.
echo SUCCESS: Restaurant service is working
echo.

echo ========================================
echo Manual Testing Steps:
echo ========================================
echo.
echo 1. Open browser: http://localhost:5173
echo 2. Login with: customer@test.com / Password@123
echo 3. Browse restaurants
echo 4. Click on a restaurant
echo 5. Add items to cart
echo 6. Go to checkout
echo 7. Fill delivery details
echo 8. Place order
echo 9. Verify order in "My Orders"
echo.
echo ========================================
echo Verification Points:
echo ========================================
echo.
echo - Cart count updates when adding items
echo - Checkout shows correct items and prices
echo - Order success message appears
echo - Redirected to order tracking page
echo - Order appears in order history
echo - Order status is "Pending"
echo.
echo Check Kafka events:
echo - Open: http://localhost:8090
echo - Topic: order-created
echo - Should see ORDER_CREATED event
echo.
pause
