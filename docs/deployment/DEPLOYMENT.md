# Deployment Guide for PixelTool

## Current Status

✅ Docker container is running on the server at `http://91.197.99.37:3000`

## Next Steps

### 1. Configure Nginx (Reverse Proxy)

SSH to your server and run these commands:

```bash
# Copy Nginx configuration
scp nginx.conf your-user@91.197.99.37:~/pixeltool/

# SSH to server
ssh your-user@91.197.99.37

# Copy setup script and run it
cd ~/pixeltool
chmod +x scripts/setup-nginx.sh
./scripts/setup-nginx.sh
```

Or manually:

```bash
# Install Nginx
sudo apt update
sudo apt install -y nginx

# Copy configuration
sudo cp ~/pixeltool/nginx.conf /etc/nginx/sites-available/pixeltool

# Enable site
sudo ln -sf /etc/nginx/sites-available/pixeltool /etc/nginx/sites-enabled/pixeltool

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 2. Configure DNS

Make sure your domain `pixeltool.pro` points to your server IP `91.197.99.37`:

- A record: `pixeltool.pro` → `91.197.99.37`
- A record: `www.pixeltool.pro` → `91.197.99.37`

### 3. Set up SSL Certificate

Once DNS is configured and propagated:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d pixeltool.pro -d www.pixeltool.pro
```

### 4. Update Nginx for HTTPS

After SSL setup, edit `/etc/nginx/sites-available/pixeltool`:

- Uncomment the HTTPS server block
- Update the HTTP server block to redirect to HTTPS

```bash
sudo nano /etc/nginx/sites-available/pixeltool
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configure GitHub Secrets (Optional)

If you plan to use Supabase or other services, add these secrets in GitHub:

- Go to Settings → Secrets and variables → Actions
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `DATABASE_URL`
  - `NEXT_PUBLIC_YANDEX_METRIKA_ID`

## Monitoring

Check if everything is working:

```bash
# Check Docker container
docker ps | grep pixeltool
docker logs pixeltool

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Troubleshooting

### Container not running

```bash
cd ~/pixeltool
docker logs pixeltool
docker run -d --name pixeltool --restart unless-stopped --env-file .env.production -p 3000:3000 ghcr.io/goosen-x/pixeltool:latest
```

### Nginx errors

```bash
sudo nginx -t
sudo journalctl -xe
```

### Permission issues

```bash
sudo chown -R $USER:$USER ~/pixeltool
```
