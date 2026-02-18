@echo off
echo ========================================
echo Testing Delivery Service Kafka Integration
echo ========================================
echo.

REM Get auth token
echo Step 1: Logging in as customer...
curl -s -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"customer@test.com\",\"password\":\"Password@123\"}" > temp_login.json

REM Extract token (simple approach for Windows)
for /f "tokens=2 delims=:," %%a in ('type temp_login.json ^| findstr "token"') do set TOKEN=%%a
set TOKEN=%TOKEN:"=%
set TOKEN=%TOKEN: =%

echo Token obtained: %TOKEN:~0,20%...
echo.

REM Create a new order
echo Step 2: Creating new order...
curl -s -X POST http://localhost:8080/api/orders ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"restaurantId\":1,\"items\":[{\"menuItemId\":1,\"quantity\":2}],\"deliveryAddress\":\"123 Test St, City, State 12345\"}" > temp_order.json

REM Extract order ID
for /f "tokens=2 delims=:," %%a in ('type temp_order.json ^| findstr "\"id\""') do set ORDER_ID=%%a
set ORDER_ID=%ORDER_ID: =%

echo Order created with ID: %ORDER_ID%
echo.

REM Update order to CONFIRMED
echo Step 3: Updating order to CONFIRMED...
curl -s -X PUT http://localhost:8080/api/orders/%ORDER_ID%/status?status=CONFIRMED ^
  -H "Authorization: Bearer %TOKEN%"
echo.
timeout /t 2 /nobreak > nul

REM Update order to PREPARING
echo Step 4: Updating order to PREPARING...
curl -s -X PUT http://localhost:8080/api/orders/%ORDER_ID%/status?status=PREPARING ^
  -H "Authorization: Bearer %TOKEN%"
echo.
timeout /t 2 /nobreak > nul

REM Update order to READY_FOR_PICKUP
echo Step 5: Updating order to READY_FOR_PICKUP...
echo This should trigger Kafka event and create delivery record!
curl -s -X PUT http://localhost:8080/api/orders/%ORDER_ID%/status?status=READY_FOR_PICKUP ^
  -H "Authorization: Bearer %TOKEN%"
echo.
echo Waiting 3 seconds for Kafka processing...
timeout /t 3 /nobreak > nul

REM Check if delivery was created
echo.
echo Step 6: Checking if delivery was created...
curl -s http://localhost:8080/api/deliveries/available
echo.
echo.

REM Cleanup
del temp_login.json temp_order.json 2>nul

echo ========================================
echo Test Complete!
echo Check the delivery-service logs for Kafka event processing
echo ========================================
pause
