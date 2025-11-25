/**
 * Dynamic Pharmacy Generator
 * Generates realistic pharmacy locations based on user's ZIP code
 */

import { Pharmacy } from "@/data/pharmacies";

// US ZIP code to approximate lat/lng mapping (simplified)
// In production, you'd use a proper geocoding API
const zipToCoords: Record<string, { lat: number; lng: number; city: string; state: string }> = {
  // Major cities for demo purposes
  "10001": { lat: 40.7506, lng: -73.9971, city: "New York", state: "NY" },
  "90001": { lat: 33.9731, lng: -118.2479, city: "Los Angeles", state: "CA" },
  "60601": { lat: 41.8857, lng: -87.6182, city: "Chicago", state: "IL" },
  "77001": { lat: 29.7499, lng: -95.3583, city: "Houston", state: "TX" },
  "85001": { lat: 33.4484, lng: -112.0740, city: "Phoenix", state: "AZ" },
  "19101": { lat: 39.9500, lng: -75.1667, city: "Philadelphia", state: "PA" },
  "78201": { lat: 29.4246, lng: -98.4951, city: "San Antonio", state: "TX" },
  "92101": { lat: 32.7157, lng: -117.1611, city: "San Diego", state: "CA" },
  "75201": { lat: 32.7767, lng: -96.7970, city: "Dallas", state: "TX" },
  "95101": { lat: 37.3352, lng: -121.8811, city: "San Jose", state: "CA" },
  "02108": { lat: 42.3601, lng: -71.0589, city: "Boston", state: "MA" },
  "98101": { lat: 47.6097, lng: -122.3331, city: "Seattle", state: "WA" },
  "80201": { lat: 39.7392, lng: -104.9903, city: "Denver", state: "CO" },
  "20001": { lat: 38.9072, lng: -77.0369, city: "Washington", state: "DC" },
  "33101": { lat: 25.7743, lng: -80.1937, city: "Miami", state: "FL" },
};

const pharmacyChains = [
  { name: "CVS", hasDelivery: true, hasDriveThru: false },
  { name: "Walgreens", hasDelivery: true, hasDriveThru: true },
  { name: "Rite Aid", hasDelivery: false, hasDriveThru: false },
  { name: "Walmart", hasDelivery: true, hasDriveThru: true },
  { name: "Target", hasDelivery: false, hasDriveThru: false },
  { name: "Costco", hasDelivery: false, hasDriveThru: false },
  { name: "Stop & Shop", hasDelivery: false, hasDriveThru: false },
  { name: "Kroger", hasDelivery: true, hasDriveThru: true },
];

const streetNames = [
  "Main Street", "Oak Avenue", "Maple Drive", "Park Boulevard", "Washington Street",
  "Broadway", "Market Street", "First Avenue", "Second Street", "Third Avenue",
  "Elm Street", "Cedar Lane", "Pine Road", "Sunset Boulevard", "Highland Avenue"
];

const hours = [
  "Mon-Fri 8AM-10PM, Sat-Sun 9AM-9PM",
  "24 Hours",
  "Mon-Fri 7AM-11PM, Sat-Sun 8AM-10PM",
  "Mon-Sat 9AM-8PM, Sun 10AM-6PM",
  "Mon-Sat 9AM-7PM, Sun 10AM-6PM",
  "Mon-Sat 9AM-9PM, Sun 10AM-6PM",
  "Mon-Fri 10AM-7PM, Sat 9:30AM-6PM, Sun Closed",
];

/**
 * Estimate coordinates from ZIP code
 * Uses a simple algorithm based on ZIP code patterns
 */
