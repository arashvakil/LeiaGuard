import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { wireGuardDevices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateWireGuardKeys, getNextAvailableIP } from "@/lib/wireguard";
import { v4 as uuidv4 } from "uuid";
import { execSync } from "child_process";

// Function to add peer to WireGuard server
async function addPeerToServer(publicKey: string, clientIP: string): Promise<boolean> {
  try {
    // Add peer to WireGuard interface
    const command = `wg set wg0 peer ${publicKey} allowed-ips ${clientIP}/32`;
    
    // Execute on server - this will work if running on the VPN server
    if (process.env.NODE_ENV === 'production') {
      try {
        execSync(command, { stdio: 'inherit' });
        
        // Save configuration to persist across reboots
        execSync('wg-quick save wg0', { stdio: 'inherit' });
        
        console.log(`Added peer ${publicKey} with IP ${clientIP} to WireGuard server`);
        return true;
      } catch (error) {
        console.error('Failed to add peer to WireGuard server:', error);
        return false;
      }
    }
    
    return true; // In development, assume success
  } catch (error) {
    console.error('Error adding peer to server:', error);
    return false;
  }
}

// Function to remove peer from WireGuard server
async function removePeerFromServer(publicKey: string): Promise<boolean> {
  try {
    if (process.env.NODE_ENV === 'production') {
      try {
        const command = `wg set wg0 peer ${publicKey} remove`;
        execSync(command, { stdio: 'inherit' });
        
        // Save configuration
        execSync('wg-quick save wg0', { stdio: 'inherit' });
        
        console.log(`Removed peer ${publicKey} from WireGuard server`);
        return true;
      } catch (error) {
        console.error('Failed to remove peer from WireGuard server:', error);
        return false;
      }
    }
    
    return true; // In development, assume success
  } catch (error) {
    console.error('Error removing peer from server:', error);
    return false;
  }
}

// GET /api/devices - List user's devices
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const devices = await db
      .select({
        id: wireGuardDevices.id,
        deviceName: wireGuardDevices.deviceName,
        ipAddress: wireGuardDevices.ipAddress,
        isActive: wireGuardDevices.isActive,
        createdAt: wireGuardDevices.createdAt,
      })
      .from(wireGuardDevices)
      .where(eq(wireGuardDevices.userId, session.user.id));

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Failed to fetch devices:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/devices - Create new device
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Device name is required" },
        { status: 400 }
      );
    }

    // Get existing IPs to avoid conflicts
    const existingDevices = await db
      .select({ ipAddress: wireGuardDevices.ipAddress })
      .from(wireGuardDevices);
    
    const existingIPs = existingDevices.map((d: { ipAddress: string }) => d.ipAddress);

    // Generate keys and get next available IP
    const { privateKey, publicKey } = generateWireGuardKeys();
    const ipAddress = getNextAvailableIP(existingIPs);

    // Create device record
    const deviceId = uuidv4();
    await db.insert(wireGuardDevices).values({
      id: deviceId,
      userId: session.user.id,
      deviceName: name.trim(),
      publicKey,
      privateKey,
      ipAddress,
      isActive: true,
    });

    // Add peer to WireGuard server
    const success = await addPeerToServer(publicKey, ipAddress);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to add peer to WireGuard server" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: "Device created successfully",
        deviceId,
        name: name.trim(),
        ipAddress 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create device:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 