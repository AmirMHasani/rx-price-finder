/**
 * Medication Mapping Service
 * Maps common medications to mock medication IDs for pricing lookup
 */

interface MedicationMapping {
  mockId: string;
  brandNames: string[];
  genericNames: string[];
  rxcuis: string[];
}

const medicationMappings: MedicationMapping[] = [
  {
    mockId: "med-1",
    brandNames: ["Lipitor"],
    genericNames: ["atorvastatin"],
    rxcuis: ["617318", "859424", "617310", "859419", "617320", "262095"]
  },
  {
    mockId: "med-2",
    brandNames: ["Synthroid", "Levoxyl"],
    genericNames: ["levothyroxine"],
    rxcuis: ["204108", "966224", "966191"]
  },
  {
    mockId: "med-3",
    brandNames: ["Norvasc"],
    genericNames: ["amlodipine"],
    rxcuis: ["198029", "197361", "197362"]
  },
  {
    mockId: "med-4",
    brandNames: ["Glucophage"],
    genericNames: ["metformin"],
    rxcuis: ["860649", "860975", "860974"]
  },
  {
    mockId: "med-5",
    brandNames: ["Zoloft"],
    genericNames: ["sertraline"],
    rxcuis: ["206764", "312940", "312961"]
  },
  {
    mockId: "med-6",
    brandNames: ["Prilosec", "Konvomep"],
    genericNames: ["omeprazole"],
    rxcuis: ["199348", "207212", "207211", "207210", "207213"]
  },
  {
    mockId: "med-7",
    brandNames: ["Ventolin", "ProAir"],
    genericNames: ["albuterol"],
    rxcuis: ["206977", "245314", "630208"]
  },
  {
    mockId: "med-8",
    brandNames: ["Advair"],
    genericNames: ["fluticasone", "salmeterol"],
    rxcuis: ["351137", "351136", "351135"]
  },
  {
    mockId: "med-9",
    brandNames: ["Xarelto"],
    genericNames: ["rivaroxaban"],
    rxcuis: ["1114195", "1114198", "1114201"]
  },
  {
    mockId: "med-10",
    brandNames: ["Lyrica"],
    genericNames: ["pregabalin"],
    rxcuis: ["187832", "187833", "187834"]
  },
];

/**
 * Get mock medication ID from RXCUI or medication name
 * @param rxcui - The RXCUI code
 * @param medicationName - The medication name (brand or generic)
 * @returns The mock medication ID or "med-1" as fallback
 */
export function getMockMedicationId(rxcui: string, medicationName?: string): string {
  console.log(`[MedicationMapping] Looking up RXCUI: ${rxcui}, Name: ${medicationName}`);
  
  // Try name matching first (more reliable than RXCUI)
  if (medicationName) {
    const lowerName = medicationName.toLowerCase();
    const nameMapping = medicationMappings.find(m => 
      m.brandNames.some(brand => lowerName.includes(brand.toLowerCase())) ||
      m.genericNames.some(generic => lowerName.includes(generic.toLowerCase()))
    );
    
    if (nameMapping) {
      console.log(`[MedicationMapping] Found by name: ${nameMapping.mockId}`);
      return nameMapping.mockId;
    }
  }
  
  // Fall back to RXCUI match
  const rxcuiMapping = medicationMappings.find(m => m.rxcuis.includes(rxcui));
  if (rxcuiMapping) {
    console.log(`[MedicationMapping] Found by RXCUI: ${rxcuiMapping.mockId}`);
    return rxcuiMapping.mockId;
  }
  
  console.warn(`[MedicationMapping] No mapping found for RXCUI ${rxcui} or name ${medicationName}, defaulting to med-1`);
  return "med-1"; // Default to Lipitor if not found
}

/**
 * Get medication mapping by RXCUI or name
 */
export function getMedicationMapping(rxcui: string, medicationName?: string): MedicationMapping | undefined {
  // First try exact RXCUI match
  let mapping = medicationMappings.find(m => m.rxcuis.includes(rxcui));
  
  // If no RXCUI match and medication name provided, try name matching
  if (!mapping && medicationName) {
    const lowerName = medicationName.toLowerCase();
    mapping = medicationMappings.find(m => 
      m.brandNames.some(brand => lowerName.includes(brand.toLowerCase())) ||
      m.genericNames.some(generic => lowerName.includes(generic.toLowerCase()))
    );
  }
  
  return mapping;
}

/**
 * Get all medication mappings
 */
export function getAllMedicationMappings(): MedicationMapping[] {
  return medicationMappings;
}
