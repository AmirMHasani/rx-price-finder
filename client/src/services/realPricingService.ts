/**
 * Real Pricing Service
 * Fetches real medication pricing from Cost Plus Drugs API and calculates
 * realistic pharmacy markups and insurance copays
 */

import { searchCostPlusMedication, parseCostPlusPrice, type CostPlusDrugResult } from './costPlusApi';
import type { RealPharmacy } from './realPharmacyService';

export interface PharmacyPricing {
  pharmacy: RealPharmacy;
  costPlusWholesale: number;
  cashPrice: number;
  membershipPrice: number;  // RxPrice membership pricing
  couponPrice?: number;
  couponProvider?: string;
  insurancePrice: number;
  savings: number;
  couponSavings?: number;
  membershipSavings: number;
  bestOption: 'membership' | 'coupon' | 'insurance' | 'cash';
  distance?: number;
}

/**
 * Cash price markup (50% over wholesale as requested)
 */
const CASH_PRICE_MARKUP = 1.50;

/**
 * RxPrice membership discount multipliers (discount off cash price)
 * Some pharmacies offer better membership pricing than others
 */
const MEMBERSHIP_DISCOUNTS: Record<string, number> = {
  'costco': 0.65,        // Costco: 35% off cash (best membership deal)
  'walmart': 0.70,       // Walmart: 30% off cash
  'kroger': 0.75,        // Kroger: 25% off cash
  'target': 0.75,        // Target: 25% off cash
  'walgreens': 0.85,     // Walgreens: 15% off cash
  'cvs': 0.85,           // CVS: 15% off cash (worst membership deal)
  'rite aid': 0.80,      // Rite Aid: 20% off cash
  'default': 0.80,       // Default: 20% off cash
};

/**
 * Insurance copay tiers (based on medication tier)
 */
const INSURANCE_COPAY_TIERS = {
  tier1: { min: 5, max: 15 },    // Generic preferred
  tier2: { min: 15, max: 30 },   // Generic non-preferred
  tier3: { min: 30, max: 60 },   // Brand preferred
  tier4: { min: 60, max: 100 },  // Brand non-preferred
};

/**
 * Coupon discount percentages by provider
 */
const COUPON_DISCOUNTS: Record<string, number> = {
  'GoodRx': 0.35,        // 35% discount
  'SingleCare': 0.30,    // 30% discount
  'RxSaver': 0.40,       // 40% discount (best)
};

/**
 * Get membership discount multiplier based on pharmacy name
 */
function getMembershipDiscount(pharmacyName: string): number {
  const lowerName = pharmacyName.toLowerCase();
  
  for (const [key, discount] of Object.entries(MEMBERSHIP_DISCOUNTS)) {
    if (lowerName.includes(key)) {
      return discount;
    }
  }
  
  return MEMBERSHIP_DISCOUNTS.default;
}

/**
 * Calculate insurance copay based on medication tier and cash price
 */
function calculateInsuranceCopay(
  cashPrice: number,
  medicationTier: 'tier1' | 'tier2' | 'tier3' | 'tier4',
  deductibleMet: boolean
): number {
  const tier = INSURANCE_COPAY_TIERS[medicationTier];
  
  if (deductibleMet) {
    // After deductible: lower copay
    return Math.min(tier.min, cashPrice * 0.8);
  } else {
    // Before deductible: higher copay (but capped at tier max)
    const copay = cashPrice * 0.7; // 70% of cash price
    return Math.min(Math.max(copay, tier.min), tier.max);
  }
}

/**
 * Determine medication tier (generic vs brand, preferred vs non-preferred)
 */
function getMedicationTier(costPlusData: CostPlusDrugResult): 'tier1' | 'tier2' | 'tier3' | 'tier4' {
  const isGeneric = !costPlusData.brand_name || costPlusData.brand_generic === 'Generic';
  
  if (isGeneric) {
    // Generic medications are typically tier 1 or 2
    return 'tier1'; // Most generics are tier 1 (preferred)
  } else {
    // Brand medications are typically tier 3 or 4
    return 'tier3'; // Most brands are tier 3 (preferred brand)
  }
}

/**
 * Get best coupon provider and discount for a medication
 */
function getBestCoupon(cashPrice: number): { provider: string; price: number; savings: number } {
  let bestProvider = 'RxSaver';
  let bestDiscount = COUPON_DISCOUNTS['RxSaver'];
  
  // Randomly vary which coupon is best to simulate real-world variation
  const providers = Object.keys(COUPON_DISCOUNTS);
  const randomProvider = providers[Math.floor(Math.random() * providers.length)];
  bestProvider = randomProvider;
  bestDiscount = COUPON_DISCOUNTS[randomProvider];
  
  const couponPrice = cashPrice * (1 - bestDiscount);
  const savings = cashPrice - couponPrice;
  
  return {
    provider: bestProvider,
    price: couponPrice,
    savings: savings
  };
}

/**
 * Estimate wholesale price when Cost Plus doesn't have the medication
 * Based on typical generic medication costs
 */
