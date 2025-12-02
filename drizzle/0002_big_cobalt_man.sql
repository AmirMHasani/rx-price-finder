CREATE TABLE `insurers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cmsIssuerId` varchar(50),
	`contractId` varchar(50),
	`name` varchar(255) NOT NULL,
	`type` enum('Marketplace','Medicare Advantage','Medicare Part D','Medicaid','Other') NOT NULL,
	`state` varchar(2),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insurers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plan_drug_coverage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`planId` int NOT NULL,
	`rxcui` varchar(20),
	`ndc` varchar(11),
	`drugName` varchar(255),
	`tier` int,
	`tierName` varchar(50),
	`copay` decimal(10,2),
	`coinsurance` decimal(5,2),
	`preferredPharmacy` boolean NOT NULL DEFAULT false,
	`mailOrderAvailable` boolean NOT NULL DEFAULT false,
	`priorAuthRequired` boolean NOT NULL DEFAULT false,
	`stepTherapyRequired` boolean NOT NULL DEFAULT false,
	`quantityLimit` int,
	`quantityLimitDays` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plan_drug_coverage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`insurerId` int NOT NULL,
	`externalPlanId` varchar(100),
	`hiosId` varchar(50),
	`contractPbp` varchar(50),
	`marketingName` varchar(255) NOT NULL,
	`lineOfBusiness` varchar(50),
	`metalLevel` varchar(20),
	`year` int NOT NULL,
	`deductible` decimal(10,2),
	`maxOutOfPocket` decimal(10,2),
	`state` varchar(2),
	`countyFips` varchar(5),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `plans_id` PRIMARY KEY(`id`)
);
