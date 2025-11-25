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

export default function Results() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const [results, setResults] = useState<PriceResult[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const medicationName = params.get("medication") || "";
  const rxcui = params.get("rxcui") || "";
  const dosage = params.get("dosage") || "";
  const form = params.get("form") || "";
  const insuranceId = params.get("insurance") || "";
  const deductibleMet = params.get("deductibleMet") === "true";

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
    if (medicationName && dosage && form && insuranceId && mockMedicationId) {
      // Use the mapped mock medication ID for pricing data
      const priceResults = getAllPricesForMedication(
        mockMedicationId,
        dosage,
        form,
        insuranceId,
        deductibleMet
      );
      setResults(priceResults);
    }
  }, [medicationName, dosage, form, insuranceId, deductibleMet, mockMedicationId]);

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
            <div className="w-24" /> {/* Spacer for alignment */}
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
                  {dosage} {form} • {insurance?.carrier} - {insurance?.planName}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pharmacy Results */}
            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Found {results.length} pharmacies</h2>
                  {potentialSavings > 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Save up to ${potentialSavings}
                    </Badge>
                  )}
                </div>

                {results.map((result, index) => (
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
                <MapView onMapReady={handleMapReady} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
