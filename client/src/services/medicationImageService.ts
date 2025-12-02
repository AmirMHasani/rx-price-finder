/**
 * Service to get medication images
 * Maps medication names to image paths
 */

interface MedicationImageMap {
  [key: string]: string;
}

// Map of medication names (lowercase) to image paths
const medicationImages: MedicationImageMap = {
  // Brand names
  'eliquis': '/medication-images/eliquis.webp',
  'lipitor': '/medication-images/lipitor.jpeg',
  
  // Generic names that map to brand images
  'apixaban': '/medication-images/eliquis.webp',
  'atorvastatin': '/medication-images/lipitor.jpeg',
};

// Default fallback image for medications without specific images
const DEFAULT_IMAGE = '/medication-images/generic-pills.jpg';

/**
 * Get the image path for a medication
 * @param medicationName - The name of the medication
 * @returns The path to the medication image
 */
export function getMedicationImage(medicationName: string): string {
  if (!medicationName) return DEFAULT_IMAGE;
  
  // Convert to lowercase for case-insensitive matching
  const name = medicationName.toLowerCase().trim();
  
  // Check for exact match
  if (medicationImages[name]) {
    return medicationImages[name];
  }
  
  // Check if medication name contains any of the known medications
  for (const [key, imagePath] of Object.entries(medicationImages)) {
    if (name.includes(key)) {
      return imagePath;
    }
  }
  
  // Return default image if no match found
  return DEFAULT_IMAGE;
}

/**
 * Check if a medication has a specific image (not the default)
 * @param medicationName - The name of the medication
 * @returns True if the medication has a specific image
 */
export function hasSpecificImage(medicationName: string): boolean {
  return getMedicationImage(medicationName) !== DEFAULT_IMAGE;
}
