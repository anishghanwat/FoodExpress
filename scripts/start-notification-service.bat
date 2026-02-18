@echo off
echo ========================================
echo Starting Notification Service
echo ========================================
echo.
echo Service: notification-service
echo Port: 8086
echo WebSocket: ws://localhost:8086/ws/notifications
echo.

cd notification-service
start "Notification Service" cmd /k "mvn spring-boot:run"

echo.
echo Notification service is starting...
echo Check the new window for logs
echo.
echo Press any key to return...
pause > nul
