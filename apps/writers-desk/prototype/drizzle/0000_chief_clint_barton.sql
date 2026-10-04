CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`story_id` text NOT NULL,
	`author_id` text NOT NULL,
	`author_name` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `notes_story` ON `notes` (`story_id`);--> statement-breakpoint
CREATE TABLE `photos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`credit` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'unchecked' NOT NULL,
	`last_use` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'upload' NOT NULL,
	`uploaded_by` text,
	`object_key` text,
	`mime` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`photo_id` text PRIMARY KEY NOT NULL,
	`story_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_story_id_unique` ON `reservations` (`story_id`);--> statement-breakpoint
CREATE TABLE `revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`story_id` text NOT NULL,
	`revision` integer NOT NULL,
	`snapshot` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `revisions_story` ON `revisions` (`story_id`);--> statement-breakpoint
CREATE TABLE `staff` (
	`email` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`role` text DEFAULT 'writer' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`title` text DEFAULT 'Contributor' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_user_id_unique` ON `staff` (`user_id`);--> statement-breakpoint
CREATE TABLE `stories` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`byline` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`dek` text DEFAULT '' NOT NULL,
	`section` text DEFAULT 'Football' NOT NULL,
	`body` text DEFAULT '{"ops":[]}' NOT NULL,
	`plain` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`photo_id` text,
	`photo_credit` text DEFAULT '' NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`art_request` text DEFAULT '' NOT NULL,
	`source_key` text,
	`source_name` text,
	`revision` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`published_url` text
);
--> statement-breakpoint
CREATE INDEX `stories_author` ON `stories` (`author_id`);--> statement-breakpoint
CREATE INDEX `stories_status` ON `stories` (`status`);