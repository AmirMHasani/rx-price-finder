export interface GeneVariant {
  gene: string;
  alleles: string;
  phenotype: string;
  metabolizerType: "Poor" | "Intermediate" | "Normal" | "Rapid" | "Ultra-rapid";
  clinicalSignificance: "High" | "Moderate" | "Low";
}

export interface MedicationRecommendation {
  category: string;
  medications: {
    name: string;
    genericName: string;
    recommendation: "Use as directed" | "Use with caution" | "Consider alternatives" | "Avoid" | "Dose adjustment needed";
    reason: string;
    alternativeSuggestion?: string;
  }[];
}

export interface MedicationToAvoid {
  name: string;
  genericName: string;
  reason: string;
  geneticBasis: string;
  alternatives: string;
}

export interface GenomicProfile {
  id: string;
  patientId: string;
  testDate: string;
  labName: string;
  reportId: string;
  
  // Executive Summary
  summary: {
    totalGenesAnalyzed: number;
    actionableFindings: number;
    riskLevel: "Low" | "Moderate" | "High";
    keyInsights: string[];
  };
  
  // Gene Variants
  geneVariants: GeneVariant[];
  
  // Medication Recommendations by Category
  medicationRecommendations: MedicationRecommendation[];
  
  // Medications to Avoid
  medicationsToAvoid: MedicationToAvoid[];
  
  // Warnings
  criticalWarnings: string[];
}

