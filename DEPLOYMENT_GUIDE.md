# Deployment Guide - WireGuard VPN Manager

This guide covers deployment of the WireGuard VPN Manager to a Hetzner VPS using the automated deployment script, as well as manual deployment options for other providers.

## Prerequisites

- A Hetzner VPS with Ubuntu 20.04+ or Debian 11+ (2 vCPU, 4GB RAM recommended)
- SSH access to your server with root privileges
- Domain name pointed to your server (optional but recommended)
- Git and GitHub account

## Quick Deployment (Recommended)

### 1. Automated Hetzner Deployment

The project includes a fully tested automated deployment script for Hetzner Cloud:

```bash
# Configure your server details in deploy-hetzner.sh
SERVER_HOST="your-server-ip"  # Your Hetzner server IP
DOMAIN="your-domain.com"      # Your domain name

# Run the deployment
chmod +x deploy-hetzner.sh
./deploy-hetzner.sh
```

The script automatically:
- ✅ Builds the production application
- ✅ Uploads files to your server
- ✅ Installs Node.js 20 and dependencies
- ✅ Sets up PM2 process manager with auto-restart
- ✅ Configures Nginx reverse proxy
- ✅ Preserves existing database between deployments
- ✅ Starts the application on port 3000

### 2. Access Your Application

After successful deployment:
- **URL**: https://your-domain.com (or http://your-server-ip)
- **Admin Login**: Username `admin`, Password `admin123`
- **First Steps**: 
  1. Change admin password immediately
  2. Create invitation codes for your users
  3. Test device setup

## Post-Deployment Configuration

### 1. Admin Setup

1. **Login** to your VPN manager
2. **Change admin password** in Account Settings
3. **Create invitation codes** in Admin Dashboard:
   - Go to `/dashboard/admin`
   - Click "Create Invitation Code"
   - Set custom code, max uses, and expiration
4. **Share codes** with intended users

### 2. Domain Configuration (Optional)

If using a custom domain:

```bash
# SSH into your server
ssh root@your-server-ip

# Update Nginx configuration
nano /etc/nginx/sites-available/your-domain.com

# Update the server_name directive
server_name your-domain.com;

# Test and reload
nginx -t && systemctl reload nginx
```

### 3. SSL/TLS Setup

The deployment script sets up basic SSL. For Let's Encrypt certificates:

```bash
# Install certbot
apt update && apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
certbot renew --dry-run
```

## Manual Deployment (Other Providers)

For deployment to other VPS providers (DigitalOcean, AWS, etc.):

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install WireGuard
sudo apt install -y wireguard
```

### 2. Application Setup

```bash
# Create application directory
sudo mkdir -p /opt/wireguard-vpn
cd /opt/wireguard-vpn

# Clone repository (or upload files)
git clone https://github.com/arashvakil/LeiaGuard.git .

# Install dependencies
npm install --production

# Build application
npm run build

# Set up database
npm run db:push
npm run db:seed
```

### 3. Process Management

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'wireguard-vpn',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXTAUTH_URL: 'https://your-domain.com',
      NEXTAUTH_SECRET: 'your-super-secret-key-here'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Configuration

```bash
# Create Nginx site configuration
sudo cat > /etc/nginx/sites-available/wireguard-vpn << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

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
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/wireguard-vpn /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## WireGuard Server Setup

### 1. Install and Configure WireGuard

```bash
# Generate server keys
cd /etc/wireguard
sudo wg genkey | sudo tee privatekey | wg pubkey | sudo tee publickey
sudo chmod 600 privatekey

# Create server configuration
sudo cat > wg0.conf << EOF
[Interface]
PrivateKey = $(sudo cat privatekey)
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Clients will be added here automatically by the VPN manager
EOF
```

### 2. Enable IP Forwarding

```bash
# Enable IP forwarding
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start and enable WireGuard
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

### 3. Firewall Configuration

```bash
# Configure UFW (if using)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 51820/udp # WireGuard
sudo ufw enable

# For Hetzner Cloud, configure firewall in the web console
```

## Management and Monitoring

### Service Management

```bash
# Check application status
pm2 status
pm2 logs wireguard-vpn

# Restart application
pm2 restart wireguard-vpn

# View system resources
htop
df -h

# Check WireGuard status
sudo wg show
sudo systemctl status wg-quick@wg0
```

### Updates

```bash
# Update application (re-run deployment script)
./deploy-hetzner.sh

# Or manually
cd /opt/wireguard-vpn
git pull
npm install --production
npm run build
pm2 restart wireguard-vpn
```

### Backup

```bash
# Backup database
cp /opt/wireguard-vpn/db/wireguard.db /opt/backups/wireguard-$(date +%Y%m%d).db

# Backup WireGuard configuration
cp /etc/wireguard/wg0.conf /opt/backups/wg0-$(date +%Y%m%d).conf
```

## Admin Features

### User Management

1. **Access Admin Dashboard**: `/dashboard/admin`
2. **View All Users**: `/dashboard/admin/users`
   - Monitor device counts per user
   - Enable/disable user accounts
   - See registration details
3. **Invitation Code Management**:
   - Create codes with custom expiration and usage limits
   - Track code usage and analytics
   - Monitor user registrations

### Monitoring

- **Real-time Status**: Device and user status monitoring
- **Usage Analytics**: Track invitation code usage
- **Device Management**: View all devices across all users
- **Activity Tracking**: Monitor user registrations and device creation

## Security Considerations

1. **Change default admin password** immediately after deployment
2. **Use strong invitation codes** and set appropriate expiration dates
3. **Monitor user activity** regularly through admin dashboard
4. **Keep server updated**: `apt update && apt upgrade -y`
5. **Regular backups** of database and WireGuard configuration
6. **Monitor system logs** for unusual activity

## Troubleshooting

### Common Issues

- **404 errors**: Clear browser cache, restart PM2
- **Database locked**: Check file permissions on `/opt/wireguard-vpn/db/wireguard.db`
- **WireGuard not working**: Check `systemctl status wg-quick@wg0`
- **SSL issues**: Verify domain DNS and certificate configuration

### Logs

```bash
# Application logs
pm2 logs wireguard-vpn

# System logs  
journalctl -u nginx
journalctl -u wg-quick@wg0

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

For more troubleshooting, see the main [README.md](README.md) file. 