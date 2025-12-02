/**
 * Medication Alternatives Service
 * 
 * Provides generic equivalents and therapeutic alternatives for medications.
 * Uses therapeutic drug class mappings to show relevant alternatives.
 */

import { medications } from "../data/medications";
import { findDrugClass, getTherapeuticAlternativesByClass, drugClasses } from "../data/drugClasses";

export interface MedicationAlternative {
  medicationId: string;
  name: string;
  type: "generic" | "therapeutic";
  description: string;
  estimatedSavings?: number; // Percentage savings vs original
}

/**
 * Get alternatives for a medication based on therapeutic drug class
 */
export function getMedicationAlternatives(medicationId: string): MedicationAlternative[] {
  // Find the drug class for this medication
  const drugClassKey = findDrugClass(medicationId);
  
  if (!drugClassKey) {
    // Fallback to manual mappings for medications not in drug classes yet
    return getManualAlternatives(medicationId);
  }
  
  // Get other medications in the same therapeutic class
  const classAlternatives = getTherapeuticAlternativesByClass(medicationId);
  
  // Convert to MedicationAlternative format
  const alternatives: MedicationAlternative[] = classAlternatives.map(altId => {
    const med = medications.find(m => m.id === altId);
    if (!med) return null;
    
    // Check if medication name is same as generic (indicates generic medication)
    const isGeneric = med.name.toLowerCase() === med.genericName.toLowerCase();
    
    return {
      medicationId: altId,
      name: isGeneric ? med.genericName : `${med.genericName} (${med.name})`,
      type: "therapeutic" as "therapeutic",
      description: drugClasses[drugClassKey].description,
      estimatedSavings: isGeneric ? 10 : -5,
    } as MedicationAlternative;
  }).filter((alt): alt is MedicationAlternative => alt !== null);
  
  return alternatives;
}

/**
 * Manual alternatives mapping (fallback for medications not in drug classes)
 */
function getManualAlternatives(medicationId: string): MedicationAlternative[] {
  const alternatives: Record<string, MedicationAlternative[]> = {
    // Lipitor (atorvastatin) - already generic
    "med-1": [
      {
        medicationId: "med-21",
        name: "Simvastatin (Zocor)",
        type: "therapeutic",
        description: "Alternative statin for cholesterol management",
        estimatedSavings: 15,
      },
      {
        medicationId: "med-12",
        name: "Rosuvastatin (Crestor)",
        type: "therapeutic",
        description: "More potent statin option",
        estimatedSavings: -10, // May cost more
      },
    ],
    
    // Synthroid (levothyroxine) - already generic
    "med-2": [],
    
    // Norvasc (amlodipine) - already generic
    "med-3": [
      {
        medicationId: "med-11",
        name: "Lisinopril (Zestril)",
        type: "therapeutic",
        description: "ACE inhibitor for blood pressure",
        estimatedSavings: 10,
      },
    ],
    
    // Glucophage (metformin) - already generic
    "med-4": [],
    
    // Zoloft (sertraline) - already generic
    "med-5": [
      {
        medicationId: "med-20",
        name: "Fluoxetine (Prozac)",
        type: "therapeutic",
        description: "Alternative SSRI antidepressant",
        estimatedSavings: 5,
      },
      {
        medicationId: "med-24",
        name: "Escitalopram (Lexapro)",
        type: "therapeutic",
        description: "Newer SSRI with fewer side effects",
        estimatedSavings: 0,
      },
    ],
    
    // Prilosec (omeprazole) - already generic
    "med-6": [
      {
        medicationId: "med-13",
        name: "Esomeprazole (Nexium)",
        type: "therapeutic",
        description: "Alternative PPI for acid reflux",
        estimatedSavings: -5,
      },
    ],
    
    // ProAir (albuterol) - already generic
    "med-7": [],
    
    // Advair - brand name
    "med-8": [
      {
        medicationId: "med-8",
        name: "Generic Fluticasone/Salmeterol",
        type: "generic",
        description: "Generic equivalent of Advair",
        estimatedSavings: 60,
      },
    ],
    
    // Xarelto - brand name
    "med-9": [
      {
        medicationId: "med-34",
        name: "Warfarin (Coumadin)",
        type: "therapeutic",
        description: "Traditional blood thinner, requires monitoring",
        estimatedSavings: 80,
      },
    ],
    
    // Lyrica - brand name
    "med-10": [
      {
        medicationId: "med-19",
        name: "Gabapentin (Neurontin)",
        type: "therapeutic",
        description: "Alternative for nerve pain",
        estimatedSavings: 85,
      },
    ],
    
    // Add more mappings as needed...
  };

  const manualMappings = alternatives[medicationId] || [];
  return manualMappings;
}

/**
 * Check if a medication has a generic equivalent
 */
export function hasGenericEquivalent(medicationId: string): boolean {
  const alts = getMedicationAlternatives(medicationId);
  return alts.some(alt => alt.type === "generic");
}

/**
 * Get the generic equivalent if available
 */
export function getGenericEquivalent(medicationId: string): MedicationAlternative | null {
  const alts = getMedicationAlternatives(medicationId);
  return alts.find(alt => alt.type === "generic") || null;
}

/**
 * Get therapeutic alternatives
 */
export function getTherapeuticAlternatives(medicationId: string): MedicationAlternative[] {
  const alts = getMedicationAlternatives(medicationId);
  return alts.filter(alt => alt.type === "therapeutic");
}
