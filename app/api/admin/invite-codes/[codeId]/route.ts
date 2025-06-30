import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { invitationCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

// PUT - Update invitation code
export async function PUT(
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
    const { maxUses, expiresAt, isActive, description } = await request.json();

    // Validate input
    if (maxUses !== undefined && (maxUses < 1 || maxUses > 1000)) {
      return NextResponse.json(
        { error: "Max uses must be between 1 and 1000" },
        { status: 400 }
      );
    }

    if (expiresAt !== undefined && new Date(expiresAt) <= new Date()) {
      return NextResponse.json(
        { error: "Expiration date must be in the future" },
        { status: 400 }
      );
    }

    // Check if code exists
    const existingCode = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.id, codeId))
      .limit(1);

    if (existingCode.length === 0) {
      return NextResponse.json(
        { error: "Invitation code not found" },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updateData: Partial<{
      maxUses: number;
      expiresAt: string;
      isActive: boolean;
      description: string | null;
    }> = {};
    if (maxUses !== undefined) updateData.maxUses = maxUses;
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (description !== undefined) updateData.description = description;

    // Update invitation code
    const updatedCode = await db
      .update(invitationCodes)
      .set(updateData)
      .where(eq(invitationCodes.id, codeId))
      .returning();

    return NextResponse.json(
      { 
        message: "Invitation code updated successfully",
        code: updatedCode[0]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating invitation code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete invitation code
export async function DELETE(
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

    // Check if code exists
    const existingCode = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.id, codeId))
      .limit(1);

    if (existingCode.length === 0) {
      return NextResponse.json(
        { error: "Invitation code not found" },
        { status: 404 }
      );
    }

    // Delete invitation code (this will cascade delete usage records)
    await db
      .delete(invitationCodes)
      .where(eq(invitationCodes.id, codeId));

    return NextResponse.json(
      { message: "Invitation code deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting invitation code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 