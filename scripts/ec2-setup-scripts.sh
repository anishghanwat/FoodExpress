#!/bin/bash
# One-time setup script to install helper scripts on EC2
# Run this once after connecting to EC2 via Instance Connect

echo "🔧 Setting up FoodExpress helper scripts..."

cd ~/FoodExpress || exit 1

# Make all EC2 scripts executable
chmod +x scripts/ec2-*.sh

# Create symlinks in home directory for easy access
ln -sf ~/FoodExpress/scripts/ec2-update-app.sh ~/update-app.sh
ln -sf ~/FoodExpress/scripts/ec2-quick-restart.sh ~/restart.sh
ln -sf ~/FoodExpress/scripts/ec2-view-logs.sh ~/logs.sh
ln -sf ~/FoodExpress/scripts/ec2-health-check.sh ~/health.sh

# Add helpful aliases to .bashrc
if ! grep -q "FoodExpress aliases" ~/.bashrc; then
    cat >> ~/.bashrc << 'EOF'

# FoodExpress aliases
alias fd-update='~/update-app.sh'
alias fd-restart='~/restart.sh'
alias fd-logs='~/logs.sh'
alias fd-health='~/health.sh'
alias fd-cd='cd ~/FoodExpress'
alias fd-ps='cd ~/FoodExpress && docker-compose -f docker-compose.prod.yml ps'

# Disable BuildKit to prevent hanging
export DOCKER_BUILDKIT=0
export BUILDX_NO_DEFAULT_ATTESTATIONS=1
EOF
    echo "✅ Added aliases to .bashrc"
fi

# Source the updated .bashrc
source ~/.bashrc

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Available commands:"
echo "  ~/update-app.sh       - Pull latest code and rebuild"
echo "  ~/restart.sh          - Quick restart services"
echo "  ~/logs.sh             - View logs"
echo "  ~/health.sh           - Check service health"
echo ""
echo "📝 Available aliases:"
echo "  fd-update    - Update app"
echo "  fd-restart   - Restart services"
echo "  fd-logs      - View logs"
echo "  fd-health    - Health check"
echo "  fd-cd        - Go to FoodExpress directory"
echo "  fd-ps        - Show service status"
echo ""
echo "🎯 Next step: Restart API Gateway to apply CORS fix"
echo "Run: ~/restart.sh api-gateway"
