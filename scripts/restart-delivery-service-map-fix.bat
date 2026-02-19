@echo off
echo ========================================
echo Restart Delivery Service (Map Fix)
echo ========================================
echo.

echo Step 1: Building delivery service...
echo.
cd delivery-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to build delivery service
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo The JAR file is ready at:
echo   delivery-service\target\delivery-service-1.0.0.jar
echo.
echo IMPORTANT: Manual Steps Required
echo ========================================
echo.
echo 1. STOP the currently running delivery service
echo    - Find the terminal/window running delivery service
echo    - Press Ctrl+C to stop it
echo.
echo 2. START the delivery service with the new JAR:
echo    java -jar delivery-service\target\delivery-service-1.0.0.jar
echo.
echo 3. WAIT 30 seconds for service registration
echo.
echo 4. REFRESH the frontend page
echo.
echo The map location endpoint should now work!
echo.

pause
