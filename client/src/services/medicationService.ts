/**
 * Medication Service
 * Provides functions to search medications from RxNorm and FDA APIs
 * This is a client-side implementation that calls the APIs directly
 */

export interface MedicationResult {
  source: "rxnorm" | "fda";
  rxcui?: string;
  ndc?: string;
  name: string;
  type?: string;
  genericName?: string;
  manufacturer?: string;
}

const RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST";
const FDA_BASE_URL = "https://api.fda.gov/drug/ndc.json";

/**
 * Search for medications using RxNorm API
 */
export async function searchRxNorm(searchTerm: string): Promise<MedicationResult[]> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/drugs.json?name=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.drugGroup || !data.drugGroup.conceptGroup) {
      return [];
    }

    const drugs: MedicationResult[] = [];

    data.drugGroup.conceptGroup.forEach(
      (group: { tty: string; conceptProperties?: Array<{ rxcui: string; name: string }> }) => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach(
            (prop: { rxcui: string; name: string }) => {
              drugs.push({
                source: "rxnorm",
                rxcui: prop.rxcui,
                name: prop.name,
                type: group.tty,
              });
            }
          );
        }
      }
    );

    return drugs;
  } catch (error) {
    console.error("Error searching RxNorm:", error);
    return [];
  }
}

/**
 * Search for medications using FDA API
 */
export async function searchFDA(searchTerm: string): Promise<MedicationResult[]> {
  try {
    const query = `brand_name:"${searchTerm}" OR generic_name:"${searchTerm}"`;
    const response = await fetch(
      `${FDA_BASE_URL}?search=${encodeURIComponent(query)}&limit=10`
    );

    if (!response.ok) {
      throw new Error(`FDA API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.results) {
      return [];
    }

    return data.results.map((drug: any) => ({
      source: "fda",
      ndc: drug.ndc_code || "",
      name: drug.brand_name || drug.generic_name || "",
      type: drug.dosage_form || "",
      genericName: drug.generic_name || "",
      manufacturer: drug.labeler_name || "",
    }));
  } catch (error) {
    console.error("Error searching FDA:", error);
    return [];
  }
}

/**
 * Search medications from both RxNorm and FDA APIs
 */
export async function searchMedications(searchTerm: string): Promise<MedicationResult[]> {
  if (searchTerm.length < 2) {
    return [];
  }

  try {
    // Search both APIs in parallel
    const [rxnormResults, fdaResults] = await Promise.all([
      searchRxNorm(searchTerm),
      searchFDA(searchTerm),
    ]);

    // Combine results
    const allResults = [...rxnormResults, ...fdaResults];

    // Deduplicate by name (case-insensitive)
    const uniqueMap = new Map<string, MedicationResult>();
    allResults.forEach((drug) => {
      const key = drug.name.toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, drug);
      }
    });

    return Array.from(uniqueMap.values()).slice(0, 20); // Limit to 20 results
  } catch (error) {
    console.error("Error searching medications:", error);
    return [];
  }
}

/**
 * Get medication details from RxNorm
 */
export async function getMedicationDetails(rxcui: string) {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/rxcui/${rxcui}/allProperties.json?prop=all`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.propConceptGroup) {
      return null;
    }

    const drugInfo = {
      rxcui,
      name: data.propConceptGroup[0]?.conceptProperties[0]?.name || "",
      dosages: [] as string[],
      forms: [] as string[],
      strengths: [] as string[],
    };

    // Extract dosages, forms, and strengths from properties
    data.propConceptGroup.forEach(
      (group: {
        propName: string;
        conceptProperties?: Array<{ name: string }>;
      }) => {
        if (group.propName === "DOSE_FORM" && group.conceptProperties) {
          group.conceptProperties.forEach((prop: { name: string }) => {
            if (!drugInfo.forms.includes(prop.name)) {
              drugInfo.forms.push(prop.name);
            }
          });
        } else if (group.propName === "STRENGTH" && group.conceptProperties) {
          group.conceptProperties.forEach((prop: { name: string }) => {
            if (!drugInfo.strengths.includes(prop.name)) {
              drugInfo.strengths.push(prop.name);
            }
          });
        }
      }
    );

    // Extract dosages from strengths
    drugInfo.dosages = drugInfo.strengths.slice(0, 5);

    return drugInfo;
  } catch (error) {
    console.error("Error getting medication details:", error);
    return null;
  }
}

/**
 * Get generic alternatives for a brand name drug
 */
export async function searchGenericAlternatives(
  brandName: string
): Promise<MedicationResult[]> {
  try {
    // First find the brand name drug
    const brandDrugs = await searchMedications(brandName);

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
      source: "fda",
      ndc: drug.ndc_code || "",
      name: drug.brand_name || drug.generic_name || "",
      type: drug.dosage_form || "",
      genericName: drug.generic_name || "",
      manufacturer: drug.labeler_name || "",
    }));
  } catch (error) {
    console.error("Error searching generic alternatives:", error);
    return [];
  }
}
