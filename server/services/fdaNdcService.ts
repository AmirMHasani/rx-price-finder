/**
 * FDA NDC API Service
 * Fetches drug information from the FDA's OpenFDA API
 * Documentation: https://open.fda.gov/apis/drug/ndc/
 */

const FDA_BASE_URL = "https://api.fda.gov/drug/ndc.json";

export interface FDADrug {
  ndc: string;
  brandName: string;
  genericName: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  marketingStatus: string;
  labelerName: string;
}

/**
 * Search for drugs by name
 */
export async function searchDrugsByName(
  searchTerm: string
): Promise<FDADrug[]> {
  try {
    const query = `brand_name:"${encodeURIComponent(searchTerm)}" OR generic_name:"${encodeURIComponent(searchTerm)}"`;
    const response = await fetch(
      `${FDA_BASE_URL}?search=${query}&limit=10`
    );

    if (!response.ok) {
      throw new Error(`FDA API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map((drug: any) => ({
      ndc: drug.ndc_code || "",
      brandName: drug.brand_name || "",
      genericName: drug.generic_name || "",
      dosageForm: drug.dosage_form || "",
      strength: drug.active_ingredients?.[0]?.strength || "",
      manufacturer: drug.labeler_name || "",
      marketingStatus: drug.marketing_status || "",
      labelerName: drug.labeler_name || "",
    }));
  } catch (error) {
    console.error("Error searching drugs by name:", error);
    return [];
  }
}

/**
 * Search for drugs by NDC code
 */
export async function searchDrugByNDC(ndc: string): Promise<FDADrug | null> {
  try {
    const response = await fetch(
      `${FDA_BASE_URL}?search=ndc_code:"${encodeURIComponent(ndc)}"`
    );

    if (!response.ok) {
      throw new Error(`FDA API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const drug = data.results[0];

    return {
      ndc: drug.ndc_code || "",
      brandName: drug.brand_name || "",
      genericName: drug.generic_name || "",
      dosageForm: drug.dosage_form || "",
      strength: drug.active_ingredients?.[0]?.strength || "",
      manufacturer: drug.labeler_name || "",
      marketingStatus: drug.marketing_status || "",
      labelerName: drug.labeler_name || "",
    };
  } catch (error) {
    console.error("Error searching drug by NDC:", error);
    return null;
  }
}

/**
 * Search for drugs by manufacturer
 */
export async function searchDrugsByManufacturer(
  manufacturer: string
): Promise<FDADrug[]> {
  try {
    const response = await fetch(
      `${FDA_BASE_URL}?search=labeler_name:"${encodeURIComponent(manufacturer)}"&limit=20`
    );

    if (!response.ok) {
      throw new Error(`FDA API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map((drug: any) => ({
      ndc: drug.ndc_code || "",
      brandName: drug.brand_name || "",
      genericName: drug.generic_name || "",
      dosageForm: drug.dosage_form || "",
      strength: drug.active_ingredients?.[0]?.strength || "",
      manufacturer: drug.labeler_name || "",
      marketingStatus: drug.marketing_status || "",
      labelerName: drug.labeler_name || "",
    }));
  } catch (error) {
    console.error("Error searching drugs by manufacturer:", error);
    return [];
  }
}

/**
 * Get active ingredients for a drug
 */
export async function getActiveIngredients(
  ndc: string
): Promise<Array<{ name: string; strength: string }> | null> {
  try {
    const drug = await searchDrugByNDC(ndc);

    if (!drug) {
      return null;
    }

    // Note: FDA API doesn't return detailed active ingredients in the basic search
    // This would require additional API calls or data enrichment
    return [
      {
        name: drug.genericName || "Unknown",
        strength: drug.strength || "Unknown",
      },
    ];
  } catch (error) {
    console.error("Error getting active ingredients:", error);
    return null;
  }
}

/**
 * Search for generic alternatives
 */
export async function searchGenericAlternatives(
  brandName: string
): Promise<FDADrug[]> {
  try {
    // First find the brand name drug
    const brandDrugs = await searchDrugsByName(brandName);

    if (brandDrugs.length === 0) {
      return [];
    }

    const firstDrug = brandDrugs[0];
    const genericName = firstDrug.genericName;

    if (!genericName) {
      return [];
    }

    // Search for all drugs with the same generic name
    const response = await fetch(
      `${FDA_BASE_URL}?search=generic_name:"${encodeURIComponent(genericName)}"&limit=20`
    );

    if (!response.ok) {
      throw new Error(`FDA API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map((drug: any) => ({
      ndc: drug.ndc_code || "",
      brandName: drug.brand_name || "",
      genericName: drug.generic_name || "",
      dosageForm: drug.dosage_form || "",
      strength: drug.active_ingredients?.[0]?.strength || "",
      manufacturer: drug.labeler_name || "",
      marketingStatus: drug.marketing_status || "",
      labelerName: drug.labeler_name || "",
    }));
  } catch (error) {
    console.error("Error searching generic alternatives:", error);
    return [];
  }
}
