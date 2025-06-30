import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { invitationCodes, invitationCodeUsage, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET - List all invitation codes with usage stats
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    // Get invitation codes with usage statistics
    const codesWithStats = await db
      .select({
        id: invitationCodes.id,
        code: invitationCodes.code,
        maxUses: invitationCodes.maxUses,
        usedCount: invitationCodes.usedCount,
        description: invitationCodes.description,
        expiresAt: invitationCodes.expiresAt,
        isActive: invitationCodes.isActive,
        createdAt: invitationCodes.createdAt,
        remainingUses: sql<number>`${invitationCodes.maxUses} - ${invitationCodes.usedCount}`,
        isExpired: sql<boolean>`datetime(${invitationCodes.expiresAt}) < datetime('now')`,
        isFull: sql<boolean>`${invitationCodes.usedCount} >= ${invitationCodes.maxUses}`
      })
      .from(invitationCodes)
      .orderBy(invitationCodes.createdAt);

    return NextResponse.json({ codes: codesWithStats });
  } catch (error) {
    console.error("Error fetching invitation codes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new invitation code
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();
    const { code, description, maxUses = 50, expiresInDays = 30 } = await request.json();

    // Validate input
    if (!code || code.length < 3) {
      return NextResponse.json(
        { error: "Code must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCode = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.code, code.toUpperCase()))
      .limit(1);

    if (existingCode.length > 0) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 400 }
      );
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create new invitation code
    const newCode = await db.insert(invitationCodes).values({
      id: uuidv4(),
      code: code.toUpperCase(),
      maxUses,
      usedCount: 0,
      description: description || null,
      expiresAt: expiresAt.toISOString(),
      isActive: true,
    }).returning();

    return NextResponse.json(
      { 
        message: "Invitation code created successfully",
        code: newCode[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invitation code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 