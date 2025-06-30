#!/bin/bash

# WireGuard VPN Manager - Hetzner Deployment Script
# This script automates the deployment of the VPN Manager to a Hetzner VPS

set -e  # Exit on any error

# Configuration - Update these variables for your server
SERVER_USER="root"
SERVER_HOST="your_server_ip"  # Replace with your Hetzner server IP or hostname
SSH_KEY="/path/to/your/ssh/key.pem" # Path to your SSH private key
APP_NAME="wireguard-vpn"
DOMAIN="your_domain.com"  # Your domain (e.g., vpn.example.com)
GITHUB_REPO="https://github.com/your-username/your-repo.git" # Update if you fork the repo
DEPLOY_PATH="/opt/wireguard-vpn"
SERVICE_NAME="wireguard-vpn"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    print_error "SSH key not found at $SSH_KEY"
    exit 1
fi

# Check if SSH key has correct permissions
chmod 600 "$SSH_KEY"

print_status "🚀 Starting deployment to $DOMAIN ($SERVER_HOST)..."

# Test SSH connection
print_status "Testing SSH connection..."
if ! ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "echo 'SSH connection successful'"; then
    print_error "Failed to connect to server. Please check your SSH key and server IP."
    exit 1
fi

# Build the application locally
print_status "📦 Building application locally..."
npm run build || {
    print_error "Build failed!"
    exit 1
}

# Create deployment package
print_status "📦 Packaging application..."
tar -czf wireguard-vpn.tar.gz \
    --exclude=node_modules \
    --exclude=db/wireguard.db \
    --exclude=.next/cache \
    --exclude=.git \
    --exclude="*.log" \
    .

# Upload package to server
print_status "⬆️  Uploading to server..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no wireguard-vpn.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Deploy on server
print_status "🔧 Deploying on server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << EOF
set -e

# Update system
apt-get update -y

# Install Node.js 20 if not present
if ! command -v node &> /dev/null || [[ \$(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 globally
npm install -g pm2

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
fi

# Create deployment directory
mkdir -p $DEPLOY_PATH
cd $DEPLOY_PATH

# ENHANCED DATABASE BACKUP SYSTEM
BACKUP_DIR="/root/db-backups"
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR

# Check if database exists and validate it has real data
if [ -f db/wireguard.db ]; then
    USER_COUNT=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
    DEVICE_COUNT=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM wireguard_devices;" 2>/dev/null || echo "0")
    INVITE_COUNT=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM invitation_codes;" 2>/dev/null || echo "0")
    
    echo "Current database contains: \$USER_COUNT users, \$DEVICE_COUNT devices, \$INVITE_COUNT invite codes"
    
    # Flush WAL to ensure all recent writes are in the main database file
    sqlite3 db/wireguard.db "PRAGMA wal_checkpoint(FULL);" 2>/dev/null || true

    # Create timestamped backup
    cp db/wireguard.db \$BACKUP_DIR/wireguard-backup-\$TIMESTAMP.db
    echo "✅ Database backed up to \$BACKUP_DIR/wireguard-backup-\$TIMESTAMP.db"
    
    # Also create temp backup for restore
    cp db/wireguard.db /tmp/wireguard.db.backup
    
    # If database seems empty (only 1 user = seeded admin), check for existing backups
    if [ "\$USER_COUNT" -le 1 ]; then
        echo "⚠️  Current database appears to have minimal data (\$USER_COUNT users)"
        LATEST_BACKUP=\$(ls -t \$BACKUP_DIR/wireguard-backup-*.db 2>/dev/null | head -1)
        if [ -n "\$LATEST_BACKUP" ]; then
            BACKUP_USER_COUNT=\$(sqlite3 "\$LATEST_BACKUP" "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
            echo "Found existing backup with \$BACKUP_USER_COUNT users: \$LATEST_BACKUP"
            if [ "\$BACKUP_USER_COUNT" -gt 1 ]; then
                echo "🔄 Using existing backup with more user data"
                cp "\$LATEST_BACKUP" /tmp/wireguard.db.backup
            fi
        fi
    fi
else
    echo "No existing database found"
fi

# Extract new application
tar -xzf /tmp/wireguard-vpn.tar.gz --strip-components=0 -C $DEPLOY_PATH

# Restore database if backup exists
if [ -f /tmp/wireguard.db.backup ]; then
    mkdir -p db
    cp /tmp/wireguard.db.backup db/wireguard.db
    echo "✅ Database restored from backup"
    
    # Verify restored data
    RESTORED_USERS=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
    RESTORED_DEVICES=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM wireguard_devices;" 2>/dev/null || echo "0")
    RESTORED_INVITES=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM invitation_codes;" 2>/dev/null || echo "0")
    echo "Restored database contains: \$RESTORED_USERS users, \$RESTORED_DEVICES devices, \$RESTORED_INVITES invite codes"
fi

# Install dependencies
npm install --production

# Run database migrations and seed if needed
if [ ! -f db/wireguard.db ]; then
    npm run db:generate
    npm run db:push
    npm run db:seed
    echo "Database initialized and seeded"
else
    # Validate database has required tables and data
    USER_COUNT=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
    INVITE_COUNT=\$(sqlite3 db/wireguard.db "SELECT COUNT(*) FROM invitation_codes;" 2>/dev/null || echo "0")
    if [ "\$USER_COUNT" -eq 0 ]; then
        echo "⚠️  Database exists but has no users, running seed..."
        npm run db:seed
    else
        echo "✅ Database validated: \$USER_COUNT users and \$INVITE_COUNT invite codes found"
    fi
fi

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: '$SERVICE_NAME',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXTAUTH_URL: 'https://$DOMAIN',
      NEXTAUTH_SECRET: '\$(openssl rand -base64 32)',
      WIREGUARD_SERVER_DOMAIN: 'https://$DOMAIN'
    }
  }]
}
EOL

