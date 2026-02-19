@echo off
echo Starting Notification Service with Email Configuration...

REM Load environment variables from .env file
for /f "tokens=1,2 delims==" %%a in ('type .env ^| findstr /v "^#" ^| findstr "MAIL_"') do (
    set %%a=%%b
)

REM Set additional required variables
set KAFKA_BOOTSTRAP_SERVERS=localhost:29092

cd notification-service

echo.
echo Environment Variables:
echo MAIL_HOST=%MAIL_HOST%
echo MAIL_PORT=%MAIL_PORT%
echo MAIL_USERNAME=%MAIL_USERNAME%
echo MAIL_FROM_NAME=%MAIL_FROM_NAME%
echo.

echo Starting service...
java -jar target/notification-service-1.0.0.jar

pause
