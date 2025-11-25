/**
 * Medication Service
 * Provides functions to search medications from RxNorm API
 * Optimized for instant search without blocking API calls
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
 * Extract strength from medication name
 * e.g., "atorvastatin 20 MG" -> "20 MG"
 */
function extractStrength(name: string): string {
  const match = name.match(/(\d+\s*(?:MG|mg|mcg|MCG|g|G|IU|iu))/);
  return match ? match[1] : "";
}

/**
 * Extract generic name from a full drug name
 * e.g., "atorvastatin 20 MG Oral Tablet [Lipitor]" -> "atorvastatin"
 */
function extractGenericName(name: string): string {
  // Remove bracketed brand names
  let cleaned = name.replace(/\[.*?\]/g, "").trim();
  
  // Extract the first word (usually the generic name)
  const words = cleaned.split(/\s+/);
  if (words.length > 0) {
    return words[0];
  }
  
  return name;
}

/**
 * Extract brand name from a full drug name
 * e.g., "atorvastatin 20 MG Oral Tablet [Lipitor]" -> "Lipitor"
 */
function extractBrandName(name: string): string {
  const match = name.match(/\[(.*?)\]/);
  if (match && match[1]) {
    return match[1];
  }
  
  // If no bracketed name, use the full name
  return name;
}

/**
 * Search for medications using RxNorm API
 * OPTIMIZED: No blocking API calls - instant results
 */
export async function searchMedications(searchTerm: string): Promise<MedicationResult[]> {
  if (searchTerm.length < 2) {
    return [];
  }

  try {
    console.log(`Searching for: ${searchTerm}`);
    
    const response = await fetch(
      `${RXNORM_BASE_URL}/drugs.json?name=${encodeURIComponent(searchTerm)}`
    );

    if (!response.ok) {
      console.error(`RxNorm API error: ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    if (!data.drugGroup || !data.drugGroup.conceptGroup) {
      console.log("No results from RxNorm API");
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

        // Extract generic and brand names from the full name
        const genericName = extractGenericName(name);
        const brandName = extractBrandName(name);
        const strength = extractStrength(name);

        medications.push({
          rxcui,
          name: name, // Use full name
          genericName: genericName,
          brandName: brandName,
          type: tty,
          strength: strength,
        });

        // Limit results to avoid too many items
        if (medications.length >= 20) {
          break;
        }
      }

      if (medications.length >= 20) {
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

      // Brand name match
      if (a.brandName.toLowerCase().includes(searchLower) && !b.brandName.toLowerCase().includes(searchLower)) return -1;
      if (b.brandName.toLowerCase().includes(searchLower) && !a.brandName.toLowerCase().includes(searchLower)) return 1;

      return 0;
    });

    console.log(`Found ${medications.length} medications`);
    return medications.slice(0, 15); // Return top 15 results
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