# Stop existing PM2 processes
pm2 stop all || true
pm2 delete all || true

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Configure Nginx for your domain with SSL
# IMPORTANT: You need to obtain SSL certificates for your domain (e.g., via Certbot/Let's Encrypt or Cloudflare)
# and place them in /etc/nginx/ssl/$DOMAIN/fullchain.pem and /etc/nginx/ssl/$DOMAIN/privkey.pem
# This script assumes you have already done this or will do it manually.

mkdir -p /etc/nginx/ssl/$DOMAIN

cat > /etc/nginx/sites-available/$DOMAIN << 'EOL'
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/nginx/ssl/$DOMAIN/fullchain.pem; # Update with your certificate path
    ssl_certificate_key /etc/nginx/ssl/$DOMAIN/privkey.pem; # Update with your private key path
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

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
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t && systemctl reload nginx

# Clean up
rm -f /tmp/wireguard-vpn.tar.gz

echo "✅ Deployment completed successfully!"
echo "🌐 Your VPN Manager is available at: https://$DOMAIN"
echo "🔑 Admin login: admin / admin123"
echo "📊 PM2 status: \$(pm2 status)"

EOF

# Clean up local files
rm -f wireguard-vpn.tar.gz

print_status "🎉 Deployment completed!"
print_status "🌐 Your VPN Manager should be available at: https://$DOMAIN"
print_status "🔑 Admin credentials: admin / admin123"
print_warning "⚠️  Remember to:"
print_warning "   1. Point $DOMAIN to $SERVER_HOST in your DNS"
print_warning "   2. Obtain and place your SSL certificate and key in /etc/nginx/ssl/$DOMAIN/"
print_warning "      (e.g., fullchain.pem and privkey.pem from Certbot)"
print_warning "   3. Change the default admin password"
print_warning "   4. Update WIREGUARD_SERVER_DOMAIN in ecosystem.config.js if it's different from your main domain" 