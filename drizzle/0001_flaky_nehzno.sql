CREATE TABLE `price_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`medicationName` varchar(200) NOT NULL,
	`rxcui` varchar(50),
	`dosage` varchar(100),
	`quantity` int,
	`targetPrice` decimal(10,2) NOT NULL,
	`zipCode` varchar(10) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`lastCheckedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `price_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`medicationName` varchar(200) NOT NULL,
	`rxcui` varchar(50),
	`dosage` varchar(100),
	`form` varchar(100),
	`quantity` int,
	`zipCode` varchar(10),
	`insurance` varchar(100),
	`searchedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `search_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_allergies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`allergen` varchar(200) NOT NULL,
	`severity` enum('mild','moderate','severe') NOT NULL,
	`reaction` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_allergies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_conditions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`condition` varchar(200) NOT NULL,
	`diagnosedDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_conditions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_medications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`medicationName` varchar(200) NOT NULL,
	`rxcui` varchar(50),
	`dosage` varchar(100) NOT NULL,
	`form` varchar(100),
	`frequency` varchar(100),
	`quantity` int NOT NULL,
	`lastRefillDate` timestamp,
	`nextRefillDate` timestamp,
	`refillReminderEnabled` boolean NOT NULL DEFAULT true,
	`reminderDaysBefore` int NOT NULL DEFAULT 3,
	`preferredPharmacy` varchar(200),
	`pharmacyAddress` text,
	`pharmacyPhone` varchar(20),
	`prescribingDoctor` varchar(200),
	`prescriptionNumber` varchar(100),
	`refillsRemaining` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_medications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `dateOfBirth` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `heightCm` int;--> statement-breakpoint
ALTER TABLE `users` ADD `weightKg` decimal(5,2);--> statement-breakpoint
ALTER TABLE `users` ADD `gender` enum('male','female','other','prefer_not_to_say');--> statement-breakpoint
ALTER TABLE `users` ADD `insuranceCarrier` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `insurancePlan` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `insuranceMemberId` varchar(100);