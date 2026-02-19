@echo off
echo ========================================
echo Food Delivery System - Step by Step Startup
echo ========================================
echo.
echo MySQL Credentials: root/root
echo.

echo Step 1: Creating MySQL Databases...
echo.
echo Please run this SQL command in MySQL:
echo.
echo CREATE DATABASE IF NOT EXISTS user_db;
echo CREATE DATABASE IF NOT EXISTS restaurant_db;
echo CREATE DATABASE IF NOT EXISTS order_db;
echo CREATE DATABASE IF NOT EXISTS delivery_db;
echo CREATE DATABASE IF NOT EXISTS payment_db;
echo.
echo Or run: mysql -u root -p ^< CREATE_DATABASES.sql
echo.
pause

echo.
echo Step 2: Starting Eureka Server (Service Registry)...
echo Port: 8761
echo.
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
echo Waiting 30 seconds for Eureka to start...
timeout /t 30

echo.
echo Step 3: Starting API Gateway...
echo Port: 8080
echo.
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"
echo Waiting 15 seconds...
timeout /t 15

echo.
echo Step 4: Starting User Service (Authentication)...
echo Port: 8081
echo.
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"
echo Waiting 15 seconds...
timeout /t 15

echo.
echo Step 5: Starting Restaurant Service...
echo Port: 8082
echo.
start "Restaurant Service" cmd /k "cd restaurant-service && mvn spring-boot:run"
echo Waiting 15 seconds...
timeout /t 15

echo.
echo Step 6: Starting Order Service...
echo Port: 8083
echo.
start "Order Service" cmd /k "cd order-service && mvn spring-boot:run"
echo Waiting 15 seconds...
timeout /t 15

echo.
echo Step 7: Starting Delivery Service...
echo Port: 8084
echo.
start "Delivery Service" cmd /k "cd delivery-service && mvn spring-boot:run"
echo Waiting 15 seconds...
timeout /t 15

echo.
echo Step 8: Starting Payment Service...
echo Port: 8085
echo.
start "Payment Service" cmd /k "cd payment-service && mvn spring-boot:run"
echo Waiting 15 seconds...
timeout /t 15

echo.
echo Step 9: Starting Notification Service...
echo Port: 8086
echo.
start "Notification Service" cmd /k "cd notification-service && mvn spring-boot:run"

echo.
echo ========================================
echo All Services Started!
echo ========================================
echo.
echo Please wait 2-3 minutes for all services to fully start
echo.
echo Check Eureka Dashboard: http://localhost:8761
echo You should see 7 services registered:
echo   - API-GATEWAY
echo   - USER-SERVICE
echo   - RESTAURANT-SERVICE
echo   - ORDER-SERVICE
echo   - DELIVERY-SERVICE
echo   - PAYMENT-SERVICE
echo   - NOTIFICATION-SERVICE
echo.
echo Then you can:
echo 1. Test APIs through API Gateway: http://localhost:8080
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo 3. Access app: http://localhost:5173
echo.
echo If any service fails to start, check:
echo - MySQL is running
echo - Databases are created
echo - MySQL credentials are root/root
echo - Ports are not in use
echo.
pause
