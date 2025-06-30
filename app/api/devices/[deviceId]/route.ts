import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { wireGuardDevices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { execSync } from "child_process";

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

// DELETE /api/devices/[deviceId] - Delete a device
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const { deviceId } = await params;

    // First, get the device to retrieve the public key
    const device = await db
      .select()
      .from(wireGuardDevices)
      .where(
        and(
          eq(wireGuardDevices.id, deviceId),
          eq(wireGuardDevices.userId, session.user.id)
        )
      )
      .limit(1);

    if (device.length === 0) {
      return NextResponse.json(
        { error: "Device not found or not authorized" },
        { status: 404 }
      );
    }

    // Remove peer from WireGuard server
    const success = await removePeerFromServer(device[0].publicKey);
    if (!success) {
      console.warn(`Failed to remove peer ${device[0].publicKey} from WireGuard server, but continuing with database deletion`);
    }

    // Delete device from database
    const deletedDevice = await db
      .delete(wireGuardDevices)
      .where(
        and(
          eq(wireGuardDevices.id, deviceId),
          eq(wireGuardDevices.userId, session.user.id)
        )
      )
      .returning();

    return NextResponse.json({
      message: "Device deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete device:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/devices/[deviceId] - Get device details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deviceId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deviceId } = await params;
    
    const db = getDb();
    const device = await db
      .select({
        id: wireGuardDevices.id,
        deviceName: wireGuardDevices.deviceName,
        ipAddress: wireGuardDevices.ipAddress,
        isActive: wireGuardDevices.isActive,
        createdAt: wireGuardDevices.createdAt,
      })
      .from(wireGuardDevices)
      .where(
        and(
          eq(wireGuardDevices.id, deviceId),
          eq(wireGuardDevices.userId, session.user.id)
        )
      )
      .limit(1);

    if (device.length === 0) {
      return NextResponse.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(device[0]);
  } catch (error) {
    console.error("Failed to fetch device:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 