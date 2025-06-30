import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  lastLoginAt: text("last_login_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Invitation codes table - updated for multiple uses
export const invitationCodes = sqliteTable("invitation_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  maxUses: integer("max_uses").default(50).notNull(),
  usedCount: integer("used_count").default(0).notNull(),
  description: text("description"), // Optional description for admin reference
  expiresAt: text("expires_at").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Track which users used which invitation codes
export const invitationCodeUsage = sqliteTable("invitation_code_usage", {
  id: text("id").primaryKey(),
  invitationCodeId: text("invitation_code_id").references(() => invitationCodes.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  usedAt: text("used_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// WireGuard devices/configs table
export const wireGuardDevices = sqliteTable("wireguard_devices", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  deviceName: text("device_name").notNull(),
  publicKey: text("public_key").notNull().unique(),
  privateKey: text("private_key").notNull(),
  ipAddress: text("ip_address").notNull().unique(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Sessions table for auth
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type InvitationCode = typeof invitationCodes.$inferSelect;
export type NewInvitationCode = typeof invitationCodes.$inferInsert;
export type InvitationCodeUsage = typeof invitationCodeUsage.$inferSelect;
export type NewInvitationCodeUsage = typeof invitationCodeUsage.$inferInsert;
export type WireGuardDevice = typeof wireGuardDevices.$inferSelect;
export type NewWireGuardDevice = typeof wireGuardDevices.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert; 