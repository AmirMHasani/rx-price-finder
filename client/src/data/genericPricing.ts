/**
 * Accurate Generic Medication Pricing Database
 * Based on real-world wholesale and retail prices from Cost Plus Drugs, NADAC, and GoodRx
 * Prices are per unit (tablet/capsule) in USD
 */

export interface GenericMedicationPrice {
  genericName: string;
  strength: string;
  form: string;
  wholesalePricePerUnit: number; // Wholesale/acquisition cost per unit
  retailPricePerUnit: number; // Typical retail cash price per unit
  source: string; // Data source
}

/**
 * Common generic medications with accurate pricing
 * Prices updated based on 2024 market data
 */
export const GENERIC_MEDICATION_PRICES: GenericMedicationPrice[] = [
  // Diabetes - Metformin (very cheap generic)
  {
    genericName: 'metformin',
    strength: '500mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.04, // $0.04 per tablet
    retailPricePerUnit: 0.10, // $3 for 30 tablets
    source: 'Cost Plus Drugs / NADAC'
  },
  {
    genericName: 'metformin',
    strength: '850mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.05,
    retailPricePerUnit: 0.12,
    source: 'Cost Plus Drugs / NADAC'
  },
  {
    genericName: 'metformin',
    strength: '1000mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.06,
    retailPricePerUnit: 0.14,
    source: 'Cost Plus Drugs / NADAC'
  },
  
  // Cholesterol - Atorvastatin (Lipitor generic)
  {
    genericName: 'atorvastatin',
    strength: '10mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.08,
    retailPricePerUnit: 0.15,
    source: 'Cost Plus Drugs'
  },
  {
    genericName: 'atorvastatin',
    strength: '20mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.10,
    retailPricePerUnit: 0.18,
    source: 'Cost Plus Drugs'
  },
  {
    genericName: 'atorvastatin',
    strength: '40mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.12,
    retailPricePerUnit: 0.22,
    source: 'Cost Plus Drugs'
  },
  {
    genericName: 'atorvastatin',
    strength: '80mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.15,
    retailPricePerUnit: 0.28,
    source: 'Cost Plus Drugs'
  },
  
  // Blood Pressure - Lisinopril
  {
    genericName: 'lisinopril',
    strength: '10mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.05,
    retailPricePerUnit: 0.12,
    source: 'NADAC'
  },
  {
    genericName: 'lisinopril',
    strength: '20mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.06,
    retailPricePerUnit: 0.14,
    source: 'NADAC'
  },
  
  // Blood Pressure - Amlodipine
  {
    genericName: 'amlodipine',
    strength: '5mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.04,
    retailPricePerUnit: 0.10,
    source: 'NADAC'
  },
  {
    genericName: 'amlodipine',
    strength: '10mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.05,
    retailPricePerUnit: 0.12,
    source: 'NADAC'
  },
  
  // Thyroid - Levothyroxine
  {
    genericName: 'levothyroxine',
    strength: '25mcg',
    form: 'tablet',
    wholesalePricePerUnit: 0.08,
    retailPricePerUnit: 0.15,
    source: 'NADAC'
  },
  {
    genericName: 'levothyroxine',
    strength: '50mcg',
    form: 'tablet',
    wholesalePricePerUnit: 0.08,
    retailPricePerUnit: 0.15,
    source: 'NADAC'
  },
  {
    genericName: 'levothyroxine',
    strength: '75mcg',
    form: 'tablet',
    wholesalePricePerUnit: 0.08,
    retailPricePerUnit: 0.15,
    source: 'NADAC'
  },
  {
    genericName: 'levothyroxine',
    strength: '100mcg',
    form: 'tablet',
    wholesalePricePerUnit: 0.08,
    retailPricePerUnit: 0.15,
    source: 'NADAC'
  },
  
  // Antidepressant - Sertraline (Zoloft generic)
  {
    genericName: 'sertraline',
    strength: '25mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.10,
    retailPricePerUnit: 0.18,
    source: 'Cost Plus Drugs'
  },
  {
    genericName: 'sertraline',
    strength: '50mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.12,
    retailPricePerUnit: 0.20,
    source: 'Cost Plus Drugs'
  },
  {
    genericName: 'sertraline',
    strength: '100mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.15,
    retailPricePerUnit: 0.25,
    source: 'Cost Plus Drugs'
  },
  
  // Acid Reflux - Omeprazole (Prilosec generic)
  {
    genericName: 'omeprazole',
    strength: '20mg',
    form: 'capsule',
    wholesalePricePerUnit: 0.15,
    retailPricePerUnit: 0.25,
    source: 'NADAC'
  },
  {
    genericName: 'omeprazole',
    strength: '40mg',
    form: 'capsule',
    wholesalePricePerUnit: 0.20,
    retailPricePerUnit: 0.35,
    source: 'NADAC'
  },
  
  // Antibiotic - Amoxicillin
  {
    genericName: 'amoxicillin',
    strength: '500mg',
    form: 'capsule',
    wholesalePricePerUnit: 0.10,
    retailPricePerUnit: 0.20,
    source: 'NADAC'
  },
  
  // Antibiotic - Azithromycin (Z-Pack)
  {
    genericName: 'azithromycin',
    strength: '250mg',
    form: 'tablet',
    wholesalePricePerUnit: 0.50,
    retailPricePerUnit: 0.80,
    source: 'NADAC'
  },
];

/**
 * Get accurate generic medication pricing
 */
export function getGenericMedicationPrice(
  genericName: string,
  strength: string,
  form?: string
): GenericMedicationPrice | null {
  const cleanName = genericName.toLowerCase().trim();
  const cleanStrength = strength.toLowerCase().replace(/\s+/g, '');
  const cleanForm = form?.toLowerCase().trim();
  
  // Find exact match
  const exactMatch = GENERIC_MEDICATION_PRICES.find(med => {
    const medStrength = med.strength.toLowerCase().replace(/\s+/g, '');
    const nameMatch = med.genericName.toLowerCase() === cleanName;
    const strengthMatch = medStrength === cleanStrength;
    const formMatch = !cleanForm || med.form.toLowerCase() === cleanForm;
    
    return nameMatch && strengthMatch && formMatch;
  });
  
  if (exactMatch) {
    console.log(`✅ [GENERIC PRICING] Found exact match: ${genericName} ${strength} - $${exactMatch.wholesalePricePerUnit}/unit`);
    return exactMatch;
  }
  
  // Find closest strength match (for cases where strength format differs)
  const strengthNumber = parseFloat(cleanStrength);
  if (!isNaN(strengthNumber)) {
    const closestMatch = GENERIC_MEDICATION_PRICES
      .filter(med => med.genericName.toLowerCase() === cleanName)
      .sort((a, b) => {
        const aStrength = parseFloat(a.strength);
        const bStrength = parseFloat(b.strength);
        return Math.abs(aStrength - strengthNumber) - Math.abs(bStrength - strengthNumber);
      })[0];
    
    if (closestMatch) {
      console.log(`⚠️ [GENERIC PRICING] Using closest match: ${genericName} ${closestMatch.strength} (requested ${strength})`);
      return closestMatch;
    }
  }
  
  console.log(`❌ [GENERIC PRICING] No match found for: ${genericName} ${strength}`);
  return null;
}
