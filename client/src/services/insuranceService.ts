/**
 * Insurance Service
 * Manages insurance plans and drug tier estimation
 */

import * as mockDb from './mockDb';

/**
 * Initialize insurance plans database with common plans
 */
export async function initializeInsurancePlans(): Promise<void> {
  const existingPlans = await mockDb.getInsurancePlans();
  
  if (existingPlans.length > 0) {
    return; // Already initialized
  }

  const plans: Omit<mockDb.InsurancePlan, 'id' | 'created_at'>[] = [
    {
      name: 'Blue Advantage HMO',
      carrier: 'Blue Cross Blue Shield',
      plan_type: 'HMO',
      tier1_copay: 15,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1000,
      average_oop_max: 5000,
    },
    {
      name: 'Choice Plus PPO',
      carrier: 'UnitedHealthcare',
      plan_type: 'PPO',
      tier1_copay: 20,
      tier2_copay: 40,
      tier3_copay: 80,
      tier4_copay: 200,
      average_deductible: 1500,
      average_oop_max: 6000,
    },
    {
      name: 'Open Access HMO',
      carrier: 'Aetna',
      plan_type: 'HMO',
      tier1_copay: 15,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1000,
      average_oop_max: 5000,
    },
    {
      name: 'LocalPlus HMO',
      carrier: 'Cigna',
      plan_type: 'HMO',
      tier1_copay: 15,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1000,
      average_oop_max: 5000,
    },
    {
      name: 'Gold Plus HMO',
      carrier: 'Humana',
      plan_type: 'HMO',
      tier1_copay: 15,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1000,
      average_oop_max: 5000,
    },
    {
      name: 'Silver HMO',
      carrier: 'Kaiser Permanente',
      plan_type: 'HMO',
      tier1_copay: 20,
      tier2_copay: 40,
      tier3_copay: 80,
      tier4_copay: 200,
      average_deductible: 1500,
      average_oop_max: 6000,
    },
    {
      name: 'Part D Standard',
      carrier: 'Medicare',
      plan_type: 'Medicare Part D',
      tier1_copay: 10,
      tier2_copay: 30,
      tier3_copay: 60,
      tier4_copay: 150,
      average_deductible: 505,
      average_oop_max: 6700,
    },
    {
      name: 'Medicaid Standard',
      carrier: 'Medicaid',
      plan_type: 'Medicaid',
      tier1_copay: 3,
      tier2_copay: 5,
      tier3_copay: 10,
      tier4_copay: 50,
      average_deductible: 0,
      average_oop_max: 0,
    },
  ];

  for (const plan of plans) {
    await mockDb.addInsurancePlan(plan);
  }
}

/**
 * Initialize drug tiers database with common medications
 */
export async function initializeDrugTiers(): Promise<void> {
  const existingTiers = await mockDb.getDrugTier('lipitor');
  
  if (existingTiers) {
    return; // Already initialized
  }

  const tiers: Omit<mockDb.DrugTier, 'id' | 'created_at'>[] = [
    {
      medication_name: 'Lipitor',
      generic_name: 'Atorvastatin',
      brand_name: 'Lipitor',
      is_generic: false,
      has_generic_alternative: true,
      drug_type: 'brand',
      estimated_tier: 2,
    },
    {
      medication_name: 'Atorvastatin',
      generic_name: 'Atorvastatin',
      brand_name: 'Lipitor',
      is_generic: true,
      has_generic_alternative: false,
      drug_type: 'generic',
      estimated_tier: 1,
    },
    {
      medication_name: 'Metformin',
      generic_name: 'Metformin',
      brand_name: 'Glucophage',
      is_generic: true,
      has_generic_alternative: false,
      drug_type: 'generic',
      estimated_tier: 1,
    },
    {
      medication_name: 'Lisinopril',
      generic_name: 'Lisinopril',
      brand_name: 'Prinivil',
      is_generic: true,
      has_generic_alternative: false,
      drug_type: 'generic',
      estimated_tier: 1,
    },
    {
      medication_name: 'Omeprazole',
      generic_name: 'Omeprazole',
      brand_name: 'Prilosec',
      is_generic: true,
      has_generic_alternative: false,
      drug_type: 'generic',
      estimated_tier: 1,
    },
    {
      medication_name: 'Amoxicillin',
      generic_name: 'Amoxicillin',
      brand_name: 'Amoxil',
      is_generic: true,
      has_generic_alternative: false,
      drug_type: 'generic',
      estimated_tier: 1,
    },
    {
      medication_name: 'Ibuprofen',
      generic_name: 'Ibuprofen',
      brand_name: 'Advil',
      is_generic: true,
      has_generic_alternative: false,
      drug_type: 'generic',
      estimated_tier: 1,
    },
    {
      medication_name: 'Acetaminophen',
      generic_name: 'Acetaminophen',
      brand_name: 'Tylenol',
      is_generic: true,
      has_generic_alternative: false,
      drug_type: 'generic',
      estimated_tier: 1,
    },
  ];

  for (const tier of tiers) {
    await mockDb.addDrugTier(tier);
  }
}

/**
 * Estimate drug tier based on medication info
 */
export async function estimateDrugTier(medicationName: string): Promise<number> {
  const tier = await mockDb.getDrugTier(medicationName);
  
  if (tier) {
    return tier.estimated_tier;
  }

  // Default estimation logic
  const nameLower = medicationName.toLowerCase();
  
  // Check if it's likely a generic
  if (
    nameLower.includes('generic') ||
    nameLower === 'metformin' ||
    nameLower === 'lisinopril' ||
    nameLower === 'omeprazole' ||
    nameLower === 'amoxicillin'
  ) {
    return 1; // Generic = Tier 1
  }

  // Check if it's likely a brand with generic
  if (
    nameLower === 'lipitor' ||
    nameLower === 'atorvastatin' ||
    nameLower === 'prilosec'
  ) {
    return 2; // Brand with generic = Tier 2
  }

  // Default to Tier 2
  return 2;
}

/**
 * Calculate insurance price based on tier and deductible status
 */
export function calculateInsurancePrice(
  cashPrice: number,
  drugTier: number,
  insurancePlan: mockDb.InsurancePlan,
  deductibleMet: boolean
): {
  copay: number;
  beforeDeductible: number;
  afterDeductible: number;
  savings: number;
} {
  const copays = [
    insurancePlan.tier1_copay,
    insurancePlan.tier2_copay,
    insurancePlan.tier3_copay,
    insurancePlan.tier4_copay,
  ];

  const copay = copays[drugTier - 1] || copays[1];

  if (deductibleMet) {
    return {
      copay,
      beforeDeductible: copay,
      afterDeductible: copay,
      savings: Math.max(0, cashPrice - copay),
    };
  }

  // If deductible not met, patient pays more
  const deductibleApplies = cashPrice > copay;
  const beforeDeductible = deductibleApplies ? cashPrice : copay;
  const afterDeductible = copay;

  return {
    copay,
    beforeDeductible,
    afterDeductible,
    savings: Math.max(0, cashPrice - copay),
  };
}

/**
 * Get all insurance plans
 */
export async function getInsurancePlans(): Promise<mockDb.InsurancePlan[]> {
  await initializeInsurancePlans();
  return mockDb.getInsurancePlans();
}
