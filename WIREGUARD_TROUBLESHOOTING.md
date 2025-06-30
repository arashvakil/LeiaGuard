# WireGuard Troubleshooting Guide

## ✅ FIXED: Common Issue - VPN Connects But No Internet Access

**UPDATE: This issue has been resolved as of June 24, 2025**

If your WireGuard tunnel connects successfully but you cannot access websites or other internet services, this was typically caused by incorrect NAT configuration. **This has now been fixed** with the following server-side updates:

### What Was Fixed

The server configuration now uses **specific NAT rules** for the WireGuard network instead of generic rules:

**Old (problematic) configuration:**
```bash
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

**New (fixed) configuration:**
```bash
PostUp = iptables -t nat -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE
```

### Current Server Status

✅ **NAT rules properly configured** for 10.0.0.0/24 network  
✅ **IP forwarding enabled** on server  
✅ **Firewall rules optimized** for better mobile support  
✅ **Peer management cleaned up** - removed invalid peers  

## Common Issue: VPN Connects But No Internet Access

If your WireGuard tunnel connects successfully but you cannot access websites or other internet services, this is typically a DNS resolution problem. Here are the most common solutions:

### Problem 1: DNS Server Not Reachable

**Symptoms:**
- WireGuard tunnel shows as connected
- Can ping IP addresses (e.g., `ping 8.8.8.8` works)
- Cannot access websites by domain name
- Browser shows "Site can't be reached" or similar errors

**Solution 1: Update DNS Settings in Client Config**

Edit your WireGuard client configuration file and ensure you have proper DNS servers:

```conf
[Interface]
PrivateKey = [your-private-key]
Address = 10.0.0.2/24
DNS = 8.8.8.8, 1.1.1.1

[Peer]
PublicKey = [server-public-key]
Endpoint = your-server-ip:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

**Solution 2: Try Alternative DNS Servers**

If Google's DNS doesn't work, try:
- Cloudflare: `DNS = 1.1.1.1, 1.0.0.1`
- Quad9: `DNS = 9.9.9.9, 149.112.112.112`
- OpenDNS: `DNS = 208.67.222.222, 208.67.220.220`

### Problem 2: Mobile Phone Specific Issues

**iPhone/iOS:**
1. Go to Settings → VPN & Device Management → VPN
2. Tap the "i" icon next to your WireGuard connection
3. Make sure "Connect On Demand" is enabled
4. Check that DNS settings are properly configured

**Android:**
1. Open WireGuard app
2. Tap the gear icon next to your tunnel
3. Edit the configuration
4. Ensure DNS servers are set (add `DNS = 8.8.8.8, 1.1.1.1` if missing)
5. Make sure "Exclude private IPs" is disabled for full tunnel

### Problem 3: Wrong IP Address Range

If you're getting IP conflicts, update your config to use the correct range:

```conf
[Interface]
Address = 10.0.0.X/24  # Where X is 2, 3, 4, etc.
```

### Problem 4: Firewall or ISP Blocking

**If nothing else works:**

1. **Change the port**: Edit the server config to use port 443 instead of 51820
2. **Try different endpoints**: Some ISPs block VPN traffic
3. **Contact your ISP**: Some mobile carriers block VPN connections

### Problem 5: Server-Side DNS Issues

**For server administrators:**

Check that the server can resolve DNS:
```bash
# Test DNS resolution on server
nslookup google.com
ping 8.8.8.8

# Check if IP forwarding is enabled
cat /proc/sys/net/ipv4/ip_forward
# Should return "1"

# Verify iptables rules
iptables -L -n -v | grep wg0
```

### Quick Test Commands

**On your device (when connected to VPN):**
```bash
# Test if you can reach the VPN server
ping 10.0.0.1

# Test external IP (should show server IP)
curl ipinfo.io

# Test DNS resolution
nslookup google.com

# Test direct IP access
ping 8.8.8.8
```

### Re-downloading Configuration

If you've made changes to the server:
1. Go to your VPN dashboard
2. Delete the old device configuration
3. Create a new device
4. Download the new QR code/config file
5. Import it fresh in your WireGuard app

---

## Updated Server Configuration for Better Mobile Support

The latest deployment includes:
- ✅ Fixed Farsi/RTL navigation support
- ✅ Resolved authentication database issues
- ✅ Optimized DNS configuration for mobile devices
- ✅ Updated server-side routing rules

**Your VPN is now accessible at:** https://your-domain.com

## Common Fix for Hetzner/Cloud Servers

If you're using a cloud server (Hetzner, DigitalOcean, etc.), add this to your server config:

```bash
# Add to server's WireGuard config PostUp
PostUp = iptables -t nat -A POSTROUTING -s 10.10.0.0/24 -o eth0 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -s 10.10.0.0/24 -o eth0 -j MASQUERADE
```

Replace `eth0` with your server's main network interface (check with `ip route | grep default`).

## macOS Specific Issues

If using macOS, you might need to:

1. **Flush DNS cache:**
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

2. **Check DNS settings:**
   ```bash
   scutil --dns
   ```

3. **Restart network services:**
   ```bash
   sudo ifconfig en0 down && sudo ifconfig en0 up
   ```

## Windows Specific Issues

1. **Flush DNS cache:**
   ```cmd
   ipconfig /flushdns
   ipconfig /release
   ipconfig /renew
   ```

2. **Check DNS settings:**
   ```cmd
   nslookup google.com
   ipconfig /all
   ```

## Still Having Issues?

1. **Restart WireGuard:** Disconnect and reconnect the tunnel
2. **Restart network services:** On both client and server
3. **Check logs:** 
   - Server: `sudo journalctl -u wg-quick@wg0 -f`
   - Client: Check WireGuard app logs
4. **Try split tunneling:** Set `AllowedIPs = 10.10.0.0/24` instead of `0.0.0.0/0` to test local connectivity first

## Contact Support

If you're still experiencing issues after trying these solutions, please provide:
- Your WireGuard client configuration (with private keys removed)
- Operating system and WireGuard client version
- Error messages or logs
- Results of the connectivity tests above

---

*This guide covers the most common WireGuard connectivity issues. For advanced troubleshooting, consult the official WireGuard documentation.*

### Problem X: Cloudflare Orange-Cloud Blocks UDP

If your VPN hostname (e.g., `vpn.example.com`) is behind Cloudflare's orange-cloud proxy, **UDP traffic—including WireGuard on port 51820—will be dropped**.

**Symptoms**
- WireGuard tunnel shows as connecting, but no handshake reaches the server (`wg show` shows zero transfer).
- `tcpdump` on the server shows no packets on UDP 51820.

**Solution**
1. Log in to the Cloudflare dashboard.
2. Find the A-record for your VPN hostname.
3. Click the orange cloud to turn it **grey** (DNS-only).
4. Wait for DNS to propagate (usually <1 minute) or reconnect using the server's IP directly.

After switching to DNS-only, reconnect your WireGuard client—handshakes and internet access should work immediately.

--- 