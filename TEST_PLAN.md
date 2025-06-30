# WireGuard VPN Service - Comprehensive Test Plan

## Overview
This test plan covers all aspects of the WireGuard VPN management service, including user registration, device management, admin functions, security, and VPN connectivity.

## Test Environment
- **Test Server**: Hetzner Cloud VPS
- **Staging URL**: (not applicable)
- **Production URL**: https://your-domain.com
- **Local Development**: http://localhost:3000
- **Admin User**: admin / admin123
- **Test Invitation Codes**: BETA01, FRIENDS01, WELCOME01

## 1. User Registration & Authentication Tests

### 1.1 Registration Flow Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| REG-001 | Register with valid invitation code | User created, auto-logged in, redirected to dashboard | ✅ |
| REG-002 | Register with invalid invitation code | Error: "Invalid invitation code" | ✅ |
| REG-003 | Register with expired invitation code | Error: "Invitation code has expired" | ✅ |
| REG-004 | Register with fully used invitation code | Error: "Invitation code has reached maximum uses" | ✅ |
| REG-005 | Register with existing username | Error: "Username already exists" | ✅ |
| REG-006 | Register with weak password (<6 chars) | Error: "Password must be at least 6 characters" | ✅ |
| REG-007 | Register with mismatched passwords | Error: "Passwords do not match" | ✅ |
| REG-008 | Register with empty fields | Error: "All fields are required" | ✅ |

### 1.2 Authentication Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| AUTH-001 | Login with valid credentials | Successful login, redirected to dashboard | ✅ |
| AUTH-002 | Login with invalid username | Error: "Invalid credentials" | ✅ |
| AUTH-003 | Login with invalid password | Error: "Invalid credentials" | ✅ |
| AUTH-004 | Login with disabled user account | Error: "Account is disabled" | ✅ |
| AUTH-005 | Access protected routes without auth | Redirected to login page | ✅ |
| AUTH-006 | Access admin routes without admin role | Redirected to dashboard or 403 error | ✅ |
| AUTH-007 | Session persistence across browser restarts | User remains logged in | ✅ |
| AUTH-008 | Logout functionality | User logged out, redirected to home | ✅ |

## 2. Device Management Tests

### 2.1 Device Creation Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| DEV-001 | Create device with valid name | Device created with unique IP and keys | ✅ |
| DEV-002 | Create device with empty name | Error: "Device name is required" | ✅ |
| DEV-003 | Create device with duplicate name | Device created (duplicates allowed per design) | ✅ |
| DEV-004 | Create multiple devices per user | Each gets unique IP address | ✅ |
| DEV-005 | IP address allocation sequence | IPs allocated sequentially (10.0.0.2, 10.0.0.3, ...) | ✅ |
| DEV-006 | Maximum devices per user | No hard limit enforced (by design) | ✅ |

### 2.2 Device Configuration Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| CONF-001 | Download .conf file | Valid WireGuard configuration file | ✅ |
| CONF-002 | Generate QR code | Valid QR code containing config | ✅ |
| CONF-003 | Configuration file format | Contains all required WireGuard fields | ✅ |
| CONF-004 | Private key uniqueness | Each device has unique private key | ✅ |
| CONF-005 | Public key uniqueness | Each device has unique public key | ✅ |
| CONF-006 | Server endpoint configuration | Points to correct server IP:port | ✅ |
| CONF-007 | DNS configuration | Includes 1.1.1.1, 8.8.8.8 | ✅ |
| CONF-008 | AllowedIPs configuration | Set to 0.0.0.0/0 for full tunnel | ✅ |

### 2.3 Device Management Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| MGMT-001 | View all user devices | Display all devices with status | ✅ |
| MGMT-002 | Delete device | Device removed, IP released | ✅ |
| MGMT-003 | Regenerate device config | New keys generated, same IP | ✅ |
| MGMT-004 | Device status tracking | Active/inactive status displayed | ✅ |
| MGMT-005 | Device creation timestamp | Shows when device was created | ✅ |

## 3. Admin Dashboard Tests

### 3.1 Invitation Code Management
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| ADMIN-001 | Create new invitation code | Code created with specified parameters | ✅ |
| ADMIN-002 | Create code with duplicate name | Error: "Code already exists" | ✅ |
| ADMIN-003 | Create code with custom max uses | Code created with specified limit | ✅ |
| ADMIN-004 | Create code with custom expiration | Code expires on specified date | ✅ |
| ADMIN-005 | View all invitation codes | Display all codes with statistics | ✅ |
| ADMIN-006 | View code usage details | Show users who used each code | ✅ |
| ADMIN-007 | Copy code to clipboard | Code copied successfully | ✅ |

