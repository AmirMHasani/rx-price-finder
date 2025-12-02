// Medicare Part D Spending by Drug API integration

const CMS_API_BASE = 'https://data.cms.gov/data-api/v1/dataset';
const PARTD_DATASET_ID = '7e0b4365-fd63-4a29-8f5e-e0ac9f66a81b';
const PARTD_VERSION_ID = '0ccf1b76-38e8-48c1-ad71-ab0eb69fb766';

export interface PartDResult {
  brnd_name: string;
  gnrc_name: string;
  tot_mftr: number;
  mftr_name: string;
  avg_spnd_per_dsg_unt_wghtd_2023: number;
  tot_spndng_2023: number;
  tot_dsg_unts_2023: number;
  tot_clms_2023: number;
  tot_benes_2023: number;
}

export interface PartDApiResponse {
  results: PartDResult[];
  count: number;
}

/**
 * Search for medication spending in Medicare Part D database by brand or generic name
 */
export async function searchPartDByName(
  medicationName: string
): Promise<PartDResult | null> {
  try {
    const apiKey = import.meta.env.VITE_CMS_API_KEY || process.env.CMS_API_KEY;
    
    if (!apiKey) {
      console.error('CMS API key not configured');
      return null;
    }

    // Clean medication name (remove dosage, form, brand name in brackets)
    const cleanName = medicationName
      .replace(/\s*\[.*?\]\s*/g, '') // Remove [Brand Name]
      .replace(/\s+\d+(\.\d+)?\s*(mg|mcg|g|ml)\s*/gi, '') // Remove dosage
      .replace(/\s+(tablet|capsule|oral|extended|release|delayed)\s*/gi, '') // Remove form words
      .trim()
      .toUpperCase();

    // Try brand name first
    let query = {
      conditions: [
        {
          property: 'brnd_name',
          value: `%${cleanName}%`,
          operator: 'LIKE'
        }
      ],
      sorts: [
        {
          property: 'tot_spndng_2023',
          order: 'desc'
        }
      ],
      limit: 1
    };

    let response = await fetch(
      `${CMS_API_BASE}/${PARTD_DATASET_ID}/${PARTD_VERSION_ID}`,
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
      console.error('Medicare Part D API error (brand):', response.status);
      
      // Try generic name as fallback
      query.conditions[0].property = 'gnrc_name';
      
      response = await fetch(
        `${CMS_API_BASE}/${PARTD_DATASET_ID}/${PARTD_VERSION_ID}`,
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
        console.error('Medicare Part D API error (generic):', response.status);
        return null;
      }
    }

    const data: PartDApiResponse = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching Medicare Part D data:', error);
    return null;
  }
}

/**
 * Get average spending per dosage unit from Part D result
 */
export function getPartDUnitPrice(result: PartDResult): number {
  return result.avg_spnd_per_dsg_unt_wghtd_2023 || 0;
}

/**
 * Calculate markup factor (Part D spending / NADAC acquisition cost)
 * This represents the effective markup in Medicare Part D
 */
export function calculatePartDMarkupFactor(
  partDUnitPrice: number,
  nadacUnitPrice: number
): number {
  if (nadacUnitPrice === 0) return 1.0;
  return partDUnitPrice / nadacUnitPrice;
}

/**
 * Calculate total price for quantity using Part D data
 */
export function calculatePartDTotalPrice(
  unitPrice: number,
  quantity: number
): number {
  return unitPrice * quantity;
}
