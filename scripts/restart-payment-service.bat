@echo off
echo ========================================
echo Restarting Payment Service
echo ========================================
echo.

cd payment-service

echo Cleaning and building...
call mvn clean install -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build successful!
echo Starting payment service...
echo ========================================
echo.
echo Press Ctrl+C to stop the service
echo.

call mvn spring-boot:run
