@echo off
echo ========================================
echo Fixing Delivery Service Issues
echo ========================================
echo.

echo Step 1: Updating database schema...
echo.
mysql -u root -proot < sql\update-delivery-schema.sql
if %errorlevel% neq 0 (
    echo ❌ Database update failed!
    echo Make sure MySQL is running and credentials are correct
    pause
    exit /b 1
)
echo ✅ Database schema updated
echo.

echo Step 2: Checking if delivery-service is running...
netstat -ano | findstr :8084 >nul
if %errorlevel% equ 0 (
    echo Found delivery-service running, stopping it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8084') do (
        taskkill /F /PID %%a 2>nul
    )
    timeout /t 2 /nobreak >nul
)
echo.

echo Step 3: Starting delivery-service...
cd /d "%~dp0\..\delivery-service"
start "Delivery Service" java -jar target/delivery-service-1.0.0.jar
echo.

echo ========================================
echo Delivery service is starting...
echo Check the new window for logs
echo.
echo If you see errors, please share them!
echo ========================================
pause
