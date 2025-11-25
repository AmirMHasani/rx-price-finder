export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosages: string[];
  forms: string[];
  commonUses: string;
}

export const medications: Medication[] = [
  {
    id: "med-1",
    name: "Lipitor",
    genericName: "Atorvastatin",
    dosages: ["10mg", "20mg", "40mg", "80mg"],
    forms: ["Tablet"],
    commonUses: "High cholesterol"
  },
  {
    id: "med-2",
    name: "Synthroid",
    genericName: "Levothyroxine",
    dosages: ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg"],
    forms: ["Tablet"],
    commonUses: "Hypothyroidism"
  },
  {
    id: "med-3",
    name: "Norvasc",
    genericName: "Amlodipine",
    dosages: ["2.5mg", "5mg", "10mg"],
    forms: ["Tablet"],
    commonUses: "High blood pressure"
  },
  {
    id: "med-4",
    name: "Glucophage",
    genericName: "Metformin",
    dosages: ["500mg", "850mg", "1000mg"],
    forms: ["Tablet", "Extended Release"],
    commonUses: "Type 2 diabetes"
  },
  {
    id: "med-5",
    name: "Zoloft",
    genericName: "Sertraline",
    dosages: ["25mg", "50mg", "100mg"],
    forms: ["Tablet"],
    commonUses: "Depression, anxiety"
  },
  {
    id: "med-6",
    name: "Prilosec",
    genericName: "Omeprazole",
    dosages: ["10mg", "20mg", "40mg"],
    forms: ["Capsule"],
    commonUses: "Acid reflux, heartburn"
  },
  {
    id: "med-7",
    name: "Ventolin",
    genericName: "Albuterol",
    dosages: ["90mcg"],
    forms: ["Inhaler"],
    commonUses: "Asthma, COPD"
  },
  {
    id: "med-8",
    name: "Advair",
    genericName: "Fluticasone/Salmeterol",
    dosages: ["100/50mcg", "250/50mcg", "500/50mcg"],
    forms: ["Inhaler"],
    commonUses: "Asthma, COPD"
  },
  {
    id: "med-9",
    name: "Xarelto",
    genericName: "Rivaroxaban",
    dosages: ["10mg", "15mg", "20mg"],
    forms: ["Tablet"],
    commonUses: "Blood clot prevention"
  },
  {
    id: "med-10",
    name: "Lyrica",
    genericName: "Pregabalin",
    dosages: ["25mg", "50mg", "75mg", "100mg", "150mg"],
    forms: ["Capsule"],
    commonUses: "Nerve pain, fibromyalgia"
  }
];
