import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { medications } from "@/data/medications";
import { insurancePlans } from "@/data/insurance";
import { getAllPricesForMedication, PriceResult } from "@/data/pricing";
import { ArrowLeft, MapPin, Phone, Clock, Truck, Car, DollarSign, TrendingDown } from "lucide-react";
import { MapView } from "@/components/Map";
import { getMockMedicationId } from "@/services/medicationMappingService";
import { generatePharmaciesForZip } from "@/services/pharmacyGenerator";
import { getZipCodeLocation } from "@/services/zipCodeService";
import { saveSearch } from "@/services/searchHistory";

export default function Results() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const [results, setResults] = useState<PriceResult[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  
  // Filter and sort state
  const [distanceFilter, setDistanceFilter] = useState<string>("all");
  const [featureFilters, setFeatureFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price");

  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const medicationName = params.get("medication") || "";
  const rxcui = params.get("rxcui") || "";
  const dosage = params.get("dosage") || "";
  const form = params.get("form") || "";
  const frequency = params.get("frequency") || "1";
  const quantity = params.get("quantity") || "30";
  const totalPills = parseInt(params.get("totalPills") || "30");
  const insuranceId = params.get("insurance") || "";
  const deductibleMet = params.get("deductibleMet") === "true";
  const userZip = params.get("zip") || "02108"; // Default to Boston if no ZIP provided
  
  // Get user's location from ZIP code for map centering
  const userLocation = useMemo(() => {
    return getZipCodeLocation(userZip);
  }, [userZip]);

  // Map RXCUI to mock medication ID
  const mockMedicationId = useMemo(() => {
    return getMockMedicationId(rxcui, medicationName);
  }, [rxcui, medicationName]);

  // Create medication object from URL parameters
  const medication = {
    id: mockMedicationId,
    name: medicationName,
    genericName: medicationName,
    dosages: [dosage],
    forms: [form]
  };
  const insurance = insurancePlans.find(i => i.id === insuranceId);

  useEffect(() => {
    if (medicationName && dosage && form && insuranceId && mockMedicationId && userZip) {
      // Generate pharmacies dynamically based on user's ZIP code
      const dynamicPharmacies = generatePharmaciesForZip(userZip, 8);
      
      // Get user's location for distance calculation
      const userLocation = getZipCodeLocation(userZip);
      
      // Use the mapped mock medication ID for pricing data
      const priceResults = getAllPricesForMedication(
        mockMedicationId,
        dosage,
        form,
        insuranceId,
        deductibleMet,
        userLocation.lat,
        userLocation.lng,
        dynamicPharmacies
      );
      setResults(priceResults);
    }
  }, [medicationName, dosage, form, insuranceId, deductibleMet, mockMedicationId, userZip]);

  // Save search to history
  useEffect(() => {
    if (medicationName && dosage && form && insuranceId) {
      saveSearch({
        medication: medicationName,
        dosage,
        form,
        insurance: insuranceId,
        zip: userZip,
        url: window.location.href,
      });
    }
  }, [medicationName, dosage, form, insuranceId, userZip]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];
    
    // Apply distance filter
    if (distanceFilter !== "all") {
      const maxDistance = parseFloat(distanceFilter);
      filtered = filtered.filter(r => r.distance <= maxDistance);
    }
    
    // Apply feature filters
    if (featureFilters.length > 0) {
      filtered = filtered.filter(r => {
        if (featureFilters.includes("24hour") && !r.pharmacy.hours24) return false;
        if (featureFilters.includes("driveThru") && !r.pharmacy.driveThru) return false;
        if (featureFilters.includes("delivery") && !r.pharmacy.delivery) return false;
        return true;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return a.finalPrice - b.finalPrice;
      } else if (sortBy === "distance") {
        return a.distance - b.distance;
      } else if (sortBy === "savings") {
        const savingsA = a.retailPrice - a.finalPrice;
        const savingsB = b.retailPrice - b.finalPrice;
        return savingsB - savingsA; // Higher savings first
      }
      return 0;
    });
    
    return filtered;
  }, [results, distanceFilter, featureFilters, sortBy]);

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setMapReady(true);
  };

  useEffect(() => {
    if (!mapReady || !map || results.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => {
      marker.map = null;
    });

    // Create new markers
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    const bounds = new google.maps.LatLngBounds();

    results.forEach((result, index) => {
      const position = { lat: result.pharmacy.lat, lng: result.pharmacy.lng };
      
      // Create custom marker content
      const markerContent = document.createElement("div");
      markerContent.className = "relative";
      
      const priceLabel = document.createElement("div");
      priceLabel.className = index === 0 
        ? "bg-green-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg border-2 border-white"
        : "bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg border-2 border-white";
      priceLabel.textContent = `$${result.insurancePrice}`;
      
      markerContent.appendChild(priceLabel);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content: markerContent,
        title: result.pharmacy.name,
      });

      marker.addListener("click", () => {
        setSelectedPharmacy(result.pharmacy.id);
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);
    map.fitBounds(bounds);
  }, [mapReady, map, results]);

  const lowestPrice = results.length > 0 ? Math.min(...results.map(r => r.insurancePrice)) : 0;
  const highestPrice = results.length > 0 ? Math.max(...results.map(r => r.insurancePrice)) : 0;
  const potentialSavings = highestPrice - lowestPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              New Search
            </Button>
            <h1 className="text-2xl font-bold text-foreground">RxPriceFinder</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results List */}
          <div className="lg:col-span-2">
            {/* Medication Info */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">{medicationName}</CardTitle>
                <CardDescription>
                  {dosage} {form} • {frequency === "1" ? "Once daily" : frequency === "2" ? "Twice daily" : frequency === "3" ? "Three times daily" : frequency === "4" ? "Four times daily" : frequency === "0.5" ? "Every other day" : "Once weekly"} • {quantity} days supply ({totalPills} pills)
                </CardDescription>
                <CardDescription className="mt-2">
                  {insurance?.carrier} - {insurance?.planName}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Price Comparison Summary */}
            {filteredAndSortedResults.length > 0 && (() => {
              const prices = filteredAndSortedResults.map(r => r.finalPrice);
              const lowestPrice = Math.min(...prices);
              const highestPrice = Math.max(...prices);
              const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
              const savings = highestPrice - lowestPrice;
              const recommended = filteredAndSortedResults[0]; // Best overall (already sorted)
              
              return (
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Price Comparison Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Lowest Price</div>
                        <div className="text-2xl font-bold text-green-600">${lowestPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Highest Price</div>
                        <div className="text-2xl font-bold text-red-600">${highestPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Average Price</div>
                        <div className="text-2xl font-bold text-blue-600">${avgPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Potential Savings</div>
                        <div className="text-2xl font-bold text-green-600">${savings.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900 mb-2">💡 Recommended Pharmacy</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{recommended.pharmacy.name}</div>
                          <div className="text-sm text-muted-foreground">{recommended.distance.toFixed(1)} miles away</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${recommended.finalPrice.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Best value</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Filter and Sort Controls */}
            {results.length > 0 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Distance Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Distance</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={distanceFilter}
                        onChange={(e) => setDistanceFilter(e.target.value)}
                      >
                        <option value="all">All distances</option>
                        <option value="1">Within 1 mile</option>
                        <option value="5">Within 5 miles</option>
                        <option value="10">Within 10 miles</option>
                      </select>
                    </div>
                    
                    {/* Feature Filters */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Features</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input 
                            type="checkbox" 
                            checked={featureFilters.includes("24hour")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFeatureFilters([...featureFilters, "24hour"]);
                              } else {
                                setFeatureFilters(featureFilters.filter(f => f !== "24hour"));
                              }
                            }}
                          />
                          24-Hour
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input 
                            type="checkbox" 
                            checked={featureFilters.includes("driveThru")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFeatureFilters([...featureFilters, "driveThru"]);
                              } else {
                                setFeatureFilters(featureFilters.filter(f => f !== "driveThru"));
                              }
                            }}
                          />
                          Drive-Thru
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input 
                            type="checkbox" 
                            checked={featureFilters.includes("delivery")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFeatureFilters([...featureFilters, "delivery"]);
                              } else {
                                setFeatureFilters(featureFilters.filter(f => f !== "delivery"));
                              }
                            }}
                          />
                          Delivery
                        </label>
                      </div>
                    </div>
                    
                    {/* Sort Options */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort by</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="price">Price: Low to High</option>
                        <option value="distance">Distance: Near to Far</option>
                        <option value="savings">Savings: High to Low</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pharmacy Results */}
            {filteredAndSortedResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Found {filteredAndSortedResults.length} pharmacies</h2>
                  {potentialSavings > 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Save up to ${potentialSavings}
                    </Badge>
                  )}
                </div>

                {filteredAndSortedResults.map((result, index) => (
                  <Card
                    key={result.pharmacy.id}
                    className={`cursor-pointer transition-all ${
                      selectedPharmacy === result.pharmacy.id
                        ? "ring-2 ring-primary"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedPharmacy(result.pharmacy.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pharmacy Info */}
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg">{result.pharmacy.name}</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="w-4 h-4" />
                                {result.pharmacy.address}
                              </div>
                            </div>
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-800">Lowest Price</Badge>
                            )}
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{result.pharmacy.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{result.pharmacy.hours}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {result.pharmacy.hasDelivery && (
                                <Badge variant="outline" className="text-xs">
                                  <Truck className="w-3 h-3 mr-1" />
                                  Delivery
                                </Badge>
                              )}
                              {result.pharmacy.hasDriveThru && (
                                <Badge variant="outline" className="text-xs">
                                  <Car className="w-3 h-3 mr-1" />
                                  Drive-Thru
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Pricing Info */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Cash Price</p>
                              <p className="text-2xl font-bold text-foreground line-through opacity-50">
                                ${result.cashPrice}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">With {insurance?.carrier}</p>
                              <p className="text-3xl font-bold text-primary">
                                ${result.insurancePrice}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-border">
                              <p className="text-sm font-semibold text-green-700">
                                Save ${result.savings}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                      <DollarSign className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Pricing Not Available</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        We don't have pricing data for <strong>{medicationName}</strong> yet. Our database currently includes pricing for the most commonly prescribed medications.
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                      <p className="text-sm text-foreground">
                        <strong>Try searching for:</strong>
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Lipitor, Metformin, Lisinopril, Omeprazole, Amlodipine, Sertraline, Levothyroxine, or other common prescriptions
                      </p>
                    </div>
                    <Button onClick={() => setLocation("/")} variant="default">
                      Search Another Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Pharmacy Locations</CardTitle>
                <CardDescription>Click markers to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <MapView 
                  onMapReady={handleMapReady} 
                  initialCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
                  initialZoom={12}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
