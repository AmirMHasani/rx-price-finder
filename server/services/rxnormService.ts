/**
 * RxNorm API Service
 * Fetches real medication data from the National Library of Medicine's RxNorm API
 * Documentation: https://rxnav.nlm.nih.gov/APIs/RxNormAPIs.html
 */

const RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST";

export interface RxNormDrug {
  rxcui: string;
  name: string;
  tty: string; // Term Type (BN=Brand Name, GN=Generic Name, etc.)
}

export interface RxNormDrugInfo {
  rxcui: string;
  name: string;
  dosages: string[];
  forms: string[];
  strengths: string[];
}

/**
 * Search for medications by name
 */
export async function searchMedications(
  searchTerm: string
): Promise<RxNormDrug[]> {
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

    const drugs: RxNormDrug[] = [];

    // Extract drugs from all concept groups
    data.drugGroup.conceptGroup.forEach(
      (group: { tty: string; conceptProperties: Array<{ rxcui: string; name: string }> }) => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach(
            (prop: { rxcui: string; name: string }) => {
              drugs.push({
                rxcui: prop.rxcui,
                name: prop.name,
                tty: group.tty,
              });
            }
          );
        }
      }
    );

    return drugs;
  } catch (error) {
    console.error("Error searching medications:", error);
    return [];
  }
}

/**
 * Get detailed information about a specific medication
 */
export async function getMedicationDetails(
  rxcui: string
): Promise<RxNormDrugInfo | null> {
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

    const drugInfo: RxNormDrugInfo = {
      rxcui,
      name: data.propConceptGroup[0]?.conceptProperties[0]?.name || "",
      dosages: [],
      forms: [],
      strengths: [],
    };

    // Extract dosages, forms, and strengths from properties
    data.propConceptGroup.forEach(
      (group: {
        propName: string;
        conceptProperties: Array<{ name: string }>;
      }) => {
        if (group.propName === "DOSE_FORM") {
          group.conceptProperties.forEach((prop: { name: string }) => {
            if (!drugInfo.forms.includes(prop.name)) {
              drugInfo.forms.push(prop.name);
            }
          });
        } else if (group.propName === "STRENGTH") {
          group.conceptProperties.forEach((prop: { name: string }) => {
            if (!drugInfo.strengths.includes(prop.name)) {
              drugInfo.strengths.push(prop.name);
            }
          });
        }
      }
    );

    // Extract dosages from strengths
    drugInfo.dosages = drugInfo.strengths.slice(0, 5); // Limit to 5 common dosages

    return drugInfo;
  } catch (error) {
    console.error("Error getting medication details:", error);
    return null;
  }
}

/**
 * Get related drugs (brand names, generic names, etc.)
 */
export async function getRelatedDrugs(rxcui: string): Promise<RxNormDrug[]> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?tty=all`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.relatedGroup) {
      return [];
    }

    const relatedDrugs: RxNormDrug[] = [];

    data.relatedGroup.forEach(
      (group: { tty: string; conceptProperties: Array<{ rxcui: string; name: string }> }) => {
        if (group.conceptProperties) {
          group.conceptProperties.forEach(
            (prop: { rxcui: string; name: string }) => {
              relatedDrugs.push({
                rxcui: prop.rxcui,
                name: prop.name,
                tty: group.tty,
              });
            }
          );
        }
      }
    );

    return relatedDrugs;
  } catch (error) {
    console.error("Error getting related drugs:", error);
    return [];
  }
}

/**
 * Get drug interactions
 */
export async function getDrugInteractions(
  rxcui: string
): Promise<string[] | null> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/interaction/interaction.json?rxcui=${rxcui}`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.interactionTypeGroup) {
      return [];
    }

    const interactions: string[] = [];

    data.interactionTypeGroup.forEach(
      (group: {
        interactionType: Array<{
          interactionPair: Array<{ description: string }>;
        }>;
      }) => {
        if (group.interactionType) {
          group.interactionType.forEach(
            (type: { interactionPair: Array<{ description: string }> }) => {
              if (type.interactionPair) {
                type.interactionPair.forEach(
                  (pair: { description: string }) => {
                    interactions.push(pair.description);
                  }
                );
              }
            }
          );
        }
      }
    );

    return interactions.length > 0 ? interactions : null;
  } catch (error) {
    console.error("Error getting drug interactions:", error);
    return null;
  }
}

/**
 * Search by NDC code
 */
export async function searchByNDC(ndc: string): Promise<RxNormDrug | null> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/ndcstatus.json?ndc=${encodeURIComponent(ndc)}`
    );

    if (!response.ok) {
      throw new Error(`RxNorm API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.ndcStatuses || data.ndcStatuses.length === 0) {
      return null;
    }

    const status = data.ndcStatuses[0];

    return {
      rxcui: status.rxcui,
      name: status.name,
      tty: "SCD", // Semantic Clinical Drug
    };
  } catch (error) {
    console.error("Error searching by NDC:", error);
    return null;
  }
}
