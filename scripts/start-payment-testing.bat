@echo off
echo ========================================
echo Starting Payment Testing Environment
echo ========================================
echo.

echo Step 1: Checking Docker services...
docker ps | findstr "fooddelivery-mysql fooddelivery-kafka fooddelivery-zookeeper"
if %errorlevel% neq 0 (
    echo ERROR: Docker services not running!
    echo Please run: docker-compose up -d
    pause
    exit /b 1
)
echo ✓ Docker services running
echo.

echo Step 2: Checking backend services...
echo Checking Eureka Server (8761)...
curl -s http://localhost:8761 > nul
if %errorlevel% neq 0 (
    echo WARNING: Eureka Server not responding
)

echo Checking API Gateway (8080)...
curl -s http://localhost:8080/actuator/health > nul
if %errorlevel% neq 0 (
    echo WARNING: API Gateway not responding
)

echo Checking Payment Service (8085)...
curl -s http://localhost:8085/actuator/health > nul
if %errorlevel% neq 0 (
    echo WARNING: Payment Service not responding
    echo Starting Payment Service...
    start "Payment Service" cmd /k "cd payment-service && mvn spring-boot:run"
    timeout /t 15
)
echo ✓ Backend services checked
echo.

echo Step 3: Starting Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo.
echo ========================================
echo Environment Ready!
echo ========================================
echo.
echo Frontend will start at: http://localhost:5173
echo API Gateway running at: http://localhost:8080
echo Payment Service running at: http://localhost:8085
echo.
echo Test Credentials:
echo   Email: customer@test.com
echo   Password: Password@123
echo.
echo Test Card:
echo   Number: 4242 4242 4242 4242
echo   Expiry: 12/25
echo   CVV: 123
echo.
echo Starting frontend dev server...
echo.

call npm run dev