### 3.2 Usage Statistics Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| STAT-001 | Display used count correctly | Shows actual usage count | ✅ |
| STAT-002 | Display remaining uses | Shows max_uses - used_count | ✅ |
| STAT-003 | Mark expired codes | Shows "Expired" badge for old codes | ✅ |
| STAT-004 | Mark full codes | Shows "Full" badge when max uses reached | ✅ |
| STAT-005 | Real-time usage updates | Statistics update after code usage | ✅ |
| STAT-006 | Usage history tracking | Shows when and by whom codes were used | ✅ |

### 3.3 User Management Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| USER-001 | View all registered users | Display user list with details | 🚧 |
| USER-002 | Disable user account | User loses access immediately | 🚧 |
| USER-003 | Enable disabled user | User regains access | 🚧 |
| USER-004 | View user device count | Shows number of devices per user | 🚧 |
| USER-005 | User activity tracking | Shows last login, registration date | 🚧 |

## 4. Security Tests

### 4.1 Input Validation Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| SEC-001 | SQL injection in registration | Input sanitized, no database compromise | ✅ |
| SEC-002 | XSS in device names | HTML/JS escaped properly | ✅ |
| SEC-003 | CSRF protection | Requests require valid tokens | ✅ |
| SEC-004 | Input length limits | Long inputs truncated or rejected | ✅ |
| SEC-005 | Special character handling | Special chars escaped properly | ✅ |

### 4.2 Authentication Security Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| SEC-006 | Password hashing | Passwords stored as bcrypt hashes | ✅ |
| SEC-007 | Session security | Sessions use secure tokens | ✅ |
| SEC-008 | Rate limiting | Prevent brute force attacks | 🚧 |
| SEC-009 | Session timeout | Sessions expire appropriately | ✅ |
| SEC-010 | Secure headers | HTTPS, security headers present | ✅ |

### 4.3 Access Control Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| AC-001 | User isolation | Users only see their own data | ✅ |
| AC-002 | Admin privilege escalation | Regular users can't access admin functions | ✅ |
| AC-003 | Direct API access | Protected endpoints require authentication | ✅ |
| AC-004 | File access permissions | Users can't access other users' configs | ✅ |

### 4.4 Anti-Crawling Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| CRAWL-001 | Robots.txt present | Disallows all bots | ✅ |
| CRAWL-002 | Meta robots tags | Noindex, nofollow on pages | ✅ |
| CRAWL-003 | Security headers | X-Robots-Tag header present | ✅ |
| CRAWL-004 | Search engine visibility | Site not indexed by search engines | ✅ |

## 5. VPN Connectivity Tests

### 5.1 Server Configuration Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| VPN-001 | WireGuard server running | Service active on port 51820 | ✅ |
| VPN-002 | Server key configuration | Server has valid key pair | ✅ |
| VPN-003 | IP forwarding enabled | Traffic routed properly | ✅ |
| VPN-004 | Firewall configuration | Port 51820/UDP open | ✅ |
| VPN-005 | Server endpoint reachable | External clients can connect | ✅ |

### 5.2 Client Connection Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| CONN-001 | Mobile client connection | iOS/Android apps connect successfully | 🧪 |
| CONN-002 | Desktop client connection | Windows/Mac/Linux clients connect | 🧪 |
| CONN-003 | Multiple simultaneous connections | Multiple devices connect at once | 🧪 |
| CONN-004 | Internet access through VPN | Browsing works through VPN | 🧪 |
| CONN-005 | DNS resolution through VPN | DNS queries use VPN DNS servers | 🧪 |
| CONN-006 | Connection stability | Connections remain stable over time | 🧪 |

### 5.3 Traffic Routing Tests
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| ROUTE-001 | All traffic tunneled | 0.0.0.0/0 routes through VPN | 🧪 |
| ROUTE-002 | IP address assignment | Clients get assigned IP addresses | 🧪 |
| ROUTE-003 | Internet IP masking | External IP shows as server IP | 🧪 |
| ROUTE-004 | Local network access | Can still access local resources | 🧪 |

## 6. Performance Tests

### 6.1 Application Performance
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| PERF-001 | Page load times | Pages load within 2 seconds | ✅ |
| PERF-002 | Database query performance | Queries execute within 100ms | ✅ |
| PERF-003 | Concurrent user handling | 10+ users can use system simultaneously | 🧪 |
| PERF-004 | File download performance | Config files download quickly | ✅ |
| PERF-005 | QR code generation speed | QR codes generate within 1 second | ✅ |

