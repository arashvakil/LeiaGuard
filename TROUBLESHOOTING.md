# Troubleshooting

This guide provides solutions to common issues.

## VPN Connection Issues

If you can connect to WireGuard but have no internet traffic:

1.  **Check WireGuard status on server:**
    ```bash
    wg show wg0
    systemctl status wg-quick@wg0
    ```

2.  **Verify IP forwarding:**
    ```bash
    cat /proc/sys/net/ipv4/ip_forward  # Should return "1"
    ```

3.  **Check iptables rules:**
    ```bash
    iptables -t nat -L POSTROUTING -n  # Should show MASQUERADE rules
    ```

4.  **Verify port is listening:**
    ```bash
    ss -tulpn | grep 51820  # Should show UDP port listening
    ```

## Application Issues

*   **App crashes**: Check PM2 logs with `pm2 logs wireguard-vpn`
*   **Database errors**: Ensure proper file permissions on `db/wireguard.db`
*   **Build failures**: Run `npm run build` locally to check for errors
*   **Authentication issues**: Verify `NEXTAUTH_SECRET` is set properly

## Common Solutions

*   **404 errors after deployment**: Clear browser cache and restart PM2
*   **Theme not working**: Ensure `next-themes` is properly configured
*   **QR codes not generating**: Check server WireGuard configuration
*   **Invitation codes not working**: Verify they haven't expired or reached max uses
*   **Cloudflare orange-cloud blocks UDP**: If your VPN domain is proxied through Cloudflare (orange cloud), UDP 51820 will be dropped. Set the DNS record to **DNS-only (grey cloud)** or use the server IP directly.