function estimateCoords(zip: string): { lat: number; lng: number; city: string; state: string } {
  // Check if we have exact match
  if (zipToCoords[zip]) {
    return zipToCoords[zip];
  }

  // Estimate based on ZIP code prefix (first 3 digits)
  const prefix = zip.substring(0, 3);
  const prefixNum = parseInt(prefix);

  // Rough US ZIP code geographic distribution
  // 0xx-1xx: Northeast, 2xx-3xx: Mid-Atlantic/Southeast, 4xx-6xx: South/Midwest
  // 7xx-8xx: Central/Mountain, 9xx: West Coast
  
  let lat, lng, city, state;

  if (prefixNum >= 0 && prefixNum < 100) {
    // Northeast (MA, NH, VT, ME, RI, CT)
    lat = 42.0 + (Math.random() * 3);
    lng = -71.0 - (Math.random() * 2);
    city = "Boston Area";
    state = "MA";
  } else if (prefixNum >= 100 && prefixNum < 200) {
    // NY
    lat = 40.5 + (Math.random() * 3);
    lng = -74.0 - (Math.random() * 2);
    city = "New York Area";
    state = "NY";
  } else if (prefixNum >= 200 && prefixNum < 300) {
    // Mid-Atlantic (DC, MD, VA, WV)
    lat = 38.5 + (Math.random() * 2);
    lng = -77.0 - (Math.random() * 2);
    city = "Washington Area";
    state = "DC";
  } else if (prefixNum >= 300 && prefixNum < 400) {
    // Southeast (FL, GA, SC, NC)
    lat = 28.0 + (Math.random() * 6);
    lng = -81.0 - (Math.random() * 3);
    city = "Southeast Area";
    state = "FL";
  } else if (prefixNum >= 600 && prefixNum < 700) {
    // Midwest (IL, IN, OH)
    lat = 40.0 + (Math.random() * 3);
    lng = -87.0 - (Math.random() * 3);
    city = "Chicago Area";
    state = "IL";
  } else if (prefixNum >= 700 && prefixNum < 800) {
    // South Central (TX, OK, AR, LA)
    lat = 29.0 + (Math.random() * 4);
    lng = -95.0 - (Math.random() * 5);
    city = "Houston Area";
    state = "TX";
  } else if (prefixNum >= 800 && prefixNum < 900) {
    // Mountain (CO, UT, AZ, NM)
    lat = 35.0 + (Math.random() * 5);
    lng = -105.0 - (Math.random() * 7);
    city = "Denver Area";
    state = "CO";
  } else {
    // West Coast (CA, OR, WA)
    lat = 34.0 + (Math.random() * 13);
    lng = -118.0 - (Math.random() * 4);
    city = "Los Angeles Area";
    state = "CA";
  }

  return { lat, lng, city, state };
}

/**
 * Generate pharmacies near a ZIP code
 */
export function generatePharmaciesForZip(zip: string): Pharmacy[] {
  if (!zip || zip.length < 5) {
    // Return default Boston pharmacies if no ZIP provided
    return [];
  }

  const baseCoords = estimateCoords(zip);
  const pharmacies: Pharmacy[] = [];

  // Generate 8 pharmacies
  for (let i = 0; i < 8; i++) {
    const chain = pharmacyChains[i % pharmacyChains.length];
    
    // Add some random offset to coordinates (roughly 0-5 miles)
    const latOffset = (Math.random() - 0.5) * 0.1; // ~5 miles
    const lngOffset = (Math.random() - 0.5) * 0.1;

    const streetNumber = Math.floor(Math.random() * 9000) + 100;
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const storeNumber = Math.floor(Math.random() * 9000) + 1000;

    pharmacies.push({
      id: `pharm-${zip}-${i + 1}`,
      name: chain.name === "CVS" || chain.name === "Walgreens" || chain.name === "Rite Aid"
        ? `${chain.name} #${storeNumber}`
        : `${chain.name} Pharmacy`,
      chain: chain.name,
      address: `${streetNumber} ${streetName}`,
      city: baseCoords.city,
      state: baseCoords.state,
      zip: zip,
      phone: `(${Math.floor(Math.random() * 900) + 100}) 555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      lat: baseCoords.lat + latOffset,
      lng: baseCoords.lng + lngOffset,
      hours: hours[Math.floor(Math.random() * hours.length)],
      hasDelivery: chain.hasDelivery,
      hasDriveThru: chain.hasDriveThru,
    });
  }

  return pharmacies;
}
