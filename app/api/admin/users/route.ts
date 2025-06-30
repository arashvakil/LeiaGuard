import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { users, wireGuardDevices, invitationCodeUsage, invitationCodes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const db = getDb();

    // Fetch users with device count and invitation code info
    const usersWithData = await db
      .select({
        id: users.id,
        username: users.username,
        isAdmin: users.isAdmin,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deviceCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${wireGuardDevices} 
          WHERE ${wireGuardDevices.userId} = ${users.id}
        )`,
        invitationCode: invitationCodes.code,
        invitationCodeUsedAt: invitationCodeUsage.usedAt,
      })
      .from(users)
      .leftJoin(invitationCodeUsage, eq(invitationCodeUsage.userId, users.id))
      .leftJoin(invitationCodes, eq(invitationCodes.id, invitationCodeUsage.invitationCodeId))
      .orderBy(users.createdAt);

    return NextResponse.json({ users: usersWithData });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, isActive, isAdmin } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent admins from modifying themselves
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 });
    }

    const db = getDb();

    // Build update object
    const updateData: Record<string, boolean | string> = {
      updatedAt: new Date().toISOString(),
    };

    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }

    if (typeof isAdmin === 'boolean') {
      updateData.isAdmin = isAdmin;
    }

    // Update user
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // If deactivating user, also deactivate their devices
    if (isActive === false) {
      await db
        .update(wireGuardDevices)
        .set({ 
          isActive: false,
          updatedAt: new Date().toISOString()
        })
        .where(eq(wireGuardDevices.userId, userId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 