@echo off
echo ========================================
echo FoodExpress Database Seeding
echo ========================================
echo.

echo Checking MySQL container...
docker ps | findstr fooddelivery-mysql >nul
if errorlevel 1 (
    echo ERROR: MySQL container is not running!
    echo Please start it with: docker-compose up -d mysql
    pause
    exit /b 1
)

echo.
echo Seeding database with dummy data...
echo - 4 Users (admin, owner, agent, customer)
echo - 15 Restaurants
echo - 75 Menu Items
echo.

powershell -Command "Get-Content sql/seed-dummy-data.sql | docker exec -i fooddelivery-mysql mysql -uroot -proot"

if errorlevel 1 (
    echo.
    echo ERROR: Seeding failed!
    echo.
    echo If you get duplicate entry errors, the data is already seeded.
    echo To re-seed, first clear the data:
    echo   docker exec -i fooddelivery-mysql mysql -uroot -proot -e "USE restaurant_db; DELETE FROM menu_items; DELETE FROM restaurants; USE user_db; DELETE FROM users;"
    pause
    exit /b 1
)

echo.
echo ========================================
echo Seeding Complete!
echo ========================================
echo.
echo Login Credentials (Password: Password@123):
echo   Admin:    admin@gmail.com
echo   Owner:    owner@gmail.com
echo   Agent:    agent@gmail.com
echo   Customer: customer@gmail.com
echo.
echo All restaurants are owned by owner@gmail.com
echo.
pause
