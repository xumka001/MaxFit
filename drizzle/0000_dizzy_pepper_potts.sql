CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`goal` text NOT NULL,
	`service_id` text NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL
);
