#!/bin/bash
# Quick restart script for EC2 deployment
# Usage: ./quick-restart.sh [service-name]
# Example: ./quick-restart.sh api-gateway
# Or: ./quick-restart.sh (restarts all)

cd ~/FoodExpress || exit 1

if [ -z "$1" ]; then
    echo "🔄 Restarting all services..."
    docker-compose -f docker-compose.prod.yml restart
else
    echo "🔄 Restarting $1..."
    docker-compose -f docker-compose.prod.yml restart "$1"
fi

echo "⏳ Waiting for services to stabilize..."
sleep 10

echo "✅ Service status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 Restart complete!"
