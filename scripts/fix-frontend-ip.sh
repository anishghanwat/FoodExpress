#!/bin/bash

# Get the public IP of the EC2 instance
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "Detected EC2 Public IP: $PUBLIC_IP"

# Update frontend .env file
cat > /home/ubuntu/FoodExpress/frontend/.env << EOF
VITE_API_BASE_URL=http://${PUBLIC_IP}:8080
VITE_WS_URL=ws://${PUBLIC_IP}:8080
EOF

echo "Updated frontend/.env with IP: $PUBLIC_IP"
cat /home/ubuntu/FoodExpress/frontend/.env

# Rebuild frontend container
echo "Rebuilding frontend container..."
cd /home/ubuntu/FoodExpress
docker-compose -f docker-compose.prod.yml up -d --build frontend

echo ""
echo "✅ Done! Frontend will be ready in 2-3 minutes."
echo "Access your app at: http://${PUBLIC_IP}"
