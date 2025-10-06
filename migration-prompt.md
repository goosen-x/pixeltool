# Next.js Project Migration from Vercel to Self-Hosted Server

## Comprehensive Migration Guide

This prompt provides detailed instructions for migrating a Next.js application
from Vercel to a self-hosted server environment, based on the successful
migration of the PixelTool project.

### 🏗️ Project Architecture Requirements

**Core Technologies:**

- Next.js 15+ with App Router
- React 18+ with TypeScript
- Node.js 18+ runtime
- PostgreSQL database (via Supabase or self-hosted)

**Key Dependencies:**

```json
{
	"next": "^15.0.0",
	"react": "^18.0.0",
	"typescript": "^5.0.0",
	"@supabase/supabase-js": "^2.0.0",
	"next-themes": "^0.3.0",
	"tailwindcss": "^3.4.0"
}
```

### 🚀 Pre-Migration Checklist

**1. Environment Analysis**

- [ ] Document all environment variables from Vercel dashboard
- [ ] Identify external service dependencies (analytics, databases, APIs)
- [ ] Review build configuration and custom scripts
- [ ] Check for Vercel-specific features being used
- [ ] Document current deployment workflow

**2. Performance Baseline**

- [ ] Record current Core Web Vitals metrics
- [ ] Document average build times
- [ ] Note current bundle sizes
- [ ] Test critical user flows

**3. Database Migration Planning**

- [ ] If using Vercel's database, plan migration to Supabase or self-hosted
      PostgreSQL
- [ ] Export existing data and schema
- [ ] Test database connectivity from new server

### 🔧 Server Infrastructure Setup

**Recommended Server Specifications:**

- **CPU:** 2+ cores (4+ for production)
- **RAM:** 4GB minimum (8GB+ recommended)
- **Storage:** 20GB+ SSD
- **OS:** Ubuntu 22.04 LTS or similar

**Required Software Stack:**

```bash
# Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# PM2 for process management
npm install -g pm2

# Nginx for reverse proxy
sudo apt update
sudo apt install nginx

# PostgreSQL (if self-hosting database)
sudo apt install postgresql postgresql-contrib

# SSL certificates (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
```

### 📦 Application Migration Steps

**1. Environment Variables Setup** Create `.env.local` and `.env.production`
files:

```bash
# Core Application
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# Database (Supabase recommended)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Analytics (Optional)
NEXT_PUBLIC_YANDEX_METRIKA_ID=your-metrika-id
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id

# Node Environment
NODE_ENV=production
```

**2. Build Configuration** Update `next.config.js` for self-hosted environment:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	experimental: {
		outputFileTracingRoot: path.join(__dirname, '../../')
	},
	images: {
		unoptimized: false,
		domains: ['yourdomain.com']
	},
	// Remove Vercel-specific configurations
	async rewrites() {
		return [
			// Add your custom rewrites
		]
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'DENY'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin'
					}
				]
			}
		]
	}
}

module.exports = nextConfig
```

**3. Package.json Scripts** Update build and deployment scripts:

```json
{
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"lint": "next lint",
		"typecheck": "tsc --noEmit",
		"build:production": "NODE_ENV=production next build",
		"start:production": "NODE_ENV=production next start -p 3000"
	}
}
```

### 🔄 Deployment Automation

**1. PM2 Configuration** Create `ecosystem.config.js`:

```javascript
module.exports = {
	apps: [
		{
			name: 'your-app-name',
			script: 'npm',
			args: 'start',
			cwd: '/path/to/your/app',
			instances: 'max',
			exec_mode: 'cluster',
			env: {
				NODE_ENV: 'production',
				PORT: 3000
			},
			error_file: '/var/log/pm2/your-app-error.log',
			out_file: '/var/log/pm2/your-app-out.log',
			log_file: '/var/log/pm2/your-app-combined.log',
			time: true
		}
	]
}
```

**2. Nginx Configuration** Create `/etc/nginx/sites-available/your-domain`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

**3. Deployment Script** Create `deploy.sh`:

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment...${NC}"

# Backup current version
if [ -d "/var/www/your-app" ]; then
    echo -e "${YELLOW}Creating backup...${NC}"
    sudo cp -r /var/www/your-app /var/www/your-app-backup-$(date +%Y%m%d-%H%M%S)
fi

# Pull latest code
echo -e "${YELLOW}Pulling latest code...${NC}"
cd /var/www/your-app
git pull origin main

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci --production=false

# Run type checking
echo -e "${YELLOW}Running type check...${NC}"
npm run typecheck

# Build application
echo -e "${YELLOW}Building application...${NC}"
npm run build:production

# Restart PM2
echo -e "${YELLOW}Restarting application...${NC}"
pm2 restart ecosystem.config.js

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}Deployment completed successfully!${NC}"

# Health check
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}Health check passed!${NC}"
else
    echo -e "${RED}Health check failed!${NC}"
    exit 1
fi
```