### 6.2 VPN Performance
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| PERF-006 | VPN connection speed | Minimal speed impact (<20% loss) | 🧪 |
| PERF-007 | Latency impact | <50ms additional latency | 🧪 |
| PERF-008 | Throughput testing | Maintains reasonable bandwidth | 🧪 |
| PERF-009 | Resource usage | Server resources within limits | 🧪 |

## 7. Integration Tests

### 7.1 Database Integration
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| INT-001 | Database schema integrity | All tables and relationships correct | ✅ |
| INT-002 | Migration handling | Migrations apply cleanly | ✅ |
| INT-003 | Data consistency | Related data stays consistent | ✅ |
| INT-004 | Transaction handling | Operations are atomic | ✅ |

### 7.2 External Service Integration
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| INT-005 | WireGuard server communication | App can modify server configs | ✅ |
| INT-006 | File system integration | Config files stored/served correctly | ✅ |
| INT-007 | Nginx reverse proxy | HTTPS termination works correctly | ✅ |
| INT-008 | SSL certificate handling | Certificates auto-renew | ✅ |

## 8. Deployment Tests

### 8.1 Production Deployment
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| DEPLOY-001 | Build process | Application builds without errors | ✅ |
| DEPLOY-002 | PM2 process management | Application starts and stays running | ✅ |
| DEPLOY-003 | Environment variables | All required env vars configured | ✅ |
| DEPLOY-004 | Database migrations | Migrations run successfully in prod | ✅ |
| DEPLOY-005 | SSL certificate | HTTPS works correctly | ✅ |
| DEPLOY-006 | Server monitoring | Application health can be monitored | ✅ |

### 8.2 Backup and Recovery
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| BACKUP-001 | Database backup | Database can be backed up | 🚧 |
| BACKUP-002 | Data recovery | Data can be restored from backup | 🚧 |
| BACKUP-003 | WireGuard config backup | Server configs can be backed up | 🚧 |
| BACKUP-004 | Disaster recovery | System can be rebuilt from backups | 🚧 |

## Test Status Legend
- ✅ **Passed**: Test completed successfully
- 🚧 **Pending**: Test not yet implemented/completed
- 🧪 **Manual**: Requires manual testing
- ❌ **Failed**: Test failed, requires attention

## Test Execution Commands

### Automated API Tests
```bash
# Test registration endpoint
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"inviteCode":"BETA01","username":"test_'$(date +%s)'","password":"testpass123"}'

# Test admin endpoints (requires session cookie)
curl -X GET https://your-domain.com/api/admin/invite-codes \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Test device creation
curl -X POST https://your-domain.com/api/devices \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{"deviceName":"Test Device"}'
```

### Manual Testing Checklist

#### User Registration Flow
1. [ ] Visit registration page
2. [ ] Try invalid invitation code
3. [ ] Try valid invitation code with valid details
4. [ ] Verify automatic login after registration
5. [ ] Check dashboard access

#### Device Management Flow
1. [ ] Create new device
2. [ ] Download configuration file
3. [ ] Scan QR code with mobile device
4. [ ] Test VPN connection
5. [ ] Delete device

#### Admin Dashboard Flow
1. [ ] Login as admin
2. [ ] Access admin dashboard
3. [ ] Create new invitation code
4. [ ] View code usage statistics
5. [ ] Monitor user registrations

#### VPN Connectivity Test
1. [ ] Import configuration to WireGuard client
2. [ ] Connect to VPN
3. [ ] Verify IP address change
4. [ ] Test internet browsing
5. [ ] Test DNS resolution
6. [ ] Disconnect from VPN

## Test Data Management

### Test Users
- Admin: `admin` / `admin123`
- Test User 1: Create via registration with BETA01
- Test User 2: Create via registration with FRIENDS01

### Test Invitation Codes
- `BETA01`: 10 uses, 7 days expiration
- `FRIENDS01`: 50 uses, 30 days expiration
- `WELCOME01`: 50 uses, 30 days expiration

### Cleanup Procedures
```bash
# Reset test data (use with caution)
node db/migrate-to-multi-use.js
npx tsx db/seed/index.ts

# Remove test devices
# Use admin dashboard to clean up test devices

# Monitor server resources
htop
df -h
systemctl status wg-quick@wg0
```

## Reporting
Test results should be documented with:
- Test case ID
- Execution date/time
- Result (Pass/Fail)
- Screenshots for UI tests
- Error messages for failed tests
- Performance metrics where applicable

## Continuous Testing
- Automated tests should run on each deployment
- Manual tests should be executed for major releases
- Security tests should be performed quarterly
- Performance benchmarks should be monitored continuously 