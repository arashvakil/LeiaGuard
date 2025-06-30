import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { users, invitationCodes, invitationCodeUsage } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { inviteCode, username, password } = await request.json();

    // Validate input
    if (!inviteCode || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Find invitation code (case-insensitive)
    const inviteResult = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.code, inviteCode.toUpperCase()))
      .limit(1);

    if (inviteResult.length === 0) {
      return NextResponse.json(
        { error: "Invalid invitation code" },
        { status: 400 }
      );
    }

    const inviteRecord = inviteResult[0];

    // Check if invitation code is active
    if (!inviteRecord.isActive) {
      return NextResponse.json(
        { error: "Invitation code is disabled" },
        { status: 400 }
      );
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(inviteRecord.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        { error: "Invitation code has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (inviteRecord.usedCount >= inviteRecord.maxUses) {
      return NextResponse.json(
        { error: "Invitation code usage limit reached" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userId = uuidv4();
    await db.insert(users).values({
      id: userId,
      username,
      passwordHash: hashedPassword,
      isAdmin: false,
      isActive: true,
    });

    // Record usage and increment counter atomically within a transaction
    await db.transaction(async (tx) => {
      // Insert usage record
      await tx.insert(invitationCodeUsage).values({
        id: uuidv4(),
        invitationCodeId: inviteRecord.id,
        userId: userId,
      });
      // Increment used_count
      await tx
        .update(invitationCodes)
        .set({ usedCount: inviteRecord.usedCount + 1 })
        .where(eq(invitationCodes.id, inviteRecord.id));
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        username,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 