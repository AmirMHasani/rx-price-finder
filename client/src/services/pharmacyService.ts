/**
 * Pharmacy Search Service
 * Uses Google Places API to find pharmacies near user location
 * 
 * To use this service, you need:
 * 1. Google Places API key in VITE_GOOGLE_PLACES_API_KEY environment variable
 * 2. Places API enabled in Google Cloud Console
 */

import * as mockDb from './mockDb';

export interface PharmacyResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  reviewCount?: number;
  openNow?: boolean;
  placeId: string;
  distance?: number; // in miles
}

/**
 * Find pharmacies near a location using Google Places API
 */
export async function findNearbyPharmacies(
  lat: number,
  lng: number,
  radiusMeters: number = 5000
): Promise<PharmacyResult[]> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Places API key not found. Using mock data.');
      return getMockPharmacies(lat, lng);
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${lat},${lng}&` +
      `radius=${radiusMeters}&` +
      `type=pharmacy&` +
      `key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Google Places API error');
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.warn('Google Places API status:', data.status);
      return getMockPharmacies(lat, lng);
    }

    const results = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      openNow: place.opening_hours?.open_now,
      placeId: place.place_id,
      distance: calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng),
    }));

    // Store in mock database
    for (const pharmacy of results) {
      const existing = await mockDb.getPharmacyByGooglePlaceId(pharmacy.placeId);
      if (!existing) {
        await mockDb.addPharmacy({
          name: pharmacy.name,
          address: pharmacy.address,
          city: '',
          state: '',
          zip_code: '',
          latitude: pharmacy.lat,
          longitude: pharmacy.lng,
          phone: '',
          hours_monday: '',
          hours_tuesday: '',
          hours_wednesday: '',
          hours_thursday: '',
          hours_friday: '',
          hours_saturday: '',
          hours_sunday: '',
          website: '',
          google_place_id: pharmacy.placeId,
          has_delivery: false,
          has_drive_thru: false,
          has_mail_order: false,
          rating: pharmacy.rating || 0,
          review_count: pharmacy.reviewCount || 0,
        });
      }
    }

    return results.sort((a: PharmacyResult, b: PharmacyResult) => (a.distance || 0) - (b.distance || 0));
  } catch (error) {
    console.error('Error finding pharmacies:', error);
    return getMockPharmacies(lat, lng);
  }
}

/**
 * Get detailed information about a pharmacy
 */
export async function getPharmacyDetails(placeId: string): Promise<any> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return null;
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&` +
      `fields=name,formatted_address,formatted_phone_number,opening_hours,website,rating,review_count,url&` +
      `key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Google Places API error');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error getting pharmacy details:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates (in miles)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Mock pharmacies for development/fallback
 */
function getMockPharmacies(userLat: number, userLng: number): PharmacyResult[] {
  const mockPharmacies = [
    {
      id: 'mock-1',
      name: 'CVS Pharmacy #5432',
      address: '123 Main Street, Boston, MA',
      lat: 42.3601,
      lng: -71.0589,
      rating: 4.2,
      reviewCount: 145,
      openNow: true,
      placeId: 'mock-1',
    },
    {
      id: 'mock-2',
      name: 'Walgreens #8765',
      address: '456 Commonwealth Ave, Boston, MA',
      lat: 42.3551,
      lng: -71.0636,
      rating: 4.0,
      reviewCount: 98,
      openNow: true,
      placeId: 'mock-2',
    },
    {
      id: 'mock-3',
      name: 'Walmart Pharmacy',
      address: '55 Mystic Ave, Somerville, MA',
      lat: 42.3876,
      lng: -71.0995,
      rating: 3.8,
      reviewCount: 67,
      openNow: true,
      placeId: 'mock-3',
    },
    {
      id: 'mock-4',
      name: 'Stop & Shop Pharmacy',
      address: '321 Beacon Street, Boston, MA',
      lat: 42.3521,
      lng: -71.0676,
      rating: 4.1,
      reviewCount: 112,
      openNow: true,
      placeId: 'mock-4',
    },
    {
      id: 'mock-5',
      name: 'Rite Aid #2341',
      address: '789 Boylston Street, Boston, MA',
      lat: 42.3476,
      lng: -71.0776,
      rating: 3.9,
      reviewCount: 84,
      openNow: true,
      placeId: 'mock-5',
    },
    {
      id: 'mock-6',
      name: 'Costco Pharmacy',
      address: '400 Soldiers Field Rd, Brighton, MA',
      lat: 42.3656,
      lng: -71.1329,
      rating: 4.5,
      reviewCount: 203,
      openNow: true,
      placeId: 'mock-6',
    },
  ];

  return mockPharmacies.map((pharmacy) => ({
    ...pharmacy,
    distance: calculateDistance(userLat, userLng, pharmacy.lat, pharmacy.lng),
  }));
}
