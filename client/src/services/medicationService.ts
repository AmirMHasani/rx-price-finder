/**
 * Medication Service
 * Provides functions to search medications from RxNorm API
 * Includes dosage and form extraction for auto-fill functionality
 */

import { cleanMedicationResults } from './medicationResultCleaner';

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
 * Clean up medication display name for user-friendly presentation
 * Removes confusing RxNorm formatting and shows brand or generic name clearly
 */
export function getCleanMedicationName(medication: MedicationResult): string {
  // The medication name is already cleaned by medicationResultCleaner
  // Just return it as-is
  return medication.name;
}

/**
 * Check if medication should be filtered out (packs, kits, starter packs, etc.)
 */
function shouldFilterMedication(name: string): boolean {
  const lowerName = name.toLowerCase();
  const filterPatterns = [
    'pack',
    'kit',
    'starter',
    '{', // RxNorm pack notation
    '}',
    'dose pack',
    'therapy pack',
    'combination pack'
  ];
  
  return filterPatterns.some(pattern => lowerName.includes(pattern));
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
              // Clean up form name - remove numeric prefixes like "2. Oral Tablet" -> "Oral Tablet"
              const cleanForm = prop.name.replace(/^\d+\.\s*/, '');
              forms.add(cleanForm);
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
  if (searchTerm.length < 2) {
    return [];
  }

  // Check cache first
  const cacheKey = `medication_search_${searchTerm.toLowerCase()}`;
  const { searchCache } = await import('./searchCache');
  const cached = searchCache.get<MedicationResult[]>(cacheKey);
  if (cached) {
    console.log(`Cache hit for: ${searchTerm}`);
    return cached;
  }

  try {
    console.log(`Searching for: ${searchTerm}`);
    
    // Add language filter to ensure only English drug names are returned
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
      
      // Include brand names, generic names, and clinical drugs
      // BN = Brand Name, GN = Generic Name, SBD = Semantic Branded Drug
      // SCD = Semantic Clinical Drug, IN = Ingredient
      // Exclude: BPCK = Branded Pack, GPCK = Generic Pack (confusing for users)
      if (!["BN", "GN", "SBD", "SCD", "IN"].includes(tty)) {
        continue;
      }

      if (!group.conceptProperties) {
        continue;
      }

      for (const prop of group.conceptProperties) {
        const name = prop.name;
        const rxcui = prop.rxcui;

        // Skip Spanish drug names (they often contain specific Spanish words)
        const spanishIndicators = [
          ' de ', ' del ', ' la ', ' el ', ' los ', ' las ',
          'comprimido', 'cápsula', 'tableta', 'jarabe', 'solución',
          'inyectable', 'suspensión', 'crema', 'pomada'
        ];
        const nameLower = name.toLowerCase();
        const hasSpanishIndicator = spanishIndicators.some(indicator => 
          nameLower.includes(indicator)
        );
        
        if (hasSpanishIndicator) {
          console.log(`Skipping Spanish drug name: ${name}`);
          continue;
        }
        
        // Filter out packs, kits, and confusing options
        if (shouldFilterMedication(name)) {
          console.log(`Skipping pack/kit medication: ${name}`);
          continue;
        }

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

    // Clean up results (remove duplicates, simplify names, calculate total doses)
    const cleanedMedications = cleanMedicationResults(medications);

    // Sort by relevance: exact matches first, then partial matches
    cleanedMedications.sort((a, b) => {
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

    console.log(`Found ${cleanedMedications.length} cleaned medications (from ${medications.length} raw results)`);
    const results = cleanedMedications.slice(0, 15); // Return top 15 results
    
    // Cache the results
    searchCache.set(cacheKey, results);
    
    return results;
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