export const mockGenomicProfiles: GenomicProfile[] = [
  // Profile 1: CYP2D6 Poor Metabolizer
  {
    id: "profile-001",
    patientId: "PT-2024-001",
    testDate: "2024-11-15",
    labName: "GenePath Diagnostics",
    reportId: "GP-2024-11-001",
    summary: {
      totalGenesAnalyzed: 12,
      actionableFindings: 4,
      riskLevel: "Moderate",
      keyInsights: [
        "CYP2D6 Poor Metabolizer: Reduced ability to process certain pain medications and antidepressants",
        "SLCO1B1 variant detected: Increased risk of statin-induced muscle pain",
        "Normal CYP2C19 function: Standard dosing for clopidogrel and PPIs",
        "CYP3A4 Normal Metabolizer: Standard dosing for most medications"
      ]
    },
    geneVariants: [
      {
        gene: "CYP2D6",
        alleles: "*4/*4",
        phenotype: "Poor Metabolizer",
        metabolizerType: "Poor",
        clinicalSignificance: "High"
      },
      {
        gene: "CYP2C19",
        alleles: "*1/*1",
        phenotype: "Normal Metabolizer",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "CYP3A4",
        alleles: "*1/*1",
        phenotype: "Normal Metabolizer",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "SLCO1B1",
        alleles: "*5/*5",
        phenotype: "Decreased Function",
        metabolizerType: "Poor",
        clinicalSignificance: "Moderate"
      },
      {
        gene: "VKORC1",
        alleles: "-1639G>A (AA)",
        phenotype: "Low Warfarin Dose Required",
        metabolizerType: "Normal",
        clinicalSignificance: "High"
      }
    ],
    medicationRecommendations: [
      {
        category: "Pain Management",
        medications: [
          {
            name: "Codeine",
            genericName: "codeine",
            recommendation: "Avoid",
            reason: "CYP2D6 Poor Metabolizer: Cannot convert codeine to morphine. Medication will be ineffective for pain relief.",
            alternativeSuggestion: "Consider acetaminophen, ibuprofen, or non-CYP2D6 dependent opioids"
          },
          {
            name: "Tramadol",
            genericName: "tramadol",
            recommendation: "Consider alternatives",
            reason: "CYP2D6 Poor Metabolizer: Reduced effectiveness. May not provide adequate pain relief.",
            alternativeSuggestion: "Consider morphine, oxycodone, or NSAIDs"
          },
          {
            name: "Hydrocodone",
            genericName: "hydrocodone",
            recommendation: "Use with caution",
            reason: "CYP2D6 Poor Metabolizer: May have reduced effectiveness. Monitor pain control closely.",
            alternativeSuggestion: "Consider oxycodone or morphine if inadequate response"
          },
          {
            name: "Morphine",
            genericName: "morphine",
            recommendation: "Use as directed",
            reason: "Not significantly affected by CYP2D6 status. Standard dosing appropriate."
          }
        ]
      },
      {
        category: "Cardiovascular",
        medications: [
          {
            name: "Simvastatin",
            genericName: "simvastatin",
            recommendation: "Dose adjustment needed",
            reason: "SLCO1B1 *5/*5: Increased risk of muscle pain and rhabdomyolysis. Use lowest effective dose (≤20mg/day).",
            alternativeSuggestion: "Consider pravastatin or rosuvastatin as alternatives"
          },
          {
            name: "Atorvastatin",
            genericName: "atorvastatin",
            recommendation: "Use with caution",
            reason: "SLCO1B1 variant: Moderate risk of muscle toxicity. Start with low dose and monitor for muscle pain.",
            alternativeSuggestion: "Consider pravastatin or rosuvastatin"
          },
          {
            name: "Warfarin",
            genericName: "warfarin",
            recommendation: "Dose adjustment needed",
            reason: "VKORC1 -1639G>A (AA): Requires lower than average warfarin dose. Start with 2-3mg/day and monitor INR closely.",
            alternativeSuggestion: "Consider DOACs (apixaban, rivaroxaban) which don't require genetic dosing"
          },
          {
            name: "Clopidogrel",
            genericName: "clopidogrel",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard activation of clopidogrel. Normal antiplatelet effect expected."
          }
        ]
      },
      {
        category: "Psychiatric Medications",
        medications: [
          {
            name: "Venlafaxine (Effexor)",
            genericName: "venlafaxine",
            recommendation: "Use with caution",
            reason: "CYP2D6 Poor Metabolizer: Increased drug levels and side effects possible. Start with lower dose.",
            alternativeSuggestion: "Consider sertraline or escitalopram"
          },
          {
            name: "Paroxetine (Paxil)",
            genericName: "paroxetine",
            recommendation: "Consider alternatives",
            reason: "CYP2D6 Poor Metabolizer: Significantly increased drug levels. Higher risk of side effects.",
            alternativeSuggestion: "Consider sertraline, citalopram, or escitalopram"
          },
          {
            name: "Sertraline (Zoloft)",
            genericName: "sertraline",
            recommendation: "Use as directed",
            reason: "Minimal CYP2D6 involvement. Standard dosing appropriate."
          },
          {
            name: "Aripiprazole (Abilify)",
            genericName: "aripiprazole",
            recommendation: "Dose adjustment needed",
            reason: "CYP2D6 Poor Metabolizer: Reduce dose by 50% to avoid excessive drug levels and side effects."
          }
        ]
      },
      {
        category: "Gastrointestinal",
        medications: [
          {
            name: "Omeprazole (Prilosec)",
            genericName: "omeprazole",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard metabolism and effectiveness expected."
          },
          {
            name: "Pantoprazole (Protonix)",
            genericName: "pantoprazole",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard dosing provides expected acid suppression."
          }
        ]
      }
    ],
    medicationsToAvoid: [
      {
        name: "Codeine",
        genericName: "codeine",
        reason: "Will be completely ineffective for pain relief",
        geneticBasis: "CYP2D6 Poor Metabolizer (*4/*4): Cannot convert codeine into its active form (morphine). The medication will provide no pain relief.",
        alternatives: "Acetaminophen, ibuprofen, naproxen, morphine, oxycodone, or hydromorphone"
      },
      {
        name: "Simvastatin (High Dose)",
        genericName: "simvastatin >20mg",
        reason: "Severe risk of muscle damage and rhabdomyolysis",
        geneticBasis: "SLCO1B1 *5/*5 variant: Dramatically reduces drug clearance, leading to toxic accumulation in muscle tissue. Risk of life-threatening muscle breakdown.",
        alternatives: "Pravastatin, rosuvastatin, or atorvastatin at low doses with careful monitoring"
      },
      {
        name: "Paroxetine (Paxil)",
        genericName: "paroxetine",
        reason: "Excessive drug accumulation and severe side effects",
        geneticBasis: "CYP2D6 Poor Metabolizer: Drug levels can be 3-5 times higher than normal, causing severe nausea, drowsiness, and withdrawal symptoms.",
        alternatives: "Sertraline (Zoloft), escitalopram (Lexapro), or citalopram (Celexa)"
      }
    ],
    criticalWarnings: [
      "⚠️ AVOID CODEINE: Will not be effective for pain relief due to CYP2D6 Poor Metabolizer status",
      "⚠️ SIMVASTATIN: Use maximum 20mg/day due to SLCO1B1 variant and muscle toxicity risk",
      "⚠️ WARFARIN: Requires lower starting dose (2-3mg/day) due to VKORC1 variant"
    ]
  },

  // Profile 2: CYP2C19 Ultra-rapid Metabolizer
  {
    id: "profile-002",
    patientId: "PT-2024-002",
    testDate: "2024-11-18",
    labName: "PharmaGenomics Lab",
    reportId: "PGL-2024-11-002",
    summary: {
      totalGenesAnalyzed: 12,
      actionableFindings: 3,
      riskLevel: "Moderate",
      keyInsights: [
        "CYP2C19 Ultra-rapid Metabolizer: Reduced effectiveness of clopidogrel and PPIs",
        "CYP2D6 Normal Metabolizer: Standard dosing for most pain and psychiatric medications",
        "TPMT Normal Activity: Standard dosing for azathioprine and mercaptopurine",
        "G6PD Normal: No restrictions on oxidative stress medications"
      ]
    },
    geneVariants: [
      {
        gene: "CYP2C19",
        alleles: "*17/*17",
        phenotype: "Ultra-rapid Metabolizer",
        metabolizerType: "Ultra-rapid",
        clinicalSignificance: "High"
      },
      {
        gene: "CYP2D6",
        alleles: "*1/*1",
        phenotype: "Normal Metabolizer",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "CYP3A5",
        alleles: "*1/*3",
        phenotype: "Intermediate Metabolizer",
        metabolizerType: "Intermediate",
        clinicalSignificance: "Moderate"
      },
      {
        gene: "TPMT",
        alleles: "*1/*1",
        phenotype: "Normal Activity",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "G6PD",
        alleles: "Normal",
        phenotype: "Normal Activity",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      }
    ],
    medicationRecommendations: [
      {
        category: "Cardiovascular",
        medications: [
          {
            name: "Clopidogrel (Plavix)",
            genericName: "clopidogrel",
            recommendation: "Consider alternatives",
            reason: "CYP2C19 Ultra-rapid Metabolizer: Rapid inactivation leads to reduced antiplatelet effect and increased risk of cardiovascular events.",
            alternativeSuggestion: "Consider prasugrel or ticagrelor which are not affected by CYP2C19 status"
          },
          {
            name: "Prasugrel (Effient)",
            genericName: "prasugrel",
            recommendation: "Use as directed",
            reason: "Not affected by CYP2C19 status. Provides consistent antiplatelet effect."
          },
          {
            name: "Ticagrelor (Brilinta)",
            genericName: "ticagrelor",
            recommendation: "Use as directed",
            reason: "Not affected by CYP2C19 status. Direct-acting antiplatelet agent."
          },
          {
            name: "Metoprolol",
            genericName: "metoprolol",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard dosing provides expected beta-blockade."
          }
        ]
      },
      {
        category: "Gastrointestinal",
        medications: [
          {
            name: "Omeprazole (Prilosec)",
            genericName: "omeprazole",
            recommendation: "Dose adjustment needed",
            reason: "CYP2C19 Ultra-rapid Metabolizer: Rapid metabolism reduces effectiveness. May need higher doses or twice-daily dosing for adequate acid suppression.",
            alternativeSuggestion: "Consider pantoprazole or rabeprazole, or increase omeprazole dose"
          },
          {
            name: "Esomeprazole (Nexium)",
            genericName: "esomeprazole",
            recommendation: "Dose adjustment needed",
            reason: "CYP2C19 Ultra-rapid Metabolizer: May require higher doses (40mg BID) for GERD or ulcer healing.",
            alternativeSuggestion: "Consider H2 blockers (famotidine) if PPIs inadequate"
          },
          {
            name: "Pantoprazole (Protonix)",
            genericName: "pantoprazole",
            recommendation: "Use with caution",
            reason: "CYP2C19 Ultra-rapid Metabolizer: Less affected than omeprazole but may still need dose adjustment. Monitor symptom control."
          }
        ]
      },
      {
        category: "Psychiatric Medications",
        medications: [
          {
            name: "Escitalopram (Lexapro)",
            genericName: "escitalopram",
            recommendation: "Dose adjustment needed",
            reason: "CYP2C19 Ultra-rapid Metabolizer: Rapid metabolism may reduce effectiveness. May need higher doses (15-20mg) for therapeutic effect.",
            alternativeSuggestion: "Consider sertraline or venlafaxine"
          },
          {
            name: "Citalopram (Celexa)",
            genericName: "citalopram",
            recommendation: "Use with caution",
            reason: "CYP2C19 Ultra-rapid Metabolizer: May have reduced effectiveness. Monitor for adequate antidepressant response."
          },
          {
            name: "Sertraline (Zoloft)",
            genericName: "sertraline",
            recommendation: "Use as directed",
            reason: "Minimal CYP2C19 involvement. Standard dosing appropriate."
          },
          {
            name: "Venlafaxine (Effexor)",
            genericName: "venlafaxine",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard dosing provides expected therapeutic effect."
          }
        ]
      },
      {
        category: "Immunosuppressants",
        medications: [
          {
            name: "Tacrolimus (Prograf)",
            genericName: "tacrolimus",
            recommendation: "Dose adjustment needed",
            reason: "CYP3A5 *1/*3 Intermediate Metabolizer: May require slightly higher doses than CYP3A5 non-expressers. Monitor levels closely.",
            alternativeSuggestion: "Therapeutic drug monitoring essential"
          },
          {
            name: "Azathioprine (Imuran)",
            genericName: "azathioprine",
            recommendation: "Use as directed",
            reason: "TPMT Normal Activity: Standard dosing appropriate. No increased risk of bone marrow suppression."
          }
        ]
      },
      {
        category: "Pain Management",
        medications: [
          {
            name: "Codeine",
            genericName: "codeine",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard conversion to morphine. Expected analgesic effect."
          },
          {
            name: "Tramadol",
            genericName: "tramadol",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard activation and pain relief expected."
          }
        ]
      }
    ],
    medicationsToAvoid: [
      {
        name: "Clopidogrel (Plavix)",
        genericName: "clopidogrel",
        reason: "Significantly reduced effectiveness for preventing blood clots",
        geneticBasis: "CYP2C19 Ultra-rapid Metabolizer (*17/*17): Converts clopidogrel to active form too quickly, leading to rapid elimination and inadequate antiplatelet protection.",
        alternatives: "Prasugrel (Effient) or ticagrelor (Brilinta) - these don't require CYP2C19 activation"
      },
      {
        name: "Voriconazole (Antifungal)",
        genericName: "voriconazole",
        reason: "Subtherapeutic drug levels - treatment failure risk",
        geneticBasis: "CYP2C19 Ultra-rapid Metabolizer: Metabolizes drug too quickly, resulting in insufficient antifungal coverage.",
        alternatives: "Posaconazole, isavuconazole, or amphotericin B with therapeutic drug monitoring"
      }
    ],
    criticalWarnings: [
      "⚠️ CLOPIDOGREL: Reduced effectiveness due to CYP2C19 Ultra-rapid Metabolizer status. Consider prasugrel or ticagrelor.",
      "⚠️ PROTON PUMP INHIBITORS: May need higher doses or twice-daily dosing for adequate acid suppression",
      "⚠️ ESCITALOPRAM: May require higher doses (15-20mg) for therapeutic antidepressant effect"
    ]
  },

  // Profile 3: CYP2D6 Ultra-rapid Metabolizer
  {
    id: "profile-003",
    patientId: "PT-2024-003",
    testDate: "2024-11-20",
    labName: "GenePath Diagnostics",
    reportId: "GP-2024-11-003",
    summary: {
      totalGenesAnalyzed: 12,
      actionableFindings: 5,
      riskLevel: "High",
      keyInsights: [
        "CYP2D6 Ultra-rapid Metabolizer: Increased risk of toxicity with codeine and tramadol",
        "CYP2C9 *2/*3: Poor warfarin metabolism - bleeding risk with standard doses",
        "VKORC1 variant: Further increases warfarin sensitivity",
        "HLA-B*5701 Negative: Can safely use abacavir if needed"
      ]
    },
    geneVariants: [
      {
        gene: "CYP2D6",
        alleles: "*1/*1xN (gene duplication)",
        phenotype: "Ultra-rapid Metabolizer",
        metabolizerType: "Ultra-rapid",
        clinicalSignificance: "High"
      },
      {
        gene: "CYP2C9",
        alleles: "*2/*3",
        phenotype: "Poor Metabolizer",
        metabolizerType: "Poor",
        clinicalSignificance: "High"
      },
      {
        gene: "CYP2C19",
        alleles: "*1/*2",
        phenotype: "Intermediate Metabolizer",
        metabolizerType: "Intermediate",
        clinicalSignificance: "Moderate"
      },
      {
        gene: "VKORC1",
        alleles: "-1639G>A (AA)",
        phenotype: "Low Warfarin Dose Required",
        metabolizerType: "Normal",
        clinicalSignificance: "High"
      },
      {
        gene: "HLA-B",
        alleles: "*5701 Negative",
        phenotype: "Normal Risk",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      }
    ],
    medicationRecommendations: [
      {
        category: "Pain Management",
        medications: [
          {
            name: "Codeine",
            genericName: "codeine",
            recommendation: "Avoid",
            reason: "CYP2D6 Ultra-rapid Metabolizer: Excessive conversion to morphine can cause life-threatening respiratory depression, especially in children. FDA Black Box Warning.",
            alternativeSuggestion: "Use morphine, oxycodone, or non-opioid alternatives"
          },
          {
            name: "Tramadol",
            genericName: "tramadol",
            recommendation: "Avoid",
            reason: "CYP2D6 Ultra-rapid Metabolizer: Excessive conversion to active metabolite increases risk of toxicity and respiratory depression.",
            alternativeSuggestion: "Use morphine, oxycodone, or NSAIDs"
          },
          {
            name: "Hydrocodone",
            genericName: "hydrocodone",
            recommendation: "Use with caution",
            reason: "CYP2D6 Ultra-rapid Metabolizer: Increased conversion to hydromorphone may cause excessive sedation. Use lowest effective dose and monitor closely.",
            alternativeSuggestion: "Consider oxycodone or morphine with standard dosing"
          },
          {
            name: "Morphine",
            genericName: "morphine",
            recommendation: "Use as directed",
            reason: "Not significantly affected by CYP2D6 status. Standard dosing appropriate."
          },
          {
            name: "Oxycodone",
            genericName: "oxycodone",
            recommendation: "Use as directed",
            reason: "Minimal CYP2D6 involvement. Standard dosing provides predictable pain relief."
          }
        ]
      },
      {
        category: "Cardiovascular",
        medications: [
          {
            name: "Warfarin",
            genericName: "warfarin",
            recommendation: "Dose adjustment needed",
            reason: "CYP2C9 *2/*3 + VKORC1 variant: Extremely sensitive to warfarin. Requires very low doses (1-2mg/day). High bleeding risk with standard dosing.",
            alternativeSuggestion: "Strongly consider DOACs (apixaban, rivaroxaban, edoxaban) which don't require genetic dosing"
          },
          {
            name: "Metoprolol",
            genericName: "metoprolol",
            recommendation: "Dose adjustment needed",
            reason: "CYP2D6 Ultra-rapid Metabolizer: Rapid metabolism reduces effectiveness. May need higher doses or more frequent dosing for adequate beta-blockade.",
            alternativeSuggestion: "Consider atenolol or bisoprolol which are not CYP2D6 dependent"
          },
          {
            name: "Carvedilol",
            genericName: "carvedilol",
            recommendation: "Use with caution",
            reason: "CYP2D6 Ultra-rapid Metabolizer: May have reduced effectiveness. Monitor blood pressure and heart rate response."
          },
          {
            name: "Clopidogrel",
            genericName: "clopidogrel",
            recommendation: "Use with caution",
            reason: "CYP2C19 Intermediate Metabolizer: Moderately reduced activation may decrease antiplatelet effect. Monitor for cardiovascular events.",
            alternativeSuggestion: "Consider prasugrel or ticagrelor for higher-risk patients"
          }
        ]
      },
      {
        category: "Psychiatric Medications",
        medications: [
          {
            name: "Venlafaxine (Effexor)",
            genericName: "venlafaxine",
            recommendation: "Dose adjustment needed",
            reason: "CYP2D6 Ultra-rapid Metabolizer: Rapid conversion to active metabolite may cause excessive side effects. Start with lower dose.",
            alternativeSuggestion: "Consider sertraline or escitalopram"
          },
          {
            name: "Fluoxetine (Prozac)",
            genericName: "fluoxetine",
            recommendation: "Use with caution",
            reason: "CYP2D6 Ultra-rapid Metabolizer: May have reduced effectiveness due to rapid metabolism. Monitor antidepressant response."
          },
          {
            name: "Aripiprazole (Abilify)",
            genericName: "aripiprazole",
            recommendation: "Dose adjustment needed",
            reason: "CYP2D6 Ultra-rapid Metabolizer: Rapid metabolism may reduce effectiveness. May need higher doses for therapeutic effect.",
            alternativeSuggestion: "Monitor for adequate antipsychotic response"
          },
          {
            name: "Risperidone (Risperdal)",
            genericName: "risperidone",
            recommendation: "Use with caution",
            reason: "CYP2D6 Ultra-rapid Metabolizer: Rapid conversion to active metabolite (paliperidone) may alter drug effect. Monitor closely."
          }
        ]
      },
      {
        category: "NSAIDs",
        medications: [
          {
            name: "Celecoxib (Celebrex)",
            genericName: "celecoxib",
            recommendation: "Dose adjustment needed",
            reason: "CYP2C9 *2/*3: Reduced metabolism increases drug levels and bleeding risk. Use lowest effective dose (100mg/day max).",
            alternativeSuggestion: "Consider ibuprofen or naproxen"
          },
          {
            name: "Ibuprofen (Advil, Motrin)",
            genericName: "ibuprofen",
            recommendation: "Use as directed",
            reason: "Minimal CYP2C9 involvement. Standard dosing appropriate."
          }
        ]
      }
    ],
    medicationsToAvoid: [
      {
        name: "Codeine",
        genericName: "codeine",
        reason: "Life-threatening respiratory depression risk",
        geneticBasis: "CYP2D6 Ultra-rapid Metabolizer (*1/*2xN): Converts codeine to morphine extremely rapidly, causing toxic morphine levels and potentially fatal respiratory depression.",
        alternatives: "Morphine, oxycodone, or hydromorphone at carefully controlled doses"
      },
      {
        name: "Tramadol",
        genericName: "tramadol",
        reason: "Severe overdose risk and respiratory depression",
        geneticBasis: "CYP2D6 Ultra-rapid Metabolizer: Produces excessive active metabolite (O-desmethyltramadol), leading to opioid toxicity even at standard doses.",
        alternatives: "Morphine, oxycodone, or non-opioid pain management strategies"
      },
      {
        name: "Celecoxib (High Dose)",
        genericName: "celecoxib >100mg/day",
        reason: "Severe bleeding and cardiovascular risk",
        geneticBasis: "CYP2C9 Poor Metabolizer (*3/*3): Drug accumulation leads to excessive COX-2 inhibition, increasing risk of GI bleeding and cardiovascular events.",
        alternatives: "Acetaminophen, low-dose ibuprofen, or topical NSAIDs"
      }
    ],
    criticalWarnings: [
      "🚨 AVOID CODEINE & TRAMADOL: Life-threatening respiratory depression risk due to CYP2D6 Ultra-rapid Metabolizer status",
      "🚨 WARFARIN: Extremely sensitive - requires very low doses (1-2mg/day). High bleeding risk. Consider DOACs instead.",
      "⚠️ CELECOXIB: Maximum dose 100mg/day due to CYP2C9 Poor Metabolizer status and bleeding risk"
    ]
  },

  // Profile 4: TPMT Deficiency
  {
    id: "profile-004",
    patientId: "PT-2024-004",
    testDate: "2024-11-22",
    labName: "PharmaGenomics Lab",
    reportId: "PGL-2024-11-004",
    summary: {
      totalGenesAnalyzed: 12,
      actionableFindings: 3,
      riskLevel: "High",
      keyInsights: [
        "TPMT Deficiency: High risk of severe bone marrow suppression with azathioprine/mercaptopurine",
        "DPYD Intermediate Activity: Increased toxicity risk with fluorouracil chemotherapy",
        "CYP2D6 Intermediate Metabolizer: Variable response to certain medications",
        "All other genes show normal function"
      ]
    },
    geneVariants: [
      {
        gene: "TPMT",
        alleles: "*3A/*3C",
        phenotype: "Deficient Activity",
        metabolizerType: "Poor",
        clinicalSignificance: "High"
      },
      {
        gene: "DPYD",
        alleles: "*2A/*1",
        phenotype: "Intermediate Activity",
        metabolizerType: "Intermediate",
        clinicalSignificance: "High"
      },
      {
        gene: "CYP2D6",
        alleles: "*1/*4",
        phenotype: "Intermediate Metabolizer",
        metabolizerType: "Intermediate",
        clinicalSignificance: "Moderate"
      },
      {
        gene: "CYP2C19",
        alleles: "*1/*1",
        phenotype: "Normal Metabolizer",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "CYP3A5",
        alleles: "*3/*3",
        phenotype: "Non-expresser",
        metabolizerType: "Poor",
        clinicalSignificance: "Low"
      }
    ],
    medicationRecommendations: [
      {
        category: "Immunosuppressants",
        medications: [
          {
            name: "Azathioprine (Imuran)",
            genericName: "azathioprine",
            recommendation: "Dose adjustment needed",
            reason: "TPMT Deficiency: Reduce starting dose by 90% (5-10mg daily instead of 50-100mg). High risk of life-threatening bone marrow suppression with standard doses. Requires frequent CBC monitoring.",
            alternativeSuggestion: "Consider alternative immunosuppressants (mycophenolate, methotrexate)"
          },
          {
            name: "Mercaptopurine (Purinethol)",
            genericName: "mercaptopurine",
            recommendation: "Dose adjustment needed",
            reason: "TPMT Deficiency: Reduce dose by 90%. Extreme risk of severe myelosuppression with standard dosing. Weekly CBC monitoring required.",
            alternativeSuggestion: "Consider alternative agents depending on indication"
          },
          {
            name: "Thioguanine",
            genericName: "thioguanine",
            recommendation: "Dose adjustment needed",
            reason: "TPMT Deficiency: Reduce dose by 90%. High risk of bone marrow toxicity. Close hematologic monitoring essential."
          },
          {
            name: "Mycophenolate (CellCept)",
            genericName: "mycophenolate",
            recommendation: "Use as directed",
            reason: "Not affected by TPMT status. Safe alternative to azathioprine."
          }
        ]
      },
      {
        category: "Chemotherapy",
        medications: [
          {
            name: "Fluorouracil (5-FU)",
            genericName: "fluorouracil",
            recommendation: "Dose adjustment needed",
            reason: "DPYD Intermediate Activity: Reduce dose by 50% for initial cycle. Increased risk of severe toxicity (mucositis, diarrhea, neutropenia). Monitor closely.",
            alternativeSuggestion: "Consider alternative chemotherapy regimens"
          },
          {
            name: "Capecitabine (Xeloda)",
            genericName: "capecitabine",
            recommendation: "Dose adjustment needed",
            reason: "DPYD Intermediate Activity: Reduce dose by 50%. Metabolized to 5-FU. Same toxicity risks apply.",
            alternativeSuggestion: "Discuss with oncologist about alternative agents"
          }
        ]
      },
      {
        category: "Pain Management",
        medications: [
          {
            name: "Codeine",
            genericName: "codeine",
            recommendation: "Use with caution",
            reason: "CYP2D6 Intermediate Metabolizer: Variable conversion to morphine. Pain relief may be unpredictable. Monitor response.",
            alternativeSuggestion: "Consider morphine or oxycodone for more predictable effect"
          },
          {
            name: "Tramadol",
            genericName: "tramadol",
            recommendation: "Use with caution",
            reason: "CYP2D6 Intermediate Metabolizer: Variable activation may lead to inconsistent pain relief. Monitor effectiveness."
          },
          {
            name: "Morphine",
            genericName: "morphine",
            recommendation: "Use as directed",
            reason: "Not significantly affected by CYP2D6 status. Provides predictable pain relief."
          }
        ]
      },
      {
        category: "Psychiatric Medications",
        medications: [
          {
            name: "Venlafaxine (Effexor)",
            genericName: "venlafaxine",
            recommendation: "Use with caution",
            reason: "CYP2D6 Intermediate Metabolizer: May have variable drug levels. Monitor for side effects and therapeutic response."
          },
          {
            name: "Paroxetine (Paxil)",
            genericName: "paroxetine",
            recommendation: "Use with caution",
            reason: "CYP2D6 Intermediate Metabolizer: May have increased drug levels. Start with lower dose and titrate based on response."
          },
          {
            name: "Sertraline (Zoloft)",
            genericName: "sertraline",
            recommendation: "Use as directed",
            reason: "Minimal CYP2D6 involvement. Standard dosing appropriate."
          }
        ]
      },
      {
        category: "Gastrointestinal",
        medications: [
          {
            name: "Omeprazole (Prilosec)",
            genericName: "omeprazole",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard metabolism and effectiveness expected."
          }
        ]
      }
    ],
    medicationsToAvoid: [
      {
        name: "Azathioprine (Standard Dose)",
        genericName: "azathioprine at normal doses",
        reason: "Life-threatening bone marrow suppression",
        geneticBasis: "TPMT Deficiency (*3A/*3A): Cannot metabolize thiopurine drugs. Standard doses cause severe, potentially fatal bone marrow failure and immunosuppression.",
        alternatives: "Use azathioprine at 10% of standard dose with close monitoring, or consider alternative immunosuppressants (mycophenolate, methotrexate)"
      },
      {
        name: "Mercaptopurine (Standard Dose)",
        genericName: "mercaptopurine at normal doses",
        reason: "Severe bone marrow toxicity",
        geneticBasis: "TPMT Deficiency: Accumulation of toxic metabolites causes life-threatening myelosuppression, infections, and bleeding.",
        alternatives: "Reduce dose by 90% with intensive monitoring, or use alternative chemotherapy agents"
      },
      {
        name: "Fluorouracil/Capecitabine (Standard Dose)",
        genericName: "5-FU, capecitabine at normal doses",
        reason: "Severe chemotherapy toxicity",
        geneticBasis: "DPYD variant: Reduced ability to break down fluoropyrimidine drugs, leading to toxic accumulation causing severe diarrhea, mucositis, and bone marrow suppression.",
        alternatives: "Reduce dose by 50% or consider alternative chemotherapy regimens without fluoropyrimidines"
      }
    ],
    criticalWarnings: [
      "🚨 AZATHIOPRINE/MERCAPTOPURINE: Reduce dose by 90% due to TPMT Deficiency. Life-threatening bone marrow suppression risk with standard doses.",
      "🚨 FLUOROURACIL/CAPECITABINE: Reduce dose by 50% due to DPYD variant. Severe toxicity risk with standard chemotherapy doses.",
      "⚠️ Inform all healthcare providers about TPMT and DPYD status before starting new medications"
    ]
  },

  // Profile 5: Normal/Favorable Profile
  {
    id: "profile-005",
    patientId: "PT-2024-005",
    testDate: "2024-11-25",
    labName: "GenePath Diagnostics",
    reportId: "GP-2024-11-005",
    summary: {
      totalGenesAnalyzed: 12,
      actionableFindings: 1,
      riskLevel: "Low",
      keyInsights: [
        "All major drug-metabolizing enzymes show normal function",
        "SLCO1B1 variant: Mild increased risk with high-dose simvastatin",
        "No contraindications to common medications identified",
        "Overall favorable pharmacogenomic profile"
      ]
    },
    geneVariants: [
      {
        gene: "CYP2D6",
        alleles: "*1/*1",
        phenotype: "Normal Metabolizer",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "CYP2C19",
        alleles: "*1/*1",
        phenotype: "Normal Metabolizer",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "CYP2C9",
        alleles: "*1/*1",
        phenotype: "Normal Metabolizer",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "CYP3A5",
        alleles: "*1/*1",
        phenotype: "Normal Expresser",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "SLCO1B1",
        alleles: "*1/*5",
        phenotype: "Intermediate Function",
        metabolizerType: "Intermediate",
        clinicalSignificance: "Moderate"
      },
      {
        gene: "TPMT",
        alleles: "*1/*1",
        phenotype: "Normal Activity",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "DPYD",
        alleles: "*1/*1",
        phenotype: "Normal Activity",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      },
      {
        gene: "VKORC1",
        alleles: "-1639G>A (GG)",
        phenotype: "Normal Warfarin Sensitivity",
        metabolizerType: "Normal",
        clinicalSignificance: "Low"
      }
    ],
    medicationRecommendations: [
      {
        category: "Pain Management",
        medications: [
          {
            name: "Codeine",
            genericName: "codeine",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard conversion to morphine. Expected analgesic effect with standard dosing."
          },
          {
            name: "Tramadol",
            genericName: "tramadol",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard activation provides expected pain relief."
          },
          {
            name: "Hydrocodone",
            genericName: "hydrocodone",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard metabolism provides predictable pain control."
          },
          {
            name: "Morphine",
            genericName: "morphine",
            recommendation: "Use as directed",
            reason: "Standard dosing appropriate for all metabolizer types."
          },
          {
            name: "Oxycodone",
            genericName: "oxycodone",
            recommendation: "Use as directed",
            reason: "Standard dosing provides predictable analgesic effect."
          }
        ]
      },
      {
        category: "Cardiovascular",
        medications: [
          {
            name: "Clopidogrel (Plavix)",
            genericName: "clopidogrel",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard activation provides expected antiplatelet effect."
          },
          {
            name: "Warfarin",
            genericName: "warfarin",
            recommendation: "Use as directed",
            reason: "CYP2C9 *1/*1 and VKORC1 GG: Standard dosing (5mg/day starting dose) appropriate. Normal INR response expected."
          },
          {
            name: "Simvastatin",
            genericName: "simvastatin",
            recommendation: "Use with caution",
            reason: "SLCO1B1 *1/*5: Moderate risk of muscle pain with high doses (>40mg/day). Use ≤40mg/day or consider alternative statin.",
            alternativeSuggestion: "Consider pravastatin or rosuvastatin for high-dose statin therapy"
          },
          {
            name: "Atorvastatin",
            genericName: "atorvastatin",
            recommendation: "Use as directed",
            reason: "SLCO1B1 *1/*5: Low to moderate risk of muscle toxicity. Standard dosing generally well-tolerated."
          },
          {
            name: "Metoprolol",
            genericName: "metoprolol",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard dosing provides expected beta-blockade."
          }
        ]
      },
      {
        category: "Psychiatric Medications",
        medications: [
          {
            name: "Sertraline (Zoloft)",
            genericName: "sertraline",
            recommendation: "Use as directed",
            reason: "Standard dosing appropriate. Expected antidepressant response."
          },
          {
            name: "Escitalopram (Lexapro)",
            genericName: "escitalopram",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard dosing provides expected therapeutic effect."
          },
          {
            name: "Venlafaxine (Effexor)",
            genericName: "venlafaxine",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard dosing appropriate."
          },
          {
            name: "Aripiprazole (Abilify)",
            genericName: "aripiprazole",
            recommendation: "Use as directed",
            reason: "CYP2D6 Normal Metabolizer: Standard dosing provides expected antipsychotic effect."
          }
        ]
      },
      {
        category: "Gastrointestinal",
        medications: [
          {
            name: "Omeprazole (Prilosec)",
            genericName: "omeprazole",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard acid suppression with typical dosing."
          },
          {
            name: "Pantoprazole (Protonix)",
            genericName: "pantoprazole",
            recommendation: "Use as directed",
            reason: "CYP2C19 Normal Metabolizer: Standard dosing provides expected acid reduction."
          }
        ]
      },
      {
        category: "Immunosuppressants",
        medications: [
          {
            name: "Tacrolimus (Prograf)",
            genericName: "tacrolimus",
            recommendation: "Use as directed",
            reason: "CYP3A5 *1/*1 Expresser: May require slightly higher doses than non-expressers. Therapeutic drug monitoring essential.",
            alternativeSuggestion: "Monitor trough levels closely and adjust dose to maintain therapeutic range"
          },
          {
            name: "Azathioprine (Imuran)",
            genericName: "azathioprine",
            recommendation: "Use as directed",
            reason: "TPMT Normal Activity: Standard dosing appropriate. No increased risk of bone marrow suppression."
          }
        ]
      },
      {
        category: "NSAIDs",
        medications: [
          {
            name: "Celecoxib (Celebrex)",
            genericName: "celecoxib",
            recommendation: "Use as directed",
            reason: "CYP2C9 *1/*1: Standard metabolism. Normal dosing appropriate."
          },
          {
            name: "Ibuprofen (Advil, Motrin)",
            genericName: "ibuprofen",
            recommendation: "Use as directed",
            reason: "Standard dosing provides expected anti-inflammatory and analgesic effects."
          }
        ]
      }
    ],
    medicationsToAvoid: [
      {
        name: "Simvastatin (High Dose)",
        genericName: "simvastatin >40mg",
        reason: "Increased risk of muscle damage",
        geneticBasis: "SLCO1B1 variant (*5/*1): Moderately reduced drug clearance increases risk of statin-induced myopathy at high doses.",
        alternatives: "Use simvastatin ≤40mg/day, or switch to pravastatin or rosuvastatin which have lower myopathy risk"
      }
    ],
    criticalWarnings: [
      "⚠️ SIMVASTATIN: Use ≤40mg/day due to SLCO1B1 variant and moderate muscle toxicity risk",
      "✅ Overall favorable genetic profile - most medications can be used at standard doses"
    ]
  }
];

// Helper function to get a random profile
export function getRandomGenomicProfile(): GenomicProfile {
  const randomIndex = Math.floor(Math.random() * mockGenomicProfiles.length);
  return mockGenomicProfiles[randomIndex];
}

// Helper function to get profile by ID
export function getGenomicProfileById(id: string): GenomicProfile | undefined {
  return mockGenomicProfiles.find(profile => profile.id === id);
}
