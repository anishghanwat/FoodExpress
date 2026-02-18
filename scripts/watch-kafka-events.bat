@echo off
echo ========================================
echo Watching Kafka Events in Real-Time
echo ========================================
echo.
echo This will show all events published to order-events topic
echo Press Ctrl+C to stop watching
echo.
echo Starting consumer...
echo ========================================
echo.

docker exec -it fooddelivery-kafka kafka-console-consumer ^
  --bootstrap-server localhost:9092 ^
  --topic order-events ^
  --from-beginning ^
  --property print.timestamp=true ^
  --property print.key=true

pause
