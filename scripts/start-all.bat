@echo off
echo ========================================
echo Starting All Microservices
echo ========================================
echo.
echo IMPORTANT: Make sure MySQL is running and databases are created!
echo.
pause

echo Starting Eureka Server (Port 8761)...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 30

echo Starting API Gateway (Port 8080)...
start "API Gateway" cmd /k "cd api-gateway && mvn spring-boot:run"
timeout /t 10

echo Starting User Service (Port 8081)...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"
timeout /t 10

echo Starting Restaurant Service (Port 8082)...
start "Restaurant Service" cmd /k "cd restaurant-service && mvn spring-boot:run"
timeout /t 10

echo Starting Order Service (Port 8083)...
start "Order Service" cmd /k "cd order-service && mvn spring-boot:run"
timeout /t 10

echo Starting Delivery Service (Port 8084)...
start "Delivery Service" cmd /k "cd delivery-service && mvn spring-boot:run"
timeout /t 10

echo Starting Payment Service (Port 8085)...
start "Payment Service" cmd /k "cd payment-service && mvn spring-boot:run"
timeout /t 10

echo Starting Notification Service (Port 8086)...
start "Notification Service" cmd /k "cd notification-service && mvn spring-boot:run"

echo.
echo ========================================
echo All Services Starting...
echo ========================================
echo.
echo Service URLs:
echo - Eureka Dashboard: http://localhost:8761
echo - API Gateway: http://localhost:8080
echo - User Service: http://localhost:8081
echo - Restaurant Service: http://localhost:8082
echo - Order Service: http://localhost:8083
echo - Delivery Service: http://localhost:8084
echo - Payment Service: http://localhost:8085
echo - Notification Service: http://localhost:8086
echo.
echo Wait 2-3 minutes for all services to register with Eureka
echo Then check: http://localhost:8761
echo.
pause
