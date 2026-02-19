@echo off
REM Production Deployment Script for FoodExpress (Windows)

echo =========================================
echo FoodExpress Production Deployment
echo =========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found!
    echo Please create .env file from .env.example and configure it.
    exit /b 1
)

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed or not running
    exit /b 1
)

echo Docker is running
echo.

REM Stop existing containers
echo Stopping existing containers...
docker-compose -f docker-compose.prod.yml down
echo.

REM Build images
echo Building Docker images...
docker-compose -f docker-compose.prod.yml build --no-cache
echo.

REM Start services
echo Starting services...
docker-compose -f docker-compose.prod.yml up -d
echo.

REM Wait for services
echo Waiting for services to start...
timeout /t 30 /nobreak >nul
echo.

REM Check service health
echo Checking service health...
docker-compose -f docker-compose.prod.yml ps
echo.

echo =========================================
echo Deployment Complete!
echo =========================================
echo.
echo Services:
echo   - Frontend:    http://localhost
echo   - API Gateway: http://localhost:8080
echo   - Eureka:      http://localhost:8761
echo.
echo To view logs:
echo   docker-compose -f docker-compose.prod.yml logs -f [service-name]
echo.
echo To stop all services:
echo   docker-compose -f docker-compose.prod.yml down
echo.
pause
