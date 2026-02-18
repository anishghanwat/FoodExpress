@echo off
echo ========================================
echo Testing NEW Kafka Integration
echo ========================================
echo.

echo Step 1: Finding and stopping old order-service...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8083') do (
    echo Found process on port 8083: %%a
    taskkill /F /PID %%a 2>nul
)
echo Old service stopped.
echo.

echo Step 2: Waiting 3 seconds...
timeout /t 3 /nobreak >nul
echo.

echo Step 3: Starting NEW order-service...
cd /d "%~dp0\..\order-service"
start "Order Service (NEW)" java -jar target/order-service-1.0.0.jar
echo.

echo Step 4: Waiting 10 seconds for service to start...
timeout /t 10 /nobreak
echo.

echo Step 5: Opening Kafka UI in browser...
start http://localhost:8090
echo.

echo Step 6: Starting Kafka event watcher...
echo.
echo ========================================
echo INSTRUCTIONS:
echo ========================================
echo 1. This window will show NEW events in real-time
echo 2. Go to http://localhost:5173 in your browser
echo 3. Login as customer: customer@test.com / Password@123
echo 4. Place a NEW order
echo 5. Watch THIS window for the event
echo.
echo You should see:
echo - "eventType":"ORDER_CREATED" (not ORDER_UPDATED)
echo - "userId":X (not customerId)
echo.
echo Press Ctrl+C to stop watching
echo ========================================
echo.

cd /d "%~dp0\.."
docker exec -it fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-events ^
  --property print.timestamp=true ^
  --property print.key=true

pause
