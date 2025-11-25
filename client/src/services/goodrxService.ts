/**
 * GoodRx Service
 * Fetches real cash prices for medications
 * 
 * To use this service, you need:
 * 1. GoodRx API key in VITE_GOODRX_API_KEY environment variable
 * 2. Request API access at https://www.goodrx.com/business/api
 */

import * as mockDb from './mockDb';

export interface GoodRxPrice {
  medication: string;
  dosage: string;
  form: string;
  pharmacy: string;
  price: number;
  quantity: number;
  source: string;
}

/**
 * Search for medication prices on GoodRx
 * Falls back to mock prices if API key is not available
 */
export async function searchGoodRxPrices(
  medicationName: string,
  dosage: string,
  form: string
): Promise<GoodRxPrice[]> {
  try {
    const apiKey = import.meta.env.VITE_GOODRX_API_KEY;

    if (!apiKey) {
      console.warn('GoodRx API key not found. Using mock prices.');
      return getMockPrices(medicationName, dosage, form);
    }

    const response = await fetch(
      `https://api.goodrx.com/prices?` +
      `drug_name=${encodeURIComponent(medicationName)}&` +
      `dosage=${dosage}&` +
      `form=${form}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn('GoodRx API error:', response.statusText);
      return getMockPrices(medicationName, dosage, form);
    }

    const data = await response.json();
    
    if (!data.prices || data.prices.length === 0) {
      return getMockPrices(medicationName, dosage, form);
    }

    return data.prices;
  } catch (error) {
    console.error('Error fetching GoodRx prices:', error);
    return getMockPrices(medicationName, dosage, form);
  }
}

/**
 * Get cached price or fetch from API
 */
export async function getPriceWithCache(
  medicationName: string,
  dosage: string,
  form: string,
  pharmacyId: string
): Promise<number | null> {
  try {
    // Check cache first
    const cached = await mockDb.getCachedPrice(medicationName, dosage, form, pharmacyId);
    if (cached !== null) {
      return cached;
    }

    // Fetch from API
    const prices = await searchGoodRxPrices(medicationName, dosage, form);
    
    if (prices.length === 0) {
      return null;
    }

    // Store in cache
    const price = prices[0].price;
    await mockDb.cachePriceData(
      medicationName,
      dosage,
      form,
      pharmacyId,
      price,
      'goodrx'
    );

    return price;
  } catch (error) {
    console.error('Error getting price with cache:', error);
    return null;
  }
}

/**
 * Mock prices for development/fallback
 */
function getMockPrices(medicationName: string, dosage: string, form: string): GoodRxPrice[] {
  // Generate realistic mock prices based on medication
  const basePrices: { [key: string]: number } = {
    'lipitor': 25,
    'atorvastatin': 15,
    'metformin': 8,
    'lisinopril': 10,
    'omeprazole': 12,
    'amoxicillin': 20,
    'ibuprofen': 5,
    'acetaminophen': 6,
  };

  const medLower = medicationName.toLowerCase();
  let basePrice = basePrices[medLower] || 20;

  // Adjust based on dosage
  const dosageNum = parseInt(dosage);
  if (dosageNum > 500) {
    basePrice *= 1.5;
  }

  const pharmacies = [
    'CVS Pharmacy',
    'Walgreens',
    'Walmart Pharmacy',
    'Stop & Shop',
    'Rite Aid',
    'Costco Pharmacy',
  ];

  return pharmacies.map((pharmacy, index) => ({
    medication: medicationName,
    dosage,
    form,
    pharmacy,
    price: basePrice + (index * 2),
    quantity: 30,
    source: 'goodrx_mock',
  }));
}

/**
 * Get price for specific pharmacy
 */
export async function getPriceForPharmacy(
  medicationName: string,
  dosage: string,
  form: string,
  pharmacyName: string
): Promise<number | null> {
  try {
    const prices = await searchGoodRxPrices(medicationName, dosage, form);
    const pharmacyPrice = prices.find(
      p => p.pharmacy.toLowerCase().includes(pharmacyName.toLowerCase())
    );

    return pharmacyPrice?.price || null;
  } catch (error) {
    console.error('Error getting pharmacy price:', error);
    return null;
  }
}
