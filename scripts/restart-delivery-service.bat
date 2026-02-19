@echo off
echo ========================================
echo Starting Delivery Service (NEW VERSION)
echo ========================================

cd /d "%~dp0\..\delivery-service"

echo.
echo Starting service on port 8084...
echo Watch for these messages:
echo   - "Started DeliveryServiceApplication"
echo   - Kafka consumer started
echo   - Kafka topics created
echo.

java -jar target/delivery-service-1.0.0.jar

pause
