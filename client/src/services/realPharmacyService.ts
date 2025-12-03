/**
 * Real Pharmacy Service
 * Fetches actual pharmacy locations using Google Places API
 */

export interface RealPharmacy {
  placeId: string;
  id?: string;  // Alias for placeId for compatibility
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  userRatingsTotal?: number;
  openNow?: boolean;
  chain?: string;
  // Optional pharmacy features
  hours?: string;
  hasDelivery?: boolean;
  hasDriveThru?: boolean;
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
    
    // Step 1: Geocode the ZIP code (specify USA to avoid international matches)
    const geocoder = new google.maps.Geocoder();
    const geocodeResult = await new Promise<google.maps.GeocoderResult[]>(
      (resolve, reject) => {
        geocoder.geocode({ 
          address: `${zipCode}, USA`,
          componentRestrictions: { country: 'US' }
        }, (results, status) => {
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
    // Priority: Known pharmacy chains first, then independent pharmacies
    
    // Known pharmacy chains to prioritize
    const KNOWN_CHAINS = [
      'cvs', 'walgreens', 'walmart', 'rite aid', 'costco', 'target',
      'kroger', 'safeway', 'publix', 'wegmans', 'giant', 'stop & shop',
      'harris teeter', 'albertsons', 'vons', 'jewel', 'osco', 'sav-on',
      'duane reade', 'eckerd', 'thrifty', 'longs drugs', 'medicine shoppe',
      'health mart', 'good neighbor', 'independent pharmacy', 'family pharmacy',
      'community pharmacy', 'discount pharmacy', 'neighborhood pharmacy'
    ];
    
    const pharmacies: RealPharmacy[] = placesResult
      .filter(place => {
        if (!place.geometry?.location || !place.name || !place.vicinity) return false;
        
        const name = place.name.toLowerCase();
        const types = place.types || [];
        
        // Check if it's a known chain
        const isKnownChain = KNOWN_CHAINS.some(chain => name.includes(chain));
        const hasPharmacyInName = name.includes('pharmacy') || name.includes('drug') || name.includes('rx');
        const isPharmacyType = types.includes('pharmacy');
        
        // FIRST: Exclude person names and medical facilities BEFORE checking if it's a pharmacy
        // Exclude if name appears to be a person's name (has title like BSc, BS, MD, PharmD)
        if (name.match(/\b(bs|bsc|md|pharmd|phd|rph|do|dds|dvm|np|pa)\b/)) {
          console.log(`❌ [FILTER] Excluding person name with title: ${place.name}`);
          return false;
        }
        
        // Exclude if name has typical person name patterns
        // Pattern 1: "First Last, Title" or "First M. Last, Title"
        if (name.match(/^[a-z]+\s+[a-z]\.?\s+[a-z]+,/)) {
          console.log(`❌ [FILTER] Excluding person name with title: ${place.name}`);
          return false;
        }
        
        // Pattern 2: "First Last" or "Last First MiddleInitial" (two-three words, capitalized like person names)
        // But exclude common pharmacy words
        const commonPharmacyWords = ['pharmacy', 'drug', 'drugs', 'rx', 'health', 'care', 'mart', 'store', 'discount', 'family', 'community', 'neighborhood'];
        const words = place.name!.split(/\s+/);
        
        // Check for "Last First MiddleInitial" pattern (e.g., "Gwin Julie J", "Smith John A")
        if (words.length === 3 && /^[A-Z]$/.test(words[2])) {
          // Third word is single capital letter (middle initial)
          const hasPharmacyKeyword = commonPharmacyWords.some(word => name.includes(word));
          if (!hasPharmacyKeyword) {
            console.log(`❌ [FILTER] Excluding person name with middle initial: ${place.name}`);
            return false;
          }
        }
        
        if (words.length === 2 && !commonPharmacyWords.some(word => name.includes(word))) {
          // Check if both words are capitalized (typical person name)
          if (words.every(word => word.charAt(0) === word.charAt(0).toUpperCase())) {
            console.log(`❌ [FILTER] Excluding likely person name: ${place.name}`);
            return false;
          }
        }
        
        // Pattern 3: "First Middle Last" (three words, all capitalized - person name)
        // Examples: "Hawkins White Maria", "John A. Smith", "Mary Jane Doe"
        if (words.length === 3) {
          // Check if all three words are capitalized (typical person name pattern)
          const allCapitalized = words.every(word => /^[A-Z][a-z]/.test(word) || /^[A-Z]\.$/.test(word));
          
          // Also check if it doesn't contain pharmacy-related keywords
          const hasPharmacyKeyword = commonPharmacyWords.some(word => name.includes(word));
          
          if (allCapitalized && !hasPharmacyKeyword) {
            console.log(`❌ [FILTER] Excluding three-word person name: ${place.name}`);
            return false;
          }
        }
        
        // Exclude medical facilities even if they have 'pharmacy' in name
        if (name.includes('hospital') || name.includes('clinic') || 
            name.includes('medical center') || name.includes('health center') ||
            name.includes('urgent care') || name.includes('doctor') ||
            name.includes('physicians') || name.includes('associates') ||
            name.includes('veterans administration') || name.includes('va medical')) {
          console.log(`❌ [FILTER] Excluding medical facility: ${place.name}`);
          return false;
        }
        
        // Exclude single-word names that are likely not pharmacies
        const singleWordExclusions = ['reads', 'wellness', 'care', 'health'];
        if (words.length === 1 && singleWordExclusions.includes(name)) {
          console.log(`❌ [FILTER] Excluding single-word non-pharmacy: ${place.name}`);
          return false;
        }
        
        // SECOND: Accept if it's a known chain OR has pharmacy in name OR is pharmacy type from Google
        if (!isKnownChain && !hasPharmacyInName && !isPharmacyType) {
          console.log(`❌ [FILTER] Not a recognized pharmacy: ${place.name}`);
          return false;
        }

        
        console.log(`✅ [FILTER] Accepted pharmacy: ${place.name}`);
        return true;
      })
      .sort((a, b) => {
        // Prioritize known chains
        const aIsChain = isKnownPharmacyChain(a.name!);
        const bIsChain = isKnownPharmacyChain(b.name!);
        if (aIsChain && !bIsChain) return -1;
        if (!aIsChain && bIsChain) return 1;
        return 0;
      })
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
          // openNow removed - deprecated field, use PlacesService.getDetails() with isOpen() instead
          openNow: undefined,
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

/**
 * Check if a place name is a known pharmacy chain
 */
function isKnownPharmacyChain(name: string): boolean {
  const lowerName = name.toLowerCase();
  const chains = ['cvs', 'walgreens', 'walmart', 'rite aid', 'costco', 'target', 'stop & shop', 'kroger', 'safeway', 'publix'];
  return chains.some(chain => lowerName.includes(chain));
}

/**
 * Get clean display name for pharmacy
 */
export function getCleanPharmacyName(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Known chain patterns
  if (lowerName.includes('cvs')) return 'CVS Pharmacy';
  if (lowerName.includes('walgreens')) return 'Walgreens';
  if (lowerName.includes('walmart')) return 'Walmart Pharmacy';
  if (lowerName.includes('rite aid')) return 'Rite Aid';
  if (lowerName.includes('costco')) return 'Costco Pharmacy';
  if (lowerName.includes('target')) return 'Target Pharmacy';
  if (lowerName.includes('stop & shop')) return 'Stop & Shop Pharmacy';
  if (lowerName.includes('kroger')) return 'Kroger Pharmacy';
  if (lowerName.includes('safeway')) return 'Safeway Pharmacy';
  if (lowerName.includes('publix')) return 'Publix Pharmacy';
  
  // For health centers and clinics, add "Pharmacy" if not present
  if ((lowerName.includes('health') || lowerName.includes('medical') || lowerName.includes('clinic')) && !lowerName.includes('pharmacy')) {
    return `${name} Pharmacy`;
  }
  
  // Return original name for independent pharmacies
  return name;
}
