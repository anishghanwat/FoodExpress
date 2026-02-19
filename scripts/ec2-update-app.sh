#!/bin/bash
# Quick update script for EC2 deployment
# Usage: ./update-app.sh

echo "🔄 Updating FoodExpress application..."

cd ~/FoodExpress || exit 1

echo "📥 Pulling latest code from GitHub..."
git pull origin main

echo "🔨 Rebuilding and restarting services..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

echo "⏳ Waiting for services to start..."
sleep 30

echo "✅ Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 Update complete!"
echo "Frontend: http://3.110.98.241"
echo "API Gateway: http://3.110.98.241:8080"
