-- Add is_active column to invitation_codes table
ALTER TABLE `invitation_codes` ADD COLUMN `is_active` integer DEFAULT 1 NOT NULL; 