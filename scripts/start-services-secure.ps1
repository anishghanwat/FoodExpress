$env:RAZORPAY_KEY_ID = "rzp_test_SHk0nqdeDnb7Oc"
$env:RAZORPAY_KEY_SECRET = "Ymt7tZ8XzLDZyNzA03RGH3B3"

Write-Host "Starting All Services with Razorpay Keys..."

# 1. Eureka
Write-Host "Starting Eureka Server..."
Start-Process cmd -ArgumentList "/k cd eureka-server && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"
Start-Sleep -Seconds 20

# 2. Gateway
Write-Host "Starting API Gateway..."
Start-Process cmd -ArgumentList "/k cd api-gateway && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"
Start-Sleep -Seconds 10

# 3. User Service
Write-Host "Starting User Service..."
Start-Process cmd -ArgumentList "/k cd user-service && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"
Start-Sleep -Seconds 10

# 4. Restaurant Service
Write-Host "Starting Restaurant Service..."
Start-Process cmd -ArgumentList "/k cd restaurant-service && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"
Start-Sleep -Seconds 10

# 5. Order Service
Write-Host "Starting Order Service..."
Start-Process cmd -ArgumentList "/k cd order-service && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"
Start-Sleep -Seconds 10

# 6. Delivery Service
Write-Host "Starting Delivery Service..."
Start-Process cmd -ArgumentList "/k cd delivery-service && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"
Start-Sleep -Seconds 10

# 7. Payment Service
Write-Host "Starting Payment Service (with keys)..."
Start-Process cmd -ArgumentList "/k cd payment-service && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"
Start-Sleep -Seconds 10

# 8. Notification Service
Write-Host "Starting Notification Service..."
Start-Process cmd -ArgumentList "/k cd notification-service && mvn spring-boot:run" -WorkingDirectory "c:\Users\Unmesh\Downloads\FoodExpress-main\FoodExpress-main"

Write-Host "All services started. Please wait for them to register with Eureka."
Write-Host "Eureka Dashboard: http://localhost:8761"
