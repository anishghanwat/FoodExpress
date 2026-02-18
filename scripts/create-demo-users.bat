@echo off
echo ========================================
echo Creating Demo Users
echo ========================================
echo.

echo Creating Customer: customer@test.com
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Demo Customer\",\"email\":\"customer@test.com\",\"password\":\"password123\",\"phone\":\"+1234567890\",\"role\":\"CUSTOMER\"}"
echo.
echo.

echo Creating Owner: owner@test.com
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Demo Owner\",\"email\":\"owner@test.com\",\"password\":\"password123\",\"phone\":\"+1234567891\",\"role\":\"RESTAURANT_OWNER\"}"
echo.
echo.

echo Creating Agent: agent@test.com
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Demo Agent\",\"email\":\"agent@test.com\",\"password\":\"password123\",\"phone\":\"+1234567892\",\"role\":\"DELIVERY_AGENT\"}"
echo.
echo.

echo Creating Admin: admin@test.com
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Demo Admin\",\"email\":\"admin@test.com\",\"password\":\"password123\",\"phone\":\"+1234567893\",\"role\":\"ADMIN\"}"
echo.
echo.

echo ========================================
echo Demo Users Created Successfully!
echo ========================================
echo.
echo You can now login with:
echo - customer@test.com / password123 (Customer)
echo - owner@test.com / password123 (Restaurant Owner)
echo - agent@test.com / password123 (Delivery Agent)
echo - admin@test.com / password123 (Admin)
echo.
pause
