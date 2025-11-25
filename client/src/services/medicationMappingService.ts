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
    rxcuis: ["617318", "859424", "617310", "859419", "153165"]
  },
  {
    mockId: "med-2",
    brandNames: ["Synthroid", "Levoxyl"],
    genericNames: ["levothyroxine"],
    rxcuis: ["204108", "966224", "966191", "10582"]
  },
  {
    mockId: "med-3",
    brandNames: ["Norvasc"],
    genericNames: ["amlodipine"],
    rxcuis: ["198029", "197361", "197362", "17767"]
  },
  {
    mockId: "med-4",
    brandNames: ["Glucophage"],
    genericNames: ["metformin"],
    rxcuis: ["860649", "860975", "860974", "6809"]
  },
  {
    mockId: "med-5",
    brandNames: ["Zoloft"],
    genericNames: ["sertraline"],
    rxcuis: ["206764", "312940", "312961", "36437"]
  },
  {
    mockId: "med-6",
    brandNames: ["Prilosec", "Konvomep"],
    genericNames: ["omeprazole"],
    rxcuis: ["199348", "207212", "207211", "207210", "207213", "7646"]
  },
  {
    mockId: "med-7",
    brandNames: ["Ventolin", "ProAir"],
    genericNames: ["albuterol"],
    rxcuis: ["206977", "245314", "630208", "435"]
  },
  {
    mockId: "med-8",
    brandNames: ["Advair"],
    genericNames: ["fluticasone", "salmeterol"],
    rxcuis: ["351137", "351136", "351135", "274783"]
  },
  {
    mockId: "med-9",
    brandNames: ["Xarelto"],
    genericNames: ["rivaroxaban"],
    rxcuis: ["1114195", "1114198", "1114201", "114194"]
  },
  {
    mockId: "med-10",
    brandNames: ["Lyrica"],
    genericNames: ["pregabalin"],
    rxcuis: ["187832", "187833", "187834", "187832"]
  },
  {
    mockId: "med-11",
    brandNames: ["Prinivil", "Zestril"],
    genericNames: ["lisinopril"],
    rxcuis: ["104377", "314076", "567576", "29046"]
  },
  {
    mockId: "med-12",
    brandNames: ["Crestor"],
    genericNames: ["rosuvastatin"],
    rxcuis: ["301542", "859751", "859749", "36567"]
  },
  {
    mockId: "med-13",
    brandNames: ["Nexium"],
    genericNames: ["esomeprazole"],
    rxcuis: ["283742", "617851", "617853", "283742"]
  },
  {
    mockId: "med-14",
    brandNames: ["Plavix"],
    genericNames: ["clopidogrel"],
    rxcuis: ["309362", "309364", "32968"]
  },
  {
    mockId: "med-15",
    brandNames: ["Singulair"],
    genericNames: ["montelukast"],
    rxcuis: ["152923", "152924", "42463"]
  },
  {
    mockId: "med-16",
    brandNames: ["Diovan"],
    genericNames: ["valsartan"],
    rxcuis: ["349199", "349200", "349201", "69749"]
  },
  {
    mockId: "med-17",
    brandNames: ["Lantus"],
    genericNames: ["insulin glargine"],
    rxcuis: ["274783", "352385", "261551"]
  },
  {
    mockId: "med-18",
    brandNames: ["Cozaar"],
    genericNames: ["losartan"],
    rxcuis: ["52175", "979480", "979482", "52175"]
  },
  {
    mockId: "med-19",
    brandNames: ["Neurontin"],
    genericNames: ["gabapentin"],
    rxcuis: ["25480", "308971", "308972", "4025"]
  },
  {
    mockId: "med-20",
    brandNames: ["Prozac"],
    genericNames: ["fluoxetine"],
    rxcuis: ["310384", "310385", "4493"]
  },
  {
    mockId: "med-21",
    brandNames: ["Zocor"],
    genericNames: ["simvastatin"],
    rxcuis: ["196503", "196504", "196505", "36567"]
  },
  {
    mockId: "med-22",
    brandNames: ["Toprol-XL", "Lopressor"],
    genericNames: ["metoprolol"],
    rxcuis: ["866426", "866435", "866439", "6918"]
  },
  {
    mockId: "med-23",
    brandNames: ["Microzide"],
    genericNames: ["hydrochlorothiazide"],
    rxcuis: ["310798", "310799", "5487"]
  },
  {
    mockId: "med-24",
    brandNames: ["Lexapro"],
    genericNames: ["escitalopram"],
    rxcuis: ["321988", "321989", "321988"]
  },
  {
    mockId: "med-25",
    brandNames: ["Cymbalta"],
    genericNames: ["duloxetine"],
    rxcuis: ["596928", "596929", "72625"]
  },
  {
    mockId: "med-26",
    brandNames: ["Celebrex"],
    genericNames: ["celecoxib"],
    rxcuis: ["140587", "140588", "140587"]
  },
  {
    mockId: "med-27",
    brandNames: ["Zyrtec"],
    genericNames: ["cetirizine"],
    rxcuis: ["203150", "1014678", "2101"]
  },
  {
    mockId: "med-28",
    brandNames: ["Amoxil"],
    genericNames: ["amoxicillin"],
    rxcuis: ["308182", "308191", "723"]
  },
  {
    mockId: "med-29",
    brandNames: ["Zithromax", "Z-Pak"],
    genericNames: ["azithromycin"],
    rxcuis: ["248656", "308460", "18631"]
  },
  {
    mockId: "med-30",
    brandNames: ["Ambien"],
    genericNames: ["zolpidem"],
    rxcuis: ["131725", "854871", "42347"]
  },
  {
    mockId: "med-31",
    brandNames: ["Proventil"],
    genericNames: ["albuterol sulfate"],
    rxcuis: ["435", "245314", "630208"]
  },
  {
    mockId: "med-32",
    brandNames: ["Coumadin", "Jantoven"],
    genericNames: ["warfarin"],
    rxcuis: ["11289", "855333", "855332", "11289"]
  },
  {
    mockId: "med-33",
    brandNames: ["Eliquis"],
    genericNames: ["apixaban"],
    rxcuis: ["1364430", "1364431", "1364430"]
  },
  {
    mockId: "med-34",
    brandNames: ["Januvia"],
    genericNames: ["sitagliptin"],
    rxcuis: ["593411", "593412", "593411"]
  },
  {
    mockId: "med-35",
    brandNames: ["Spiriva"],
    genericNames: ["tiotropium"],
    rxcuis: ["213378", "349094", "213378"]
  },
  {
    mockId: "med-36",
    brandNames: ["Viagra"],
    genericNames: ["sildenafil"],
    rxcuis: ["136411", "312107", "136411"]
  },
  {
    mockId: "med-37",
    brandNames: ["Cialis"],
    genericNames: ["tadalafil"],
    rxcuis: ["349332", "349333", "349332"]
  },
  {
    mockId: "med-38",
    brandNames: ["Abilify"],
    genericNames: ["aripiprazole"],
    rxcuis: ["89013", "731533", "731534", "89013"]
  },
  {
    mockId: "med-39",
    brandNames: ["Seroquel"],
    genericNames: ["quetiapine"],
    rxcuis: ["115698", "636570", "636571", "115698"]
  },
  {
    mockId: "med-40",
    brandNames: ["Zetia"],
    genericNames: ["ezetimibe"],
    rxcuis: ["341248", "341248"]
  },
  {
    mockId: "med-41",
    brandNames: ["Benicar"],
    genericNames: ["olmesartan"],
    rxcuis: ["321064", "321065", "321066", "321064"]
  },
  {
    mockId: "med-42",
    brandNames: ["Flomax"],
    genericNames: ["tamsulosin"],
    rxcuis: ["77492", "317133", "317134", "77492"]
  },
  {
    mockId: "med-43",
    brandNames: ["Lyrica"],
    genericNames: ["pregabalin"],
    rxcuis: ["187832", "187833", "187834", "187832"]
  },
  {
    mockId: "med-44",
    brandNames: ["Tricor"],
    genericNames: ["fenofibrate"],
    rxcuis: ["83367", "200031", "200032", "4278"]
  },
  {
    mockId: "med-45",
    brandNames: ["Actos"],
    genericNames: ["pioglitazone"],
    rxcuis: ["33738", "312440", "312441", "33738"]
  },
  {
    mockId: "med-46",
    brandNames: ["Dilantin"],
    genericNames: ["phenytoin"],
    rxcuis: ["8183", "309314", "309315", "8183"]
  },
  {
    mockId: "med-47",
    brandNames: ["Lasix"],
    genericNames: ["furosemide"],
    rxcuis: ["4603", "310429", "310430", "4603"]
  },
  {
    mockId: "med-48",
    brandNames: ["Premarin"],
    genericNames: ["conjugated estrogens"],
    rxcuis: ["197658", "197659", "197660", "197658"]
  },
  {
    mockId: "med-49",
    brandNames: ["Effexor XR"],
    genericNames: ["venlafaxine"],
    rxcuis: ["72625", "596928", "596929", "72625"]
  },
  {
    mockId: "med-50",
    brandNames: ["Wellbutrin"],
    genericNames: ["bupropion"],
    rxcuis: ["42347", "993681", "993687", "42347"]
  }
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
