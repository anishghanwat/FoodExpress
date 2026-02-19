@echo off
echo ========================================
echo Kafka Testing Script
echo ========================================
echo.

echo Step 1: Checking Docker containers...
docker ps --filter "name=kafka" --format "table {{.Names}}\t{{.Status}}"
echo.

echo Step 2: Listing Kafka topics...
docker exec fooddelivery-kafka kafka-topics --bootstrap-server localhost:9092 --list
echo.

echo Step 3: Checking order-events topic details...
docker exec fooddelivery-kafka kafka-topics --bootstrap-server localhost:9092 --describe --topic order-events
echo.

echo ========================================
echo Kafka Status Check Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Open Kafka UI: http://localhost:8090
echo 2. Start order-service: scripts\restart-order-service.bat
echo 3. Place an order through frontend
echo 4. Check Kafka UI for events
echo.
pause
