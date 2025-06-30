import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (typeof window !== 'undefined') {
    throw new Error('Database should only be accessed on the server side');
  }
  
  if (!dbInstance) {
    try {
      const dbPath = path.join(process.cwd(), "db", "wireguard.db");
      const sqlite = new Database(dbPath);
      dbInstance = drizzle(sqlite, { schema });
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
  return dbInstance;
}
