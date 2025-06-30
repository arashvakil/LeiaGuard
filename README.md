# WireGuard VPN Management System

A comprehensive, secure VPN management system built with Next.js, featuring multi-use invitation codes, device management with QR codes, comprehensive admin tools, and automated WireGuard server integration.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm or yarn
- A VPS or server for deployment (Hetzner, DigitalOcean, AWS, etc.)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/arashvakil/LeiaGuard.git
   cd WireguardService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXTAUTH_SECRET=your-super-secret-key-change-this
   NEXTAUTH_URL=http://localhost:3000
   AUTH_TRUST_HOST=true
   
   # WireGuard Configuration (for production)
   WIREGUARD_SERVER_IP=your-server-ip
   WIREGUARD_SERVER_DOMAIN=your-domain.com
   WIREGUARD_SERVER_PUBLIC_KEY=your-server-public-key
   WIREGUARD_SERVER_PORT=51820
   WIREGUARD_NETWORK_RANGE=10.0.0.0/24
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:3000
   - Register with invitation code: `WELCOME01`, `FAMILY01`, `FRIENDS01`, `ACCESS01`, or `BETA01`
   - Admin access: Username `admin`, Password `admin123` (change immediately!)

## 🌐 Production Deployment

### Dockerized Setup

This project is configured to run in a Docker container, which simplifies deployment and ensures a consistent environment.

1.  **Build the Docker image**
    ```bash
    docker-compose build
    ```

2.  **Run the container**
    ```bash
    docker-compose up -d
    ```

3.  **Set up environment variables**
    Make sure your `.env.local` file is correctly configured as described in the "Local Development" section. The `docker-compose.yml` file is set up to use this file for environment variables.

4.  **Access the application**
    - Open http://localhost:3000
    - The application will be running inside the Docker container.

### Automated Deployment to Hetzner

The project includes a production-tested deployment script for Hetzner Cloud VPS:

1. **Configure the deployment script**
   ```bash
   # Edit deploy-hetzner.sh with your server details
   SERVER_HOST="your-server-ip"  # Replace with your actual server IP
   SERVER_USER="root"           # Adjust if using different user
   DOMAIN="your-domain.com"     # Your domain name
   ```

2. **Run deployment**
   ```bash
   chmod +x deploy-hetzner.sh
   ./deploy-hetzner.sh
   ```

The deployment script automatically:
- ✅ Builds the production application
- ✅ Uploads files to your server  
- ✅ Installs Node.js 20 and dependencies
- ✅ Sets up PM2 process manager
- ✅ Configures Nginx reverse proxy
- ✅ Preserves database between deployments (users, devices **and invitation codes**)
- ✅ Starts the application

3. **Post-deployment setup**
   - Access your application at `https://your-domain.com`
   - Login with admin credentials: `admin` / `admin123`
   - **Immediately change the admin password**
   - Create invitation codes for your users

### Manual Deployment

For other VPS providers, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed manual deployment instructions.

## 🛡️ Server Configuration

### Hetzner Cloud Firewall Setup

In your Hetzner Cloud Console, configure these firewall rules:

**INBOUND Rules:**
```
HTTP    TCP  80     0.0.0.0/0      Allow web traffic
HTTPS   TCP  443    0.0.0.0/0      Allow SSL traffic  
SSH     TCP  22     YOUR_IP/32     Allow SSH from your IP only
WG      UDP  51820  0.0.0.0/0      Allow WireGuard VPN traffic
```

**OUTBOUND Rules:**
```
All traffic allowed (default)
```

### WireGuard Server Setup

If WireGuard isn't installed, the deployment script handles this, but for manual setup:

```bash
# Install WireGuard
apt update && apt install -y wireguard

# Generate server keys
cd /etc/wireguard
wg genkey | tee privatekey | wg pubkey > publickey
chmod 600 privatekey

# Create server config
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = $(cat privatekey)
Address = 10.0.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
EOF

# Enable IP forwarding
echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
sysctl -p

# Start WireGuard
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0
```

## 🎯 Features

### ✨ Latest Release - v1.2.1

**🎛️ Advanced Invitation Code Management**
- **Edit invitation codes** - Change expiration dates, max uses, and descriptions after creation
- **Enable/Disable codes** - Temporarily deactivate codes without deleting them
- **Delete codes** - Permanently remove unused invitation codes
- **Bulk operations** - Quickly manage multiple codes with consistent settings
- **Real-time validation** - Prevent registration with disabled or expired codes
- Multi-use invitation code support with custom expiration and usage limits

**🛡️ Enhanced Admin Controls**
- Comprehensive user management (view, enable/disable users)
- Real-time usage analytics and invitation code tracking
- Detailed user device count and status monitoring
- **Database preservation** - Deployment script safely preserves all data

**📱 Enhanced Device Management**
- Beautiful device dashboard with real-time status indicators
- QR code generation for instant mobile setup (iOS/Android)
- Direct config file download for desktop clients (Windows/Mac/Linux)
- One-click device deletion and management
- Automatic WireGuard peer management on server

**🎨 Modern User Experience**
- System theme preference (automatic dark/light mode)
- Password change functionality in account settings
- Responsive design optimized for mobile and desktop
- Comprehensive setup guides and troubleshooting

**🔐 Security & Performance**
- **Note on Development Dependencies:**
A security audit has identified some moderate-severity vulnerabilities in the development dependencies of this project. These vulnerabilities are related to the `esbuild` package, which is a dependency of `drizzle-kit`. Since `drizzle-kit` is a development dependency, these vulnerabilities **do not affect the production build** of the application.
- NextAuth.js session-based authentication
- Multi-use invitation codes with expiration tracking
- Automatic SSL/TLS setup via deployment script
- Database-driven user and device management

