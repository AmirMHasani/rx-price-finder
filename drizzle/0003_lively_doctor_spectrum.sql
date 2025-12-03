CREATE TABLE `family_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`condition` varchar(200) NOT NULL,
	`relation` enum('mother','father','sibling','maternal_grandmother','maternal_grandfather','paternal_grandmother','paternal_grandfather','child','other') NOT NULL,
	`otherRelation` varchar(100),
	`ageOfOnset` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `family_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `genomic_tests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`testType` varchar(100) NOT NULL,
	`testProvider` varchar(100),
	`status` enum('requested','sample_collected','processing','completed','cancelled') NOT NULL DEFAULT 'requested',
	`requestDate` timestamp NOT NULL DEFAULT (now()),
	`sampleCollectedDate` timestamp,
	`resultsDate` timestamp,
	`reportUrl` text,
	`reportDataJson` text,
	`physicianNotes` text,
	`patientNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `genomic_tests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insurance_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`primaryGroupNumber` varchar(50),
	`primaryRxBin` varchar(20),
	`primaryRxPcn` varchar(20),
	`primaryRxGroup` varchar(20),
	`hasSecondary` boolean DEFAULT false,
	`secondaryCarrier` varchar(100),
	`secondaryPlan` varchar(100),
	`secondaryGroupNumber` varchar(50),
	`secondaryMemberId` varchar(50),
	`deductibleMet` boolean DEFAULT false,
	`deductibleAmount` decimal(10,2),
	`deductibleMetDate` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insurance_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `insurance_details_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `medication_gene_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`genomicTestId` int NOT NULL,
	`medicationName` varchar(200) NOT NULL,
	`rxcui` varchar(50),
	`medicationClass` varchar(100),
	`gene` varchar(50) NOT NULL,
	`variant` varchar(100),
	`phenotype` varchar(100),
	`safetyLevel` enum('safe','caution','avoid') NOT NULL,
	`interpretation` text NOT NULL,
	`recommendation` text,
	`evidenceLevel` enum('strong','moderate','weak'),
	`guidelineSource` varchar(100),
	`guidelineUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `medication_gene_interactions_id` PRIMARY KEY(`id`)
);
