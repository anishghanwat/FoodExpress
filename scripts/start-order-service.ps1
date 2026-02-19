# Start Order Service
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Order Service (NEW VERSION)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to order-service directory
Set-Location "$PSScriptRoot\..\order-service"

Write-Host "Starting service on port 8083..." -ForegroundColor Yellow
Write-Host "Watch for Kafka connection messages..." -ForegroundColor Yellow
Write-Host ""

# Start the service
java -jar target/order-service-1.0.0.jar

Write-Host ""
Write-Host "Service stopped." -ForegroundColor Red
