/**
 * Brand Medication Pricing Database
 * 
 * Contains known brand medications with realistic wholesale and retail pricing
 * Used as fallback when APIs don't have data for expensive brand drugs
 * 
 * Prices sourced from:
 * - GoodRx pricing data
 * - Medicare Part D average spending
 * - Manufacturer list prices
 * - Industry pricing reports
 */

export interface BrandMedicationData {
  brandName: string;
  genericName: string;
  wholesalePricePerUnit: number;  // Typical wholesale acquisition cost per pill/dose
  retailPricePerUnit: number;     // Typical retail price per pill/dose
  tier: 'tier3' | 'tier4';        // Insurance tier (tier3 = preferred brand, tier4 = non-preferred/specialty)
  category: string;               // Therapeutic category
}

/**
 * Brand medication pricing database
 * Key is lowercase generic name for easy matching
 */
export const BRAND_MEDICATIONS: Record<string, BrandMedicationData> = {
  // Anticoagulants (Blood Thinners)
  'apixaban': {
    brandName: 'Eliquis',
    genericName: 'apixaban',
    wholesalePricePerUnit: 6.50,    // ~$195 for 30 pills wholesale
    retailPricePerUnit: 13.00,       // ~$390 for 30 pills retail (60 pills = $780)
    tier: 'tier3',
    category: 'Anticoagulant'
  },
  'rivaroxaban': {
    brandName: 'Xarelto',
    genericName: 'rivaroxaban',
    wholesalePricePerUnit: 6.00,
    retailPricePerUnit: 12.00,
    tier: 'tier3',
    category: 'Anticoagulant'
  },
  'dabigatran': {
    brandName: 'Pradaxa',
    genericName: 'dabigatran',
    wholesalePricePerUnit: 5.00,
    retailPricePerUnit: 10.00,
    tier: 'tier3',
    category: 'Anticoagulant'
  },
  
  // Diabetes Medications
  'dapagliflozin': {
    brandName: 'Farxiga',
    genericName: 'dapagliflozin',
    wholesalePricePerUnit: 9.00,    // ~$270 for 30 pills wholesale
    retailPricePerUnit: 18.00,       // ~$540 for 30 pills retail
    tier: 'tier3',
    category: 'Diabetes - SGLT2 Inhibitor'
  },
  'empagliflozin': {
    brandName: 'Jardiance',
    genericName: 'empagliflozin',
    wholesalePricePerUnit: 9.50,
    retailPricePerUnit: 19.00,
    tier: 'tier3',
    category: 'Diabetes - SGLT2 Inhibitor'
  },
  'semaglutide': {
    brandName: 'Ozempic',
    genericName: 'semaglutide',
    wholesalePricePerUnit: 225.00,   // ~$900 per month (4 doses)
    retailPricePerUnit: 450.00,      // ~$1,800 per month retail
    tier: 'tier4',
    category: 'Diabetes - GLP-1 Agonist'
  },
  'dulaglutide': {
    brandName: 'Trulicity',
    genericName: 'dulaglutide',
    wholesalePricePerUnit: 200.00,
    retailPricePerUnit: 400.00,
    tier: 'tier4',
    category: 'Diabetes - GLP-1 Agonist'
  },
  'liraglutide': {
    brandName: 'Victoza',
    genericName: 'liraglutide',
    wholesalePricePerUnit: 180.00,
    retailPricePerUnit: 360.00,
    tier: 'tier4',
    category: 'Diabetes - GLP-1 Agonist'
  },
  
  // Asthma/COPD Inhalers
  'fluticasone/salmeterol': {
    brandName: 'Advair',
    genericName: 'fluticasone/salmeterol',
    wholesalePricePerUnit: 6.00,     // Per dose (inhaler has 60 doses)
    retailPricePerUnit: 12.00,       // ~$720 per inhaler retail
    tier: 'tier3',
    category: 'Respiratory - Inhaler'
  },
  'budesonide/formoterol': {
    brandName: 'Symbicort',
    genericName: 'budesonide/formoterol',
    wholesalePricePerUnit: 5.50,
    retailPricePerUnit: 11.00,
    tier: 'tier3',
    category: 'Respiratory - Inhaler'
  },
  
  // Immunosuppressants/Biologics
  'adalimumab': {
    brandName: 'Humira',
    genericName: 'adalimumab',
    wholesalePricePerUnit: 1500.00,  // Per injection (2 per month)
    retailPricePerUnit: 3000.00,     // ~$6,000 per month
    tier: 'tier4',
    category: 'Biologic - Immunosuppressant'
  },
  'etanercept': {
    brandName: 'Enbrel',
    genericName: 'etanercept',
    wholesalePricePerUnit: 1400.00,
    retailPricePerUnit: 2800.00,
    tier: 'tier4',
    category: 'Biologic - Immunosuppressant'
  },
  'ustekinumab': {
    brandName: 'Stelara',
    genericName: 'ustekinumab',
    wholesalePricePerUnit: 6000.00,  // Per injection (quarterly)
    retailPricePerUnit: 12000.00,
    tier: 'tier4',
    category: 'Biologic - Immunosuppressant'
  },
  
  // Cholesterol Medications (Brand versions)
  'evolocumab': {
    brandName: 'Repatha',
    genericName: 'evolocumab',
    wholesalePricePerUnit: 290.00,   // Per injection (2 per month)
    retailPricePerUnit: 580.00,      // ~$1,160 per month
    tier: 'tier4',
    category: 'Cholesterol - PCSK9 Inhibitor'
  },
  'alirocumab': {
    brandName: 'Praluent',
    genericName: 'alirocumab',
    wholesalePricePerUnit: 285.00,
    retailPricePerUnit: 570.00,
    tier: 'tier4',
    category: 'Cholesterol - PCSK9 Inhibitor'
  },
  
  // Antidepressants/Psychiatric (Brand versions)
  'vortioxetine': {
    brandName: 'Trintellix',
    genericName: 'vortioxetine',
    wholesalePricePerUnit: 10.00,
    retailPricePerUnit: 20.00,
    tier: 'tier3',
    category: 'Antidepressant'
  },
  'vilazodone': {
    brandName: 'Viibryd',
    genericName: 'vilazodone',
    wholesalePricePerUnit: 9.00,
    retailPricePerUnit: 18.00,
    tier: 'tier3',
    category: 'Antidepressant'
  },
  
  // Proton Pump Inhibitors (Brand versions)
  'dexlansoprazole': {
    brandName: 'Dexilant',
    genericName: 'dexlansoprazole',
    wholesalePricePerUnit: 8.00,
    retailPricePerUnit: 16.00,
    tier: 'tier3',
    category: 'Proton Pump Inhibitor'
  },
  
  // Pain Medications
  'celecoxib': {
    brandName: 'Celebrex',
    genericName: 'celecoxib',
    wholesalePricePerUnit: 2.00,     // Generic now available, but brand still exists
    retailPricePerUnit: 4.00,
    tier: 'tier3',
    category: 'NSAID'
  },
  
  // Rare/Specialty Medications
  'repository corticotropin': {
    brandName: 'Acthar Gel',
    genericName: 'repository corticotropin',
    wholesalePricePerUnit: 19000.00, // Per vial (~$38,000 per treatment)
    retailPricePerUnit: 38000.00,
    tier: 'tier4',
    category: 'Specialty - Corticotropin'
  },
  'pyrimethamine': {
    brandName: 'Daraprim',
    genericName: 'pyrimethamine',
    wholesalePricePerUnit: 375.00,   // Infamous price hike drug
    retailPricePerUnit: 750.00,
    tier: 'tier4',
    category: 'Antiparasitic'
  }
};

/**
 * Check if a medication is a known brand drug
 * @param medicationName - Generic or brand name to check
 * @returns Brand medication data if found, null otherwise
 */
export function getBrandMedicationData(medicationName: string): BrandMedicationData | null {
  const lowerName = medicationName.toLowerCase();
  
  // Check if it matches a generic name directly
  if (BRAND_MEDICATIONS[lowerName]) {
    return BRAND_MEDICATIONS[lowerName];
  }
  
  // Check if medication name contains the generic name
  for (const [genericName, data] of Object.entries(BRAND_MEDICATIONS)) {
    if (lowerName.includes(genericName)) {
      return data;
    }
  }
  
  // Check if medication name contains the brand name
  for (const data of Object.values(BRAND_MEDICATIONS)) {
    if (lowerName.includes(data.brandName.toLowerCase())) {
      return data;
    }
  }
  
  return null;
}

/**
 * Check if a medication is a brand drug (not generic)
 * @param medicationName - Medication name to check
 * @returns true if brand drug, false if generic or unknown
 */
export function isBrandMedication(medicationName: string): boolean {
  return getBrandMedicationData(medicationName) !== null;
}
