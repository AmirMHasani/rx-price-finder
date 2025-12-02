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