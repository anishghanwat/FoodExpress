#!/bin/bash

# Health Check Script for FoodExpress Services

echo "========================================="
echo "FoodExpress Health Check"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" $url 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓${NC} $service_name is healthy"
        return 0
    else
        echo -e "${RED}✗${NC} $service_name is unhealthy (HTTP $response)"
        return 1
    fi
}

# Check Docker
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}✗${NC} Docker is not running"
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker is running"
echo ""

# Check containers
echo "Container Status:"
docker-compose -f docker-compose.prod.yml ps
echo ""

# Check service health endpoints
echo "Service Health:"
check_service "Eureka Server" "http://localhost:8761/actuator/health"
check_service "API Gateway" "http://localhost:8080/actuator/health"
check_service "Frontend" "http://localhost/health"
echo ""

# Check database
echo "Database:"
if docker exec foodexpress-mysql mysql -uroot -p${MYSQL_PASSWORD} -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} MySQL is accessible"
else
    echo -e "${RED}✗${NC} MySQL connection failed"
fi
echo ""

# Check Kafka
echo "Kafka:"
if docker exec foodexpress-kafka kafka-broker-api-versions --bootstrap-server localhost:9092 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Kafka is accessible"
    
    # List topics
    echo "  Topics:"
    docker exec foodexpress-kafka kafka-topics --list --bootstrap-server localhost:9092 | sed 's/^/    - /'
else
    echo -e "${RED}✗${NC} Kafka connection failed"
fi
echo ""

# Check Eureka registered services
echo "Registered Services (Eureka):"
curl -s http://localhost:8761/eureka/apps | grep -o '<app>[^<]*</app>' | sed 's/<app>//g' | sed 's/<\/app>//g' | sed 's/^/  - /' || echo "  Unable to fetch"
echo ""

echo "========================================="
echo "Health Check Complete"
echo "========================================="
