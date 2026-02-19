@echo off
echo Starting Notification Service with Environment Variables...

set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set MAIL_USERNAME=Fooddelapp@gmail.com
set MAIL_PASSWORD=ebxr vrbo rzkg hznp
set MAIL_FROM_NAME=FoodExpress

cd notification-service
mvn spring-boot:run
