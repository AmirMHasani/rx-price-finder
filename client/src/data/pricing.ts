import { medications } from "./medications";
import { pharmacies } from "./pharmacies";
import { insurancePlans } from "./insurance";
import { getCouponPrice } from "../services/couponService";

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
  { medicationId: "med-11", tier: 1 }, // Lisinopril - generic
  { medicationId: "med-12", tier: 2 }, // Rosuvastatin - preferred generic
  { medicationId: "med-13", tier: 1 }, // Esomeprazole - generic
  { medicationId: "med-14", tier: 2 }, // Clopidogrel - preferred generic
  { medicationId: "med-15", tier: 2 }, // Montelukast - preferred generic
  { medicationId: "med-16", tier: 1 }, // Valsartan - generic
  { medicationId: "med-17", tier: 4 }, // Insulin Glargine - specialty
  { medicationId: "med-18", tier: 1 }, // Losartan - generic
  { medicationId: "med-19", tier: 1 }, // Gabapentin - generic
  { medicationId: "med-20", tier: 2 }, // Fluoxetine - preferred generic
  { medicationId: "med-21", tier: 1 }, // Simvastatin - generic
  { medicationId: "med-22", tier: 1 }, // Metoprolol - generic
  { medicationId: "med-23", tier: 1 }, // Hydrochlorothiazide - generic
  { medicationId: "med-24", tier: 2 }, // Escitalopram - preferred generic
  { medicationId: "med-25", tier: 3 }, // Duloxetine - non-preferred brand
  { medicationId: "med-26", tier: 3 }, // Celecoxib - non-preferred brand
  { medicationId: "med-27", tier: 1 }, // Cetirizine - generic
  { medicationId: "med-28", tier: 1 }, // Amoxicillin - generic
  { medicationId: "med-29", tier: 1 }, // Azithromycin - generic
  { medicationId: "med-30", tier: 2 }, // Zolpidem - preferred generic
  { medicationId: "med-31", tier: 1 }, // Albuterol Sulfate - generic
  { medicationId: "med-32", tier: 1 }, // Warfarin - generic
  { medicationId: "med-33", tier: 3 }, // Apixaban - specialty
  { medicationId: "med-34", tier: 3 }, // Sitagliptin - non-preferred brand
  { medicationId: "med-35", tier: 3 }, // Tiotropium - non-preferred brand
  { medicationId: "med-36", tier: 2 }, // Sildenafil - preferred generic
  { medicationId: "med-37", tier: 3 }, // Tadalafil - non-preferred brand
  { medicationId: "med-38", tier: 4 }, // Aripiprazole - specialty
  { medicationId: "med-39", tier: 3 }, // Quetiapine - non-preferred brand
  { medicationId: "med-40", tier: 2 }, // Ezetimibe - preferred generic
  { medicationId: "med-41", tier: 2 }, // Olmesartan - preferred generic
  { medicationId: "med-42", tier: 1 }, // Tamsulosin - generic
  { medicationId: "med-43", tier: 4 }, // Pregabalin - specialty
  { medicationId: "med-44", tier: 2 }, // Fenofibrate - preferred generic
  { medicationId: "med-45", tier: 2 }, // Pioglitazone - preferred generic
  { medicationId: "med-46", tier: 1 }, // Phenytoin - generic
  { medicationId: "med-47", tier: 1 }, // Furosemide - generic
  { medicationId: "med-48", tier: 3 }, // Conjugated Estrogens - non-preferred brand
  { medicationId: "med-49", tier: 2 }, // Venlafaxine - preferred generic
  { medicationId: "med-50", tier: 2 }, // Bupropion - preferred generic
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
        // Based on real-world pharmacy markup data (Cost Plus baseline ~$5-6)
        const chainMultiplier: Record<string, number> = {
          "CVS": 5.5,        // CVS typically charges $30-35 for generics
          "Walgreens": 5.0,  // Walgreens ~$25-30
          "Rite Aid": 4.8,   // Rite Aid ~$24-29
          "Stop & Shop": 3.5, // Grocery pharmacies ~$18-21
          "Target": 3.2,     // Target ~$16-19
          "Walmart": 2.8,    // Walmart $4 generics program ~$14-17
          "Costco": 2.2      // Costco lowest markup ~$11-13
        };
        
        // Base medication costs (Cost Plus Drugs baseline for 30-day supply)
        // Updated with real Cost Plus API prices (Dec 2025)
        const medBaseCosts: Record<string, number> = {
          "med-1": 5.46,  // Atorvastatin 20mg
          "med-2": 5.91,  // Levothyroxine 50mcg
          "med-3": 5.20,  // Amlodipine 5mg
          "med-4": 5.32,  // Metformin 500mg
          "med-5": 5.69,  // Sertraline 50mg
          "med-6": 6.50,  // Omeprazole 20mg (estimated)
          "med-7": 18.00, // Albuterol inhaler (brand)
          "med-8": 280,   // Advair (brand, specialty)
          "med-9": 450,   // Xarelto (brand, specialty)
          "med-10": 380,  // Lyrica (brand, specialty)
          "med-11": 5.39, // Lisinopril 10mg
          "med-12": 5.67, // Rosuvastatin 10mg
          "med-13": 6.80, // Esomeprazole (estimated)
          "med-14": 7.50, // Clopidogrel (estimated)
          "med-15": 8.00, // Montelukast (estimated)
          "med-16": 5.80, // Valsartan (estimated)
          "med-17": 320,  // Insulin Glargine (specialty)
          "med-18": 5.74, // Losartan 50mg
          "med-19": 6.20, // Gabapentin (estimated)
          "med-20": 5.90, // Fluoxetine (estimated)
          "med-21": 5.56, // Simvastatin 20mg
          "med-22": 5.40, // Metoprolol (estimated)
          "med-23": 5.10, // Hydrochlorothiazide (estimated)
          "med-24": 6.50, // Escitalopram (estimated)
          "med-25": 65,   // Duloxetine (brand)
          "med-26": 75,   // Celecoxib (brand)
          "med-27": 5.30, // Cetirizine (estimated)
          "med-28": 5.50, // Amoxicillin (estimated)
          "med-29": 6.00, // Azithromycin (estimated)
          "med-30": 6.50, // Zolpidem (estimated)
          "med-31": 5.80, // Albuterol Sulfate (estimated)
          "med-32": 5.60, // Warfarin (estimated)
          "med-33": 480,  // Apixaban (specialty)
          "med-34": 420,  // Sitagliptin (brand)
          "med-35": 380,  // Tiotropium (brand)
          "med-36": 12.00, // Sildenafil (estimated)
          "med-37": 15.00, // Tadalafil (estimated)
          "med-38": 520,  // Aripiprazole (specialty)
          "med-39": 180,  // Quetiapine (brand)
          "med-40": 8.50, // Ezetimibe (estimated)
          "med-41": 7.00, // Olmesartan (estimated)
          "med-42": 6.20, // Tamsulosin (estimated)
          "med-43": 380,  // Pregabalin (specialty)
          "med-44": 8.00, // Fenofibrate (estimated)
          "med-45": 7.50, // Pioglitazone (estimated)
          "med-46": 6.00, // Phenytoin (estimated)
          "med-47": 5.20, // Furosemide (estimated)
          "med-48": 85,   // Conjugated Estrogens (brand)
          "med-49": 9.00, // Venlafaxine (estimated)
          "med-50": 7.50  // Bupropion (estimated)
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
  couponPrice?: number; // Price with coupon
  couponProvider?: string; // e.g., "GoodRx", "SingleCare"
  couponSavings?: number; // Savings vs cash price
  bestPrice?: number; // Lower of insurance or coupon price
  bestOption?: "insurance" | "coupon"; // Which is cheaper
}

