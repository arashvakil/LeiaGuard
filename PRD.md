# Product Requirements Document: WireGuard Credential Management System

## 1. Executive Summary

### 1.1 Project Overview
A web application that allows users to register accounts using invitation codes, download WireGuard VPN credentials, and provides administrators with minimal user management capabilities. The application will support bilingual interface (English and Farsi) and include comprehensive setup instructions for various devices.

### 1.2 Business Objectives
- Provide a streamlined way for users to obtain WireGuard VPN credentials
- Enable minimal administrative control with hands-off user management
- Support both English and Farsi-speaking users (manual toggle)
- Ensure secure credential distribution and immediate revocation
- Keep costs minimal using open-source solutions
- Maintain user privacy with no email requirements

## 2. Target Users

### 2.1 End Users
- **Primary**: ~50 individuals needing VPN access (free service)
- **Geographic**: English and Farsi-speaking regions
- **Technical Level**: Mixed (basic to intermediate)
- **Devices**: Multiple devices per user allowed
- **Privacy**: Anonymous registration (no email required)

### 2.2 Administrators
- **Primary**: Single administrator (hands-off approach)
- **Responsibilities**: Generate invitation codes, view registered users, device counts, disable users when needed

## 3. Core Features

### 3.1 User Registration & Authentication
- **User Registration**: Invitation code-based registration (no email required)
- **Anonymous Access**: Users create username/password only
- **Login System**: Secure authentication with session management
- **Password Reset**: Admin-assisted password reset (no email recovery)
- **Multi-language Support**: Manual toggle between English and Farsi

### 3.2 WireGuard Credential Management
- **Multiple Devices**: Users can generate configs for multiple devices
- **Credential Generation**: Automatic WireGuard config generation per device
- **Self-Service**: Users can regenerate their own credentials
- **Download Interface**: Secure credential download (QR code + config file)
- **Device Instructions**: Step-by-step setup guides for:
  - Windows
  - macOS
  - iOS
  - Android
  - Linux
- **Credential Status**: Active/Inactive status display
- **No Expiration**: Credentials remain valid until manually disabled

### 3.3 Admin Interface (Minimal)
- **User Overview**: 
  - View all registered users
  - See device count per user
  - Disable user accounts (immediate termination)
- **Invitation Management**:
  - Generate invitation codes
  - View code usage status
- **Simple Controls**:
  - One-click user disable/enable
  - Basic user statistics
- **No Logging**: No activity logs or detailed monitoring

### 3.4 Bilingual Support
- **Interface Language**: Manual toggle between English and Farsi
- **Instructions**: Complete setup guides in both languages
- **Admin Interface**: Bilingual admin panel
- **No RTL**: Simple language toggle without complex RTL layout

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Shadcn UI components
- **Animation**: Framer Motion
- **State Management**: React Context/Zustand
- **Internationalization**: next-i18next or similar

### 4.2 Backend Stack (Cost-Optimized)
- **Database**: SQLite with Drizzle (local file, free)
- **Authentication**: NextAuth.js (free, open-source alternative to Clerk)
- **API**: Next.js Server Actions
- **File Storage**: Local filesystem (no external storage needed)

### 4.3 WireGuard Integration
- **Server**: WireGuard server on a cloud provider (e.g., Hetzner, AWS, etc.)
- **Server Specs**: Recommended 2 vCPU, 4GB RAM, 40GB storage
- **Endpoint**: Your server's domain (e.g., vpn.yourdomain.com)
- **Port**: 51820/UDP (configurable)
- **Key Management**: Automated key pair generation using Node.js crypto
- **Config Generation**: Dynamic WireGuard config creation
- **Peer Management**: Direct `wg` commands for peer addition/removal
- **Immediate Termination**: Active connection termination on user disable
- **IP Range**: 10.0.0.0/24 for VPN clients (configurable)

