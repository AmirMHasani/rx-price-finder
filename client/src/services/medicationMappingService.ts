/**
 * Medication Mapping Service
 * Maps common medications to mock medication IDs for pricing lookup
 */

interface MedicationMapping {
  rxcui: string;
  mockId: string;
  name: string;
  genericName: string;
}

const medicationMappings: MedicationMapping[] = [
  {
    rxcui: "617318",
    mockId: "med-1",
    name: "Lipitor",
    genericName: "atorvastatin"
  },
  {
    rxcui: "860649",
    mockId: "med-4",
    name: "Glucophage",
    genericName: "metformin"
  },
  {
    rxcui: "197446",
    mockId: "med-3",
    name: "Prinivil",
    genericName: "lisinopril"
  },
  {
    rxcui: "198029",
    mockId: "med-3",
    name: "Norvasc",
    genericName: "amlodipine"
  },
  {
    rxcui: "199348",
    mockId: "med-6",
    name: "Prilosec",
    genericName: "omeprazole"
  },
  {
    rxcui: "204108",
    mockId: "med-2",
    name: "Synthroid",
    genericName: "levothyroxine"
  },
  {
    rxcui: "206764",
    mockId: "med-5",
    name: "Zoloft",
    genericName: "sertraline"
  },
  {
    rxcui: "206977",
    mockId: "med-7",
    name: "Ventolin",
    genericName: "albuterol"
  },
  {
    rxcui: "248656",
    mockId: "med-8",
    name: "Advair",
    genericName: "fluticasone/salmeterol"
  },
  {
    rxcui: "349032",
    mockId: "med-9",
    name: "Xarelto",
    genericName: "rivaroxaban"
  },
];

/**
 * Get mock medication ID from RXCUI
 * Falls back to med-1 if not found
 */
export function getMockMedicationId(rxcui: string): string {
  const mapping = medicationMappings.find(m => m.rxcui === rxcui);
  return mapping ? mapping.mockId : "med-1"; // Default to Lipitor if not found
}

/**
 * Get medication mapping by RXCUI
 */
export function getMedicationMapping(rxcui: string): MedicationMapping | undefined {
  return medicationMappings.find(m => m.rxcui === rxcui);
}

/**
 * Get all medication mappings
 */
export function getAllMedicationMappings(): MedicationMapping[] {
  return medicationMappings;
}
