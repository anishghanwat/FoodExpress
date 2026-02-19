@echo off
echo ========================================
echo Fix Map Location Endpoint
echo ========================================
echo.

echo Step 1: Run database migration...
echo.
mysql -u root -proot < sql\add-delivery-location-fields.sql
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Database migration may have already been applied
    echo.
)

echo Step 2: Rebuild delivery service...
echo.
cd delivery-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to build delivery service
    exit /b 1
)
cd ..

echo.
echo Step 3: Restart delivery service...
echo.
echo Please stop the delivery service if it's running, then start it again.
echo.
echo To start: java -jar delivery-service\target\delivery-service-0.0.1-SNAPSHOT.jar
echo.

echo ========================================
echo Fix Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Stop the delivery service (Ctrl+C in its terminal)
echo 2. Start it again: java -jar delivery-service\target\delivery-service-0.0.1-SNAPSHOT.jar
echo 3. Test the endpoint: GET http://localhost:8080/api/deliveries/12/location
echo.

pause
