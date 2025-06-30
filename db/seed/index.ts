"use server"

import process from "process"
import { getDb } from "@/db"
import { users, invitationCodes } from "@/db/schema"
import { adminUser, invitationCodes as inviteCodesData } from "./data/customers"
import { eq } from "drizzle-orm"

async function main() {
  console.log("🌱 Seeding database...")
  
  try {
    const db = getDb();
    
    // Check if admin user exists
    console.log("Checking admin user...")
    const existingAdmin = await db.select().from(users).where(eq(users.username, "admin")).limit(1)
    
    if (existingAdmin.length === 0) {
      console.log("Creating admin user...")
      await db.insert(users).values(adminUser)
    } else {
      console.log("Admin user already exists, skipping...")
    }
    
    // Create invitation codes (only new ones)
    console.log("Creating invitation codes...")
    for (const code of inviteCodesData) {
      try {
        await db.insert(invitationCodes).values(code)
        console.log(`Created invitation code: ${code.code}`)
      } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          console.log(`Invitation code ${code.code} already exists, skipping...`)
        } else {
          throw error
        }
      }
    }
    
    console.log("✅ Database seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

main()
