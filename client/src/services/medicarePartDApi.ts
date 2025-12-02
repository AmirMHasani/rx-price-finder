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
 * Uses server-side endpoint to bypass CORS restrictions
 */
export async function searchPartDByName(
  medicationName: string
): Promise<PartDResult | null> {
  try {
    // Call server-side endpoint instead of direct CMS API
    const response = await fetch(
      `/api/medications/partd?name=${encodeURIComponent(medicationName)}`
    );

    if (!response.ok) {
      console.error('[Part D Client] Server endpoint error:', response.status);
      return null;
    }

    const result = await response.json();

    if (!result.success || !result.found) {
      return null;
    }

    // Convert server response to PartDResult format
    return {
      brnd_name: result.data.brandName,
      gnrc_name: result.data.genericName,
      tot_mftr: 1,
      mftr_name: result.data.manufacturer,
      avg_spnd_per_dsg_unt_wghtd_2023: result.data.unitPrice,
      tot_spndng_2023: result.data.totalSpending,
      tot_dsg_unts_2023: result.data.totalUnits,
      tot_clms_2023: 0,
      tot_benes_2023: 0,
    };
  } catch (error) {
    console.error('[Part D Client] Error fetching data:', error);
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