### 4.4 Deployment (Single Server)
- **Hosting**: Single Cloud Server (e.g., Hetzner, DigitalOcean)
- **Domain**: A domain you own (e.g., yourdomain.com)
- **Server**: Ubuntu 22.04 LTS (recommended)
- **SSL**: Cloudflare (Full SSL/TLS) or Let's Encrypt
- **Reverse Proxy**: Nginx
- **Services**: Next.js app + WireGuard server on the same machine

## 5. User Stories

### 5.1 End User Stories
1. **As a user**, I want to register with an invitation code so that I can access VPN credentials anonymously
2. **As a user**, I want to create multiple device configs so that I can use VPN on all my devices
3. **As a user**, I want to download my WireGuard config so that I can set up VPN
4. **As a user**, I want to see QR codes so that I can easily configure mobile devices
5. **As a user**, I want setup instructions in my language so that I can configure my device
6. **As a user**, I want to regenerate my credentials so that I can refresh my access

### 5.2 Admin Stories
1. **As an admin**, I want to generate invitation codes so that I can control who registers
2. **As an admin**, I want to view all users so that I can see usage
3. **As an admin**, I want to disable users so that I can immediately revoke access
4. **As an admin**, I want to see device counts so that I can monitor usage patterns

## 6. Security Requirements

### 6.1 Authentication Security
- Strong password requirements
- Invitation code validation
- Session management with secure tokens
- Rate limiting on authentication endpoints

### 6.2 Credential Security
- Secure key generation using cryptographically secure methods
- Encrypted storage of private keys
- Secure transmission of credentials (HTTPS only)
- Automatic credential cleanup on user deactivation

### 6.3 Admin Security
- Role-based access control
- Secure admin authentication
- Protected admin endpoints
- Invitation code expiration

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load times < 2 seconds
- Config generation < 5 seconds
- Support for ~50 concurrent users
- 99% uptime target (single server)

### 7.2 Usability
- Responsive design (mobile-first)
- Intuitive user interface
- Clear error messages
- Accessibility compliance (WCAG 2.1)

### 7.3 Privacy
- No email collection
- Minimal user data storage
- Anonymous registration process
- No activity logging

## 8. Success Metrics

### 8.1 User Metrics
- User registration rate via invitation codes
- Credential download completion rate
- Device setup success rate

### 8.2 Technical Metrics
- System uptime
- Response times
- Error rates

## 9. Development Phases

### Phase 1: Core MVP (3-4 weeks)
- WireGuard server installation and configuration
- User registration with invitation codes (NextAuth.js)
- Multi-device credential generation
- Download interface with QR codes
- English-only interface
- Basic admin panel

### Phase 2: Enhanced Features (2-3 weeks)
- Farsi language support (manual toggle)
- Comprehensive device instructions
- Self-service credential regeneration
- Immediate connection termination on disable

### Phase 3: Polish & Optimization (1-2 weeks)
- UI/UX improvements
- Performance optimization
- Security hardening
- Documentation and setup guides

## 10. Risk Assessment

### 10.1 Technical Risks
- WireGuard server integration complexity
- Key management security
- Single server dependency
- SQLite performance limitations

### 10.2 Business Risks
- User adoption challenges
- Server infrastructure costs
- Security vulnerabilities

## 11. Registration Flow Design

### 11.1 Invitation Code System
- **Admin generates codes**: Random 8-character alphanumeric codes
- **Code expiration**: 30 days from generation
- **Single use**: Each code can only be used once
- **User registration**: Code + username + password
- **No email**: No email verification required

### 11.2 User Flow
1. User receives invitation code from admin
2. User visits registration page
3. User enters: invitation code, desired username, password
4. System validates code and creates account
5. User can immediately generate device credentials

---

## Next Steps
1. Clone the LeiaGuard repository and install dependencies
2. Configure environment variables and database
3. Install and configure WireGuard on Hetzner server
4. Implement invitation code system
5. Build credential generation functionality
6. Create bilingual interface 

### Technical Requirements
- **Server**: Ubuntu 22.04 LTS on a cloud provider
- **Domain**: A domain you own
- **SSL**: Cloudflare (Full SSL/TLS) or Let's Encrypt
- **CI/CD**: Manual deployment via `deploy-hetzner.sh` (can be adapted) 