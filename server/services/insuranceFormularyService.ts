/**
 * Insurance Formulary Service
 * 
 * Looks up drug coverage and copays from real insurance plan formularies
 */

import { db } from "../db";
import { insurers, plans, planDrugCoverage } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export interface FormularyCoverage {
  planId: number;
  planName: string;
  insurerName: string;
  tier: number;
  tierName: string;
  copay: number;
  priorAuthRequired: boolean;
}

/**
 * Get formulary coverage for a medication by RXCUI and insurance type
 */
export async function getFormularyCoverage(
  rxcui: string,
  insuranceType?: string
): Promise<FormularyCoverage[]> {
  try {
    // Query plan_drug_coverage joined with plans and insurers
    const coverage = await db
      .select({
        planId: planDrugCoverage.planId,
        planName: plans.marketingName,
        insurerName: insurers.name,
        tier: planDrugCoverage.tier,
        tierName: planDrugCoverage.tierName,
        copay: planDrugCoverage.copay,
        priorAuthRequired: planDrugCoverage.priorAuthRequired,
      })
      .from(planDrugCoverage)
      .innerJoin(plans, eq(planDrugCoverage.planId, plans.id))
      .innerJoin(insurers, eq(plans.insurerId, insurers.id))
      .where(
        and(
          eq(planDrugCoverage.rxcui, rxcui),
          eq(planDrugCoverage.isActive, true),
          eq(plans.isActive, true),
          eq(insurers.isActive, true)
        )
      );

    // Convert copay strings to numbers
    return coverage.map((c) => ({
      ...c,
      copay: parseFloat(c.copay),
    }));
  } catch (error) {
    console.error(`[Insurance Formulary] Error fetching coverage for RXCUI ${rxcui}:`, error);
    return [];
  }
}

/**
 * Get all active insurance plans
 */
export async function getActivePlans() {
  try {
    const activePlans = await db
      .select({
        id: plans.id,
        contractPbp: plans.contractPbp,
        marketingName: plans.marketingName,
        lineOfBusiness: plans.lineOfBusiness,
        year: plans.year,
        state: plans.state,
        insurerName: insurers.name,
        insurerType: insurers.type,
      })
      .from(plans)
      .innerJoin(insurers, eq(plans.insurerId, insurers.id))
      .where(and(eq(plans.isActive, true), eq(insurers.isActive, true)));

    return activePlans;
  } catch (error) {
    console.error("[Insurance Formulary] Error fetching active plans:", error);
    return [];
  }
}

/**
 * Map user insurance selection to plan lookup
 * This maps the insurance dropdown values to actual plans in the database
 */
export function mapInsuranceToPlans(insuranceSelection: string): string[] {
  const insuranceMap: Record<string, string[]> = {
    // Medicare plans
    medicare: ["H1234-001", "S5678-002", "H9999-003", "S1111-004"],
    medicare_advantage: ["H1234-001", "H9999-003"],
    medicare_part_d: ["S5678-002", "S1111-004"],
    
    // Medicaid - would use state-specific plans
    medicaid: ["H1234-001"], // Placeholder
    
    // Marketplace/ACA plans
    marketplace: ["12345MA0010001"],
    bcbs: ["12345MA0010001"],
    
    // Commercial insurance (would map to specific plans)
    aetna: ["H9999-003"],
    cigna: ["S1111-004"],
    united: ["H1234-001"],
    humana: ["S5678-002"],
    
    // No insurance
    no_insurance: [],
    cash: [],
  };

  return insuranceMap[insuranceSelection.toLowerCase()] || [];
}

/**
 * Get best copay for a medication under specific insurance
 */
export async function getBestCopay(
  rxcui: string,
  insuranceSelection: string
): Promise<{ copay: number; planName: string; tierName: string } | null> {
  try {
    const planIds = mapInsuranceToPlans(insuranceSelection);
    
    if (planIds.length === 0) {
      return null; // No insurance or not covered
    }

    const coverage = await getFormularyCoverage(rxcui, insuranceSelection);
    
    if (coverage.length === 0) {
      return null; // Medication not in formulary
    }

    // Filter to selected plans
    const relevantCoverage = coverage.filter((c) =>
      planIds.some((planId) => c.planName.includes(planId) || c.insurerName.toLowerCase().includes(insuranceSelection.toLowerCase()))
    );

    if (relevantCoverage.length === 0) {
      // Fall back to any coverage if no exact match
      relevantCoverage.push(...coverage);
    }

    // Find lowest copay
    const bestCoverage = relevantCoverage.reduce((best, current) =>
      current.copay < best.copay ? current : best
    );

    return {
      copay: bestCoverage.copay,
      planName: bestCoverage.planName,
      tierName: bestCoverage.tierName,
    };
  } catch (error) {
    console.error(`[Insurance Formulary] Error getting best copay for RXCUI ${rxcui}:`, error);
    return null;
  }
}
