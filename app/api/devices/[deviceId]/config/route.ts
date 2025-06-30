import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { wireGuardDevices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateClientConfig } from "@/lib/wireguard";

// GET /api/devices/[deviceId]/config - Download config file
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
    // Get device
    const device = await db
      .select()
      .from(wireGuardDevices)
      .where(
        and(
          eq(wireGuardDevices.id, deviceId),
          eq(wireGuardDevices.userId, session.user.id),
          eq(wireGuardDevices.isActive, true)
        )
      )
      .limit(1);

    if (device.length === 0) {
      return NextResponse.json(
        { error: "Device not found or inactive" },
        { status: 404 }
      );
    }

    // Generate config
    const config = generateClientConfig(
      device[0].privateKey,
      device[0].ipAddress
    );

    // Return as downloadable file
    return new NextResponse(config, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${device[0].deviceName}.conf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 