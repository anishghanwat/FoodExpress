@echo off
echo ========================================
echo Watching for NEW Kafka Events Only
echo ========================================
echo.
echo This will show ONLY new events (not historical)
echo.
echo Now:
echo 1. Go to http://localhost:5173
echo 2. Login and place a NEW order
echo 3. Watch this window for the event
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

docker exec -it fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-events ^
  --property print.timestamp=true ^
  --property print.key=true

pause
