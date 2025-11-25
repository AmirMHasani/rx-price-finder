/**
 * ZIP Code to Coordinates Service
 * Provides approximate coordinates for US ZIP codes
 */

interface ZipCodeData {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

// Sample ZIP codes with their coordinates (major cities)
// In production, this would use a complete ZIP code database or API
const zipCodeDatabase: Record<string, ZipCodeData> = {
  // Boston, MA
  "02108": { lat: 42.3601, lng: -71.0589, city: "Boston", state: "MA" },
  "02215": { lat: 42.3505, lng: -71.0892, city: "Boston", state: "MA" },
  "02116": { lat: 42.3488, lng: -71.0820, city: "Boston", state: "MA" },
  
  // New York, NY
  "10001": { lat: 40.7506, lng: -73.9971, city: "New York", state: "NY" },
  "10002": { lat: 40.7156, lng: -73.9860, city: "New York", state: "NY" },
  "10003": { lat: 40.7310, lng: -73.9896, city: "New York", state: "NY" },
  "10016": { lat: 40.7450, lng: -73.9782, city: "New York", state: "NY" },
  "10021": { lat: 40.7686, lng: -73.9593, city: "New York", state: "NY" },
  
  // Los Angeles, CA
  "90001": { lat: 33.9731, lng: -118.2479, city: "Los Angeles", state: "CA" },
  "90012": { lat: 34.0631, lng: -118.2373, city: "Los Angeles", state: "CA" },
  "90028": { lat: 34.1016, lng: -118.3267, city: "Los Angeles", state: "CA" },
  "90210": { lat: 34.1030, lng: -118.4105, city: "Beverly Hills", state: "CA" },
  
  // Chicago, IL
  "60601": { lat: 41.8856, lng: -87.6214, city: "Chicago", state: "IL" },
  "60611": { lat: 41.8955, lng: -87.6233, city: "Chicago", state: "IL" },
  "60614": { lat: 41.9214, lng: -87.6531, city: "Chicago", state: "IL" },
  
  // Miami, FL
  "33101": { lat: 25.7753, lng: -80.1977, city: "Miami", state: "FL" },
  "33125": { lat: 25.7823, lng: -80.2287, city: "Miami", state: "FL" },
  "33130": { lat: 25.7547, lng: -80.1925, city: "Miami", state: "FL" },
  "33139": { lat: 25.7823, lng: -80.1321, city: "Miami Beach", state: "FL" },
  
  // Houston, TX
  "77001": { lat: 29.7505, lng: -95.3570, city: "Houston", state: "TX" },
  "77002": { lat: 29.7589, lng: -95.3677, city: "Houston", state: "TX" },
  "77003": { lat: 29.7463, lng: -95.3547, city: "Houston", state: "TX" },
  
  // Phoenix, AZ
  "85001": { lat: 33.4484, lng: -112.0740, city: "Phoenix", state: "AZ" },
  "85004": { lat: 33.4484, lng: -112.0740, city: "Phoenix", state: "AZ" },
  
  // Philadelphia, PA
  "19101": { lat: 39.9526, lng: -75.1652, city: "Philadelphia", state: "PA" },
  "19102": { lat: 39.9526, lng: -75.1652, city: "Philadelphia", state: "PA" },
  
  // San Antonio, TX
  "78201": { lat: 29.4252, lng: -98.4946, city: "San Antonio", state: "TX" },
  
  // San Diego, CA
  "92101": { lat: 32.7157, lng: -117.1611, city: "San Diego", state: "CA" },
  
  // Dallas, TX
  "75201": { lat: 32.7767, lng: -96.7970, city: "Dallas", state: "TX" },
  
  // San Jose, CA
  "95101": { lat: 37.3382, lng: -121.8863, city: "San Jose", state: "CA" },
  
  // Austin, TX
  "78701": { lat: 29.7604, lng: -97.7430, city: "Austin", state: "TX" },
  
  // Seattle, WA
  "98101": { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "WA" },
  "98102": { lat: 47.6295, lng: -122.3218, city: "Seattle", state: "WA" },
  
  // Denver, CO
  "80201": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
  
  // Washington, DC
  "20001": { lat: 38.9072, lng: -77.0369, city: "Washington", state: "DC" },
  
  // Atlanta, GA
  "30301": { lat: 33.7490, lng: -84.3880, city: "Atlanta", state: "GA" },
};

/**
 * Get coordinates for a ZIP code
 * Returns approximate coordinates or null if ZIP not found
 */
export function getZipCodeCoordinates(zipCode: string): ZipCodeData | null {
  // Remove any spaces or dashes
  const cleanZip = zipCode.replace(/[\s-]/g, "");
  
  // Try exact match first
  if (zipCodeDatabase[cleanZip]) {
    return zipCodeDatabase[cleanZip];
  }
  
  // Try first 3 digits (ZIP code prefix) for approximate location
  const zipPrefix = cleanZip.substring(0, 3);
  const matchingZip = Object.keys(zipCodeDatabase).find(zip => zip.startsWith(zipPrefix));
  
  if (matchingZip) {
    return zipCodeDatabase[matchingZip];
  }
  
  // If no match, return null (caller should handle this)
  return null;
}

/**
 * Estimate coordinates for unknown ZIP codes based on ZIP code ranges
 * This is a fallback for when exact ZIP is not in database
 */
export function estimateZipCodeLocation(zipCode: string): ZipCodeData | null {
  const cleanZip = zipCode.replace(/[\s-]/g, "");
  const zipNum = parseInt(cleanZip);
  
  if (isNaN(zipNum)) {
    return null;
  }
  
  // ZIP code ranges by region (very approximate)
  // This is a simplified version - production would use a complete database
  if (zipNum >= 10000 && zipNum <= 14999) {
    // New York area
    return { lat: 40.7128, lng: -74.0060, city: "New York", state: "NY" };
  } else if (zipNum >= 20000 && zipNum <= 20599) {
    // Washington DC area
    return { lat: 38.9072, lng: -77.0369, city: "Washington", state: "DC" };
  } else if (zipNum >= 30000 && zipNum <= 31999) {
    // Georgia
    return { lat: 33.7490, lng: -84.3880, city: "Atlanta", state: "GA" };
  } else if (zipNum >= 60000 && zipNum <= 62999) {
    // Chicago area
    return { lat: 41.8781, lng: -87.6298, city: "Chicago", state: "IL" };
  } else if (zipNum >= 75000 && zipNum <= 75999) {
    // Dallas area
    return { lat: 32.7767, lng: -96.7970, city: "Dallas", state: "TX" };
  } else if (zipNum >= 77000 && zipNum <= 77999) {
    // Houston area
    return { lat: 29.7604, lng: -95.3698, city: "Houston", state: "TX" };
  } else if (zipNum >= 85000 && zipNum <= 85999) {
    // Phoenix area
    return { lat: 33.4484, lng: -112.0740, city: "Phoenix", state: "AZ" };
  } else if (zipNum >= 90000 && zipNum <= 90999) {
    // Los Angeles area
    return { lat: 34.0522, lng: -118.2437, city: "Los Angeles", state: "CA" };
  } else if (zipNum >= 94000 && zipNum <= 94999) {
    // San Francisco area
    return { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" };
  } else if (zipNum >= 98000 && zipNum <= 98999) {
    // Seattle area
    return { lat: 47.6062, lng: -122.3321, city: "Seattle", state: "WA" };
  } else if (zipNum >= 2000 && zipNum <= 2799) {
    // Boston area
    return { lat: 42.3601, lng: -71.0589, city: "Boston", state: "MA" };
  }
  
  // Default to center of US if unknown
  return { lat: 39.8283, lng: -98.5795, city: "Unknown", state: "US" };
}

/**
 * Get coordinates for a ZIP code with fallback to estimation
 */
export function getZipCodeLocation(zipCode: string): ZipCodeData {
  const exactMatch = getZipCodeCoordinates(zipCode);
  if (exactMatch) {
    return exactMatch;
  }
  
  const estimated = estimateZipCodeLocation(zipCode);
  if (estimated) {
    return estimated;
  }
  
  // Final fallback to center of US
  return { lat: 39.8283, lng: -98.5795, city: "Unknown", state: "US" };
}
