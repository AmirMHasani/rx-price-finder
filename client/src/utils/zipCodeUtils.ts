/**
 * Get approximate coordinates for a US ZIP code
 * This is a simplified implementation using ZIP code ranges
 */
export function getCoordinatesForZip(zip: string): { lat: number; lng: number } | null {
  if (!zip || zip.length < 5) {
    return null;
  }

  const zipPrefix = parseInt(zip.substring(0, 3));

  // Approximate coordinates based on ZIP code prefix ranges
  // Source: USPS ZIP code allocation
  if (zipPrefix >= 0 && zipPrefix <= 99) {
    // Northeast (00-09)
    if (zipPrefix <= 9) return { lat: 42.3601, lng: -71.0589 }; // Boston, MA
    // New York (10-14)
    if (zipPrefix <= 14) return { lat: 40.7128, lng: -74.0060 }; // New York, NY
    // Pennsylvania (15-19)
    if (zipPrefix <= 19) return { lat: 39.9526, lng: -75.1652 }; // Philadelphia, PA
    // DC/Maryland (20-21)
    if (zipPrefix <= 21) return { lat: 38.9072, lng: -77.0369 }; // Washington, DC
    // Virginia (22-24)
    if (zipPrefix <= 24) return { lat: 37.5407, lng: -77.4360 }; // Richmond, VA
    // North Carolina (27-28)
    if (zipPrefix <= 28) return { lat: 35.7796, lng: -78.6382 }; // Raleigh, NC
    // South Carolina (29)
    if (zipPrefix <= 29) return { lat: 33.8361, lng: -81.1637 }; // Columbia, SC
    // Georgia (30-31)
    if (zipPrefix <= 31) return { lat: 33.7490, lng: -84.3880 }; // Atlanta, GA
    // Florida (32-34)
    if (zipPrefix <= 34) return { lat: 28.5383, lng: -81.3792 }; // Orlando, FL
    // Alabama (35-36)
    if (zipPrefix <= 36) return { lat: 33.5186, lng: -86.8104 }; // Birmingham, AL
    // Tennessee (37-38)
    if (zipPrefix <= 38) return { lat: 36.1627, lng: -86.7816 }; // Nashville, TN
    // Mississippi (38-39)
    if (zipPrefix <= 39) return { lat: 32.2988, lng: -90.1848 }; // Jackson, MS
    // Kentucky (40-42)
    if (zipPrefix <= 42) return { lat: 38.2527, lng: -85.7585 }; // Louisville, KY
    // Ohio (43-45)
    if (zipPrefix <= 45) return { lat: 39.9612, lng: -82.9988 }; // Columbus, OH
    // Indiana (46-47)
    if (zipPrefix <= 47) return { lat: 39.7684, lng: -86.1581 }; // Indianapolis, IN
    // Michigan (48-49)
    if (zipPrefix <= 49) return { lat: 42.3314, lng: -83.0458 }; // Detroit, MI
    // Iowa (50-52)
    if (zipPrefix <= 52) return { lat: 41.5868, lng: -93.6250 }; // Des Moines, IA
    // Wisconsin (53-54)
    if (zipPrefix <= 54) return { lat: 43.0389, lng: -87.9065 }; // Milwaukee, WI
    // Minnesota (55-56)
    if (zipPrefix <= 56) return { lat: 44.9778, lng: -93.2650 }; // Minneapolis, MN
    // South Dakota (57)
    if (zipPrefix <= 57) return { lat: 43.5460, lng: -96.7313 }; // Sioux Falls, SD
    // North Dakota (58)
    if (zipPrefix <= 58) return { lat: 46.8772, lng: -96.7898 }; // Fargo, ND
    // Montana (59)
    if (zipPrefix <= 59) return { lat: 45.7833, lng: -108.5007 }; // Billings, MT
    // Illinois (60-62)
    if (zipPrefix <= 62) return { lat: 41.8781, lng: -87.6298 }; // Chicago, IL
    // Missouri (63-65)
    if (zipPrefix <= 65) return { lat: 38.6270, lng: -90.1994 }; // St. Louis, MO
    // Kansas (66-67)
    if (zipPrefix <= 67) return { lat: 37.6872, lng: -97.3301 }; // Wichita, KS
    // Nebraska (68-69)
    if (zipPrefix <= 69) return { lat: 41.2565, lng: -95.9345 }; // Omaha, NE
    // Louisiana (70-71)
    if (zipPrefix <= 71) return { lat: 29.9511, lng: -90.0715 }; // New Orleans, LA
    // Arkansas (71-72)
    if (zipPrefix <= 72) return { lat: 34.7465, lng: -92.2896 }; // Little Rock, AR
    // Oklahoma (73-74)
    if (zipPrefix <= 74) return { lat: 35.4676, lng: -97.5164 }; // Oklahoma City, OK
    // Texas (75-79)
    if (zipPrefix <= 79) return { lat: 29.7604, lng: -95.3698 }; // Houston, TX
    // Colorado (80-81)
    if (zipPrefix <= 81) return { lat: 39.7392, lng: -104.9903 }; // Denver, CO
    // Wyoming (82-83)
    if (zipPrefix <= 83) return { lat: 41.1400, lng: -104.8202 }; // Cheyenne, WY
    // Utah (84)
    if (zipPrefix <= 84) return { lat: 40.7608, lng: -111.8910 }; // Salt Lake City, UT
    // Arizona (85-86)
    if (zipPrefix <= 86) return { lat: 33.4484, lng: -112.0740 }; // Phoenix, AZ
    // New Mexico (87-88)
    if (zipPrefix <= 88) return { lat: 35.0844, lng: -106.6504 }; // Albuquerque, NM
    // Nevada (89)
    if (zipPrefix <= 89) return { lat: 36.1699, lng: -115.1398 }; // Las Vegas, NV
    // California (90-96)
    if (zipPrefix <= 96) return { lat: 34.0522, lng: -118.2437 }; // Los Angeles, CA
    // Washington (98-99)
    if (zipPrefix <= 99) return { lat: 47.6062, lng: -122.3321 }; // Seattle, WA
  }

  // Default to Boston if ZIP code is not recognized
  return { lat: 42.3601, lng: -71.0589 };
}

