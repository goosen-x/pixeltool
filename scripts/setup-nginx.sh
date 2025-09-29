#!/bin/bash

# Setup script for Nginx on Ubuntu 24.04
# This script should be run on the server

set -e

echo "🚀 Setting up Nginx for PixelTool..."

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install -y nginx
else
    echo "✅ Nginx already installed"
fi

# Install Certbot for SSL certificates
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
else
    echo "✅ Certbot already installed"
fi

# Create Nginx configuration
echo "📝 Creating Nginx configuration..."
sudo cp ~/pixeltool/nginx.conf /etc/nginx/sites-available/pixeltool

# Enable the site
echo "🔗 Enabling site..."
sudo ln -sf /etc/nginx/sites-available/pixeltool /etc/nginx/sites-enabled/pixeltool

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Nginx setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure your domain (pixeltool.pro) points to this server (91.197.99.37)"
echo "2. Once DNS is configured, run: sudo certbot --nginx -d pixeltool.pro -d www.pixeltool.pro"
echo "3. After SSL setup, uncomment HTTPS configuration in /etc/nginx/sites-available/pixeltool"
echo "4. Reload Nginx: sudo systemctl reload nginx"