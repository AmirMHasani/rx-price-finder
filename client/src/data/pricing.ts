import { medications } from "./medications";
import { pharmacies } from "./pharmacies";
import { insurancePlans } from "./insurance";
import { generatePharmaciesForZip } from "@/services/pharmacyGenerator";

export interface MedicationTier {
  medicationId: string;
  tier: 1 | 2 | 3 | 4;
}

export interface PharmacyPrice {
  pharmacyId: string;
  medicationId: string;
  dosage: string;
  form: string;
  quantity: number;
  cashPrice: number;
  basePrice: number; // Price before insurance
}

// Define which tier each medication falls into for insurance purposes
export const medicationTiers: MedicationTier[] = [
  { medicationId: "med-1", tier: 2 }, // Atorvastatin - preferred generic
  { medicationId: "med-2", tier: 1 }, // Levothyroxine - generic
  { medicationId: "med-3", tier: 1 }, // Amlodipine - generic
  { medicationId: "med-4", tier: 1 }, // Metformin - generic
  { medicationId: "med-5", tier: 2 }, // Sertraline - preferred generic
  { medicationId: "med-6", tier: 1 }, // Omeprazole - generic
  { medicationId: "med-7", tier: 2 }, // Albuterol - preferred brand
  { medicationId: "med-8", tier: 3 }, // Advair - non-preferred brand
  { medicationId: "med-9", tier: 3 }, // Xarelto - specialty
  { medicationId: "med-10", tier: 4 }, // Lyrica - specialty
];

// Generate realistic pharmacy pricing
// Different pharmacies have different base prices
export const pharmacyPrices: PharmacyPrice[] = [];

medications.forEach(med => {
  med.dosages.forEach(dosage => {
    med.forms.forEach(form => {
      pharmacies.forEach(pharmacy => {
        // Base price varies by pharmacy chain and medication
        let basePrice = 0;
        
        // Different chains have different pricing strategies
        const chainMultiplier: Record<string, number> = {
          "CVS": 1.15,
          "Walgreens": 1.12,
          "Rite Aid": 1.18,
          "Stop & Shop": 0.95,
          "Target": 0.98,
          "Walmart": 0.85,
          "Costco": 0.80
        };
        
        // Base medication costs (before pharmacy markup)
        const medBaseCosts: Record<string, number> = {
          "med-1": 25,
          "med-2": 15,
          "med-3": 12,
          "med-4": 18,
          "med-5": 30,
          "med-6": 20,
          "med-7": 55,
          "med-8": 280,
          "med-9": 450,
          "med-10": 380
        };
        
        const baseCost = medBaseCosts[med.id] || 50;
        const multiplier = chainMultiplier[pharmacy.chain] || 1.0;
        
        // Add some randomness for different dosages
        const dosageVariation = 1 + (Math.random() * 0.3 - 0.15);
        
        basePrice = Math.round(baseCost * multiplier * dosageVariation);
        
        // Cash price is typically higher than insurance negotiated price
        const cashPrice = Math.round(basePrice * 1.3);
        
        pharmacyPrices.push({
          pharmacyId: pharmacy.id,
          medicationId: med.id,
          dosage,
          form,
          quantity: 30, // Standard 30-day supply
          cashPrice,
          basePrice
        });
      });
    });
  });
});

export interface PriceResult {
  pharmacy: typeof pharmacies[0];
  medication: typeof medications[0];
  dosage: string;
  form: string;
  quantity: number;
  cashPrice: number;
  insurancePrice: number;
  copay: number;
  deductibleApplied: number;
  totalCost: number;
  savings: number;
  distance?: number; // miles from user location
  perPillPrice?: number; // Price per pill (before quantity multiplication)
}

export function calculateInsurancePrice(
  medicationId: string,
  dosage: string,
  form: string,
  pharmacy: typeof pharmacies[0],
  insuranceId: string,
  deductibleMet: boolean = false
): PriceResult | null {
  const medication = medications.find(m => m.id === medicationId);
  const insurance = insurancePlans.find(i => i.id === insuranceId);
  const tier = medicationTiers.find(t => t.medicationId === medicationId);
  
  if (!medication || !pharmacy || !insurance || !tier) {
    return null;
  }
  
  // Flexible form matching: check if the requested form contains the pricing form
  // e.g., "Delayed Release Oral Capsule" contains "Capsule"
  // For dynamically generated pharmacies, match by chain name instead of pharmacy ID
  const pharmacyChain = pharmacy.name.split(' ')[0]; // e.g., "CVS" from "CVS Pharmacy"
  
  const pricing = pharmacyPrices.find(
    p => {
      const pricingPharmacy = pharmacies.find(ph => ph.id === p.pharmacyId);
      const pricingChain = pricingPharmacy?.name.split(' ')[0];
      
      return p.medicationId === medicationId && 
             (p.pharmacyId === pharmacy.id || pricingChain === pharmacyChain) && 
             p.dosage === dosage && 
             (p.form === form || form.includes(p.form) || p.form.includes(form));
    }
  );

  if (!pricing) {
    return null;
  }

  // Determine copay based on tier
  let copay = 0;
  switch (tier.tier) {
    case 1:
      copay = insurance.tier1Copay;
      break;
    case 2:
      copay = insurance.tier2Copay;
      break;
    case 3:
      copay = insurance.tier3Copay;
      break;
    case 4:
      copay = insurance.tier4Copay;
      break;
  }

  // If deductible not met, patient pays more
  let deductibleApplied = 0;
  let insurancePrice = pricing.basePrice;
  
  if (!deductibleMet) {
    // Patient pays full negotiated price until deductible is met
    deductibleApplied = Math.min(insurance.deductible, pricing.basePrice);
    insurancePrice = pricing.basePrice;
  } else {
    // After deductible, patient pays copay
    insurancePrice = copay;
  }

  const totalCost = deductibleMet ? copay : pricing.basePrice;
  const savings = pricing.cashPrice - totalCost;

  return {
    pharmacy,
    medication,
    dosage,
    form,
    quantity: pricing.quantity,
    cashPrice: pricing.cashPrice,
    insurancePrice,
    copay,
    deductibleApplied,
    totalCost,
    savings,
  };
}

export function getAllPricesForMedication(
  medicationId: string,
  dosage: string,
  form: string,
  insuranceId: string,
  deductibleMet: boolean = false,
  userLat?: number,
  userLng?: number,
  userZip?: string
): PriceResult[] {
  const results: PriceResult[] = [];

  // Use dynamic pharmacy generation if ZIP code is provided
  const pharmacyList = userZip ? generatePharmaciesForZip(userZip) : pharmacies;

  pharmacyList.forEach(pharmacy => {
    const result = calculateInsurancePrice(
      medicationId,
      dosage,
      form,
      pharmacy,
      insuranceId,
      deductibleMet
    );

    if (result) {
      // Calculate distance if user location provided
      if (userLat !== undefined && userLng !== undefined) {
        result.distance = calculateDistance(
          userLat,
          userLng,
          pharmacy.lat,
          pharmacy.lng
        );
      }
      results.push(result);
    }
  });

  // Sort by total cost (cheapest first)
  return results.sort((a, b) => a.totalCost - b.totalCost);
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
