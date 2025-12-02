// Copay estimation logic

import { INSURANCE_PLANS, InsurancePlanType, CopayRange } from '../data/insurancePlans';
import { getDrugTier, DrugClassification } from '../data/drugTiers';

export interface CopayEstimate {
  min: number;
  max: number;
  confidence: 'high' | 'medium' | 'low';
  tierDescription: string;
  isPreferredPharmacy: boolean;
  disclaimer: string;
}

/**
 * Estimate insurance copay for a medication at a specific pharmacy
 */
export function estimateCopay(
  medicationName: string,
  insurancePlanType: InsurancePlanType,
  pharmacyName: string,
  retailPrice?: number
): CopayEstimate {
  // Get insurance plan
  const plan = INSURANCE_PLANS[insurancePlanType];
  
  // Handle no insurance case
  if (insurancePlanType === 'no_insurance') {
    return {
      min: retailPrice || 0,
      max: retailPrice || 0,
      confidence: 'high',
      tierDescription: 'Cash Price',
      isPreferredPharmacy: false,
      disclaimer: 'Full retail price without insurance',
    };
  }
  
  // Get drug classification
  const drugClass = getDrugTier(medicationName);
  
  // Get base copay range for this tier
  const baseCopay = plan.copayStructure[drugClass.tier];
  
  // Check if this is a preferred pharmacy
  const isPreferredPharmacy = plan.preferredPharmacies?.some(
    preferred => pharmacyName.toLowerCase().includes(preferred.toLowerCase())
  ) || false;
  
  // Adjust copay for preferred pharmacy (5-15% discount)
  let adjustedMin = baseCopay.min;
  let adjustedMax = baseCopay.max;
  
  if (isPreferredPharmacy && baseCopay.min > 0) {
    adjustedMin = Math.max(0, Math.floor(baseCopay.min * 0.9));
    adjustedMax = Math.floor(baseCopay.max * 0.95);
  }
  
  // Determine confidence level
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  
  if (drugClass.isGeneric && drugClass.tier === 1) {
    confidence = 'high'; // Generic tier 1 drugs have predictable copays
  } else if (drugClass.isSpecialty || drugClass.tier >= 4) {
    confidence = 'low'; // Specialty drugs have variable copays
  }
  
  // Cap copay at retail price if provided
  if (retailPrice) {
    adjustedMin = Math.min(adjustedMin, retailPrice);
    adjustedMax = Math.min(adjustedMax, retailPrice);
  }
  
  return {
    min: adjustedMin,
    max: adjustedMax,
    confidence,
    tierDescription: baseCopay.description,
    isPreferredPharmacy,
    disclaimer: getDisclaimerText(drugClass, confidence),
  };
}

function getDisclaimerText(drugClass: DrugClassification, confidence: 'high' | 'medium' | 'low'): string {
  if (confidence === 'high') {
    return 'Estimate based on typical copay for this drug tier';
  } else if (confidence === 'low') {
    return 'Estimate may vary significantly. Contact your insurance for exact copay';
  } else {
    return 'Estimate based on typical plan structure. Actual copay may vary';
  }
}

/**
 * Calculate potential savings by switching to generic
 */
export function calculateGenericSavings(
  brandPrice: number,
  genericPrice: number,
  insurancePlanType: InsurancePlanType
): {
  brandCopay: CopayEstimate;
  genericCopay: CopayEstimate;
  savingsMin: number;
  savingsMax: number;
  savingsPercent: number;
} {
  // Estimate copays for brand and generic
  const brandCopay = estimateCopay('brand_drug', insurancePlanType, 'CVS', brandPrice);
  const genericCopay = estimateCopay('generic_drug', insurancePlanType, 'CVS', genericPrice);
  
  // Override with actual tier info
  brandCopay.tierDescription = 'Brand Name';
  genericCopay.tierDescription = 'Generic';
  
  const savingsMin = Math.max(0, brandCopay.min - genericCopay.max);
  const savingsMax = Math.max(0, brandCopay.max - genericCopay.min);
  const savingsPercent = brandCopay.max > 0 
    ? Math.round(((brandCopay.max - genericCopay.min) / brandCopay.max) * 100)
    : 0;
  
  return {
    brandCopay,
    genericCopay,
    savingsMin,
    savingsMax,
    savingsPercent,
  };
}

/**
 * Format copay estimate for display
 */
export function formatCopayEstimate(estimate: CopayEstimate): string {
  if (estimate.min === estimate.max) {
    return `$${estimate.min}`;
  }
  return `$${estimate.min}-${estimate.max}`;
}

/**
 * Get confidence badge color
 */
export function getConfidenceBadgeColor(confidence: 'high' | 'medium' | 'low'): string {
  switch (confidence) {
    case 'high':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-orange-100 text-orange-800';
  }
}
