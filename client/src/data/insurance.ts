export interface InsurancePlan {
  id: string;
  carrier: string;
  planName: string;
  planType: string;
  tier1Copay: number;
  tier2Copay: number;
  tier3Copay: number;
  tier4Copay: number;
  deductible: number;
}

export const insurancePlans: InsurancePlan[] = [
  // New insurance plans with matching IDs from insurancePlans.ts
  {
    id: "medicare_part_d",
    carrier: "Medicare",
    planName: "Part D Standard",
    planType: "Medicare Part D",
    tier1Copay: 5,
    tier2Copay: 15,
    tier3Copay: 60,
    tier4Copay: 120,
    deductible: 545
  },
  {
    id: "blue_cross_ppo",
    carrier: "Blue Cross Blue Shield",
    planName: "Blue Shield PPO",
    planType: "PPO",
    tier1Copay: 15,
    tier2Copay: 45,
    tier3Copay: 80,
    tier4Copay: 150,
    deductible: 1000
  },
  {
    id: "blue_cross_hmo",
    carrier: "Blue Cross Blue Shield",
    planName: "Blue Advantage HMO",
    planType: "HMO",
    tier1Copay: 10,
    tier2Copay: 30,
    tier3Copay: 60,
    tier4Copay: 100,
    deductible: 500
  },
  {
    id: "united_healthcare",
    carrier: "UnitedHealthcare",
    planName: "Choice Plus PPO",
    planType: "PPO",
    tier1Copay: 15,
    tier2Copay: 35,
    tier3Copay: 70,
    tier4Copay: 150,
    deductible: 1000
  },
  {
    id: "aetna",
    carrier: "Aetna",
    planName: "Open Access HMO",
    planType: "HMO",
    tier1Copay: 10,
    tier2Copay: 25,
    tier3Copay: 50,
    tier4Copay: 120,
    deductible: 750
  },
  {
    id: "cigna",
    carrier: "Cigna",
    planName: "LocalPlus",
    planType: "HMO",
    tier1Copay: 12,
    tier2Copay: 40,
    tier3Copay: 80,
    tier4Copay: 200,
    deductible: 1500
  },
  {
    id: "humana",
    carrier: "Humana",
    planName: "Gold Plus HMO",
    planType: "HMO",
    tier1Copay: 5,
    tier2Copay: 20,
    tier3Copay: 45,
    tier4Copay: 90,
    deductible: 250
  },
  {
    id: "medicaid",
    carrier: "Medicaid",
    planName: "State Medicaid",
    planType: "Medicaid",
    tier1Copay: 0,
    tier2Copay: 3,
    tier3Copay: 8,
    tier4Copay: 15,
    deductible: 0
  },
  {
    id: "no_insurance",
    carrier: "No Insurance",
    planName: "Cash Payment",
    planType: "Cash",
    tier1Copay: 0,
    tier2Copay: 0,
    tier3Copay: 0,
    tier4Copay: 0,
    deductible: 0
  },
  // Keep old IDs for backward compatibility
  {
    id: "ins-1",
    carrier: "Blue Cross Blue Shield",
    planName: "Blue Advantage HMO",
    planType: "HMO",
    tier1Copay: 10,
    tier2Copay: 30,
    tier3Copay: 60,
    tier4Copay: 100,
    deductible: 500
  },
  {
    id: "ins-2",
    carrier: "UnitedHealthcare",
    planName: "Choice Plus PPO",
    planType: "PPO",
    tier1Copay: 15,
    tier2Copay: 35,
    tier3Copay: 70,
    tier4Copay: 150,
    deductible: 1000
  },
  {
    id: "ins-3",
    carrier: "Aetna",
    planName: "Open Access HMO",
    planType: "HMO",
    tier1Copay: 10,
    tier2Copay: 25,
    tier3Copay: 50,
    tier4Copay: 120,
    deductible: 750
  },
  {
    id: "ins-4",
    carrier: "Cigna",
    planName: "LocalPlus",
    planType: "HMO",
    tier1Copay: 12,
    tier2Copay: 40,
    tier3Copay: 80,
    tier4Copay: 200,
    deductible: 1500
  },
  {
    id: "ins-5",
    carrier: "Humana",
    planName: "Gold Plus HMO",
    planType: "HMO",
    tier1Copay: 5,
    tier2Copay: 20,
    tier3Copay: 45,
    tier4Copay: 90,
    deductible: 250
  },
  {
    id: "ins-6",
    carrier: "Kaiser Permanente",
    planName: "Silver HMO",
    planType: "HMO",
    tier1Copay: 10,
    tier2Copay: 30,
    tier3Copay: 60,
    tier4Copay: 100,
    deductible: 500
  },
  {
    id: "ins-7",
    carrier: "Medicare",
    planName: "Part D Standard",
    planType: "Medicare Part D",
    tier1Copay: 0,
    tier2Copay: 10,
    tier3Copay: 47,
    tier4Copay: 100,
    deductible: 545
  }
];

export const insuranceCarriers = [
  "Blue Cross Blue Shield",
  "UnitedHealthcare",
  "Aetna",
  "Cigna",
  "Humana",
  "Kaiser Permanente",
  "Medicare",
  "Medicaid",
  "Other"
];
