@echo off
echo ========================================
echo Watching Latest Kafka Events
echo ========================================
echo.
echo This will show the LAST 5 events from order-events topic
echo Then continue watching for NEW events
echo.
echo Instructions:
echo 1. Keep this window open
echo 2. Go to http://localhost:5173
echo 3. Login and place a NEW order
echo 4. Watch for the event to appear here
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.

docker exec -it fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-events ^
  --property print.timestamp=true ^
  --property print.key=true ^
  --max-messages 5 ^
  --from-beginning

echo.
echo ========================================
echo Above are the last 5 events
echo Now watching for NEW events...
echo ========================================
echo.

docker exec -it fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-events ^
  --property print.timestamp=true ^
  --property print.key=true

pause
