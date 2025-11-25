import type { Pharmacy } from "@/data/pharmacies";
import { getZipCodeLocation } from "./zipCodeService";

/**
 * Pharmacy chain templates with typical characteristics
 */
const pharmacyChains = [
  {
    name: "CVS",
    hasDelivery: true,
    hasDriveThru: false,
    hours: "Mon-Fri 8AM-10PM, Sat-Sun 9AM-9PM",
  },
  {
    name: "Walgreens",
    hasDelivery: true,
    hasDriveThru: true,
    hours: "24 Hours",
  },
  {
    name: "Rite Aid",
    hasDelivery: false,
    hasDriveThru: false,
    hours: "Mon-Fri 7AM-11PM, Sat-Sun 8AM-10PM",
  },
  {
    name: "Stop & Shop",
    hasDelivery: false,
    hasDriveThru: false,
    hours: "Mon-Sat 9AM-8PM, Sun 10AM-6PM",
  },
  {
    name: "Target",
    hasDelivery: false,
    hasDriveThru: false,
    hours: "Mon-Sat 9AM-7PM, Sun 10AM-6PM",
  },
  {
    name: "Walmart",
    hasDelivery: true,
    hasDriveThru: true,
    hours: "Mon-Sat 9AM-9PM, Sun 10AM-6PM",
  },
  {
    name: "Costco",
    hasDelivery: false,
    hasDriveThru: false,
    hours: "Mon-Fri 10AM-7PM, Sat 9:30AM-6PM, Sun Closed",
  },
];

/**
 * Generate a random offset for pharmacy locations
 * Returns offset in degrees (approximately 0.5-3 miles)
 */
function getRandomOffset(): { latOffset: number; lngOffset: number } {
  // 0.01 degrees is approximately 0.7 miles
  // Generate offset between 0.007 and 0.043 degrees (0.5-3 miles)
  const distance = 0.007 + Math.random() * 0.036;
  const angle = Math.random() * 2 * Math.PI;
  
  return {
    latOffset: distance * Math.cos(angle),
    lngOffset: distance * Math.sin(angle),
  };
}

/**
 * Generate street address based on location
 */
function generateAddress(city: string, state: string, index: number): string {
  const streetNames = [
    "Main Street",
    "Broadway",
    "Park Avenue",
    "Oak Street",
    "Maple Avenue",
    "Washington Street",
    "First Avenue",
    "Second Street",
  ];
  
  const streetNumber = 100 + (index * 123) % 900;
  const streetName = streetNames[index % streetNames.length];
  
  return `${streetNumber} ${streetName}`;
}

/**
 * Generate phone number based on state
 */
function generatePhoneNumber(state: string, index: number): string {
  // Area codes by state (simplified)
  const areaCodes: Record<string, string> = {
    "MA": "617",
    "NY": "212",
    "CA": "213",
    "IL": "312",
    "FL": "305",
    "TX": "713",
    "AZ": "602",
    "PA": "215",
    "WA": "206",
    "CO": "303",
    "DC": "202",
    "GA": "404",
  };
  
  const areaCode = areaCodes[state] || "555";
  const prefix = 555;
  const lineNumber = 1000 + (index * 111) % 9000;
  
  return `(${areaCode}) ${prefix}-${lineNumber.toString().padStart(4, "0")}`;
}

/**
 * Generate pharmacies near a given ZIP code
 * @param zipCode - User's ZIP code
 * @param count - Number of pharmacies to generate (default: 8)
 * @returns Array of pharmacy objects
 */
export function generatePharmaciesForZip(zipCode: string, count: number = 8): Pharmacy[] {
  const location = getZipCodeLocation(zipCode);
  const pharmacies: Pharmacy[] = [];
  
  // Generate one pharmacy for each chain, cycling if needed
  for (let i = 0; i < count; i++) {
    const chain = pharmacyChains[i % pharmacyChains.length];
    const offset = getRandomOffset();
    const storeNumber = 1000 + Math.floor(Math.random() * 9000);
    
    pharmacies.push({
      id: `pharm-${i + 1}`,
      name: `${chain.name} Pharmacy${chain.name === "CVS" || chain.name === "Walgreens" || chain.name === "Rite Aid" ? ` #${storeNumber}` : ""}`,
      chain: chain.name,
      address: generateAddress(location.city, location.state, i),
      city: location.city,
      state: location.state,
      zip: zipCode,
      phone: generatePhoneNumber(location.state, i),
      lat: location.lat + offset.latOffset,
      lng: location.lng + offset.lngOffset,
      hours: chain.hours,
      hasDelivery: chain.hasDelivery,
      hasDriveThru: chain.hasDriveThru,
    });
  }
  
  return pharmacies;
}

/**
 * Get pharmacy chain name from pharmacy ID or name
 * Used for pricing lookup
 */
export function getPharmacyChain(pharmacy: Pharmacy): string {
  return pharmacy.chain;
}
