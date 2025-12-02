// Two-tier insurance selection: Carriers → Plans

import { type InsurancePlanType } from './insurancePlans';

export interface InsuranceCarrier {
  id: string;
  name: string;
  logo?: string;
  plans: {
    id: InsurancePlanType;
    name: string;
    description?: string;
  }[];
}

export const INSURANCE_CARRIERS: InsuranceCarrier[] = [
  {
    id: 'medicare',
    name: 'Medicare',
    plans: [
      {
        id: 'medicare_part_d',
        name: 'Medicare Part D',
        description: 'Prescription drug coverage for Medicare beneficiaries',
      },
    ],
  },
  {
    id: 'bcbs',
    name: 'Blue Cross Blue Shield',
    plans: [
      {
        id: 'blue_cross_ppo',
        name: 'PPO Plan',
        description: 'Preferred Provider Organization - More flexibility',
      },
      {
        id: 'blue_cross_hmo',
        name: 'HMO Plan',
        description: 'Health Maintenance Organization - Lower costs',
      },
    ],
  },
  {
    id: 'unitedhealthcare',
    name: 'UnitedHealthcare',
    plans: [
      {
        id: 'united_healthcare',
        name: 'UnitedHealthcare Plan',
        description: 'Comprehensive coverage',
      },
    ],
  },
  {
    id: 'aetna',
    name: 'Aetna',
    plans: [
      {
        id: 'aetna',
        name: 'Aetna Plan',
        description: 'CVS Health insurance',
      },
    ],
  },
  {
    id: 'cigna',
    name: 'Cigna',
    plans: [
      {
        id: 'cigna',
        name: 'Cigna Plan',
        description: 'Global health service company',
      },
    ],
  },
  {
    id: 'humana',
    name: 'Humana',
    plans: [
      {
        id: 'humana',
        name: 'Humana Plan',
        description: 'Medicare Advantage and more',
      },
    ],
  },
  {
    id: 'medicaid',
    name: 'Medicaid',
    plans: [
      {
        id: 'medicaid',
        name: 'Medicaid',
        description: 'State and federal health coverage',
      },
    ],
  },
  {
    id: 'cash',
    name: 'No Insurance',
    plans: [
      {
        id: 'no_insurance',
        name: 'Cash Payment',
        description: 'Pay out of pocket without insurance',
      },
    ],
  },
];

// Helper function to get all plans from a carrier
export function getCarrierPlans(carrierId: string): InsurancePlanType[] {
  const carrier = INSURANCE_CARRIERS.find(c => c.id === carrierId);
  return carrier ? carrier.plans.map(p => p.id) : [];
}

// Helper function to find carrier by plan ID
export function getCarrierByPlanId(planId: InsurancePlanType): InsuranceCarrier | undefined {
  return INSURANCE_CARRIERS.find(carrier => 
    carrier.plans.some(plan => plan.id === planId)
  );
}
