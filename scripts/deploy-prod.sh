#!/bin/bash

# Production Deployment Script for FoodExpress
set -e

echo "========================================="
echo "FoodExpress Production Deployment"
echo "========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file from .env.example and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "✅ Environment variables loaded"
echo ""

# Check required environment variables
required_vars=("MYSQL_PASSWORD" "RAZORPAY_KEY_ID" "RAZORPAY_KEY_SECRET" "MAIL_USERNAME" "MAIL_PASSWORD")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Error: Missing required environment variables:"
    printf '   - %s\n' "${missing_vars[@]}"
    echo ""
    echo "Please configure these in your .env file"
    exit 1
fi

echo "✅ All required environment variables are set"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down
echo ""

# Remove old images (optional - uncomment to clean up)
# echo "🧹 Removing old images..."
# docker-compose -f docker-compose.prod.yml down --rmi all
# echo ""

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache
echo ""

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service health
echo ""
echo "🏥 Checking service health..."
docker-compose -f docker-compose.prod.yml ps
echo ""

# Initialize database (if needed)
echo "💾 Initializing database..."
docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} -e "SHOW DATABASES;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database is accessible"
else
    echo "❌ Database connection failed"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "Services:"
echo "  - Frontend:    http://localhost"
echo "  - API Gateway: http://localhost:8080"
echo "  - Eureka:      http://localhost:8761"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f [service-name]"
echo ""
echo "To stop all services:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
