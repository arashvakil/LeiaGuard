-- Add last login tracking to users table
ALTER TABLE users ADD COLUMN last_login_at TEXT; 