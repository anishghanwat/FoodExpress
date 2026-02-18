@echo off
echo ========================================
echo Building All Microservices
echo ========================================

echo.
echo [1/7] Building Eureka Server...
cd eureka-server
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Eureka Server build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/7] Building API Gateway...
cd api-gateway
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: API Gateway build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/7] Building User Service...
cd user-service
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: User Service build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [4/7] Building Restaurant Service...
cd restaurant-service
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Restaurant Service build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [5/7] Building Order Service...
cd order-service
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Order Service build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [6/7] Building Delivery Service...
cd delivery-service
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Delivery Service build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [7/7] Building Payment Service...
cd payment-service
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Payment Service build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [8/8] Building Notification Service...
cd notification-service
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Notification Service build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo All Services Built Successfully!
echo ========================================
echo.
echo Next Steps:
echo 1. Create MySQL databases (see CREATE_DATABASES.sql)
echo 2. Run start-all.bat to start all services
echo.
pause
