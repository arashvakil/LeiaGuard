const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'wireguard.db');
const db = new Database(dbPath);

console.log('Starting migration to multi-use invitation codes...');

try {
  // Enable WAL mode for better concurrent access
  db.pragma('journal_mode = WAL');
  
  // Step 1: Create the new invitation_code_usage table
  console.log('1. Creating invitation_code_usage table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS invitation_code_usage (
      id TEXT PRIMARY KEY NOT NULL,
      invitation_code_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      used_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (invitation_code_id) REFERENCES invitation_codes(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Step 2: Check if we need to migrate (if old schema exists)
  const tableInfo = db.prepare("PRAGMA table_info(invitation_codes)").all();
  const hasOldSchema = tableInfo.some(col => col.name === 'is_used');
  
  if (hasOldSchema) {
    console.log('2. Migrating from old schema...');
    
    // Disable foreign keys
    db.pragma('foreign_keys = OFF');
    
    // Create new table structure
    db.exec(`
      CREATE TABLE __new_invitation_codes (
        id TEXT PRIMARY KEY NOT NULL,
        code TEXT NOT NULL,
        max_uses INTEGER DEFAULT 50 NOT NULL,
        used_count INTEGER DEFAULT 0 NOT NULL,
        description TEXT,
        expires_at TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    
    // Migrate existing data
    db.exec(`
      INSERT INTO __new_invitation_codes (id, code, max_uses, used_count, description, expires_at, created_at)
      SELECT 
        id, 
        code, 
        50 as max_uses,
        CASE WHEN is_used = 1 THEN 1 ELSE 0 END as used_count,
        NULL as description,
        expires_at, 
        created_at 
      FROM invitation_codes
    `);
    
    // Migrate usage records
    const usageRecords = db.prepare(`
      SELECT id, used_by, created_at 
      FROM invitation_codes 
      WHERE is_used = 1 AND used_by IS NOT NULL
    `).all();
    
    const insertUsage = db.prepare(`
      INSERT INTO invitation_code_usage (id, invitation_code_id, user_id, used_at)
      VALUES (?, ?, ?, ?)
    `);
    
    for (const record of usageRecords) {
      const usageId = require('crypto').randomUUID();
      insertUsage.run(usageId, record.id, record.used_by, record.created_at);
    }
    
    // Replace old table
    db.exec('DROP TABLE invitation_codes');
    db.exec('ALTER TABLE __new_invitation_codes RENAME TO invitation_codes');
    
    // Re-enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Recreate unique index
    db.exec('CREATE UNIQUE INDEX invitation_codes_code_unique ON invitation_codes (code)');
    
    console.log('✅ Migration completed successfully!');
  } else {
    console.log('✅ Database already has new schema, no migration needed.');
  }
  
  // Verify the new structure
  const newTableInfo = db.prepare("PRAGMA table_info(invitation_codes)").all();
  console.log('New invitation_codes schema:', newTableInfo.map(col => col.name));
  
  const usageTableInfo = db.prepare("PRAGMA table_info(invitation_code_usage)").all();
  console.log('invitation_code_usage schema:', usageTableInfo.map(col => col.name));
  
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}

console.log('Migration script completed.'); 