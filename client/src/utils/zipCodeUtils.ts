import type { Pharmacy } from "@/data/pharmacies";

/**
 * Get approximate coordinates for a US ZIP code
 * Uses ZIP code prefix to determine general region
 */
export function getCoordinatesForZip(zip: string): { lat: number; lng: number } {
  const zipPrefix = parseInt(zip.substring(0, 2));
  
  // Northeast
  if (zipPrefix >= 0 && zipPrefix <= 6) {
    if (zipPrefix === 0) return { lat: 41.8240, lng: -71.4128 }; // Rhode Island
    if (zipPrefix === 1) return { lat: 40.7128, lng: -74.0060 }; // New York, NY
    if (zipPrefix === 2) return { lat: 38.9072, lng: -77.0369 }; // Washington, DC
    if (zipPrefix === 3) return { lat: 40.4406, lng: -79.9959 }; // Pittsburgh, PA
    if (zipPrefix === 4) return { lat: 42.3601, lng: -71.0589 }; // Boston, MA
    if (zipPrefix === 5) return { lat: 43.0731, lng: -89.4012 }; // Madison, WI
    return { lat: 41.8781, lng: -87.6298 }; // Chicago, IL
  }
  
  // Southeast
  if (zipPrefix >= 7 && zipPrefix <= 31) {
    if (zipPrefix === 7 || zipPrefix === 8) return { lat: 40.0583, lng: -74.4057 }; // New Jersey
    if (zipPrefix >= 10 && zipPrefix <= 14) return { lat: 33.7490, lng: -84.3880 }; // Atlanta, GA
    if (zipPrefix >= 15 && zipPrefix <= 19) return { lat: 35.2271, lng: -80.8431 }; // Charlotte, NC
    if (zipPrefix >= 20 && zipPrefix <= 27) return { lat: 30.3322, lng: -81.6557 }; // Jacksonville, FL
    if (zipPrefix >= 28 && zipPrefix <= 29) return { lat: 25.7617, lng: -80.1918 }; // Miami, FL
    if (zipPrefix >= 30 && zipPrefix <= 31) return { lat: 33.7490, lng: -84.3880 }; // Atlanta, GA
    return { lat: 27.9506, lng: -82.4572 }; // Tampa, FL
  }
  
  // Midwest
  if (zipPrefix >= 32 && zipPrefix <= 62) {
    if (zipPrefix >= 32 && zipPrefix <= 34) return { lat: 30.4383, lng: -84.2807 }; // Tallahassee, FL
    if (zipPrefix >= 35 && zipPrefix <= 36) return { lat: 33.5186, lng: -86.8104 }; // Birmingham, AL
    if (zipPrefix >= 37 && zipPrefix <= 38) return { lat: 36.1627, lng: -86.7816 }; // Nashville, TN
    if (zipPrefix >= 39 && zipPrefix <= 39) return { lat: 32.2988, lng: -90.1848 }; // Jackson, MS
    if (zipPrefix >= 40 && zipPrefix <= 42) return { lat: 38.2527, lng: -85.7585 }; // Louisville, KY
    if (zipPrefix >= 43 && zipPrefix <= 45) return { lat: 39.9612, lng: -82.9988 }; // Columbus, OH
    if (zipPrefix >= 46 && zipPrefix <= 47) return { lat: 39.7684, lng: -86.1581 }; // Indianapolis, IN
    if (zipPrefix >= 48 && zipPrefix <= 49) return { lat: 42.3314, lng: -83.0458 }; // Detroit, MI
    if (zipPrefix >= 50 && zipPrefix <= 52) return { lat: 41.5868, lng: -93.6250 }; // Des Moines, IA
    if (zipPrefix >= 53 && zipPrefix <= 54) return { lat: 43.0389, lng: -87.9065 }; // Milwaukee, WI
    if (zipPrefix >= 55 && zipPrefix <= 56) return { lat: 44.9778, lng: -93.2650 }; // Minneapolis, MN
    if (zipPrefix >= 57 && zipPrefix <= 57) return { lat: 43.5460, lng: -96.7313 }; // Sioux Falls, SD
    if (zipPrefix >= 58 && zipPrefix <= 58) return { lat: 46.8772, lng: -96.7898 }; // Fargo, ND
    if (zipPrefix >= 59 && zipPrefix <= 59) return { lat: 45.7833, lng: -108.5007 }; // Billings, MT
    if (zipPrefix >= 60 && zipPrefix <= 62) return { lat: 41.8781, lng: -87.6298 }; // Chicago, IL
    return { lat: 41.8781, lng: -87.6298 }; // Chicago, IL (default)
  }
  
  // South Central
  if (zipPrefix >= 63 && zipPrefix <= 79) {
    if (zipPrefix >= 63 && zipPrefix <= 65) return { lat: 38.6270, lng: -90.1994 }; // St. Louis, MO
    if (zipPrefix >= 66 && zipPrefix <= 67) return { lat: 39.0997, lng: -94.5786 }; // Kansas City, MO
    if (zipPrefix >= 68 && zipPrefix <= 69) return { lat: 41.2565, lng: -95.9345 }; // Omaha, NE
    if (zipPrefix >= 70 && zipPrefix <= 71) return { lat: 29.9511, lng: -90.0715 }; // New Orleans, LA
    if (zipPrefix >= 72 && zipPrefix <= 72) return { lat: 34.7465, lng: -92.2896 }; // Little Rock, AR
    if (zipPrefix >= 73 && zipPrefix <= 74) return { lat: 35.4676, lng: -97.5164 }; // Oklahoma City, OK
    if (zipPrefix >= 75 && zipPrefix <= 79) return { lat: 32.7767, lng: -96.7970 }; // Dallas, TX
    return { lat: 29.7604, lng: -95.3698 }; // Houston, TX (default)
  }
  
  // Mountain
  if (zipPrefix >= 80 && zipPrefix <= 89) {
    if (zipPrefix >= 80 && zipPrefix <= 81) return { lat: 39.7392, lng: -104.9903 }; // Denver, CO
    if (zipPrefix >= 82 && zipPrefix <= 83) return { lat: 41.1400, lng: -104.8202 }; // Cheyenne, WY
    if (zipPrefix >= 84 && zipPrefix <= 84) return { lat: 40.7608, lng: -111.8910 }; // Salt Lake City, UT
    if (zipPrefix >= 85 && zipPrefix <= 86) return { lat: 33.4484, lng: -112.0740 }; // Phoenix, AZ
    if (zipPrefix >= 87 && zipPrefix <= 88) return { lat: 35.0844, lng: -106.6504 }; // Albuquerque, NM
    if (zipPrefix >= 89 && zipPrefix <= 89) return { lat: 36.1699, lng: -115.1398 }; // Las Vegas, NV
    return { lat: 39.7392, lng: -104.9903 }; // Denver, CO (default)
  }
  
  // Pacific
  if (zipPrefix >= 90 && zipPrefix <= 99) {
    if (zipPrefix >= 90 && zipPrefix <= 96) return { lat: 34.0522, lng: -118.2437 }; // Los Angeles, CA
    if (zipPrefix >= 97 && zipPrefix <= 97) return { lat: 45.5152, lng: -122.6784 }; // Portland, OR
    if (zipPrefix >= 98 && zipPrefix <= 99) return { lat: 47.6062, lng: -122.3321 }; // Seattle, WA
    return { lat: 37.7749, lng: -122.4194 }; // San Francisco, CA (default)
  }
  
  // Default to center of US
  return { lat: 39.8283, lng: -98.5795 };
}

