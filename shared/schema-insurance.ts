import { pgTable, text, integer, varchar, boolean, timestamp, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Insurance Providers (Payers/Issuers)
 * Maps to CMS issuer_id, contract_id, etc.
 */
export const insurers = pgTable("insurers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  
  // External identifiers from CMS
  cmsIssuerId: varchar("cms_issuer_id", { length: 50 }),
  contractId: varchar("contract_id", { length: 50 }), // For Medicare (Hxxxx, Sxxxx)
  
  // Basic info
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'Marketplace' | 'Medicare Advantage' | 'Medicare Part D' | 'Medicaid' | 'Other'
  
  // Metadata
  state: varchar("state", { length: 2 }), // Two-letter state code
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  cmsIssuerIdIdx: index("insurers_cms_issuer_id_idx").on(table.cmsIssuerId),
  contractIdIdx: index("insurers_contract_id_idx").on(table.contractId),
  typeIdx: index("insurers_type_idx").on(table.type),
}));

export const insertInsurerSchema = createInsertSchema(insurers);
export const selectInsurerSchema = createSelectSchema(insurers);
export type Insurer = z.infer<typeof selectInsurerSchema>;
export type InsertInsurer = z.infer<typeof insertInsurerSchema>;

/**
 * Insurance Plans
 * Specific plans offered by insurers (e.g., "Blue Cross Silver PPO")
 */
export const plans = pgTable("plans", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  
  // Foreign keys
  insurerId: integer("insurer_id").notNull().references(() => insurers.id),
  
  // External identifiers
  externalPlanId: varchar("external_plan_id", { length: 100 }), // HIOS ID for Marketplace, contract+PBP for MA
  hiosId: varchar("hios_id", { length: 50 }), // For Marketplace plans
  contractPbp: varchar("contract_pbp", { length: 50 }), // For Medicare (H1234-001)
  
  // Basic info
  marketingName: varchar("marketing_name", { length: 255 }).notNull(),
  lineOfBusiness: varchar("line_of_business", { length: 50 }), // 'INDIVIDUAL', 'SMALL_GROUP', 'MA', 'PDP'
  metalLevel: varchar("metal_level", { length: 20 }), // 'Bronze', 'Silver', 'Gold', 'Platinum' (Marketplace only)
  year: integer("year").notNull(),
  
  // High-level benefits
  deductible: decimal("deductible", { precision: 10, scale: 2 }),
  maxOutOfPocket: decimal("max_out_of_pocket", { precision: 10, scale: 2 }),
  
  // Metadata
  state: varchar("state", { length: 2 }),
  countyFips: varchar("county_fips", { length: 5 }), // For location-specific plans
  active: boolean("active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  insurerIdIdx: index("plans_insurer_id_idx").on(table.insurerId),
  externalPlanIdIdx: index("plans_external_plan_id_idx").on(table.externalPlanId),
  hiosIdIdx: index("plans_hios_id_idx").on(table.hiosId),
  contractPbpIdx: index("plans_contract_pbp_idx").on(table.contractPbp),
  yearIdx: index("plans_year_idx").on(table.year),
  stateIdx: index("plans_state_idx").on(table.state),
}));

export const insertPlanSchema = createInsertSchema(plans);
export const selectPlanSchema = createSelectSchema(plans);
export type Plan = z.infer<typeof selectPlanSchema>;
export type InsertPlan = z.infer<typeof insertPlanSchema>;

/**
 * Plan Drug Coverage (Formulary)
 * Maps medications to plan-specific tiers, copays, and restrictions
 */
export const planDrugCoverage = pgTable("plan_drug_coverage", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  
  // Foreign keys
  planId: integer("plan_id").notNull().references(() => plans.id),
  
  // Drug identifiers
  rxcui: varchar("rxcui", { length: 20 }), // RxNorm Concept Unique Identifier
  ndc: varchar("ndc", { length: 11 }), // National Drug Code
  drugName: varchar("drug_name", { length: 255 }),
  
  // Coverage details
  tier: integer("tier"), // 1-5 (1 = preferred generic, 5 = specialty)
  tierName: varchar("tier_name", { length: 50 }), // 'Preferred Generic', 'Generic', 'Preferred Brand', etc.
  
  // Cost sharing
  copay: decimal("copay", { precision: 10, scale: 2 }), // Fixed copay amount
  coinsurance: decimal("coinsurance", { precision: 5, scale: 2 }), // Percentage (e.g., 30.00 for 30%)
  
  // Pharmacy preferences
  preferredPharmacy: boolean("preferred_pharmacy").default(false),
  mailOrderAvailable: boolean("mail_order_available").default(false),
  
  // Utilization management
  priorAuthRequired: boolean("prior_auth_required").default(false),
  stepTherapyRequired: boolean("step_therapy_required").default(false),
  quantityLimit: integer("quantity_limit"), // Max quantity per fill
  quantityLimitDays: integer("quantity_limit_days"), // Days supply limit
  
  // Metadata
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  planIdIdx: index("plan_drug_coverage_plan_id_idx").on(table.planId),
  rxcuiIdx: index("plan_drug_coverage_rxcui_idx").on(table.rxcui),
  ndcIdx: index("plan_drug_coverage_ndc_idx").on(table.ndc),
  planRxcuiIdx: index("plan_drug_coverage_plan_rxcui_idx").on(table.planId, table.rxcui),
}));

export const insertPlanDrugCoverageSchema = createInsertSchema(planDrugCoverage);
export const selectPlanDrugCoverageSchema = createSelectSchema(planDrugCoverage);
export type PlanDrugCoverage = z.infer<typeof selectPlanDrugCoverageSchema>;
export type InsertPlanDrugCoverage = z.infer<typeof insertPlanDrugCoverageSchema>;
