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
    echo "Please run manually with: PUBLIC_IP=your_ip bash $0"
    exit 1
fi

cd /home/ubuntu/FoodExpress

# Update .env.production with the correct IP
cat > .env.production << EOF
# MySQL Configuration
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=kafka:9092

# Eureka Configuration
EUREKA_SERVER_URL=http://eureka-server:8761/eureka/

# Mail Configuration (Notification Service)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=fooddelapp@gmail.com
MAIL_PASSWORD=ebxr vrbo rzkg hznp
MAIL_FROM_NAME=FoodExpress

# Razorpay Configuration (Payment Service)
RAZORPAY_KEY_ID=rzp_test_SHk0nqdeDnb7Oc
RAZORPAY_KEY_SECRET=Ymt7tZ8XzLDZyNzA03RGH3B3

# Frontend Configuration (with EC2 IP)
VITE_API_GATEWAY_URL=http://${PUBLIC_IP}:8080
VITE_WS_URL=ws://${PUBLIC_IP}:8080/ws
VITE_RAZORPAY_KEY_ID=rzp_test_SHk0nqdeDnb7Oc
EOF

echo ""
echo "✅ Updated .env.production with IP: $PUBLIC_IP"
echo ""
echo "Frontend will connect to: http://${PUBLIC_IP}:8080"
