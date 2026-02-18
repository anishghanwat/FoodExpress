@echo off
echo ========================================
echo Admin Dashboard Setup
echo ========================================
echo.
echo This script will:
echo 1. Rebuild API Gateway with admin routes
echo 2. Rebuild User Service with admin endpoints
echo 3. Create admin user in database
echo.
pause

echo.
echo Step 1: Building API Gateway...
echo ========================================
cd api-gateway
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Failed to build api-gateway
    pause
    exit /b 1
)
cd ..

echo.
echo Step 2: Building User Service...
echo ========================================
cd user-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo Failed to build user-service
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Creating Admin User...
echo ========================================
echo Please run the following command in MySQL:
echo mysql -u root -p ^< create-admin-user.sql
echo.
echo Or manually execute create-admin-user.sql in MySQL Workbench
echo.

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Stop the running api-gateway (Ctrl+C)
echo 2. Stop the running user-service (Ctrl+C)
echo.
echo 3. Restart API Gateway:
echo    cd api-gateway
echo    mvn spring-boot:run
echo.
echo 4. Restart User Service (in new terminal):
echo    cd user-service
echo    mvn spring-boot:run
echo.
echo 5. Create admin user (if not exists):
echo    mysql -u root -p ^< create-admin-user.sql
echo.
echo 6. Login to frontend:
echo    Email: admin@foodexpress.com
echo    Password: Admin@123
echo.
echo 7. Navigate to: http://localhost:5173/admin/dashboard
echo.
pause
