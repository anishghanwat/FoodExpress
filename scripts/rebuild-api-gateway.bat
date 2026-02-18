@echo off
echo ========================================
echo Rebuilding API Gateway with Admin Routes
echo ========================================

cd api-gateway
echo.
echo Building api-gateway...
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Failed to build api-gateway
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Now restart the api-gateway:
echo 1. Stop the running api-gateway (Ctrl+C in its terminal)
echo 2. Run: cd api-gateway
echo 3. Run: mvn spring-boot:run
echo.
pause
