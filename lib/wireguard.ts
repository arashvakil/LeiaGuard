import { execSync } from "child_process";
import crypto from "crypto";

// Generate WireGuard key pair
export function generateWireGuardKeys() {
  try {
    // Generate private key
    const privateKey = execSync("wg genkey", { encoding: "utf-8" }).trim();
    
    // Generate public key from private key
    const publicKey = execSync(`echo "${privateKey}" | wg pubkey`, { 
      encoding: "utf-8" 
    }).trim();

    return { privateKey, publicKey };
  } catch (error) {
    // Fallback to Node.js crypto if wg is not available locally
    console.warn("WireGuard CLI not available locally, using fallback key generation");
    
    // Generate 32 random bytes for private key
    const privateKeyBytes = crypto.randomBytes(32);
    const privateKey = privateKeyBytes.toString("base64");
    
    // For demo purposes, generate a mock public key
    // In production, this would need proper Curve25519 implementation
    const publicKeyBytes = crypto.randomBytes(32);
    const publicKey = publicKeyBytes.toString("base64");
    
    return { privateKey, publicKey };
  }
}

// Get next available IP address in the VPN network
export function getNextAvailableIP(existingIPs: string[]): string {
  const networkBase = process.env.WIREGUARD_NETWORK_RANGE || "10.0.0.0/24";
  const [baseIP, subnet] = networkBase.split("/");
  const [a, b, c] = baseIP.split(".").map(Number);
  
  // Start from .2 (server usually uses .1)
  for (let d = 2; d < 254; d++) {
    const ip = `${a}.${b}.${c}.${d}`;
    if (!existingIPs.includes(ip)) {
      return ip;
    }
  }
  
  throw new Error("No available IP addresses in the network range");
}

// Generate WireGuard client configuration
export function generateClientConfig(
  privateKey: string,
  clientIP: string,
  serverPublicKey?: string
): string {
  const serverIP = process.env.WIREGUARD_SERVER_IP || "your-server-ip";
  const serverPort = process.env.WIREGUARD_SERVER_PORT || "51820";
  const serverDomain = process.env.WIREGUARD_SERVER_DOMAIN || "your-domain.com";
  
  // Use domain if available, fallback to IP
  const endpoint = serverDomain ? `${serverDomain}:${serverPort}` : `${serverIP}:${serverPort}`;
  
  // Use the actual server public key from environment or the real server key
  const actualServerPublicKey = serverPublicKey || process.env.WIREGUARD_SERVER_PUBLIC_KEY || "vnJmVxAymHHox6xU0AxTld1HoagCO15XCPiOQbk1FzA=";

  return `[Interface]
PrivateKey = ${privateKey}
Address = ${clientIP}/32
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = ${actualServerPublicKey}
Endpoint = ${endpoint}
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`;
}

// Add peer to WireGuard server (to be run on server)
export function generateServerPeerConfig(publicKey: string, clientIP: string): string {
  return `# Client configuration
wg set wg0 peer ${publicKey} allowed-ips ${clientIP}/32`;
}

// Remove peer from WireGuard server (to be run on server)
export function generateRemovePeerConfig(publicKey: string): string {
  return `# Remove client
wg set wg0 peer ${publicKey} remove`;
}

// Generate server installation script
export function generateServerSetupScript(): string {
  const serverIP = process.env.WIREGUARD_SERVER_IP || "your-server-ip";
  const serverPort = process.env.WIREGUARD_SERVER_PORT || "51820";
  
  return `#!/bin/bash
# WireGuard Server Setup Script for Ubuntu/Debian
set -e

echo "🔧 Installing WireGuard..."
apt update
apt install -y wireguard

echo "🔑 Generating server keys..."
cd /etc/wireguard
wg genkey | tee privatekey | wg pubkey > publickey
chmod 600 privatekey

echo "📝 Creating server configuration..."
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = \$(cat privatekey)
Address = 10.0.0.1/24
ListenPort = ${serverPort}

# Optimized firewall rules to prioritize WireGuard traffic over Docker
PostUp = iptables -I FORWARD 1 -i %i -j ACCEPT
PostUp = iptables -I FORWARD 1 -o %i -j ACCEPT
PostUp = iptables -t nat -I POSTROUTING 1 -s 10.0.0.0/24 -o eth0 -j MASQUERADE

PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -o %i -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE

# Peers will be added here automatically

EOF

echo "🌐 Enabling IP forwarding..."
echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
sysctl -p

echo "🚀 Starting WireGuard..."
systemctl enable wg-quick@wg0
systemctl start wg-quick@wg0

echo "✅ WireGuard server setup complete!"
echo "📋 Server public key:"
cat publickey
echo ""
echo "🔧 Remember to:"
echo "1. Update your application with the server public key"
echo "2. Configure your firewall to allow port ${serverPort}/udp"
echo "3. Set up automatic peer management"
echo "4. Test connectivity: wg show && iptables -t nat -L POSTROUTING -n"
`;
} 