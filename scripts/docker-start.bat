@echo off
echo ========================================
echo Starting Docker Infrastructure
echo ========================================
echo.
echo Starting MySQL, Kafka, and Zookeeper...
echo.

docker-compose up -d

echo.
echo Waiting for services to be healthy...
timeout /t 30

echo.
echo ========================================
echo Docker Services Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo Service URLs
echo ========================================
echo MySQL:      localhost:3306 (root/root)
echo Kafka:      localhost:29092
echo Kafka UI:   http://localhost:8090
echo Zookeeper:  localhost:2181
echo.
echo ========================================
echo Verifying MySQL Databases
echo ========================================
docker exec fooddelivery-mysql mysql -uroot -proot -e "SHOW DATABASES;"

echo.
echo ========================================
echo Docker Infrastructure Ready!
echo ========================================
echo.
echo You can now start the backend services:
echo   build-all.bat
echo   start-all.bat
echo.
pause
