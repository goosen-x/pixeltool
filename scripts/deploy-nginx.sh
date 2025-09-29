#!/bin/bash

# Deploy Nginx configuration to server
# Usage: ./deploy-nginx.sh username

if [ -z "$1" ]; then
    echo "Usage: ./deploy-nginx.sh <username>"
    echo "Example: ./deploy-nginx.sh root"
    exit 1
fi

USER=$1
HOST="91.197.99.37"

echo "🚀 Deploying Nginx configuration to $USER@$HOST..."

# Copy files
echo "📦 Copying files..."
scp nginx.conf $USER@$HOST:~/pixeltool/
scp scripts/setup-nginx.sh $USER@$HOST:~/pixeltool/

echo "✅ Files copied successfully!"
echo ""
echo "Next steps:"
echo "1. SSH to server: ssh $USER@$HOST"
echo "2. Run: cd ~/pixeltool && chmod +x setup-nginx.sh && ./setup-nginx.sh"
echo "3. Check if site is accessible at http://pixeltool.pro"