// CMS NADAC (National Average Drug Acquisition Cost) API integration

const CMS_API_BASE = 'https://data.medicaid.gov/api/1/datastore/query';
const NADAC_DATASET_ID = 'f38d0706-1239-442c-a3cc-40ef1b686ac0';

export interface NADACResult {
  ndc_description: string;
  ndc: string;
  nadac_per_unit: string;
  effective_date: string;
  pricing_unit: string;
  pharmacy_type_indicator: string;
  otc: string;
}

export interface NADACApiResponse {
  results: NADACResult[];
  count: number;
}

/**
 * Search for medication pricing in NADAC database by NDC code
 */
export async function searchNADACByNDC(
  ndc: string
): Promise<NADACResult | null> {
  try {
    const apiKey = import.meta.env.VITE_CMS_API_KEY || process.env.CMS_API_KEY;
    
    if (!apiKey) {
      console.error('CMS API key not configured');
      return null;
    }

    // Build query to search by NDC
    const query = {
      conditions: [
        {
          property: 'ndc',
          value: ndc,
          operator: '='
        }
      ],
      sorts: [
        {
          property: 'effective_date',
          order: 'desc'
        }
      ],
      limit: 1
    };

    const response = await fetch(
      `${CMS_API_BASE}/${NADAC_DATASET_ID}/0`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(query)
      }
    );

    if (!response.ok) {
      console.error('CMS NADAC API error:', response.status, await response.text());
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
 * Search for medication pricing by drug name
 */
export async function searchNADACByName(
  medicationName: string,
  strength?: string
): Promise<NADACResult[]> {
  try {
    const apiKey = import.meta.env.VITE_CMS_API_KEY || process.env.CMS_API_KEY;
    
    if (!apiKey) {
      console.error('CMS API key not configured');
      return [];
    }

    // Build search query
    const conditions: any[] = [
      {
        property: 'ndc_description',
        value: `%${medicationName.toUpperCase()}%`,
        operator: 'LIKE'
      }
    ];

    if (strength) {
      conditions.push({
        property: 'ndc_description',
        value: `%${strength}%`,
        operator: 'LIKE'
      });
    }

    const query = {
      conditions,
      sorts: [
        {
          property: 'effective_date',
          order: 'desc'
        }
      ],
      limit: 10
    };

    const response = await fetch(
      `${CMS_API_BASE}/${NADAC_DATASET_ID}/0`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(query)
      }
    );

    if (!response.ok) {
      console.error('CMS NADAC API error:', response.status);
      return [];
    }

    const data: NADACApiResponse = await response.json();

    return data.results || [];
  } catch (error) {
    console.error('Error fetching NADAC data:', error);
    return [];
  }
}

/**
 * Parse NADAC price string to number
 */
export function parseNADACPrice(priceString: string): number {
  return parseFloat(priceString);
}

/**
 * Get unit price from NADAC result
 */
export function getNADACUnitPrice(result: NADACResult): number {
  return parseNADACPrice(result.nadac_per_unit);
}

/**
 * Calculate total price for quantity
 */
export function calculateNADACTotalPrice(
  unitPrice: number,
  quantity: number,
  pricingUnit: string
): number {
  // NADAC prices are per unit (e.g., per ML, per EA, per GM)
  // For most oral medications, pricing unit is "EA" (each)
  if (pricingUnit === 'EA') {
    return unitPrice * quantity;
  }
  
  // For other units, return unit price (may need adjustment based on form)
  return unitPrice * quantity;
}
