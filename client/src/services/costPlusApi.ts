// Cost Plus Drugs API integration

const COST_PLUS_API_BASE = 'https://us-central1-costplusdrugs-publicapi.cloudfunctions.net/main';

export interface CostPlusDrugResult {
  brand_name: string;
  brand_generic?: string;  // 'Brand' or 'Generic'
  form: string;
  medication_name: string;
  ndc: string;
  pill_nonpill: string;
  slug: string;
  strength: string;
  unit_price: string;
  url: string;
  requested_quote?: string;
  requested_quote_units?: number;
  error_message?: string;
}

export interface CostPlusApiResponse {
  results: CostPlusDrugResult[];
}

/**
 * Search for medication on Cost Plus Drugs
 */
export async function searchCostPlusMedication(
  medicationName: string,
  strength?: string,
  quantity?: number
): Promise<CostPlusDrugResult | null> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      medication_name: medicationName,
    });
    
    if (strength) {
      params.append('strength', strength);
    }
    
    if (quantity) {
      params.append('quantity_units', quantity.toString());
    }
    
    // Make API request
    const response = await fetch(`${COST_PLUS_API_BASE}?${params.toString()}`);
    
    if (!response.ok) {
      console.error('Cost Plus API error:', response.status);
      return null;
    }
    
    const data: CostPlusApiResponse = await response.json();
    
    // Return first result if available
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Cost Plus data:', error);
    return null;
  }
}

/**
 * Search for generic alternative on Cost Plus Drugs
 */
export async function searchCostPlusGeneric(
  brandName: string,
  strength?: string,
  quantity?: number
): Promise<CostPlusDrugResult | null> {
  try {
    const params = new URLSearchParams({
      brand_name: brandName,
      generic_equivalent_ok: 'true',
    });
    
    if (strength) {
      params.append('strength', strength);
    }
    
    if (quantity) {
      params.append('quantity_units', quantity.toString());
    }
    
    const response = await fetch(`${COST_PLUS_API_BASE}?${params.toString()}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data: CostPlusApiResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Cost Plus generic:', error);
    return null;
  }
}

/**
 * Parse Cost Plus price string to number
 */
export function parseCostPlusPrice(priceString: string): number {
  // Remove $ and convert to number
  return parseFloat(priceString.replace('$', '').replace(',', ''));
}

/**
 * Format Cost Plus drug info for display
 */
export function formatCostPlusDrug(drug: CostPlusDrugResult): {
  name: string;
  strength: string;
  form: string;
  unitPrice: number;
  totalPrice?: number;
  quantity?: number;
  url: string;
  isGeneric: boolean;
} {
  return {
    name: drug.medication_name,
    strength: drug.strength,
    form: drug.form,
    unitPrice: parseCostPlusPrice(drug.unit_price),
    totalPrice: drug.requested_quote ? parseCostPlusPrice(drug.requested_quote) : undefined,
    quantity: drug.requested_quote_units,
    url: drug.url,
    isGeneric: !drug.brand_name || drug.brand_name === '',
  };
}

/**
 * Calculate savings vs retail price
 */
export function calculateCostPlusSavings(
  costPlusPrice: number,
  retailPrice: number
): {
  savings: number;
  savingsPercent: number;
} {
  const savings = Math.max(0, retailPrice - costPlusPrice);
  const savingsPercent = retailPrice > 0 
    ? Math.round((savings / retailPrice) * 100)
    : 0;
  
  return { savings, savingsPercent };
}
