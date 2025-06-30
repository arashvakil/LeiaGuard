-- Create the new invitation_code_usage table
CREATE TABLE `invitation_code_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`invitation_code_id` text NOT NULL,
	`user_id` text NOT NULL,
	`used_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`invitation_code_id`) REFERENCES `invitation_codes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Disable foreign keys temporarily
PRAGMA foreign_keys=OFF;

-- Create new invitation_codes table with updated schema
CREATE TABLE `__new_invitation_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`max_uses` integer DEFAULT 50 NOT NULL,
	`used_count` integer DEFAULT 0 NOT NULL,
	`description` text,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Migrate existing data: convert is_used boolean to used_count
INSERT INTO `__new_invitation_codes`(
	`id`, 
	`code`, 
	`max_uses`, 
	`used_count`, 
	`description`, 
	`expires_at`, 
	`created_at`
) 
SELECT 
	`id`, 
	`code`, 
	50 as `max_uses`,
	CASE WHEN `is_used` = 1 THEN 1 ELSE 0 END as `used_count`,
	NULL as `description`,
	`expires_at`, 
	`created_at` 
FROM `invitation_codes`;

-- Migrate existing usage records to the new table
INSERT INTO `invitation_code_usage` (`id`, `invitation_code_id`, `user_id`, `used_at`)
SELECT 
	lower(hex(randomblob(16))) as `id`,
	`id` as `invitation_code_id`,
	`used_by` as `user_id`,
	`created_at` as `used_at`
FROM `invitation_codes` 
WHERE `is_used` = 1 AND `used_by` IS NOT NULL;

-- Replace the old table
DROP TABLE `invitation_codes`;
ALTER TABLE `__new_invitation_codes` RENAME TO `invitation_codes`;

-- Re-enable foreign keys
PRAGMA foreign_keys=ON;

-- Recreate the unique index
CREATE UNIQUE INDEX `invitation_codes_code_unique` ON `invitation_codes` (`code`); 