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
    // Medicare Plans
    {
      name: 'Part D Standard',
      carrier: 'Medicare',
      plan_type: 'Medicare Part D',
      tier1_copay: 7,
      tier2_copay: 20,
      tier3_copay: 47,
      tier4_copay: 125,
      average_deductible: 486,
      average_oop_max: 2000, // 2025 new cap
    },
    {
      name: 'Medicare Advantage',
      carrier: 'Medicare',
      plan_type: 'Medicare Advantage',
      tier1_copay: 5,
      tier2_copay: 15,
      tier3_copay: 40,
      tier4_copay: 100,
      average_deductible: 350,
      average_oop_max: 2000,
    },
    {
      name: 'Part D Enhanced',
      carrier: 'Medicare',
      plan_type: 'Medicare Part D',
      tier1_copay: 0,
      tier2_copay: 10,
      tier3_copay: 30,
      tier4_copay: 95,
      average_deductible: 0,
      average_oop_max: 2000,
    },
    // Commercial Insurance - UnitedHealthcare
    {
      name: 'Choice Plus PPO',
      carrier: 'UnitedHealthcare',
      plan_type: 'PPO',
      tier1_copay: 10,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1500,
      average_oop_max: 6000,
    },
    {
      name: 'Options PPO',
      carrier: 'UnitedHealthcare',
      plan_type: 'PPO',
      tier1_copay: 15,
      tier2_copay: 45,
      tier3_copay: 85,
      tier4_copay: 200,
      average_deductible: 2000,
      average_oop_max: 7000,
    },
    // Blue Cross Blue Shield
    {
      name: 'Blue Advantage HMO',
      carrier: 'Blue Cross Blue Shield',
      plan_type: 'HMO',
      tier1_copay: 10,
      tier2_copay: 30,
      tier3_copay: 60,
      tier4_copay: 150,
      average_deductible: 1000,
      average_oop_max: 5000,
    },
    {
      name: 'Blue Preferred PPO',
      carrier: 'Blue Cross Blue Shield',
      plan_type: 'PPO',
      tier1_copay: 15,
      tier2_copay: 40,
      tier3_copay: 75,
      tier4_copay: 175,
      average_deductible: 1500,
      average_oop_max: 6500,
    },
    // Aetna CVS Health
    {
      name: 'Open Choice PPO',
      carrier: 'Aetna',
      plan_type: 'PPO',
      tier1_copay: 10,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1500,
      average_oop_max: 6000,
    },
    {
      name: 'Aetna HMO',
      carrier: 'Aetna',
      plan_type: 'HMO',
      tier1_copay: 10,
      tier2_copay: 30,
      tier3_copay: 65,
      tier4_copay: 140,
      average_deductible: 1000,
      average_oop_max: 5500,
    },
    // Cigna
    {
      name: 'Cigna LocalPlus',
      carrier: 'Cigna',
      plan_type: 'HMO',
      tier1_copay: 10,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1200,
      average_oop_max: 5500,
    },
    {
      name: 'Cigna Open Access Plus',
      carrier: 'Cigna',
      plan_type: 'PPO',
      tier1_copay: 15,
      tier2_copay: 40,
      tier3_copay: 80,
      tier4_copay: 175,
      average_deductible: 1800,
      average_oop_max: 6500,
    },
    // Kaiser Permanente
    {
      name: 'Kaiser Silver HMO',
      carrier: 'Kaiser Permanente',
      plan_type: 'HMO',
      tier1_copay: 10,
      tier2_copay: 30,
      tier3_copay: 60,
      tier4_copay: 150,
      average_deductible: 1400,
      average_oop_max: 6000,
    },
    {
      name: 'Kaiser Gold HMO',
      carrier: 'Kaiser Permanente',
      plan_type: 'HMO',
      tier1_copay: 5,
      tier2_copay: 20,
      tier3_copay: 45,
      tier4_copay: 100,
      average_deductible: 500,
      average_oop_max: 4500,
    },
    // Humana
    {
      name: 'Humana Gold Plus',
      carrier: 'Humana',
      plan_type: 'Medicare Advantage',
      tier1_copay: 0,
      tier2_copay: 12,
      tier3_copay: 42,
      tier4_copay: 100,
      average_deductible: 0,
      average_oop_max: 2000,
    },
    {
      name: 'Humana Preferred HMO',
      carrier: 'Humana',
      plan_type: 'HMO',
      tier1_copay: 10,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1000,
      average_oop_max: 5500,
    },
    // Marketplace/ACA Plans
    {
      name: 'Bronze Plan',
      carrier: 'Marketplace',
      plan_type: 'ACA Bronze',
      tier1_copay: 20,
      tier2_copay: 60,
      tier3_copay: 100,
      tier4_copay: 250,
      average_deductible: 6000,
      average_oop_max: 9100,
    },
    {
      name: 'Silver Plan',
      carrier: 'Marketplace',
      plan_type: 'ACA Silver',
      tier1_copay: 15,
      tier2_copay: 45,
      tier3_copay: 80,
      tier4_copay: 200,
      average_deductible: 4500,
      average_oop_max: 9100,
    },
    {
      name: 'Gold Plan',
      carrier: 'Marketplace',
      plan_type: 'ACA Gold',
      tier1_copay: 10,
      tier2_copay: 35,
      tier3_copay: 65,
      tier4_copay: 150,
      average_deductible: 2000,
      average_oop_max: 9100,
    },
    {
      name: 'Platinum Plan',
      carrier: 'Marketplace',
      plan_type: 'ACA Platinum',
      tier1_copay: 5,
      tier2_copay: 25,
      tier3_copay: 50,
      tier4_copay: 100,
      average_deductible: 500,
      average_oop_max: 9100,
    },
    // Anthem (Elevance Health)
    {
      name: 'Anthem Blue Cross PPO',
      carrier: 'Anthem',
      plan_type: 'PPO',
      tier1_copay: 10,
      tier2_copay: 35,
      tier3_copay: 70,
      tier4_copay: 150,
      average_deductible: 1500,
      average_oop_max: 6000,
    },
    {
      name: 'Anthem HealthKeepers HMO',
      carrier: 'Anthem',
      plan_type: 'HMO',
      tier1_copay: 10,
      tier2_copay: 30,
      tier3_copay: 60,
      tier4_copay: 140,
      average_deductible: 1000,
      average_oop_max: 5500,
    },
    // Centene (Ambetter, WellCare)
    {
      name: 'Ambetter Balanced Care',
      carrier: 'Centene',
      plan_type: 'ACA Silver',
      tier1_copay: 15,
      tier2_copay: 45,
      tier3_copay: 80,
      tier4_copay: 200,
      average_deductible: 4000,
      average_oop_max: 9100,
    },
    {
      name: 'WellCare Medicare Advantage',
      carrier: 'Centene',
      plan_type: 'Medicare Advantage',
      tier1_copay: 0,
      tier2_copay: 15,
      tier3_copay: 42,
      tier4_copay: 100,
      average_deductible: 0,
      average_oop_max: 2000,
    },
    // Molina Healthcare
    {
      name: 'Molina Marketplace Silver',
      carrier: 'Molina',
      plan_type: 'ACA Silver',
      tier1_copay: 15,
      tier2_copay: 45,
      tier3_copay: 80,
      tier4_copay: 200,
      average_deductible: 4500,
      average_oop_max: 9100,
    },
    {
      name: 'Molina Medicaid',
      carrier: 'Molina',
      plan_type: 'Medicaid',
      tier1_copay: 0,
      tier2_copay: 2,
      tier3_copay: 5,
      tier4_copay: 20,
      average_deductible: 0,
      average_oop_max: 0,
    },
    // Oscar Health
    {
      name: 'Oscar Simple Gold',
      carrier: 'Oscar',
      plan_type: 'ACA Gold',
      tier1_copay: 10,
      tier2_copay: 35,
      tier3_copay: 65,
      tier4_copay: 150,
      average_deductible: 2000,
      average_oop_max: 9100,
    },
    // TRICARE (Military)
    {
      name: 'TRICARE Prime',
      carrier: 'TRICARE',
      plan_type: 'Military',
      tier1_copay: 0,
      tier2_copay: 0,
      tier3_copay: 0,
      tier4_copay: 0,
      average_deductible: 0,
      average_oop_max: 0,
    },
    {
      name: 'TRICARE Select',
      carrier: 'TRICARE',
      plan_type: 'Military',
      tier1_copay: 13,
      tier2_copay: 33,
      tier3_copay: 60,
      tier4_copay: 60,
      average_deductible: 350,
      average_oop_max: 3500,
    },
    // VA (Veterans Affairs)
    {
      name: 'VA Health Benefits',
      carrier: 'VA',
      plan_type: 'Veterans',
      tier1_copay: 0,
      tier2_copay: 0,
      tier3_copay: 0,
      tier4_copay: 0,
      average_deductible: 0,
      average_oop_max: 0,
    },
    // Medicaid
    {
      name: 'Medicaid Standard',
      carrier: 'Medicaid',
      plan_type: 'Medicaid',
      tier1_copay: 1,
      tier2_copay: 3,
      tier3_copay: 8,
      tier4_copay: 25,
      average_deductible: 0,
      average_oop_max: 0,
    },
    {
      name: 'Medicaid Managed Care',
      carrier: 'Medicaid',
      plan_type: 'Medicaid MCO',
      tier1_copay: 0,
      tier2_copay: 2,
      tier3_copay: 5,
      tier4_copay: 20,
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