### 🔍 Migration Verification

**1. Functionality Testing**

- [ ] All pages load correctly
- [ ] Dynamic routes work as expected
- [ ] API endpoints respond properly
- [ ] Database connections are stable
- [ ] File uploads work (if applicable)
- [ ] Authentication flows function correctly

**2. Performance Testing**

- [ ] Core Web Vitals meet or exceed Vercel performance
- [ ] Build times are reasonable (< 5 minutes for most projects)
- [ ] Server response times are acceptable (< 200ms for static content)
- [ ] Image optimization is working

**3. SEO Verification**

- [ ] Meta tags are properly rendered
- [ ] Sitemap.xml is accessible
- [ ] robots.txt is correct
- [ ] Open Graph images generate correctly
- [ ] Structured data is present

### 🚨 Common Migration Issues & Solutions

**Issue 1: Environment Variable Problems**

```bash
# Check if variables are loaded
echo $NEXT_PUBLIC_SITE_URL

# Verify in application
console.log(process.env.NEXT_PUBLIC_SITE_URL)
```

**Issue 2: Database Connection Failures**

```javascript
// Test database connection
const testConnection = async () => {
	try {
		const { data, error } = await supabase
			.from('your_table')
			.select('*')
			.limit(1)

		if (error) throw error
		console.log('Database connection successful')
	} catch (err) {
		console.error('Database connection failed:', err)
	}
}
```

**Issue 3: Build Failures**

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for missing dependencies
npm audit
npm update
```

**Issue 4: SSL Certificate Issues**

```bash
# Renew certificates
sudo certbot renew --dry-run

# Test SSL configuration
sudo nginx -t
```

### 📊 Performance Optimization

**1. Server-Level Optimizations**

```bash
# Optimize Node.js memory usage
export NODE_OPTIONS="--max-old-space-size=4096"

# Enable PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**2. Application-Level Optimizations**

```javascript
// next.config.js optimizations
const nextConfig = {
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production'
	},
	experimental: {
		scrollRestoration: true
	},
	poweredByHeader: false,
	compress: true
}
```

### 🔄 Monitoring & Maintenance

**1. Health Monitoring**

```bash
# Create health check endpoint
# pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

**2. Log Management**

```bash
# PM2 logs
pm2 logs --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

**3. Backup Strategy**

```bash
# Application backup
tar -czf app-backup-$(date +%Y%m%d).tar.gz /var/www/your-app

# Database backup (if self-hosted)
pg_dump your_database > backup-$(date +%Y%m%d).sql
```

### 🎯 Go-Live Checklist

**Pre-Launch (24 hours before):**

- [ ] Complete migration testing on staging environment
- [ ] Verify all environment variables are set
- [ ] Test database migration and connectivity
- [ ] Confirm SSL certificates are installed and working
- [ ] Set up monitoring and alerting
- [ ] Prepare rollback plan

**Launch Day:**

- [ ] Update DNS records to point to new server
- [ ] Monitor application performance and error rates
- [ ] Verify all critical user flows work correctly
- [ ] Check analytics tracking is functioning
- [ ] Confirm email notifications are being sent
- [ ] Monitor server resources (CPU, memory, disk)

**Post-Launch (first week):**

- [ ] Daily performance monitoring
- [ ] Review error logs and fix any issues
- [ ] Monitor user feedback and support tickets
- [ ] Optimize performance based on real traffic patterns
- [ ] Document any additional configuration changes needed

### 📞 Support & Troubleshooting

**Common Commands:**

```bash
# Restart application
pm2 restart all

# View application status
pm2 status

# Monitor real-time logs
pm2 monit

# Check Nginx configuration
sudo nginx -t

# Reload Nginx without downtime
sudo systemctl reload nginx

# Check server resources
htop
df -h
free -h
```

This migration guide provides a comprehensive approach to moving from Vercel to
a self-hosted environment while maintaining the performance, security, and
functionality of your Next.js application.
