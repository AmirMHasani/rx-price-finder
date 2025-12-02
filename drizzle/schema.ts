import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Health profile fields
  dateOfBirth: timestamp("dateOfBirth"),
  heightCm: int("heightCm"), // Height in centimeters
  weightKg: decimal("weightKg", { precision: 5, scale: 2 }), // Weight in kilograms
  gender: mysqlEnum("gender", ["male", "female", "other", "prefer_not_to_say"]),
  
  // Insurance information
  insuranceCarrier: varchar("insuranceCarrier", { length: 100 }),
  insurancePlan: varchar("insurancePlan", { length: 100 }),
  insuranceMemberId: varchar("insuranceMemberId", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Medical conditions/comorbidities for users
 */
export const userConditions = mysqlTable("user_conditions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  condition: varchar("condition", { length: 200 }).notNull(),
  diagnosedDate: timestamp("diagnosedDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * User allergies tracking
 */
export const userAllergies = mysqlTable("user_allergies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  allergen: varchar("allergen", { length: 200 }).notNull(),
  severity: mysqlEnum("severity", ["mild", "moderate", "severe"]).notNull(),
  reaction: text("reaction"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Current medications for users
 */
export const userMedications = mysqlTable("user_medications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  medicationName: varchar("medicationName", { length: 200 }).notNull(),
  rxcui: varchar("rxcui", { length: 50 }),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  form: varchar("form", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  quantity: int("quantity").notNull(),
  
  lastRefillDate: timestamp("lastRefillDate"),
  nextRefillDate: timestamp("nextRefillDate"),
  refillReminderEnabled: boolean("refillReminderEnabled").default(true).notNull(),
  reminderDaysBefore: int("reminderDaysBefore").default(3).notNull(),
  
  preferredPharmacy: varchar("preferredPharmacy", { length: 200 }),
  pharmacyAddress: text("pharmacyAddress"),
  pharmacyPhone: varchar("pharmacyPhone", { length: 20 }),
  
  prescribingDoctor: varchar("prescribingDoctor", { length: 200 }),
  prescriptionNumber: varchar("prescriptionNumber", { length: 100 }),
  refillsRemaining: int("refillsRemaining"),
  
  isActive: boolean("isActive").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Medication search history
 */
export const searchHistory = mysqlTable("search_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  medicationName: varchar("medicationName", { length: 200 }).notNull(),
  rxcui: varchar("rxcui", { length: 50 }),
  dosage: varchar("dosage", { length: 100 }),
  form: varchar("form", { length: 100 }),
  quantity: int("quantity"),
  zipCode: varchar("zipCode", { length: 10 }),
  insurance: varchar("insurance", { length: 100 }),
  searchedAt: timestamp("searchedAt").defaultNow().notNull(),
});

/**
 * Price alerts for medications
 */
export const priceAlerts = mysqlTable("price_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  medicationName: varchar("medicationName", { length: 200 }).notNull(),
  rxcui: varchar("rxcui", { length: 50 }),
  dosage: varchar("dosage", { length: 100 }),
  quantity: int("quantity"),
  targetPrice: decimal("targetPrice", { precision: 10, scale: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  lastCheckedAt: timestamp("lastCheckedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserCondition = typeof userConditions.$inferSelect;
export type InsertUserCondition = typeof userConditions.$inferInsert;

export type UserAllergy = typeof userAllergies.$inferSelect;
export type InsertUserAllergy = typeof userAllergies.$inferInsert;

export type UserMedication = typeof userMedications.$inferSelect;
export type InsertUserMedication = typeof userMedications.$inferInsert;

export type SearchHistory = typeof searchHistory.$inferSelect;
export type InsertSearchHistory = typeof searchHistory.$inferInsert;

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = typeof priceAlerts.$inferInsert;

/**
 * Insurance Providers (Payers/Issuers)
 * Maps to CMS issuer_id, contract_id, etc.
 */
export const insurers = mysqlTable("insurers", {
  id: int("id").autoincrement().primaryKey(),
  
  // External identifiers from CMS
  cmsIssuerId: varchar("cmsIssuerId", { length: 50 }),
  contractId: varchar("contractId", { length: 50 }), // For Medicare (Hxxxx, Sxxxx)
  
  // Basic info
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["Marketplace", "Medicare Advantage", "Medicare Part D", "Medicaid", "Other"]).notNull(),
  
  // Metadata
  state: varchar("state", { length: 2 }), // Two-letter state code
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Insurer = typeof insurers.$inferSelect;
export type InsertInsurer = typeof insurers.$inferInsert;

/**
 * Insurance Plans
 * Specific plans offered by insurers (e.g., "Blue Cross Silver PPO")
 */
export const plans = mysqlTable("plans", {
  id: int("id").autoincrement().primaryKey(),
  
  // Foreign keys
  insurerId: int("insurerId").notNull(),
  
  // External identifiers
  externalPlanId: varchar("externalPlanId", { length: 100 }), // HIOS ID for Marketplace, contract+PBP for MA
  hiosId: varchar("hiosId", { length: 50 }), // For Marketplace plans
  contractPbp: varchar("contractPbp", { length: 50 }), // For Medicare (H1234-001)
  
  // Basic info
  marketingName: varchar("marketingName", { length: 255 }).notNull(),
  lineOfBusiness: varchar("lineOfBusiness", { length: 50 }), // 'INDIVIDUAL', 'SMALL_GROUP', 'MA', 'PDP'
  metalLevel: varchar("metalLevel", { length: 20 }), // 'Bronze', 'Silver', 'Gold', 'Platinum' (Marketplace only)
  year: int("year").notNull(),
  
  // High-level benefits
  deductible: decimal("deductible", { precision: 10, scale: 2 }),
  maxOutOfPocket: decimal("maxOutOfPocket", { precision: 10, scale: 2 }),
  
  // Metadata
  state: varchar("state", { length: 2 }),
  countyFips: varchar("countyFips", { length: 5 }), // For location-specific plans
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;

/**
 * Plan Drug Coverage (Formulary)
 * Maps medications to plan-specific tiers, copays, and restrictions
 */
export const planDrugCoverage = mysqlTable("plan_drug_coverage", {
  id: int("id").autoincrement().primaryKey(),
  
  // Foreign keys
  planId: int("planId").notNull(),
  
  // Drug identifiers
  rxcui: varchar("rxcui", { length: 20 }), // RxNorm Concept Unique Identifier
  ndc: varchar("ndc", { length: 11 }), // National Drug Code
  drugName: varchar("drugName", { length: 255 }),
  
  // Coverage details
  tier: int("tier"), // 1-5 (1 = preferred generic, 5 = specialty)
  tierName: varchar("tierName", { length: 50 }), // 'Preferred Generic', 'Generic', 'Preferred Brand', etc.
  
  // Cost sharing
  copay: decimal("copay", { precision: 10, scale: 2 }), // Fixed copay amount
  coinsurance: decimal("coinsurance", { precision: 5, scale: 2 }), // Percentage (e.g., 30.00 for 30%)
  
  // Pharmacy preferences
  preferredPharmacy: boolean("preferredPharmacy").default(false).notNull(),
  mailOrderAvailable: boolean("mailOrderAvailable").default(false).notNull(),
  
  // Utilization management
  priorAuthRequired: boolean("priorAuthRequired").default(false).notNull(),
  stepTherapyRequired: boolean("stepTherapyRequired").default(false).notNull(),
  quantityLimit: int("quantityLimit"), // Max quantity per fill
  quantityLimitDays: int("quantityLimitDays"), // Days supply limit
  
  // Metadata
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlanDrugCoverage = typeof planDrugCoverage.$inferSelect;
export type InsertPlanDrugCoverage = typeof planDrugCoverage.$inferInsert;