### Core Features

- 🔐 **Secure Authentication** - NextAuth.js with session management
- 👥 **Multi-use Invitation Codes** - Configurable codes for families/teams
- 📱 **QR Code Setup** - Instant mobile device configuration
- 💻 **Desktop Support** - Download .conf files for all platforms
- 🎨 **Modern UI** - Beautiful, responsive interface with theme support
- 🚀 **Easy Deployment** - One-command deployment to Hetzner VPS
- 📊 **Usage Analytics** - Track invitation code usage and device statistics
- 🛡️ **Admin Panel** - Comprehensive admin tools and user management
- ⚡ **Real-time Updates** - Live status monitoring and instant feedback

## 🎛️ Invitation Code Management

### Admin Interface Features

The admin dashboard at `/dashboard/admin` provides comprehensive invitation code management:

**✏️ Edit Invitation Codes**
- Modify expiration dates to any future date
- Change maximum usage limits (1-1000 uses)
- Update descriptions for better organization
- Toggle active/inactive status

**🔄 Quick Actions**
- **Copy button** - Copy code to clipboard
- **View usage** - See which users have used each code
- **Edit button** - Open edit dialog for modifications
- **Toggle button** - Enable/disable codes instantly
- **Delete button** - Permanently remove codes (with confirmation)

**📊 Status Indicators**
- **Active** - Code is ready for use
- **Disabled** - Code is temporarily deactivated
- **Expired** - Code has passed its expiration date
- **Full** - Code has reached maximum usage limit

### Database Safety & Deployment

**🛡️ Data Preservation Guarantee**
The deployment script (`deploy-hetzner.sh`) is designed to preserve ALL your data:

1. **Automatic Backup** - Creates timestamped database backups before deployment
2. **Safe Restoration** - Restores existing users, devices, and invitation codes
3. **Schema Migration** - Applies new database features without data loss
4. **Validation** - Verifies data integrity after deployment

**✅ What's Preserved:**
- All user accounts and passwords
- All device configurations
- All invitation codes (including usage history)
- All admin settings

**⚠️ Post-Deployment Verification:**
After deployment, always verify your data:
```bash
# Check invitation codes are intact
ssh -i your-key.pem root@server-ip "cd /opt/wireguard-vpn && sqlite3 db/wireguard.db 'SELECT COUNT(*) FROM invitation_codes;'"

# Check users are intact  
ssh -i your-key.pem root@server-ip "cd /opt/wireguard-vpn && sqlite3 db/wireguard.db 'SELECT COUNT(*) FROM users;'"
```

### Bulk Operations

**Setting Consistent Expiration Dates:**
```sql
-- Set all codes to expire September 1st, 2026
UPDATE invitation_codes SET expires_at = '2026-09-01T23:59:59.000Z';
```

**Setting Consistent Usage Limits:**
```sql
-- Set all codes to 100 max uses
UPDATE invitation_codes SET max_uses = 100;
```

**Combined Updates:**
```sql
-- Set expiration and max uses together
UPDATE invitation_codes SET expires_at = '2026-09-01T23:59:59.000Z', max_uses = 100;
```

## 📱 Device Setup Guides

### Mobile Setup (iOS/Android)

1. **Download the WireGuard app** from App Store or Google Play
2. **Add a device** in the VPN manager dashboard
3. **Click the QR code button** on your device card
4. **Scan the QR code** with the WireGuard app
5. **Toggle the connection on** to connect to VPN

### Desktop Setup (Windows/Mac/Linux)

1. **Download WireGuard** from [wireguard.com](https://www.wireguard.com/install/)
2. **Add a device** in the VPN manager dashboard  
3. **Download the .conf file** using the download button
4. **Import the file** in WireGuard application
5. **Activate the tunnel** to connect to VPN

## 🎛️ Admin Guide

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for details on managing the application.

## 🔧 Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions to common issues.

## 🔧 Development

### Database Management

```bash
# Generate database migrations
npm run db:generate

# Apply migrations to database
npm run db:push

# Seed database with test data
npm run db:seed

# View database structure
npm run db:studio  # If drizzle-studio is installed
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm run test
```

### API Endpoints

**Device Management:**
- `GET /api/devices` - List user's devices
- `POST /api/devices` - Create new device
- `GET /api/devices/[id]/config` - Download config file
- `GET /api/devices/[id]/qr` - Get QR code data URL
- `DELETE /api/devices/[id]` - Delete device

**Admin Endpoints:**
- `GET /api/admin/invite-codes` - List invitation codes
- `POST /api/admin/invite-codes` - Create invitation code  
- `GET /api/admin/invite-codes/[id]/usage` - View code usage
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users` - Enable/disable user

## 📊 System Status

**Production Deployment:**
- ✅ **Live at**: Your domain (e.g., https://leia.yourdomain.com)
- ✅ **Server**: Your cloud provider (e.g., Hetzner, AWS)
- ✅ **SSL**: Your SSL provider (e.g., CloudFlare, Let's Encrypt)
- ✅ **WireGuard**: Running on port 51820/UDP (configurable)
- ✅ **Admin Panel**: Fully functional
- ✅ **User Registration**: Multi-use invitation codes active

**Current Features Status:**
- ✅ User registration with invitation codes
- ✅ Multi-device VPN credential generation
- ✅ QR code setup for mobile devices
- ✅ Configuration file download for desktop
- ✅ Admin dashboard with user management
- ✅ Real-time device status monitoring
- ✅ Theme system with dark/light mode
- ✅ Password change functionality
- ✅ Comprehensive setup instructions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](license) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for our future plans and how you can contribute.

## ✨ Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes.
