/**
 * Dosing Frequency Detection
 * Detects medication dosing frequency (daily, weekly, monthly) based on medication form and name
 * Used to correctly calculate pricing for injectable and non-daily medications
 */

export type DosingFrequency = 'daily' | 'weekly' | 'monthly' | 'as-needed';

export interface DosingInfo {
  frequency: DosingFrequency;
  daysSupply: number;  // How many days a single unit lasts
  unitsPerMonth: number;  // How many units needed for 30 days
  description: string;
}

/**
 * Known medications with non-daily dosing
 * Format: medication name (lowercase) → dosing info
 */
const KNOWN_DOSING_SCHEDULES: Record<string, DosingInfo> = {
  // GLP-1 Agonists (Weekly injections)
  'ozempic': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly injection (4 doses per month)',
  },
  'semaglutide': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly injection (4 doses per month)',
  },
  'wegovy': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly injection (4 doses per month)',
  },
  'trulicity': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly injection (4 doses per month)',
  },
  'dulaglutide': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly injection (4 doses per month)',
  },
  'mounjaro': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly injection (4 doses per month)',
  },
  'tirzepatide': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly injection (4 doses per month)',
  },
  'victoza': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily injection (30 doses per month)',
  },
  'liraglutide': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily injection (30 doses per month)',
  },
  
  // Biologic DMARDs (Weekly/Bi-weekly injections)
  'humira': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly or bi-weekly injection (2-4 doses per month)',
  },
  'adalimumab': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly or bi-weekly injection (2-4 doses per month)',
  },
  'enbrel': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly or bi-weekly injection (2-4 doses per month)',
  },
  'etanercept': {
    frequency: 'weekly',
    daysSupply: 7,
    unitsPerMonth: 4,
    description: 'Weekly or bi-weekly injection (2-4 doses per month)',
  },
  
  // Long-acting insulins (Daily injections)
  'lantus': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily injection (30 doses per month)',
  },
  'basaglar': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily injection (30 doses per month)',
  },
  'tresiba': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily injection (30 doses per month)',
  },
  'toujeo': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily injection (30 doses per month)',
  },
  
  // Rapid-acting insulins (Multiple daily injections)
  'humalog': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Multiple daily injections (as needed with meals)',
  },
  'novolog': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Multiple daily injections (as needed with meals)',
  },
  'apidra': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Multiple daily injections (as needed with meals)',
  },
  
  // Monthly injections
  'invega sustenna': {
    frequency: 'monthly',
    daysSupply: 30,
    unitsPerMonth: 1,
    description: 'Monthly injection (1 dose per month)',
  },
  'paliperidone palmitate': {
    frequency: 'monthly',
    daysSupply: 30,
    unitsPerMonth: 1,
    description: 'Monthly injection (1 dose per month)',
  },
  'risperdal consta': {
    frequency: 'monthly',
    daysSupply: 30,
    unitsPerMonth: 1,
    description: 'Monthly injection (1 dose per month)',
  },
  
  // Inhalers (Daily, but measured in inhalations)
  'advair': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily inhaler (typically 2 inhalations per day)',
  },
  'symbicort': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily inhaler (typically 2 inhalations per day)',
  },
  'breo ellipta': {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily inhaler (1 inhalation per day)',
  },
};

/**
 * Detect dosing frequency from medication name and form
 * @param medicationName - Full medication name (may include brand/generic)
 * @param form - Medication form (e.g., "Pen Injector", "Tablet", "Inhaler")
 * @returns Dosing information
 */
export function detectDosingFrequency(
  medicationName: string,
  form?: string
): DosingInfo {
  const lowerName = medicationName.toLowerCase();
  const lowerForm = (form || '').toLowerCase();
  
  // Check known medications first
  for (const [medName, dosingInfo] of Object.entries(KNOWN_DOSING_SCHEDULES)) {
    if (lowerName.includes(medName)) {
      console.log(`✅ [DOSING] Found known medication: "${medName}" → ${dosingInfo.frequency} (${dosingInfo.unitsPerMonth} units/month)`);
      return dosingInfo;
    }
  }
  
  // Detect by form if not in known list
  if (lowerForm.includes('pen injector') || lowerForm.includes('injection')) {
    // Injectable medications - check for weekly patterns
    if (lowerName.includes('weekly') || lowerName.includes('once-weekly')) {
      console.log(`✅ [DOSING] Detected weekly injection from form/name`);
      return {
        frequency: 'weekly',
        daysSupply: 7,
        unitsPerMonth: 4,
        description: 'Weekly injection (4 doses per month)',
      };
    }
    
    // Default to daily for injections
    console.log(`✅ [DOSING] Detected daily injection from form`);
    return {
      frequency: 'daily',
      daysSupply: 1,
      unitsPerMonth: 30,
      description: 'Daily injection (30 doses per month)',
    };
  }
  
  if (lowerForm.includes('inhaler') || lowerForm.includes('aerosol')) {
    console.log(`✅ [DOSING] Detected daily inhaler from form`);
    return {
      frequency: 'daily',
      daysSupply: 1,
      unitsPerMonth: 30,
      description: 'Daily inhaler (typically 1-2 inhalations per day)',
    };
  }
  
  // Default: daily dosing (most common for oral medications)
  console.log(`ℹ️ [DOSING] Using default daily dosing`);
  return {
    frequency: 'daily',
    daysSupply: 1,
    unitsPerMonth: 30,
    description: 'Daily oral medication (30 doses per month)',
  };
}

/**
 * Calculate actual quantity needed for 30-day supply based on dosing frequency
 * @param requestedQuantity - Quantity requested by user (e.g., 30)
 * @param dosingInfo - Dosing frequency information
 * @returns Actual quantity needed for 30 days
 */
export function calculateActualQuantity(
  requestedQuantity: number,
  dosingInfo: DosingInfo
): number {
  // For daily medications, quantity = days supply
  if (dosingInfo.frequency === 'daily') {
    return requestedQuantity;
  }
  
  // For weekly/monthly medications, calculate based on units per month
  // If user requested 30, they probably mean "30 days supply"
  // So we need to convert to actual units
  if (requestedQuantity === 30 || requestedQuantity === 28 || requestedQuantity === 90) {
    // User is thinking in "days supply", convert to actual units
    const actualUnits = Math.ceil((requestedQuantity / 30) * dosingInfo.unitsPerMonth);
    console.log(`📊 [DOSING] Converting ${requestedQuantity} days → ${actualUnits} units (${dosingInfo.frequency})`);
    return actualUnits;
  }
  
  // Otherwise, assume user knows what they're doing
  return requestedQuantity;
}

/**
 * Calculate price per unit adjusted for dosing frequency
 * @param wholesalePrice - Wholesale price for the requested quantity
 * @param requestedQuantity - Quantity requested by user
 * @param dosingInfo - Dosing frequency information
 * @returns Price per unit (per dose)
 */
export function calculatePricePerUnit(
  wholesalePrice: number,
  requestedQuantity: number,
  dosingInfo: DosingInfo
): number {
  const actualQuantity = calculateActualQuantity(requestedQuantity, dosingInfo);
  return wholesalePrice / actualQuantity;
}