/**
 * Generate random offset for pharmacy locations
 */
function getRandomOffset(maxMiles: number = 5): { latOffset: number; lngOffset: number } {
  // 1 degree latitude ≈ 69 miles
  // 1 degree longitude ≈ 54.6 miles (at 40° latitude)
  const latOffset = (Math.random() - 0.5) * (maxMiles / 69) * 2;
  const lngOffset = (Math.random() - 0.5) * (maxMiles / 54.6) * 2;
  return { latOffset, lngOffset };
}

export interface Pharmacy {
  id: string;
  name: string;
  chain: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  lat: number;
  lng: number;
  hours: string;
  hasDelivery: boolean;
  hasDriveThru: boolean;
}

/**
 * Get city and state for a ZIP code prefix
 */
function getCityStateForZip(zipPrefix: number): { city: string; state: string } {
  if (zipPrefix <= 9) return { city: "Boston", state: "MA" };
  if (zipPrefix <= 14) return { city: "New York", state: "NY" };
  if (zipPrefix <= 19) return { city: "Philadelphia", state: "PA" };
  if (zipPrefix <= 21) return { city: "Washington", state: "DC" };
  if (zipPrefix <= 24) return { city: "Richmond", state: "VA" };
  if (zipPrefix <= 28) return { city: "Raleigh", state: "NC" };
  if (zipPrefix <= 29) return { city: "Columbia", state: "SC" };
  if (zipPrefix <= 31) return { city: "Atlanta", state: "GA" };
  if (zipPrefix <= 34) return { city: "Orlando", state: "FL" };
  if (zipPrefix <= 36) return { city: "Birmingham", state: "AL" };
  if (zipPrefix <= 38) return { city: "Nashville", state: "TN" };
  if (zipPrefix <= 39) return { city: "Jackson", state: "MS" };
  if (zipPrefix <= 42) return { city: "Louisville", state: "KY" };
  if (zipPrefix <= 45) return { city: "Columbus", state: "OH" };
  if (zipPrefix <= 47) return { city: "Indianapolis", state: "IN" };
  if (zipPrefix <= 49) return { city: "Detroit", state: "MI" };
  if (zipPrefix <= 52) return { city: "Des Moines", state: "IA" };
  if (zipPrefix <= 54) return { city: "Milwaukee", state: "WI" };
  if (zipPrefix <= 56) return { city: "Minneapolis", state: "MN" };
  if (zipPrefix <= 57) return { city: "Sioux Falls", state: "SD" };
  if (zipPrefix <= 58) return { city: "Fargo", state: "ND" };
  if (zipPrefix <= 59) return { city: "Billings", state: "MT" };
  if (zipPrefix <= 62) return { city: "Chicago", state: "IL" };
  if (zipPrefix <= 65) return { city: "St. Louis", state: "MO" };
  if (zipPrefix <= 67) return { city: "Wichita", state: "KS" };
  if (zipPrefix <= 69) return { city: "Omaha", state: "NE" };
  if (zipPrefix <= 71) return { city: "New Orleans", state: "LA" };
  if (zipPrefix <= 72) return { city: "Little Rock", state: "AR" };
  if (zipPrefix <= 74) return { city: "Oklahoma City", state: "OK" };
  if (zipPrefix <= 79) return { city: "Houston", state: "TX" };
  if (zipPrefix <= 81) return { city: "Denver", state: "CO" };
  if (zipPrefix <= 83) return { city: "Cheyenne", state: "WY" };
  if (zipPrefix <= 84) return { city: "Salt Lake City", state: "UT" };
  if (zipPrefix <= 86) return { city: "Phoenix", state: "AZ" };
  if (zipPrefix <= 88) return { city: "Albuquerque", state: "NM" };
  if (zipPrefix <= 89) return { city: "Las Vegas", state: "NV" };
  if (zipPrefix <= 96) return { city: "Los Angeles", state: "CA" };
  if (zipPrefix <= 99) return { city: "Seattle", state: "WA" };
  return { city: "Boston", state: "MA" };
}

