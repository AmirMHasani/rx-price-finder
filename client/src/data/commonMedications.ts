/**
 * Common Medications Database
 * Pre-loaded list of frequently prescribed medications for fast partial search
 */

export interface CommonMedication {
  rxcui: string;
  name: string;
  genericName: string;
  brandName: string;
  dosages: string[];
  forms: string[];
}

export const commonMedications: CommonMedication[] = [
  {
    rxcui: "617318",
    name: "atorvastatin 20 MG Oral Tablet [Lipitor]",
    genericName: "atorvastatin",
    brandName: "Lipitor",
    dosages: ["10mg", "20mg", "40mg", "80mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "860649",
    name: "metformin 500 MG Oral Tablet",
    genericName: "metformin",
    brandName: "Glucophage",
    dosages: ["500mg", "850mg", "1000mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "197446",
    name: "lisinopril 10 MG Oral Tablet",
    genericName: "lisinopril",
    brandName: "Prinivil",
    dosages: ["5mg", "10mg", "20mg", "40mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "198029",
    name: "amlodipine 5 MG Oral Tablet [Norvasc]",
    genericName: "amlodipine",
    brandName: "Norvasc",
    dosages: ["2.5mg", "5mg", "10mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "199348",
    name: "omeprazole 20 MG Oral Capsule [Prilosec]",
    genericName: "omeprazole",
    brandName: "Prilosec",
    dosages: ["10mg", "20mg", "40mg"],
    forms: ["Capsule"],
  },
  {
    rxcui: "200063",
    name: "sertraline 50 MG Oral Tablet [Zoloft]",
    genericName: "sertraline",
    brandName: "Zoloft",
    dosages: ["25mg", "50mg", "100mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "200345",
    name: "levothyroxine 50 MCG Oral Tablet [Synthroid]",
    genericName: "levothyroxine",
    brandName: "Synthroid",
    dosages: ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg", "150mcg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "311696",
    name: "albuterol 90 MCG/ACTUATION Metered Dose Inhaler [Ventolin]",
    genericName: "albuterol",
    brandName: "Ventolin",
    dosages: ["90mcg"],
    forms: ["Inhaler"],
  },
  {
    rxcui: "308135",
    name: "ibuprofen 200 MG Oral Tablet",
    genericName: "ibuprofen",
    brandName: "Advil",
    dosages: ["200mg", "400mg", "600mg", "800mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "5487",
    name: "acetaminophen 325 MG Oral Tablet [Tylenol]",
    genericName: "acetaminophen",
    brandName: "Tylenol",
    dosages: ["325mg", "500mg", "650mg", "1000mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1049589",
    name: "losartan 50 MG Oral Tablet [Cozaar]",
    genericName: "losartan",
    brandName: "Cozaar",
    dosages: ["25mg", "50mg", "100mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1190374",
    name: "rosuvastatin 10 MG Oral Tablet [Crestor]",
    genericName: "rosuvastatin",
    brandName: "Crestor",
    dosages: ["5mg", "10mg", "20mg", "40mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1011482",
    name: "escitalopram 10 MG Oral Tablet [Lexapro]",
    genericName: "escitalopram",
    brandName: "Lexapro",
    dosages: ["5mg", "10mg", "15mg", "20mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1088507",
    name: "pravastatin 20 MG Oral Tablet",
    genericName: "pravastatin",
    brandName: "Pravachol",
    dosages: ["10mg", "20mg", "40mg", "80mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1091652",
    name: "simvastatin 20 MG Oral Tablet [Zocor]",
    genericName: "simvastatin",
    brandName: "Zocor",
    dosages: ["5mg", "10mg", "20mg", "40mg", "80mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1099238",
    name: "fluoxetine 20 MG Oral Capsule [Prozac]",
    genericName: "fluoxetine",
    brandName: "Prozac",
    dosages: ["10mg", "20mg", "40mg", "60mg"],
    forms: ["Capsule"],
  },
  {
    rxcui: "1102129",
    name: "paroxetine 20 MG Oral Tablet [Paxil]",
    genericName: "paroxetine",
    brandName: "Paxil",
    dosages: ["10mg", "20mg", "30mg", "40mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1110695",
    name: "clopidogrel 75 MG Oral Tablet [Plavix]",
    genericName: "clopidogrel",
    brandName: "Plavix",
    dosages: ["75mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1159449",
    name: "atorvastatin 40 MG Oral Tablet [Lipitor]",
    genericName: "atorvastatin",
    brandName: "Lipitor",
    dosages: ["10mg", "20mg", "40mg", "80mg"],
    forms: ["Tablet"],
  },
  {
    rxcui: "1191200",
    name: "valsartan 80 MG Oral Tablet [Diovan]",
    genericName: "valsartan",
    brandName: "Diovan",
    dosages: ["40mg", "80mg", "160mg", "320mg"],
    forms: ["Tablet"],
  },
];

/**
 * Search common medications with partial matching
 */
export function searchCommonMedications(searchTerm: string): CommonMedication[] {
  if (searchTerm.length < 2) {
    return [];
  }

  const searchLower = searchTerm.toLowerCase();

  return commonMedications
    .filter((med) => {
      const nameMatch = med.name.toLowerCase().includes(searchLower);
      const genericMatch = med.genericName.toLowerCase().includes(searchLower);
      const brandMatch = med.brandName.toLowerCase().includes(searchLower);

      return nameMatch || genericMatch || brandMatch;
    })
    .sort((a, b) => {
      const searchLower = searchTerm.toLowerCase();

      // Prioritize brand name matches
      const aBrandMatch = a.brandName.toLowerCase().startsWith(searchLower);
      const bBrandMatch = b.brandName.toLowerCase().startsWith(searchLower);
      if (aBrandMatch && !bBrandMatch) return -1;
      if (bBrandMatch && !aBrandMatch) return 1;

      // Then generic name matches
      const aGenericMatch = a.genericName.toLowerCase().startsWith(searchLower);
      const bGenericMatch = b.genericName.toLowerCase().startsWith(searchLower);
      if (aGenericMatch && !bGenericMatch) return -1;
      if (bGenericMatch && !aGenericMatch) return 1;

      return 0;
    });
}
