@echo off
echo ========================================
echo Docker Services Logs
echo ========================================
echo.
echo Choose a service to view logs:
echo 1. MySQL
echo 2. Kafka
echo 3. Zookeeper
echo 4. Kafka UI
echo 5. All Services
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" (
    docker logs -f fooddelivery-mysql
) else if "%choice%"=="2" (
    docker logs -f fooddelivery-kafka
) else if "%choice%"=="3" (
    docker logs -f fooddelivery-zookeeper
) else if "%choice%"=="4" (
    docker logs -f fooddelivery-kafka-ui
) else if "%choice%"=="5" (
    docker-compose logs -f
) else (
    echo Invalid choice
    pause
)
