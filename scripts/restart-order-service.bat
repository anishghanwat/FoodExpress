@echo off
echo ========================================
echo Starting Order Service (NEW VERSION)
echo ========================================

cd /d "%~dp0\..\order-service"

echo.
echo Starting service on port 8083...
echo Watch for these messages:
echo   - "Started OrderServiceApplication"
echo   - Kafka topic creation messages
echo.

java -jar target/order-service-1.0.0.jar

pause
