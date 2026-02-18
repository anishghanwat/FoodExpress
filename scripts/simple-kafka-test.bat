@echo off
cls
echo ========================================
echo Simple Kafka Test
echo ========================================
echo.

echo Step 1: Checking if order-service is running...
netstat -ano | findstr :8083 >nul
if %errorlevel% equ 0 (
    echo ✓ Order service is running on port 8083
) else (
    echo ✗ Order service is NOT running!
    echo   Run: scripts\restart-order-service.bat
    pause
    exit /b
)
echo.

echo Step 2: Checking Kafka...
docker ps --filter "name=fooddelivery-kafka" --format "{{.Names}}" | findstr kafka >nul
if %errorlevel% equ 0 (
    echo ✓ Kafka is running
) else (
    echo ✗ Kafka is NOT running!
    pause
    exit /b
)
echo.

echo Step 3: Counting events in order-events topic...
echo.
docker exec fooddelivery-kafka kafka-run-class kafka.tools.GetOffsetShell ^
  --broker-list localhost:9092 ^
  --topic order-events
echo.

echo ========================================
echo Ready to Test!
echo ========================================
echo.
echo Now do this:
echo 1. Open http://localhost:5173 in your browser
echo 2. Login as: customer@test.com / Password@123
echo 3. Place a NEW order
echo 4. Come back here and press any key
echo.
pause

echo.
echo Fetching the LATEST event from Kafka...
echo ========================================
echo.

docker exec fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-events ^
  --max-messages 1 ^
  --property print.timestamp=true ^
  --property print.key=true ^
  --property print.value=true ^
  --from-beginning ^
  --timeout-ms 5000 2>nul | findstr /C:"eventType" /C:"userId" /C:"orderId"

echo.
echo ========================================
echo.
echo Check above for:
echo - "eventType":"ORDER_CREATED" (should be ORDER_CREATED, not ORDER_UPDATED)
echo - "userId":X (should be userId, not customerId)
echo.
echo If you see the correct format, Kafka integration is working!
echo.
pause
