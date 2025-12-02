// CMS NADAC (National Average Drug Acquisition Cost) API integration

const NADAC_API_BASE = 'https://data.medicaid.gov/api/1/datastore/query';
const NADAC_DATASET_ID = '99315a95-37ac-4eee-946a-3c523b4c481e/0';

export interface NADACRecord {
  ndc: string;
  ndc_description: string;
  nadac_per_unit: string;
  effective_date: string;
  pricing_unit: string;
  pharmacy_type_indicator: string;
  otc: string;
  explanation_code: string;
  classification_for_rate_setting: string;
  corresponding_generic_drug_nadac_per_unit?: string;
  corresponding_generic_drug_effective_date?: string;
}

export interface NADACApiResponse {
  results: NADACRecord[];
  count: number;
}

/**
 * Search NADAC pricing by medication name
 * Note: NADAC uses NDC codes, so this searches the description field
 */
export async function searchNADACPricing(medicationName: string): Promise<NADACRecord | null> {
  try {
    // Build SQL query to search by description
    // Clean medication name and search for exact word matches
    const cleanName = medicationName.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    const query = `
      SELECT *
      FROM ${NADAC_DATASET_ID}
      WHERE LOWER(ndc_description) LIKE '${cleanName}%'
      ORDER BY effective_date DESC
      LIMIT 1
    `;
    
    const params = new URLSearchParams({
      query: query,
      show_db_columns: 'false',
    });
    
    const response = await fetch(`${NADAC_API_BASE}/${NADAC_DATASET_ID}/0?${params.toString()}`);
    
    if (!response.ok) {
      // Silently handle 404s - medication not in NADAC database
      if (response.status === 404) {
        return null;
      }
      console.warn('NADAC API error:', response.status);
      return null;
    }
    
    const data: NADACApiResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching NADAC data:', error);
    return null;
  }
}

/**
 * Search NADAC pricing by NDC code
 */
export async function searchNADACByNDC(ndc: string): Promise<NADACRecord | null> {
  try {
    // Remove hyphens from NDC if present
    const cleanNDC = ndc.replace(/-/g, '');
    
    const query = `
      SELECT *
      FROM ${NADAC_DATASET_ID}
      WHERE ndc = '${cleanNDC}'
      ORDER BY effective_date DESC
      LIMIT 1
    `;
    
    const params = new URLSearchParams({
      query: query,
      show_db_columns: 'false',
    });
    
    const response = await fetch(`${NADAC_API_BASE}/${NADAC_DATASET_ID}/0?${params.toString()}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data: NADACApiResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching NADAC data by NDC:', error);
    return null;
  }
}

/**
 * Parse NADAC price string to number
 */
export function parseNADACPrice(priceString: string): number {
  return parseFloat(priceString);
}

/**
 * Calculate pharmacy markup percentage
 */
export function calculatePharmacyMarkup(
  retailPrice: number,
  nadacPrice: number
): {
  markupAmount: number;
  markupPercent: number;
  isFairPrice: boolean;
} {
  const markupAmount = retailPrice - nadacPrice;
  const markupPercent = nadacPrice > 0 
    ? Math.round((markupAmount / nadacPrice) * 100)
    : 0;
  
  // Consider markup "fair" if it's under 200%
  const isFairPrice = markupPercent < 200;
  
  return {
    markupAmount,
    markupPercent,
    isFairPrice,
  };
}

/**
 * Get markup indicator for display
 */
export function getMarkupIndicator(markupPercent: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (markupPercent < 150) {
    return {
      label: 'Excellent Price',
      color: 'text-green-600',
      icon: '✅',
    };
  } else if (markupPercent < 200) {
    return {
      label: 'Fair Price',
      color: 'text-blue-600',
      icon: '👍',
    };
  } else if (markupPercent < 300) {
    return {
      label: 'High Markup',
      color: 'text-orange-600',
      icon: '⚠️',
    };
  } else {
    return {
      label: 'Very High Markup',
      color: 'text-red-600',
      icon: '❌',
    };
  }
}

/**
 * Format NADAC data for display
 */
export function formatNADACData(record: NADACRecord): {
  description: string;
  pricePerUnit: number;
  pricingUnit: string;
  effectiveDate: string;
  isGeneric: boolean;
} {
  return {
    description: record.ndc_description,
    pricePerUnit: parseNADACPrice(record.nadac_per_unit),
    pricingUnit: record.pricing_unit,
    effectiveDate: new Date(record.effective_date).toLocaleDateString(),
    isGeneric: record.classification_for_rate_setting?.toLowerCase().includes('generic') || false,
  };
}

/**
 * Estimate retail price from NADAC (wholesale) price
 * Typical pharmacy markup is 200-400%
 */
export function estimateRetailFromNADAC(nadacPrice: number, pharmacyType: 'chain' | 'independent' | 'online'): {
  low: number;
  high: number;
  typical: number;
} {
  let markupLow = 2.0;  // 200%
  let markupHigh = 4.0; // 400%
  
  // Adjust markup by pharmacy type
  if (pharmacyType === 'online') {
    markupLow = 1.5;
    markupHigh = 2.5;
  } else if (pharmacyType === 'chain') {
    markupLow = 2.5;
    markupHigh = 4.0;
  } else { // independent
    markupLow = 2.0;
    markupHigh = 3.5;
  }
  
  return {
    low: Math.round(nadacPrice * markupLow * 100) / 100,
    high: Math.round(nadacPrice * markupHigh * 100) / 100,
    typical: Math.round(nadacPrice * ((markupLow + markupHigh) / 2) * 100) / 100,
  };
}
