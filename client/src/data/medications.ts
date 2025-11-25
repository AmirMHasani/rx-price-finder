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
  },
  {
    id: "med-11",
    name: "Prinivil",
    genericName: "Lisinopril",
    dosages: ["2.5mg", "5mg", "10mg", "20mg", "40mg"],
    forms: ["Tablet"],
    commonUses: "High blood pressure, heart failure"
  },
  {
    id: "med-12",
    name: "Crestor",
    genericName: "Rosuvastatin",
    dosages: ["5mg", "10mg", "20mg", "40mg"],
    forms: ["Tablet"],
    commonUses: "High cholesterol"
  },
  {
    id: "med-13",
    name: "Nexium",
    genericName: "Esomeprazole",
    dosages: ["20mg", "40mg"],
    forms: ["Capsule"],
    commonUses: "Acid reflux, GERD"
  },
  {
    id: "med-14",
    name: "Plavix",
    genericName: "Clopidogrel",
    dosages: ["75mg"],
    forms: ["Tablet"],
    commonUses: "Blood clot prevention"
  },
  {
    id: "med-15",
    name: "Singulair",
    genericName: "Montelukast",
    dosages: ["4mg", "5mg", "10mg"],
    forms: ["Tablet"],
    commonUses: "Asthma, allergies"
  },
  {
    id: "med-16",
    name: "Diovan",
    genericName: "Valsartan",
    dosages: ["40mg", "80mg", "160mg", "320mg"],
    forms: ["Tablet"],
    commonUses: "High blood pressure"
  },
  {
    id: "med-17",
    name: "Lantus",
    genericName: "Insulin Glargine",
    dosages: ["100 units/mL"],
    forms: ["Injection"],
    commonUses: "Diabetes"
  },
  {
    id: "med-18",
    name: "Cozaar",
    genericName: "Losartan",
    dosages: ["25mg", "50mg", "100mg"],
    forms: ["Tablet"],
    commonUses: "High blood pressure"
  },
  {
    id: "med-19",
    name: "Neurontin",
    genericName: "Gabapentin",
    dosages: ["100mg", "300mg", "400mg", "600mg", "800mg"],
    forms: ["Capsule", "Tablet"],
    commonUses: "Nerve pain, seizures"
  },
  {
    id: "med-20",
    name: "Prozac",
    genericName: "Fluoxetine",
    dosages: ["10mg", "20mg", "40mg"],
    forms: ["Capsule"],
    commonUses: "Depression, anxiety"
  },
  {
    id: "med-21",
    name: "Zocor",
    genericName: "Simvastatin",
    dosages: ["5mg", "10mg", "20mg", "40mg", "80mg"],
    forms: ["Tablet"],
    commonUses: "High cholesterol"
  },
  {
    id: "med-22",
    name: "Toprol-XL",
    genericName: "Metoprolol",
    dosages: ["25mg", "50mg", "100mg", "200mg"],
    forms: ["Tablet", "Extended Release"],
    commonUses: "High blood pressure, heart disease"
  },
  {
    id: "med-23",
    name: "Hydrochlorothiazide",
    genericName: "Hydrochlorothiazide",
    dosages: ["12.5mg", "25mg", "50mg"],
    forms: ["Tablet", "Capsule"],
    commonUses: "High blood pressure, fluid retention"
  },
  {
    id: "med-24",
    name: "Lexapro",
    genericName: "Escitalopram",
    dosages: ["5mg", "10mg", "20mg"],
    forms: ["Tablet"],
    commonUses: "Depression, anxiety"
  },
  {
    id: "med-25",
    name: "Cymbalta",
    genericName: "Duloxetine",
    dosages: ["20mg", "30mg", "60mg"],
    forms: ["Capsule"],
    commonUses: "Depression, anxiety, nerve pain"
  },
  {
    id: "med-26",
    name: "Celebrex",
    genericName: "Celecoxib",
    dosages: ["100mg", "200mg"],
    forms: ["Capsule"],
    commonUses: "Pain, arthritis"
  },
  {
    id: "med-27",
    name: "Zyrtec",
    genericName: "Cetirizine",
    dosages: ["5mg", "10mg"],
    forms: ["Tablet"],
    commonUses: "Allergies"
  },
  {
    id: "med-28",
    name: "Amoxil",
    genericName: "Amoxicillin",
    dosages: ["250mg", "500mg", "875mg"],
    forms: ["Capsule", "Tablet"],
    commonUses: "Bacterial infections"
  },
  {
    id: "med-29",
    name: "Zithromax",
    genericName: "Azithromycin",
    dosages: ["250mg", "500mg"],
    forms: ["Tablet"],
    commonUses: "Bacterial infections"
  },
  {
    id: "med-30",
    name: "Ambien",
    genericName: "Zolpidem",
    dosages: ["5mg", "10mg"],
    forms: ["Tablet"],
    commonUses: "Insomnia"
  },
  {
    id: "med-31",
    name: "Proventil",
    genericName: "Albuterol Sulfate",
    dosages: ["2mg", "4mg"],
    forms: ["Tablet", "Syrup"],
    commonUses: "Asthma, bronchospasm"
  },
  {
    id: "med-32",
    name: "Coumadin",
    genericName: "Warfarin",
    dosages: ["1mg", "2mg", "2.5mg", "3mg", "4mg", "5mg", "6mg", "7.5mg", "10mg"],
    forms: ["Tablet"],
    commonUses: "Blood clot prevention"
  },
  {
    id: "med-33",
    name: "Eliquis",
    genericName: "Apixaban",
    dosages: ["2.5mg", "5mg"],
    forms: ["Tablet"],
    commonUses: "Blood clot prevention"
  },
  {
    id: "med-34",
    name: "Januvia",
    genericName: "Sitagliptin",
    dosages: ["25mg", "50mg", "100mg"],
    forms: ["Tablet"],
    commonUses: "Type 2 diabetes"
  },
  {
    id: "med-35",
    name: "Spiriva",
    genericName: "Tiotropium",
    dosages: ["18mcg"],
    forms: ["Inhaler"],
    commonUses: "COPD"
  },
  {
    id: "med-36",
    name: "Viagra",
    genericName: "Sildenafil",
    dosages: ["25mg", "50mg", "100mg"],
    forms: ["Tablet"],
    commonUses: "Erectile dysfunction"
  },
  {
    id: "med-37",
    name: "Cialis",
    genericName: "Tadalafil",
    dosages: ["2.5mg", "5mg", "10mg", "20mg"],
    forms: ["Tablet"],
    commonUses: "Erectile dysfunction"
  },
  {
    id: "med-38",
    name: "Abilify",
    genericName: "Aripiprazole",
    dosages: ["2mg", "5mg", "10mg", "15mg", "20mg", "30mg"],
    forms: ["Tablet"],
    commonUses: "Schizophrenia, bipolar disorder"
  },
  {
    id: "med-39",
    name: "Seroquel",
    genericName: "Quetiapine",
    dosages: ["25mg", "50mg", "100mg", "200mg", "300mg", "400mg"],
    forms: ["Tablet"],
    commonUses: "Schizophrenia, bipolar disorder"
  },
  {
    id: "med-40",
    name: "Zetia",
    genericName: "Ezetimibe",
    dosages: ["10mg"],
    forms: ["Tablet"],
    commonUses: "High cholesterol"
  },
  {
    id: "med-41",
    name: "Benicar",
    genericName: "Olmesartan",
    dosages: ["5mg", "20mg", "40mg"],
    forms: ["Tablet"],
    commonUses: "High blood pressure"
  },
  {
    id: "med-42",
    name: "Flomax",
    genericName: "Tamsulosin",
    dosages: ["0.4mg"],
    forms: ["Capsule"],
    commonUses: "Enlarged prostate"
  },
  {
    id: "med-43",
    name: "Lyrica",
    genericName: "Pregabalin",
    dosages: ["25mg", "50mg", "75mg", "100mg", "150mg", "200mg", "225mg", "300mg"],
    forms: ["Capsule"],
    commonUses: "Nerve pain, fibromyalgia"
  },
  {
    id: "med-44",
    name: "Tricor",
    genericName: "Fenofibrate",
    dosages: ["48mg", "145mg"],
    forms: ["Tablet"],
    commonUses: "High cholesterol, triglycerides"
  },
  {
    id: "med-45",
    name: "Actos",
    genericName: "Pioglitazone",
    dosages: ["15mg", "30mg", "45mg"],
    forms: ["Tablet"],
    commonUses: "Type 2 diabetes"
  },
  {
    id: "med-46",
    name: "Dilantin",
    genericName: "Phenytoin",
    dosages: ["30mg", "100mg"],
    forms: ["Capsule"],
    commonUses: "Seizures"
  },
  {
    id: "med-47",
    name: "Lasix",
    genericName: "Furosemide",
    dosages: ["20mg", "40mg", "80mg"],
    forms: ["Tablet"],
    commonUses: "Fluid retention, high blood pressure"
  },
  {
    id: "med-48",
    name: "Premarin",
    genericName: "Conjugated Estrogens",
    dosages: ["0.3mg", "0.45mg", "0.625mg", "0.9mg", "1.25mg"],
    forms: ["Tablet"],
    commonUses: "Menopause symptoms"
  },
  {
    id: "med-49",
    name: "Effexor XR",
    genericName: "Venlafaxine",
    dosages: ["37.5mg", "75mg", "150mg"],
    forms: ["Extended Release Capsule"],
    commonUses: "Depression, anxiety"
  },
  {
    id: "med-50",
    name: "Wellbutrin",
    genericName: "Bupropion",
    dosages: ["75mg", "100mg", "150mg", "200mg"],
    forms: ["Tablet", "Extended Release"],
    commonUses: "Depression, smoking cessation"
  }
];
