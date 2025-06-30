import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { invitationCodes, invitationCodeUsage, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codeId: string }> }
) {
  try {
    const { codeId } = await params;
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    // Get invitation code details
    const inviteCode = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.id, codeId))
      .limit(1);

    if (inviteCode.length === 0) {
      return NextResponse.json(
        { error: "Invitation code not found" },
        { status: 404 }
      );
    }

    // Get usage details with user information
    const usageDetails = await db
      .select({
        id: invitationCodeUsage.id,
        userId: invitationCodeUsage.userId,
        username: users.username,
        usedAt: invitationCodeUsage.usedAt,
        userIsActive: users.isActive,
      })
      .from(invitationCodeUsage)
      .innerJoin(users, eq(invitationCodeUsage.userId, users.id))
      .where(eq(invitationCodeUsage.invitationCodeId, codeId))
      .orderBy(invitationCodeUsage.usedAt);

    return NextResponse.json({
      code: inviteCode[0],
      usage: usageDetails,
    });
  } catch (error) {
    console.error("Error fetching invitation code usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 