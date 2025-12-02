// Utility functions for calculating insurance tier-based copays

export type PlanType = 'HMO' | 'PPO' | 'EPO' | 'POS' | 'HDHP' | 'Medicare' | 'Medicaid';
export type DrugTier = 1 | 2 | 3 | 4;

// Base tier copays for different plan types
const TIER_COPAYS_BY_PLAN_TYPE: Record<PlanType, Record<`tier${DrugTier}`, number>> = {
  'HMO': { tier1: 8, tier2: 35, tier3: 70, tier4: 140 },      // Lowest cost
  'EPO': { tier1: 10, tier2: 40, tier3: 75, tier4: 160 },     // Mid-low cost
  'PPO': { tier1: 12, tier2: 45, tier3: 85, tier4: 180 },     // Baseline
  'POS': { tier1: 11, tier2: 42, tier3: 80, tier4: 170 },     // Mid cost
  'HDHP': { tier1: 18, tier2: 65, tier3: 120, tier4: 250 },   // Highest cost (before deductible)
  'Medicare': { tier1: 5, tier2: 35, tier3: 75, tier4: 150 }, // Federal program
  'Medicaid': { tier1: 1, tier2: 3, tier3: 5, tier4: 8 },     // State/federal low-income
};

/**
 * Extract plan type from plan name/description
 */
export function getPlanType(planName: string, planDescription: string = ''): PlanType {
  const text = `${planName} ${planDescription}`.toLowerCase();
  
  if (text.includes('hmo') || text.includes('health maintenance')) return 'HMO';
  if (text.includes('ppo') || text.includes('preferred provider')) return 'PPO';
  if (text.includes('epo') || text.includes('exclusive provider')) return 'EPO';
  if (text.includes('pos') || text.includes('point of service')) return 'POS';
  if (text.includes('hdhp') || text.includes('high deductible') || text.includes('hsa')) return 'HDHP';
  if (text.includes('medicare') || text.includes('advantage') || text.includes('medigap')) return 'Medicare';
  if (text.includes('medicaid')) return 'Medicaid';
  
  // Default to PPO if can't determine
  return 'PPO';
}

/**
 * Determine drug tier based on medication characteristics
 * @param isGeneric - Whether the medication is generic
 * @param isBrand - Whether the medication is brand-name
 * @param isSpecialty - Whether the medication is a specialty drug (e.g., biologics, high-cost)
 * @returns Drug tier (1-4)
 */
export function getDrugTier(
  isGeneric: boolean,
  isBrand: boolean = false,
  isSpecialty: boolean = false
): DrugTier {
  if (isSpecialty) return 4; // Specialty drugs (biologics, high-cost)
  if (isBrand && !isGeneric) return 3; // Non-preferred brand
  if (isBrand && isGeneric) return 2; // Preferred brand (has generic available)
  return 1; // Generic drugs
}

/**
 * Get copay amount for a specific plan type and drug tier
 */
export function getCopayForTier(planType: PlanType, tier: DrugTier): number {
  const copays = TIER_COPAYS_BY_PLAN_TYPE[planType];
  return copays[`tier${tier}`];
}

/**
 * Add slight variation to copay amount (±15%) to simulate real-world differences
 */
export function addCopayVariation(amount: number, variation: number = 0.15): number {
  const min = Math.round(amount * (1 - variation));
  const max = Math.round(amount * (1 + variation));
  return Math.round(min + Math.random() * (max - min));
}

/**
 * Calculate insurance copay for a medication based on plan and drug characteristics
 */
export function calculateInsuranceCopay(
  planName: string,
  planDescription: string,
  isGeneric: boolean,
  isBrand: boolean = false,
  isSpecialty: boolean = false,
  deductibleMet: boolean = false
): number {
  const planType = getPlanType(planName, planDescription);
  const tier = getDrugTier(isGeneric, isBrand, isSpecialty);
  let copay = getCopayForTier(planType, tier);
  
  // For HDHP plans, if deductible not met, increase copay significantly
  if (planType === 'HDHP' && !deductibleMet) {
    copay = copay * 2.5; // Much higher cost until deductible met
  }
  
  // Add slight variation to make prices more realistic
  copay = addCopayVariation(copay, 0.12);
  
  return Math.round(copay * 100) / 100; // Round to 2 decimal places
}
