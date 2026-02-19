# Diagnose Map Location Issue
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diagnose Map Location Issue" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: Is delivery service running?
Write-Host "Check 1: Is delivery service running?" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8084/actuator/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "OK - Delivery service is running on port 8084" -ForegroundColor Green
} catch {
    Write-Host "FAIL - Delivery service is NOT running on port 8084" -ForegroundColor Red
    Write-Host "  Solution: Start delivery service" -ForegroundColor Yellow
}
Write-Host ""

# Check 2: Is API Gateway running?
Write-Host "Check 2: Is API Gateway running?" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "OK - API Gateway is running on port 8080" -ForegroundColor Green
} catch {
    Write-Host "FAIL - API Gateway is NOT running on port 8080" -ForegroundColor Red
    Write-Host "  Solution: Start API Gateway" -ForegroundColor Yellow
}
Write-Host ""

# Check 3: Test the endpoint
Write-Host "Check 3: Test location endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/deliveries/12/location" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "OK - Endpoint exists and responding" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "OK - Endpoint exists (requires authentication)" -ForegroundColor Green
    } elseif ($statusCode -eq 404) {
        Write-Host "FAIL - Endpoint returns 404 - Not Found" -ForegroundColor Red
        Write-Host "  Possible causes:" -ForegroundColor Yellow
        Write-Host "  1. Delivery service not registered with API Gateway" -ForegroundColor White
        Write-Host "  2. Delivery service needs restart" -ForegroundColor White
        Write-Host "  3. Delivery ID 12 does not exist" -ForegroundColor White
    } else {
        Write-Host "WARNING - Endpoint returned status code: $statusCode" -ForegroundColor Yellow
    }
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diagnosis Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you see 404 errors, try these steps:" -ForegroundColor Yellow
Write-Host "1. Run: scripts\fix-map-location-endpoint.bat" -ForegroundColor White
Write-Host "2. Restart delivery service" -ForegroundColor White
Write-Host "3. Wait 30 seconds for service registration" -ForegroundColor White
Write-Host "4. Run: scripts\test-map-location-endpoint.ps1" -ForegroundColor White
Write-Host ""