/**
 * Generate pharmacies for a given ZIP code
 * Creates 8 pharmacies with realistic names and locations
 */
export function generatePharmaciesForZip(zip: string): Pharmacy[] {
  const center = getCoordinatesForZip(zip);
  
  const pharmacyChains = [
    { name: "CVS Pharmacy", chain: "CVS" },
    { name: "Walgreens", chain: "Walgreens" },
    { name: "Walmart Pharmacy", chain: "Walmart" },
    { name: "Costco Pharmacy", chain: "Costco" },
    { name: "Rite Aid Pharmacy", chain: "Rite Aid" },
    { name: "Target Pharmacy", chain: "Target" },
    { name: "Kroger Pharmacy", chain: "Kroger" },
    { name: "Safeway Pharmacy", chain: "Safeway" },
  ];
  
  const streetNames = [
    "Main Street", "Washington Street", "Market Street", "Oak Avenue",
    "Broadway", "Third Avenue", "Park Avenue", "Elm Street",
  ];
  
  return pharmacyChains.map((chain, index) => {
    // Generate coordinates in a radius around the center
    const angle = (index / pharmacyChains.length) * 2 * Math.PI;
    const radius = 0.05; // ~3-5 miles
    const lat = center.lat + radius * Math.cos(angle);
    const lng = center.lng + radius * Math.sin(angle);
    
    const streetNumber = 100 + index * 100;
    const streetName = streetNames[index];
    
    return {
      id: `pharm-${zip}-${index + 1}`,
      name: chain.name,
      chain: chain.chain,
      address: `${streetNumber} ${streetName}`,
      city: "Local",
      state: "US",
      zip: zip,
      lat: lat,
      lng: lng,
      phone: "(555) 123-4567",
      hours: "Mon-Fri: 9am-9pm, Sat-Sun: 10am-6pm",
      website: `https://www.${chain.chain.toLowerCase().replace(/\s+/g, "")}.com`,
      hasDelivery: index % 2 === 0, // Alternate delivery availability
      hasDriveThru: index % 3 === 0, // Every third pharmacy has drive-thru
    };
  });
}
