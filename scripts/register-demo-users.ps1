# Register demo users via API

$baseUrl = "http://localhost:8080/api/auth/register"

# Customer
Write-Host "Registering customer@test.com..."
$customerBody = @{
    name = "Demo Customer"
    email = "customer@test.com"
    password = "Password@123"
    phone = "+1234567890"
    role = "CUSTOMER"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $customerBody -ContentType "application/json"
    Write-Host "✓ Customer registered successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Customer registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Owner
Write-Host "Registering owner@test.com..."
$ownerBody = @{
    name = "Demo Owner"
    email = "owner@test.com"
    password = "Password@123"
    phone = "+1234567891"
    role = "RESTAURANT_OWNER"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $ownerBody -ContentType "application/json"
    Write-Host "✓ Owner registered successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Owner registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Agent
Write-Host "Registering agent@test.com..."
$agentBody = @{
    name = "Demo Agent"
    email = "agent@test.com"
    password = "Password@123"
    phone = "+1234567892"
    role = "DELIVERY_AGENT"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $agentBody -ContentType "application/json"
    Write-Host "✓ Agent registered successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Agent registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Admin
Write-Host "Registering admin@test.com..."
$adminBody = @{
    name = "Demo Admin"
    email = "admin@test.com"
    password = "Password@123"
    phone = "+1234567893"
    role = "ADMIN"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri $baseUrl -Method Post -Body $adminBody -ContentType "application/json"
    Write-Host "✓ Admin registered successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Admin registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAll demo users registered with password: Password@123" -ForegroundColor Cyan
