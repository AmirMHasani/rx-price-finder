/**
 * Medication Service
 * Provides functions to search medications from RxNorm API
 * Filters results to show only relevant medications with generic and brand names
 */

export interface MedicationResult {
  rxcui: string;
  name: string;
  genericName: string;
  brandName: string;
  type: string;
  strength?: string;
}

const RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST";

/**
 * Get generic name for a medication using RxNorm API
 */
async function getGenericName(rxcui: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?rela=has_ingredient`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.relatedGroup && data.relatedGroup.length > 0) {
      const ingredients = data.relatedGroup[0].conceptGroup;
      if (ingredients && ingredients.length > 0) {
        const ingredient = ingredients[0].conceptProperties?.[0];
        if (ingredient) {
          return ingredient.name;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting generic name:", error);
    return null;
  }
}

/**
 * Get brand name for a medication using RxNorm API
 */
async function getBrandName(rxcui: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/rxcui/${rxcui}/related.json?rela=ingredient_of`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.relatedGroup && data.relatedGroup.length > 0) {
      const brands = data.relatedGroup[0].conceptGroup;
      if (brands && brands.length > 0) {
        const brand = brands[0].conceptProperties?.[0];
        if (brand) {
          return brand.name;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting brand name:", error);
    return null;
  }
}

/**
 * Search for medications using RxNorm API
 * Filters to show only relevant active ingredients (not all strengths/forms)
 */
export async function searchMedications(searchTerm: string): Promise<MedicationResult[]> {
  if (searchTerm.length < 2) {
    return [];
  }

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

    const medications: MedicationResult[] = [];
    const seenNames = new Set<string>();

    // Process concept groups from RxNorm
    // TTY (Term Type) codes:
    // BN = Brand Name
    // GN = Generic Name
    // SBD = Semantic Branded Drug
    // SCD = Semantic Clinical Drug
    // IN = Ingredient
    // PIN = Precise Ingredient
    for (const group of data.drugGroup.conceptGroup) {
      const tty = group.tty;
      
      // Focus on brand names and generic names first
      if (!["BN", "GN", "SBD", "SCD", "IN"].includes(tty)) {
        continue;
      }

      if (!group.conceptProperties) {
        continue;
      }

      for (const prop of group.conceptProperties) {
        const name = prop.name;
        const rxcui = prop.rxcui;

        // Skip if we've already seen this medication
        const nameKey = name.toLowerCase();
        if (seenNames.has(nameKey)) {
          continue;
        }

        seenNames.add(nameKey);

        // Determine if this is a brand name or generic name
        let genericName = "";
        let brandName = "";

        if (tty === "BN" || tty === "SBD") {
          // This is a brand name
          brandName = name;
          // Try to get the generic name
          const generic = await getGenericName(rxcui);
          genericName = generic || name;
        } else if (tty === "GN" || tty === "IN") {
          // This is a generic name
          genericName = name;
          // Try to get a brand name
          const brand = await getBrandName(rxcui);
          brandName = brand || name;
        } else {
          // For SCD and other types, use the name as-is
          genericName = name;
          brandName = name;
        }

        medications.push({
          rxcui,
          name: brandName || genericName,
          genericName: genericName,
          brandName: brandName,
          type: tty,
          strength: extractStrength(name),
        });

        // Limit results to avoid too many API calls
        if (medications.length >= 15) {
          break;
        }
      }

      if (medications.length >= 15) {
        break;
      }
    }

    // Sort by relevance: exact matches first, then partial matches
    medications.sort((a, b) => {
      const searchLower = searchTerm.toLowerCase();
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      // Exact match
      if (aName === searchLower && bName !== searchLower) return -1;
      if (bName === searchLower && aName !== searchLower) return 1;

      // Starts with search term
      if (aName.startsWith(searchLower) && !bName.startsWith(searchLower)) return -1;
      if (bName.startsWith(searchLower) && !aName.startsWith(searchLower)) return 1;

      return 0;
    });

    return medications.slice(0, 12); // Return top 12 results
  } catch (error) {
    console.error("Error searching medications:", error);
    return [];
  }
}

/**
 * Extract strength from medication name
 * e.g., "atorvastatin 20 MG" -> "20 MG"
 */
function extractStrength(name: string): string {
  const match = name.match(/(\d+\s*(?:MG|mg|mcg|MCG|g|G|IU|iu))/);
  return match ? match[1] : "";
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
