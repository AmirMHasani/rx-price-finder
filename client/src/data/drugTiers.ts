// Drug tier classification based on brand/generic status and common formulary placement

import { DrugTier } from './insurancePlans';

export interface DrugClassification {
  tier: DrugTier;
  isGeneric: boolean;
  isBrand: boolean;
  isPreferred: boolean;
  isSpecialty: boolean;
}

// Common drug classifications
// In a real app, this would be a comprehensive database or API lookup
export const DRUG_TIER_DATABASE: Record<string, DrugClassification> = {
  // Generic drugs - Tier 1
  'atorvastatin': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'lisinopril': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'metformin': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'amlodipine': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'omeprazole': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'levothyroxine': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'simvastatin': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'losartan': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'gabapentin': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'sertraline': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'escitalopram': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'amoxicillin': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'hydrochlorothiazide': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'metoprolol': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'albuterol': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'furosemide': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'tramadol': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'citalopram': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'pantoprazole': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'montelukast': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'amitriptyline': { tier: 1, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  'pregabalin': { tier: 2, isGeneric: true, isBrand: false, isPreferred: true, isSpecialty: false },
  
  // Brand drugs - Tier 2-3
  'synthroid': { tier: 2, isGeneric: false, isBrand: true, isPreferred: true, isSpecialty: false },
  'crestor': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'nexium': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'advair': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'spiriva': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'januvia': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'victoza': { tier: 4, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'trulicity': { tier: 4, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'ozempic': { tier: 4, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'eliquis': { tier: 3, isGeneric: false, isBrand: true, isPreferred: true, isSpecialty: false },
  'xarelto': { tier: 3, isGeneric: false, isBrand: true, isPreferred: true, isSpecialty: false },
  'lyrica': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'celebrex': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'cymbalta': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'vyvanse': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'adderall': { tier: 2, isGeneric: false, isBrand: true, isPreferred: true, isSpecialty: false },
  'concerta': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'latuda': { tier: 4, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'abilify': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  'seroquel': { tier: 3, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: false },
  
  // Specialty drugs - Tier 4-5
  'humira': { tier: 5, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'enbrel': { tier: 5, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'remicade': { tier: 5, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'stelara': { tier: 5, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'cosentyx': { tier: 5, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'dupixent': { tier: 5, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
  'skyrizi': { tier: 5, isGeneric: false, isBrand: true, isPreferred: false, isSpecialty: true },
};

/**
 * Get drug tier classification
 * Returns a default tier if drug is not in database
 */
export function getDrugTier(medicationName: string): DrugClassification {
  const normalized = medicationName.toLowerCase().trim();
  
  // Check exact match
  if (DRUG_TIER_DATABASE[normalized]) {
    return DRUG_TIER_DATABASE[normalized];
  }
  
  // Check partial match (for drugs with dosage in name)
  for (const [key, value] of Object.entries(DRUG_TIER_DATABASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Default: assume generic tier 1 if not found
  return {
    tier: 1,
    isGeneric: true,
    isBrand: false,
    isPreferred: true,
    isSpecialty: false,
  };
}

/**
 * Check if a drug has a generic alternative
 */
export function hasGenericAlternative(brandName: string): { hasGeneric: boolean; genericName?: string } {
  const brandToGeneric: Record<string, string> = {
    'lipitor': 'atorvastatin',
    'crestor': 'rosuvastatin',
    'nexium': 'esomeprazole',
    'prilosec': 'omeprazole',
    'synthroid': 'levothyroxine',
    'zocor': 'simvastatin',
    'norvasc': 'amlodipine',
    'glucophage': 'metformin',
    'zestril': 'lisinopril',
    'prinivil': 'lisinopril',
    'cozaar': 'losartan',
    'diovan': 'valsartan',
    'neurontin': 'gabapentin',
    'zoloft': 'sertraline',
    'lexapro': 'escitalopram',
    'prozac': 'fluoxetine',
    'paxil': 'paroxetine',
    'celexa': 'citalopram',
    'protonix': 'pantoprazole',
    'singulair': 'montelukast',
    'lyrica': 'pregabalin',
    'elavil': 'amitriptyline',
    'celebrex': 'celecoxib',
    'cymbalta': 'duloxetine',
    'abilify': 'aripiprazole',
    'seroquel': 'quetiapine',
    'advair': 'fluticasone/salmeterol',
    'spiriva': 'tiotropium',
  };
  
  const normalized = brandName.toLowerCase().trim();
  
  if (brandToGeneric[normalized]) {
    return {
      hasGeneric: true,
      genericName: brandToGeneric[normalized],
    };
  }
  
  return { hasGeneric: false };
}
