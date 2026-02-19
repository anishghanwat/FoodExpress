@echo off
echo ========================================
echo Stopping Docker Infrastructure
echo ========================================
echo.

docker-compose down

echo.
echo ========================================
echo Docker Services Stopped
echo ========================================
echo.
echo To remove volumes (delete all data):
echo   docker-compose down -v
echo.
pause
