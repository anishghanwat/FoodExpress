#!/bin/bash

# Log Viewer Script for FoodExpress

if [ -z "$1" ]; then
    echo "Usage: ./logs.sh [service-name|all]"
    echo ""
    echo "Available services:"
    echo "  - eureka-server"
    echo "  - api-gateway"
    echo "  - user-service"
    echo "  - restaurant-service"
    echo "  - order-service"
    echo "  - payment-service"
    echo "  - delivery-service"
    echo "  - notification-service"
    echo "  - frontend"
    echo "  - mysql"
    echo "  - kafka"
    echo "  - all (all services)"
    exit 1
fi

if [ "$1" = "all" ]; then
    docker-compose -f docker-compose.prod.yml logs -f
else
    docker-compose -f docker-compose.prod.yml logs -f $1
fi
