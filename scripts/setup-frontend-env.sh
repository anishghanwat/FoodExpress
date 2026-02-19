#!/bin/bash

# Setup Frontend Environment for Production
# This script creates the frontend .env file with production values

echo "Setting up frontend environment for production..."

# Get the public IP or domain
read -p "Enter your server IP or domain (e.g., 54.123.45.67 or yourdomain.com): " SERVER_ADDRESS

# Get Razorpay key
read -p "Enter your Razorpay Key ID: " RAZORPAY_KEY

# Create frontend .env file
cat > frontend/.env << EOF
# API Configuration
VITE_API_GATEWAY_URL=http://${SERVER_ADDRESS}:8080
VITE_WS_URL=ws://${SERVER_ADDRESS}:8080/ws

# App Configuration
VITE_APP_NAME=FoodExpress
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_MOCK=false
VITE_ENABLE_ANALYTICS=false

# Map Configuration (for delivery tracking)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=${RAZORPAY_KEY}
EOF

echo "✅ Frontend .env file created!"
echo ""
echo "File location: frontend/.env"
echo "API Gateway URL: http://${SERVER_ADDRESS}:8080"
echo ""
echo "You can now run: docker-compose -f docker-compose.prod.yml up -d --build"
