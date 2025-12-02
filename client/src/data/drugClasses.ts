/**
 * Therapeutic Drug Class Mappings
 * Groups medications by mechanism of action and therapeutic use
 */

export interface DrugClass {
  name: string;
  description: string;
  medications: string[]; // medication IDs
}

export const drugClasses: Record<string, DrugClass> = {
  // Cardiovascular - Statins (HMG-CoA Reductase Inhibitors)
  statins: {
    name: "Statins",
    description: "HMG-CoA reductase inhibitors for cholesterol management",
    medications: ["med-1", "med-12", "med-21"], // Lipitor, Crestor, Zocor
  },
  
  // Cardiovascular - ACE Inhibitors
  ace_inhibitors: {
    name: "ACE Inhibitors",
    description: "Angiotensin-converting enzyme inhibitors for blood pressure",
    medications: ["med-11"], // Lisinopril
  },
  
  // Cardiovascular - Calcium Channel Blockers
  calcium_blockers: {
    name: "Calcium Channel Blockers",
    description: "Block calcium channels to lower blood pressure",
    medications: ["med-3"], // Amlodipine (Norvasc)
  },
  
  // Cardiovascular - Anticoagulants
  anticoagulants: {
    name: "Anticoagulants",
    description: "Blood thinners to prevent clots",
    medications: ["med-9", "med-34"], // Xarelto, Warfarin
  },
  
  // Endocrine - Thyroid Hormones
  thyroid_hormones: {
    name: "Thyroid Hormones",
    description: "Synthetic thyroid hormone replacement",
    medications: ["med-2"], // Synthroid (levothyroxine)
  },
  
  // Endocrine - Diabetes - Biguanides
  biguanides: {
    name: "Biguanides",
    description: "Reduce glucose production in liver (Type 2 diabetes)",
    medications: ["med-4"], // Metformin
  },
  
  // Endocrine - Diabetes - SGLT2 Inhibitors
  sglt2_inhibitors: {
    name: "SGLT2 Inhibitors",
    description: "Help kidneys remove glucose through urine (Type 2 diabetes)",
    medications: [], // Farxiga would go here
  },
  
  // Psychiatry - SSRIs (Selective Serotonin Reuptake Inhibitors)
  ssris: {
    name: "SSRIs",
    description: "Selective serotonin reuptake inhibitors for depression/anxiety",
    medications: ["med-5", "med-20", "med-24"], // Zoloft, Prozac, Lexapro
  },
  
  // Gastrointestinal - PPIs (Proton Pump Inhibitors)
  ppis: {
    name: "Proton Pump Inhibitors",
    description: "Reduce stomach acid production for GERD/ulcers",
    medications: ["med-6", "med-13"], // Prilosec, Nexium
  },
  
  // Respiratory - Beta-2 Agonists
  beta2_agonists: {
    name: "Beta-2 Agonists",
    description: "Bronchodilators for asthma/COPD",
    medications: ["med-7"], // Albuterol
  },
  
  // Respiratory - Inhaled Corticosteroids + LABA
  ics_laba: {
    name: "ICS/LABA Combinations",
    description: "Inhaled corticosteroid + long-acting beta agonist for asthma/COPD",
    medications: ["med-8"], // Advair
  },
  
  // Neurology - Gabapentinoids
  gabapentinoids: {
    name: "Gabapentinoids",
    description: "Anticonvulsants for nerve pain and seizures",
    medications: ["med-10", "med-19"], // Lyrica, Gabapentin
  },
};

/**
 * Find drug class for a medication
 */
export function findDrugClass(medicationId: string): string | null {
  for (const [classKey, classData] of Object.entries(drugClasses)) {
    if (classData.medications.includes(medicationId)) {
      return classKey;
    }
  }
  return null;
}

/**
 * Get all medications in the same drug class
 */
export function getMedicationsInClass(drugClassKey: string): string[] {
  return drugClasses[drugClassKey]?.medications || [];
}

/**
 * Get therapeutic alternatives (same drug class, different medication)
 */
export function getTherapeuticAlternativesByClass(medicationId: string): string[] {
  const classKey = findDrugClass(medicationId);
  if (!classKey) return [];
  
  const classMembers = getMedicationsInClass(classKey);
  return classMembers.filter(id => id !== medicationId);
}
