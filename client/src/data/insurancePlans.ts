// Insurance plan types and copay structures

export type InsurancePlanType = 
  | 'medicare_part_d'
  | 'blue_cross_ppo'
  | 'blue_cross_hmo'
  | 'united_healthcare'
  | 'aetna'
  | 'cigna'
  | 'humana'
  | 'medicaid'
  | 'no_insurance';

export type DrugTier = 1 | 2 | 3 | 4 | 5;

export interface CopayRange {
  min: number;
  max: number;
  description: string;
}

export interface InsurancePlan {
  id: InsurancePlanType;
  name: string;
  displayName: string;
  copayStructure: Record<DrugTier, CopayRange>;
  preferredPharmacies?: string[];
}

export const INSURANCE_PLANS: Record<InsurancePlanType, InsurancePlan> = {
  medicare_part_d: {
    id: 'medicare_part_d',
    name: 'Medicare Part D',
    displayName: 'Medicare Part D',
    copayStructure: {
      1: { min: 0, max: 10, description: 'Generic' },
      2: { min: 10, max: 25, description: 'Preferred Generic' },
      3: { min: 35, max: 95, description: 'Preferred Brand' },
      4: { min: 95, max: 150, description: 'Non-Preferred' },
      5: { min: 200, max: 500, description: 'Specialty (25-33% coinsurance)' },
    },
    preferredPharmacies: ['Walmart', 'Walgreens'],
  },
  blue_cross_ppo: {
    id: 'blue_cross_ppo',
    name: 'Blue Cross PPO',
    displayName: 'Blue Cross Blue Shield PPO',
    copayStructure: {
      1: { min: 10, max: 20, description: 'Generic' },
      2: { min: 30, max: 60, description: 'Preferred Brand' },
      3: { min: 60, max: 100, description: 'Non-Preferred Brand' },
      4: { min: 100, max: 200, description: 'Specialty' },
      5: { min: 200, max: 400, description: 'High-Cost Specialty' },
    },
    preferredPharmacies: ['CVS', 'Walgreens'],
  },
  blue_cross_hmo: {
    id: 'blue_cross_hmo',
    name: 'Blue Cross HMO',
    displayName: 'Blue Cross Blue Shield HMO',
    copayStructure: {
      1: { min: 5, max: 15, description: 'Generic' },
      2: { min: 25, max: 50, description: 'Preferred Brand' },
      3: { min: 50, max: 90, description: 'Non-Preferred Brand' },
      4: { min: 90, max: 180, description: 'Specialty' },
      5: { min: 180, max: 350, description: 'High-Cost Specialty' },
    },
    preferredPharmacies: ['CVS'],
  },
  united_healthcare: {
    id: 'united_healthcare',
    name: 'UnitedHealthcare',
    displayName: 'UnitedHealthcare',
    copayStructure: {
      1: { min: 10, max: 25, description: 'Generic' },
      2: { min: 35, max: 65, description: 'Preferred Brand' },
      3: { min: 65, max: 110, description: 'Non-Preferred Brand' },
      4: { min: 110, max: 220, description: 'Specialty' },
      5: { min: 220, max: 450, description: 'High-Cost Specialty' },
    },
    preferredPharmacies: ['Optum', 'Walgreens'],
  },
  aetna: {
    id: 'aetna',
    name: 'Aetna',
    displayName: 'Aetna',
    copayStructure: {
      1: { min: 10, max: 20, description: 'Generic' },
      2: { min: 30, max: 60, description: 'Preferred Brand' },
      3: { min: 60, max: 100, description: 'Non-Preferred Brand' },
      4: { min: 100, max: 200, description: 'Specialty' },
      5: { min: 200, max: 400, description: 'High-Cost Specialty' },
    },
    preferredPharmacies: ['CVS'],
  },
  cigna: {
    id: 'cigna',
    name: 'Cigna',
    displayName: 'Cigna',
    copayStructure: {
      1: { min: 10, max: 25, description: 'Generic' },
      2: { min: 35, max: 70, description: 'Preferred Brand' },
      3: { min: 70, max: 120, description: 'Non-Preferred Brand' },
      4: { min: 120, max: 240, description: 'Specialty' },
      5: { min: 240, max: 500, description: 'High-Cost Specialty' },
    },
  },
  humana: {
    id: 'humana',
    name: 'Humana',
    displayName: 'Humana',
    copayStructure: {
      1: { min: 0, max: 15, description: 'Generic' },
      2: { min: 15, max: 47, description: 'Preferred Brand' },
      3: { min: 47, max: 100, description: 'Non-Preferred Brand' },
      4: { min: 100, max: 200, description: 'Specialty' },
      5: { min: 200, max: 450, description: 'High-Cost Specialty' },
    },
    preferredPharmacies: ['Walmart', 'Walgreens'],
  },
  medicaid: {
    id: 'medicaid',
    name: 'Medicaid',
    displayName: 'Medicaid',
    copayStructure: {
      1: { min: 0, max: 4, description: 'Generic' },
      2: { min: 0, max: 8, description: 'Preferred Brand' },
      3: { min: 3, max: 8, description: 'Non-Preferred Brand' },
      4: { min: 8, max: 15, description: 'Specialty' },
      5: { min: 15, max: 30, description: 'High-Cost Specialty' },
    },
  },
  no_insurance: {
    id: 'no_insurance',
    name: 'No Insurance',
    displayName: 'No Insurance (Cash Price)',
    copayStructure: {
      1: { min: 0, max: 0, description: 'Full Cash Price' },
      2: { min: 0, max: 0, description: 'Full Cash Price' },
      3: { min: 0, max: 0, description: 'Full Cash Price' },
      4: { min: 0, max: 0, description: 'Full Cash Price' },
      5: { min: 0, max: 0, description: 'Full Cash Price' },
    },
  },
};

export const INSURANCE_PLAN_OPTIONS = Object.values(INSURANCE_PLANS).map(plan => ({
  value: plan.id,
  label: plan.displayName,
}));