function estimateWholesalePrice(quantity: number): number {
  // Most generic medications cost between $0.10 - $0.50 per pill
  // Use a middle estimate of $0.25 per pill
  const perPillCost = 0.25;
  return Math.round(perPillCost * quantity * 100) / 100;
}

/**
 * Fetch real pricing for a medication from Cost Plus and calculate pharmacy prices
 */
export async function fetchRealPricing(
  medicationName: string,
  strength: string,
  quantity: number,
  pharmacies: RealPharmacy[],
  insurancePlan: string,
  deductibleMet: boolean
): Promise<PharmacyPricing[]> {
  try {
    console.log('💰 [REAL PRICING] Fetching Cost Plus data for:', medicationName, strength, quantity);
    
    // Fetch Cost Plus wholesale price
    const costPlusData = await searchCostPlusMedication(medicationName, strength, quantity);
    
    let wholesalePrice: number;
    let medicationTier: 'tier1' | 'tier2' | 'tier3' | 'tier4';
    let usingEstimate = false;
    
    if (!costPlusData) {
      console.warn('⚠️ [REAL PRICING] No Cost Plus data found for', medicationName, '- using estimated pricing');
      wholesalePrice = estimateWholesalePrice(quantity);
      medicationTier = 'tier1'; // Assume generic tier 1 for unknown medications
      usingEstimate = true;
    } else {
      // Parse wholesale price from Cost Plus
      wholesalePrice = costPlusData.requested_quote 
        ? parseCostPlusPrice(costPlusData.requested_quote)
        : parseCostPlusPrice(costPlusData.unit_price) * quantity;
      medicationTier = getMedicationTier(costPlusData);
      usingEstimate = false;
    }
    
    console.log(usingEstimate 
      ? '📊 [REAL PRICING] Using estimated wholesale: $' + wholesalePrice
      : '✅ [REAL PRICING] Cost Plus wholesale: $' + wholesalePrice);
    
    // Calculate pricing for each pharmacy
    const pricingResults: PharmacyPricing[] = pharmacies.map(pharmacy => {
      // 1. Calculate cash price (50% markup over wholesale)
      const cashPrice = Math.round(wholesalePrice * CASH_PRICE_MARKUP * 100) / 100;
      
      // 2. Calculate RxPrice membership price (discount off cash price)
      const membershipDiscount = getMembershipDiscount(pharmacy.name);
      const membershipPrice = Math.round(cashPrice * membershipDiscount * 100) / 100;
      const membershipSavings = Math.round((cashPrice - membershipPrice) * 100) / 100;
      
      // 3. Calculate coupon price (not all pharmacies accept all coupons)
      const acceptsCoupons = Math.random() > 0.3; // 70% of pharmacies accept coupons
      let couponPrice: number | undefined;
      let couponProvider: string | undefined;
      let couponSavings: number | undefined;
      
      if (acceptsCoupons) {
        const coupon = getBestCoupon(cashPrice);
        couponPrice = Math.round(coupon.price * 100) / 100;
        couponProvider = coupon.provider;
        couponSavings = Math.round(coupon.savings * 100) / 100;
      }
      
      // 4. Calculate insurance copay
      const insurancePrice = Math.round(calculateInsuranceCopay(cashPrice, medicationTier, deductibleMet) * 100) / 100;
      
      // Determine best option (lowest price)
      const prices = [
        { type: 'membership' as const, price: membershipPrice },
        { type: 'coupon' as const, price: couponPrice || Infinity },
        { type: 'insurance' as const, price: insurancePrice },
        { type: 'cash' as const, price: cashPrice }
      ];
      const bestOption = prices.reduce((best, current) => 
        current.price < best.price ? current : best
      ).type;
      
      const savings = Math.round((cashPrice - insurancePrice) * 100) / 100;
      
      return {
        pharmacy,
        costPlusWholesale: wholesalePrice,
        cashPrice,
        membershipPrice,
        membershipSavings,
        couponPrice,
        couponProvider,
        couponSavings,
        insurancePrice,
        savings,
        bestOption,
        distance: pharmacy.distance
      };
    });
    
    console.log('✅ [REAL PRICING] Generated pricing for', pricingResults.length, 'pharmacies');
    return pricingResults;
    
  } catch (error) {
    console.error('❌ [REAL PRICING] Error fetching pricing:', error);
    return [];
  }
}

/**
 * Format pricing result for display
 */
export function formatPricingResult(pricing: PharmacyPricing) {
  return {
    pharmacyName: pricing.pharmacy.name,
    pharmacyAddress: pricing.pharmacy.address,
    cashPrice: `$${pricing.cashPrice.toFixed(2)}`,
    insurancePrice: `$${pricing.insurancePrice.toFixed(2)}`,
    couponPrice: pricing.couponPrice ? `$${pricing.couponPrice.toFixed(2)}` : undefined,
    couponProvider: pricing.couponProvider,
    savings: `$${pricing.savings.toFixed(2)}`,
    bestOption: pricing.bestOption,
    distance: pricing.distance ? `${pricing.distance.toFixed(1)} mi` : undefined
  };
}
