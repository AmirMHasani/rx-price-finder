import { useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

/**
 * Test page to verify Google Places API works with Manus proxy
 * This will search for pharmacies near a ZIP code
 */
export default function TestPlaces() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [zipCode, setZipCode] = useState("02101"); // Boston
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 42.3601, lng: -71.0589 });

  const searchPharmacies = async () => {
    if (!mapRef.current) {
      setError("Map not loaded yet");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Step 1: Geocode the ZIP code
      const geocoder = new google.maps.Geocoder();
      const geocodeResult = await new Promise<google.maps.GeocoderResult[]>(
        (resolve, reject) => {
          geocoder.geocode({ address: zipCode }, (results, status) => {
            if (status === "OK" && results) {
              resolve(results);
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        }
      );

      const location = geocodeResult[0].geometry.location;
      const center = { lat: location.lat(), lng: location.lng() };
      setMapCenter(center);
      mapRef.current.setCenter(location);

      console.log("✅ Geocoding successful:", center);

      // Step 2: Search for pharmacies using Places API
      const service = new google.maps.places.PlacesService(mapRef.current);
      
      const request: google.maps.places.PlaceSearchRequest = {
        location: location,
        radius: 5000, // 5km radius
        type: "pharmacy",
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

      console.log("✅ Places API successful:", placesResult.length, "pharmacies found");
      setResults(placesResult);

      // Add markers for each pharmacy
      placesResult.forEach((place) => {
        if (place.geometry?.location) {
          new google.maps.marker.AdvancedMarkerElement({
            map: mapRef.current,
            position: place.geometry.location,
            title: place.name,
          });
        }
      });

    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Google Places API Test</h1>
        
        <Card className="p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">ZIP Code</label>
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code"
              />
            </div>
            <Button onClick={searchPharmacies} disabled={loading}>
              {loading ? "Searching..." : "Search Pharmacies"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
              <strong>Success!</strong> Found {results.length} pharmacies
            </div>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Map</h2>
            <MapView
              initialCenter={mapCenter}
              initialZoom={13}
              onMapReady={(map) => {
                mapRef.current = map;
                console.log("✅ Map loaded successfully");
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Results ({results.length})
            </h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {results.map((place, index) => (
                <Card key={index} className="p-4">
                  <h3 className="font-semibold">{place.name}</h3>
                  <p className="text-sm text-gray-600">{place.vicinity}</p>
                  {place.rating && (
                    <p className="text-sm text-gray-500">
                      ⭐ {place.rating} ({place.user_ratings_total} reviews)
                    </p>
                  )}
                  {place.opening_hours && (
                    <p className="text-sm text-gray-500">
                      {place.opening_hours.open_now ? "🟢 Open" : "🔴 Closed"}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
