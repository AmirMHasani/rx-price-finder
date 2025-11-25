/**
 * Medication Service
 * Provides functions to search medications from RxNorm API
 * Includes dosage and form extraction for auto-fill functionality
 */

export interface MedicationResult {
  rxcui: string;
  name: string;
  genericName: string;
  brandName: string;
  type: string;
  strength?: string;
  dosages?: string[];
  forms?: string[];
}

const RXNORM_BASE_URL = "https://rxnav.nlm.nih.gov/REST";

/**
 * Extract strength from medication name
 * e.g., "atorvastatin 20 MG" -> "20 MG"
 */
function extractStrength(name: string): string {
  // Support both integers and decimals (e.g., "20 MG", "2.5 MG", "0.5 mg")
  const match = name.match(/(\d+(?:\.\d+)?\s*(?:MG|mg|mcg|MCG|g|G|IU|iu))/);
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
 * Extract dose form from medication name
 * e.g., "atorvastatin 20 MG Oral Tablet" -> "Oral Tablet"
 */
function extractForm(name: string): string {
  // Remove bracketed brand names and strength
  let cleaned = name.replace(/\[.*?\]/g, "").trim();
  
  // Remove the generic name (first word)
  const words = cleaned.split(/\s+/);
  if (words.length > 1) {
    // Remove the first word (generic name) and the strength
    const remaining = words.slice(1).join(" ");
    // Remove the strength (e.g., "20 MG")
    const form = remaining.replace(/\d+\s*(?:MG|mg|mcg|MCG|g|G|IU|iu)/i, "").trim();
    return form || "Tablet"; // Default to Tablet if no form found
  }
  
  return "Tablet";
}

/**
 * Get all available dosages for a medication from RxNorm
 */
async function getAvailableDosages(rxcui: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/rxcui/${rxcui}/allProperties.json?prop=STRENGTH`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const dosages = new Set<string>();

    if (data.propConceptGroup) {
      data.propConceptGroup.forEach((group: any) => {
        if (group.propName === "STRENGTH" && group.conceptProperties) {
          group.conceptProperties.forEach((prop: any) => {
            const strength = prop.name;
            if (strength) {
              // Extract just the numeric part with unit
              const match = strength.match(/(\d+\s*(?:MG|mg|mcg|MCG|g|G|IU|iu))/i);
              if (match) {
                dosages.add(match[1]);
              }
            }
          });
        }
      });
    }

    return Array.from(dosages).sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });
  } catch (error) {
    console.error("Error getting dosages:", error);
    return [];
  }
}

/**
 * Get all available forms for a medication from RxNorm
 */
async function getAvailableForms(rxcui: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${RXNORM_BASE_URL}/rxcui/${rxcui}/allProperties.json?prop=DOSE_FORM`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const forms = new Set<string>();

    if (data.propConceptGroup) {
      data.propConceptGroup.forEach((group: any) => {
        if (group.propName === "DOSE_FORM" && group.conceptProperties) {
          group.conceptProperties.forEach((prop: any) => {
            if (prop.name) {
              forms.add(prop.name);
            }
          });
        }
      });
    }

    return Array.from(forms);
  } catch (error) {
    console.error("Error getting forms:", error);
    return [];
  }
}

/**
 * Search for medications using RxNorm API
 * Supports partial search (e.g., "lip" returns Lipitor)
 */
export async function searchMedications(searchTerm: string): Promise<MedicationResult[]> {
  if (searchTerm.length < 3) {
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
    for (const group of data.drugGroup.conceptGroup) {
      const tty = group.tty;
      
      // Include brand names, generic names, and branded packs
      // BN = Brand Name, GN = Generic Name, SBD = Semantic Branded Drug
      // SCD = Semantic Clinical Drug, IN = Ingredient, BPCK = Branded Pack
      if (!["BN", "GN", "SBD", "SCD", "IN", "BPCK", "GPCK"].includes(tty)) {
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
        const form = extractForm(name);

        medications.push({
          rxcui,
          name: name, // Use full name
          genericName: genericName,
          brandName: brandName,
          type: tty,
          strength: strength,
          dosages: [], // Will be filled on demand
          forms: [form], // Start with extracted form
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
 * Get medication details including available dosages and forms
 */
export async function getMedicationDetails(rxcui: string) {
  try {
    const [dosages, forms] = await Promise.all([
      getAvailableDosages(rxcui),
      getAvailableForms(rxcui),
    ]);

    return {
      rxcui,
      dosages,
      forms,
    };
  } catch (error) {
    console.error("Error getting medication details:", error);
    return {
      rxcui,
      dosages: [],
      forms: [],
    };
  }
}

/**
 * Get medication details from RxNorm (legacy function)
 */
export async function getMedicationDetailsLegacy(rxcui: string) {
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
