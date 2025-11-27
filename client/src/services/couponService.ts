/**
 * Coupon Service
 * 
 * Generates mock coupon data for medications at different pharmacies.
 * In production, this would integrate with GoodRx, SingleCare, or similar APIs.
 */

export interface Coupon {
  provider: string; // e.g., "GoodRx", "SingleCare", "RxSaver"
  price: number;
  savings: number; // vs cash price
  url: string; // Link to get the coupon
}

/**
 * Generate mock coupon data for a medication at a pharmacy
 */
export function getCouponPrice(
  medicationId: string,
  pharmacyChain: string,
  cashPrice: number
): Coupon | null {
  // Simulate coupon availability (80% of medications have coupons)
  if (Math.random() > 0.8) {
    return null;
  }

  // Coupon providers with different discount strategies
  const providers = [
    { name: "GoodRx", discountRange: [0.30, 0.60] }, // 30-60% off
    { name: "SingleCare", discountRange: [0.25, 0.55] }, // 25-55% off
    { name: "RxSaver", discountRange: [0.20, 0.50] }, // 20-50% off
  ];

  // Select a random provider
  const provider = providers[Math.floor(Math.random() * providers.length)];

  // Calculate discount (varies by pharmacy chain)
  const chainMultiplier = {
    "CVS": 0.9,
    "Walgreens": 0.95,
    "Walmart": 1.1, // Walmart already has low prices, so coupons save less
    "Rite Aid": 0.85,
    "Costco": 1.2, // Costco has lowest prices, coupons save even less
    "Target": 1.0,
    "Stop & Shop": 0.9,
  }[pharmacyChain] || 1.0;

  const discountPercent =
    provider.discountRange[0] +
    Math.random() * (provider.discountRange[1] - provider.discountRange[0]);

  const adjustedDiscount = discountPercent * chainMultiplier;
  const couponPrice = Math.max(cashPrice * (1 - adjustedDiscount), 5); // Min $5
  const savings = cashPrice - couponPrice;

  return {
    provider: provider.name,
    price: Math.round(couponPrice * 100) / 100,
    savings: Math.round(savings * 100) / 100,
    url: `https://${provider.name.toLowerCase()}.com`, // Mock URL
  };
}

/**
 * Check if coupon is better than insurance
 */
export function isCouponBetterThanInsurance(
  couponPrice: number,
  insurancePrice: number
): boolean {
  return couponPrice < insurancePrice;
}
