#!/bin/bash

# Get the public IP of the EC2 instance
# Try metadata service first
PUBLIC_IP=$(curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/public-ipv4)

# If metadata service fails, try alternative methods
if [ -z "$PUBLIC_IP" ]; then
    echo "Metadata service unavailable, trying alternative method..."
    PUBLIC_IP=$(curl -s ifconfig.me)
fi

# If still empty, try another service
if [ -z "$PUBLIC_IP" ]; then
    PUBLIC_IP=$(curl -s icanhazip.com)
fi

echo "Detected EC2 Public IP: $PUBLIC_IP"

if [ -z "$PUBLIC_IP" ]; then
    echo "❌ Error: Could not detect public IP address"
    exit 1
fi

cd /home/ubuntu/FoodExpress

# Setup environment variables
bash scripts/setup-ec2-env.sh

# Stop and remove frontend container
echo "Stopping frontend container..."
docker-compose -f docker-compose.prod.yml stop frontend
docker-compose -f docker-compose.prod.yml rm -f frontend

# Remove frontend image to force rebuild
echo "Removing old frontend image..."
docker rmi foodexpress-frontend 2>/dev/null || true

# Build and start frontend with no cache
echo "Building frontend from scratch (no cache)..."
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d frontend

echo ""
echo "✅ Done! Frontend will be ready in 2-3 minutes."
echo "Access your app at: http://${PUBLIC_IP}"
echo ""
echo "Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R) when you reload!"
