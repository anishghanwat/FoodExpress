#!/bin/bash
# Health check script for EC2 deployment
# Usage: ./health-check.sh

echo "🏥 FoodExpress Health Check"
echo "================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    exit 1
fi
echo "✅ Docker is running"

# Check Docker Compose services
cd ~/FoodExpress || exit 1

echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🔍 Health Endpoints:"

# API Gateway
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ API Gateway (8080): UP"
else
    echo "❌ API Gateway (8080): DOWN"
fi

# User Service
if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
    echo "✅ User Service (8081): UP"
else
    echo "❌ User Service (8081): DOWN"
fi

# Restaurant Service
if curl -s http://localhost:8082/actuator/health > /dev/null 2>&1; then
    echo "✅ Restaurant Service (8082): UP"
else
    echo "❌ Restaurant Service (8082): DOWN"
fi

# Order Service
if curl -s http://localhost:8083/actuator/health > /dev/null 2>&1; then
    echo "✅ Order Service (8083): UP"
else
    echo "❌ Order Service (8083): DOWN"
fi

# Payment Service
if curl -s http://localhost:8084/actuator/health > /dev/null 2>&1; then
    echo "✅ Payment Service (8084): UP"
else
    echo "❌ Payment Service (8084): DOWN"
fi

# Delivery Service
if curl -s http://localhost:8085/actuator/health > /dev/null 2>&1; then
    echo "✅ Delivery Service (8085): UP"
else
    echo "❌ Delivery Service (8085): DOWN"
fi

# Notification Service
if curl -s http://localhost:8086/actuator/health > /dev/null 2>&1; then
    echo "✅ Notification Service (8086): UP"
else
    echo "❌ Notification Service (8086): DOWN"
fi

# Eureka Server
if curl -s http://localhost:8761 > /dev/null 2>&1; then
    echo "✅ Eureka Server (8761): UP"
else
    echo "❌ Eureka Server (8761): DOWN"
fi

# Frontend
if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Frontend (80): UP"
else
    echo "❌ Frontend (80): DOWN"
fi

# MySQL
if docker exec foodexpress-mysql mysqladmin ping -h localhost -uroot -p${MYSQL_PASSWORD:-root} --silent > /dev/null 2>&1; then
    echo "✅ MySQL: UP"
else
    echo "❌ MySQL: DOWN"
fi

# Kafka
if docker exec foodexpress-kafka kafka-broker-api-versions --bootstrap-server localhost:9092 > /dev/null 2>&1; then
    echo "✅ Kafka: UP"
else
    echo "❌ Kafka: DOWN"
fi

echo ""
echo "================================"
echo "🌐 Access URLs:"
echo "Frontend: http://3.110.98.241"
echo "API Gateway: http://3.110.98.241:8080"
echo "Eureka: http://3.110.98.241:8761"
