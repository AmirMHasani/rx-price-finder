import type { MedicationResult } from "./medicationService";

/**
 * Simplify form labels by removing technical details
 */
function simplifyForm(form: string): string {
  if (!form) return form;
  
  let simplified = form;
  
  // Remove chemical suffixes
  simplified = simplified.replace(/\s*(sodium|hydrochloride|hcl|sulfate|citrate)\s*/gi, ' ');
  
  // Remove "/ML" patterns
  simplified = simplified.replace(/\s*\/ML\s*/gi, ' ');
  
  // Remove concentration patterns like "100 MG/ML"
  simplified = simplified.replace(/\d+\s*MG\/ML\s*/gi, '');
  
  // Remove volume patterns like "0.3 ML", "1 ML"
  simplified = simplified.replace(/\d+\.?\d*\s*ML\s*/gi, '');
  
  // Simplify "Injectable Solution" to just "Injectable"
  simplified = simplified.replace(/Injectable\s*Solution/gi, 'Injectable');
  
  // Clean up multiple spaces
  simplified = simplified.replace(/\s+/g, ' ').trim();
  
  return simplified;
}

/**
 * Simplify medication name by removing redundant technical details
 */
function simplifyName(name: string): string {
  if (!name) return name;
  
  let simplified = name;
  
  // Remove volume prefixes like "0.3 ML", "1 ML" at the start
  simplified = simplified.replace(/^\d+\.?\d*\s*ML\s+/i, '');
  
  // Remove chemical suffixes like "sodium", "hydrochloride"
  simplified = simplified.replace(/\s+(sodium|hydrochloride|hcl|sulfate|citrate)\s+/gi, ' ');
  
  // Remove concentration patterns like "100 MG/ML" (but keep final strength like "100 MG")
  simplified = simplified.replace(/\d+\s*MG\/ML\s*/gi, '');
  
  // Clean up multiple spaces
  simplified = simplified.replace(/\s+/g, ' ').trim();
  
  return simplified;
}

/**
 * Clean up medication search results by simplifying names and form labels
 */
export function cleanMedicationResults(results: MedicationResult[]): MedicationResult[] {
  return results.map(med => ({
    ...med,
    name: simplifyName(med.name),
    forms: med.forms?.map(form => simplifyForm(form)),
  }));
}