export function calculateInsurancePrice(
  medicationId: string,
  dosage: string,
  form: string,
  pharmacy: { id: string; chain: string; name: string; address: string; city: string; state: string; zip: string; phone: string; lat: number; lng: number; hours: string; hasDelivery: boolean; hasDriveThru: boolean },
  insuranceId: string,
  deductibleMet: boolean = false
): PriceResult | null {
  const medication = medications.find(m => m.id === medicationId);
  const insurance = insurancePlans.find(i => i.id === insuranceId);
  const tier = medicationTiers.find(t => t.medicationId === medicationId);
  
  if (!medication || !pharmacy || !insurance || !tier) {
    return null;
  }
  
  // Calculate price based on pharmacy chain (not specific pharmacy ID)
  // This allows dynamic pharmacies to work with pricing data
  const chainMultiplier: Record<string, number> = {
    "CVS": 1.15,
    "Walgreens": 1.12,
    "Rite Aid": 1.18,
    "Stop & Shop": 0.95,
    "Target": 0.98,
    "Walmart": 0.85,
    "Costco": 0.80
  };
  
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
  
  const baseCost = medBaseCosts[medicationId] || 50;
  const multiplier = chainMultiplier[pharmacy.chain] || 1.0;
  
  // Add some variation for different dosages
  const dosageVariation = 1 + (Math.random() * 0.3 - 0.15);
  
  const basePrice = Math.round(baseCost * multiplier * dosageVariation);
  const cashPrice = Math.round(basePrice * 1.3);
  
  const pricing = {
    pharmacyId: pharmacy.id,
    medicationId,
    dosage,
    form,
    quantity: 30,
    cashPrice,
    basePrice
  };

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
  dynamicPharmacies?: Array<{ id: string; chain: string; name: string; address: string; city: string; state: string; zip: string; phone: string; lat: number; lng: number; hours: string; hasDelivery: boolean; hasDriveThru: boolean }>
): PriceResult[] {
  const results: PriceResult[] = [];
  
  // Use dynamic pharmacies if provided, otherwise use default hardcoded pharmacies
  const pharmaciesToUse = dynamicPharmacies || pharmacies;

  pharmaciesToUse.forEach(pharmacy => {
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
      
      // Add coupon pricing
      const pharmacyChain = pharmacy.name.split(" ")[0]; // Extract chain name (e.g., "CVS" from "CVS Pharmacy #123")
      const coupon = getCouponPrice(medicationId, pharmacyChain, result.cashPrice);
      
      if (coupon) {
        result.couponPrice = coupon.price;
        result.couponProvider = coupon.provider;
        result.couponSavings = coupon.savings;
        result.bestPrice = Math.min(result.insurancePrice, coupon.price);
        result.bestOption = coupon.price < result.insurancePrice ? "coupon" : "insurance";
      } else {
        result.bestPrice = result.insurancePrice;
        result.bestOption = "insurance";
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