/**
 * Generate pharmacy locations near a ZIP code
 */
export function generatePharmaciesForZip(zip: string): Pharmacy[] {
  const coords = getCoordinatesForZip(zip);
  if (!coords) {
    return [];
  }

  const zipPrefix = parseInt(zip.substring(0, 3));
  const { city, state } = getCityStateForZip(zipPrefix);

  const pharmacyChains = [
    { chain: "CVS", name: "CVS Pharmacy", phone: "(555) 123-4567", hasDelivery: true, hasDriveThru: true },
    { chain: "Walgreens", name: "Walgreens", phone: "(555) 234-5678", hasDelivery: true, hasDriveThru: true },
    { chain: "Walmart", name: "Walmart Pharmacy", phone: "(555) 345-6789", hasDelivery: false, hasDriveThru: true },
    { chain: "Rite Aid", name: "Rite Aid", phone: "(555) 456-7890", hasDelivery: true, hasDriveThru: false },
    { chain: "Costco", name: "Costco Pharmacy", phone: "(555) 567-8901", hasDelivery: false, hasDriveThru: false },
    { chain: "Target", name: "Target Pharmacy", phone: "(555) 678-9012", hasDelivery: true, hasDriveThru: false },
    { chain: "Kroger", name: "Kroger Pharmacy", phone: "(555) 789-0123", hasDelivery: true, hasDriveThru: true },
    { chain: "Safeway", name: "Safeway Pharmacy", phone: "(555) 890-1234", hasDelivery: true, hasDriveThru: false },
  ];

  const streetNames = ["Main St", "Market St", "Broadway", "Washington St", "Park Ave", "Oak St", "Maple Ave", "Elm St"];

  return pharmacyChains.map((chain, index) => {
    const offset = getRandomOffset(5);
    const lat = coords.lat + offset.latOffset;
    const lng = coords.lng + offset.lngOffset;
    const streetNumber = 100 + Math.floor(Math.random() * 900);
    const streetName = streetNames[index % streetNames.length];

    return {
      id: `pharm-${zip}-${index + 1}`,
      name: `${chain.name} #${Math.floor(Math.random() * 9000) + 1000}`,
      chain: chain.chain,
      address: `${streetNumber} ${streetName}`,
      city,
      state,
      zip,
      phone: chain.phone,
      lat,
      lng,
      hours: "Mon-Fri 8AM-10PM, Sat-Sun 9AM-9PM",
      hasDelivery: chain.hasDelivery,
      hasDriveThru: chain.hasDriveThru,
    };
  });
}
