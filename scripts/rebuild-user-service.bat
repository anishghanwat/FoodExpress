@echo off
echo ========================================
echo Rebuilding User Service with Admin API
echo ========================================

cd user-service
echo.
echo Building user-service...
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Failed to build user-service
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Now restart the user-service:
echo 1. Stop the running user-service (Ctrl+C in its terminal)
echo 2. Run: cd user-service
echo 3. Run: mvn spring-boot:run
echo.
pause
