/**
 * Real Pharmacy Service
 * Fetches actual pharmacy locations using Google Places API
 */

export interface RealPharmacy {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  userRatingsTotal?: number;
  openNow?: boolean;
  chain?: string;
}

/**
 * Fetch real pharmacies near a location using Google Places API
 * This function must be called from a component that has access to the Google Maps API
 */
export async function fetchRealPharmacies(
  map: google.maps.Map,
  zipCode: string
): Promise<RealPharmacy[]> {
  try {
    console.log('🏥 [REAL PHARMACIES] Fetching real pharmacies near ZIP:', zipCode);
    
    // Step 1: Geocode the ZIP code
    const geocoder = new google.maps.Geocoder();
    const geocodeResult = await new Promise<google.maps.GeocoderResult[]>(
      (resolve, reject) => {
        geocoder.geocode({ address: zipCode }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        });
      }
    );

    const location = geocodeResult[0].geometry.location;
    console.log('✅ [REAL PHARMACIES] Geocoded to:', location.lat(), location.lng());

    // Step 2: Search for pharmacies using Places API
    const service = new google.maps.places.PlacesService(map);
    
    const request: google.maps.places.PlaceSearchRequest = {
      location: location,
      radius: 8000, // 8km radius (about 5 miles)
      type: 'pharmacy',
    };

    const placesResult = await new Promise<google.maps.places.PlaceResult[]>(
      (resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Places search failed: ${status}`));
          }
        });
      }
    );

    console.log('✅ [REAL PHARMACIES] Found', placesResult.length, 'pharmacies');

    // Step 3: Transform to our pharmacy format
    const pharmacies: RealPharmacy[] = placesResult
      .filter(place => place.geometry?.location && place.name && place.vicinity)
      .map(place => {
        const lat = place.geometry!.location!.lat();
        const lng = place.geometry!.location!.lng();
        
        // Determine pharmacy chain from name
        const name = place.name!;
        let chain = 'independent';
        
        if (name.toLowerCase().includes('cvs')) chain = 'cvs';
        else if (name.toLowerCase().includes('walgreens')) chain = 'walgreens';
        else if (name.toLowerCase().includes('walmart')) chain = 'walmart';
        else if (name.toLowerCase().includes('rite aid')) chain = 'riteaid';
        else if (name.toLowerCase().includes('costco')) chain = 'costco';
        else if (name.toLowerCase().includes('target')) chain = 'target';
        else if (name.toLowerCase().includes('stop & shop')) chain = 'stopshop';

        return {
          placeId: place.place_id!,
          name: name,
          address: place.vicinity!,
          lat,
          lng,
          phone: place.formatted_phone_number,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          openNow: place.opening_hours?.open_now,
          chain,
        };
      })
      .slice(0, 12); // Limit to 12 pharmacies

    console.log('✅ [REAL PHARMACIES] Returning', pharmacies.length, 'formatted pharmacies');
    return pharmacies;

  } catch (error) {
    console.error('❌ [REAL PHARMACIES] Error fetching pharmacies:', error);
    throw error;
  }
}

/**
 * Calculate distance between two coordinates in miles
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
