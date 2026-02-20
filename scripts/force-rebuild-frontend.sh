#!/bin/bash

# Get the public IP of the EC2 instance
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "Detected EC2 Public IP: $PUBLIC_IP"

cd /home/ubuntu/FoodExpress

# Stop and remove frontend container
echo "Stopping frontend container..."
docker-compose -f docker-compose.prod.yml stop frontend
docker-compose -f docker-compose.prod.yml rm -f frontend

# Remove frontend image to force rebuild
echo "Removing old frontend image..."
docker rmi foodexpress-frontend 2>/dev/null || true

# Update frontend .env file
echo "Updating frontend/.env..."
cat > frontend/.env << EOF
VITE_API_BASE_URL=http://${PUBLIC_IP}:8080
VITE_WS_URL=ws://${PUBLIC_IP}:8080
EOF

echo "Frontend .env contents:"
cat frontend/.env

# Build and start frontend with no cache
echo "Building frontend from scratch (no cache)..."
docker-compose -f docker-compose.prod.yml build --no-cache frontend
docker-compose -f docker-compose.prod.yml up -d frontend

echo ""
echo "✅ Done! Frontend will be ready in 2-3 minutes."
echo "Access your app at: http://${PUBLIC_IP}"
echo ""
echo "Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R) when you reload!"
