/**
 * CMS Marketplace API Service
 * Integrates with HealthCare.gov Marketplace API for ACA plan data
 * 
 * API Documentation: https://marketplace.api.healthcare.gov/api/v1
 * 
 * Note: Requires CMS_MARKETPLACE_API_KEY environment variable
 * Apply for key at: https://developer.cms.gov/
 */

const MARKETPLACE_API_BASE = "https://marketplace.api.healthcare.gov/api/v1";

interface MarketplacePlanSearchRequest {
  household: {
    income: number;
    people: Array<{
      age: number;
      aptc_eligible: boolean;
      gender: string;
      uses_tobacco: boolean;
    }>;
  };
  market: "Individual" | "Small Group";
  place: {
    countyfips: string;
    state: string;
    zipcode: string;
  };
  year: number;
}

interface MarketplacePlan {
  id: string; // HIOS ID
  name: string;
  type: string;
  metal_level: string;
  issuer: {
    id: string;
    name: string;
    state: string;
  };
  premium: number;
  deductibles: Array<{
    amount: number;
    family_cost: string;
    type: string;
  }>;
  moops: Array<{
    amount: number;
    family_cost: string;
    type: string;
  }>;
}

interface DrugCoverageResponse {
  drugs: Array<{
    rxcui: string;
    name: string;
    plans: Array<{
      plan_id: string;
      tier: number;
      prior_authorization: boolean;
      step_therapy: boolean;
      quantity_limit: number | null;
      cost_sharing: Array<{
        pharmacy_type: string;
        copay_amount: number | null;
        coinsurance_rate: number | null;
      }>;
    }>;
  }>;
}

/**
 * Get county FIPS code from ZIP code
 */
export async function getCountyByZip(zipcode: string, apiKey: string): Promise<{ countyfips: string; state: string } | null> {
  try {
    const response = await fetch(
      `${MARKETPLACE_API_BASE}/counties/by/zip/${zipcode}?apikey=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`[CMS Marketplace] County lookup failed: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    if (data.counties && data.counties.length > 0) {
      return {
        countyfips: data.counties[0].fips,
        state: data.counties[0].state
      };
    }
    
    return null;
  } catch (error) {
    console.error("[CMS Marketplace] Error fetching county:", error);
    return null;
  }
}

/**
 * Search for marketplace plans
 */
export async function searchMarketplacePlans(
  request: MarketplacePlanSearchRequest,
  apiKey: string
): Promise<MarketplacePlan[]> {
  try {
    const response = await fetch(
      `${MARKETPLACE_API_BASE}/plans/search?apikey=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );
    
    if (!response.ok) {
      console.error(`[CMS Marketplace] Plan search failed: ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    return data.plans || [];
  } catch (error) {
    console.error("[CMS Marketplace] Error searching plans:", error);
    return [];
  }
}

/**
 * Get plan details by HIOS ID
 */
export async function getMarketplacePlanDetails(
  planId: string,
  year: number,
  apiKey: string
): Promise<MarketplacePlan | null> {
  try {
    const response = await fetch(
      `${MARKETPLACE_API_BASE}/plans/${planId}?year=${year}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`[CMS Marketplace] Plan details failed: ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("[CMS Marketplace] Error fetching plan details:", error);
    return null;
  }
}

/**
 * Autocomplete drug search
 */
export async function autocompleteDrug(
  query: string,
  apiKey: string
): Promise<Array<{ rxcui: string; name: string }>> {
  try {
    const response = await fetch(
      `${MARKETPLACE_API_BASE}/drugs/autocomplete?q=${encodeURIComponent(query)}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`[CMS Marketplace] Drug autocomplete failed: ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    return data.drugs || [];
  } catch (error) {
    console.error("[CMS Marketplace] Error autocompleting drug:", error);
    return [];
  }
}

/**
 * Check drug coverage for specific plans
 */
export async function checkDrugCoverage(
  rxcui: string,
  planIds: string[],
  year: number,
  apiKey: string
): Promise<DrugCoverageResponse | null> {
  try {
    const planIdsParam = planIds.join(",");
    const response = await fetch(
      `${MARKETPLACE_API_BASE}/drugs/covered?year=${year}&drugs=${rxcui}&planids=${planIdsParam}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`[CMS Marketplace] Drug coverage check failed: ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("[CMS Marketplace] Error checking drug coverage:", error);
    return null;
  }
}

/**
 * Helper: Get drug coverage for a single plan
 */
export async function getDrugCoverageForPlan(
  rxcui: string,
  planId: string,
  year: number,
  apiKey: string
): Promise<{
  tier: number | null;
  copay: number | null;
  coinsurance: number | null;
  priorAuth: boolean;
  stepTherapy: boolean;
  quantityLimit: number | null;
} | null> {
  const coverage = await checkDrugCoverage(rxcui, [planId], year, apiKey);
  
  if (!coverage || !coverage.drugs || coverage.drugs.length === 0) {
    return null;
  }
  
  const drug = coverage.drugs[0];
  const planCoverage = drug.plans.find(p => p.plan_id === planId);
  
  if (!planCoverage) {
    return null;
  }
  
  // Get retail pharmacy cost sharing (preferred over mail order)
  const retailCostSharing = planCoverage.cost_sharing.find(
    cs => cs.pharmacy_type === "retail" || cs.pharmacy_type === "preferred_retail"
  ) || planCoverage.cost_sharing[0];
  
  return {
    tier: planCoverage.tier,
    copay: retailCostSharing?.copay_amount || null,
    coinsurance: retailCostSharing?.coinsurance_rate || null,
    priorAuth: planCoverage.prior_authorization,
    stepTherapy: planCoverage.step_therapy,
    quantityLimit: planCoverage.quantity_limit,
  };
}
