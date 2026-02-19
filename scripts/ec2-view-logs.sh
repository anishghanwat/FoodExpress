#!/bin/bash
# View logs for EC2 deployment
# Usage: ./view-logs.sh [service-name]
# Example: ./view-logs.sh api-gateway
# Or: ./view-logs.sh (shows all logs)

cd ~/FoodExpress || exit 1

if [ -z "$1" ]; then
    echo "📋 Showing logs for all services (Ctrl+C to exit)..."
    docker-compose -f docker-compose.prod.yml logs -f --tail=100
else
    echo "📋 Showing logs for $1 (Ctrl+C to exit)..."
    docker-compose -f docker-compose.prod.yml logs -f --tail=100 "$1"
fi
