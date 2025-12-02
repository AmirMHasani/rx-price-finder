/**
 * Insurance API Client
 * 
 * Client-side service for querying insurance formulary data
 */

export interface InsuranceCopay {
  success: boolean;
  rxcui: string;
  insurance: string;
  covered: boolean;
  copay?: number;
  planName?: string;
  tierName?: string;
  message?: string;
}

/**
 * Get best copay for a medication under specific insurance
 */
export async function getInsuranceCopay(
  rxcui: string,
  insurance: string
): Promise<InsuranceCopay | null> {
  try {
    const response = await fetch(`/api/insurance/copay/${rxcui}?insurance=${encodeURIComponent(insurance)}`);
    
    if (!response.ok) {
      console.error(`[Insurance API] HTTP error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[Insurance API] Error fetching copay for RXCUI ${rxcui}:`, error);
    return null;
  }
}

/**
 * Check if medication is covered by insurance
 */
export async function isMedicationCovered(
  rxcui: string,
  insurance: string
): Promise<boolean> {
  const copayData = await getInsuranceCopay(rxcui, insurance);
  return copayData?.covered ?? false;
}
