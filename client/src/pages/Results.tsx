import { useEffect, useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { medications } from "@/data/medications";
import { insurancePlans } from "@/data/insurance";
import { getAllPricesForMedication, PriceResult } from "@/data/pricing";
import { ArrowLeft, MapPin, Phone, Clock, Truck, Car, DollarSign, TrendingDown } from "lucide-react";
import { MapView } from "@/components/Map";

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

  // Use mock medication data for now (will be replaced with API data)
  const medication = medications.find(m => m.id === "med-1") || {
    id: "api-med",
    name: medicationName,
    genericName: medicationName,
    dosages: [dosage],
    forms: [form]
  };
  const insurance = insurancePlans.find(i => i.id === insuranceId);

  useEffect(() => {
    if (medicationName && dosage && form && insuranceId) {
      // For now, use mock data for pricing
      // In production, this would call an API endpoint
      const priceResults = getAllPricesForMedication(
        "med-1", // Use mock medication ID
        dosage,
        form,
        insuranceId,
        deductibleMet
      );
      setResults(priceResults);
    }
  }, [medicationName, dosage, form, insuranceId, deductibleMet]);

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
        : "bg-blue-600 text-white px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg border-2 border-white";
      priceLabel.textContent = `$${result.totalCost}`;
      
      markerContent.appendChild(priceLabel);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content: markerContent,
        title: result.pharmacy.name,
      });

      marker.addListener("click", () => {
        setSelectedPharmacy(result.pharmacy.id);
        // Scroll to the pharmacy card
        const element = document.getElementById(`pharmacy-${result.pharmacy.id}`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);
    map.fitBounds(bounds);

    // Cleanup
    return () => {
      newMarkers.forEach(marker => {
        marker.map = null;
      });
    };
  }, [mapReady, map, results]);

  if (!insurance || !medicationName || !dosage || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Invalid search parameters</p>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => setLocation("/")} className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Search
              </Button>
              <h1 className="text-xl font-bold text-foreground">
                {medication.name} ({medication.genericName})
              </h1>
              <p className="text-sm text-muted-foreground">
                {dosage} {form} • {insurance.carrier} - {insurance.planName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Found {results.length} pharmacies</p>
              {results.length > 0 && (
                <p className="text-lg font-bold text-green-600">
                  Best Price: ${results[0].totalCost}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Results List */}
          <div className="space-y-4 lg:h-[calc(100vh-200px)] lg:overflow-y-auto">
            {results.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No results found</p>
                </CardContent>
              </Card>
            ) : (
              results.map((result, index) => (
                <Card
                  key={result.pharmacy.id}
                  id={`pharmacy-${result.pharmacy.id}`}
                  className={`cursor-pointer transition-all ${
                    selectedPharmacy === result.pharmacy.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  } ${index === 0 ? "border-green-500 border-2" : ""}`}
                  onClick={() => setSelectedPharmacy(result.pharmacy.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{result.pharmacy.name}</CardTitle>
                          {index === 0 && (
                            <Badge className="bg-green-600 text-white">
                              Lowest Price
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {result.pharmacy.address}, {result.pharmacy.city}, {result.pharmacy.state}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ${result.totalCost}
                        </div>
                        {result.savings > 0 && (
                          <div className="text-sm text-green-600 flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Save ${result.savings}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Price Breakdown */}
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Cash Price:</span>
                        <span className="font-medium line-through">${result.cashPrice}</span>
                      </div>
                      {deductibleMet ? (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Insurance Copay:</span>
                          <span className="font-bold text-green-600">${result.copay}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Before Deductible:</span>
                            <span className="font-medium">${result.insurancePrice}</span>
                          </div>
                          <p className="text-xs text-muted-foreground italic">
                            After meeting your ${insurance.deductible} deductible, you'll pay ${result.copay}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Pharmacy Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {result.pharmacy.phone}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {result.pharmacy.hours.split(",")[0]}
                      </div>
                      {result.pharmacy.hasDelivery && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Truck className="w-4 h-4" />
                          Delivery Available
                        </div>
                      )}
                      {result.pharmacy.hasDriveThru && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Car className="w-4 h-4" />
                          Drive-Thru
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Map */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-200px)]">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Pharmacy Locations</CardTitle>
                <CardDescription>Click markers to view details</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] lg:h-[calc(100vh-320px)] rounded-b-lg overflow-hidden">
                  <MapView
                    onMapReady={handleMapReady}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Card */}
        {results.length > 0 && (
          <Card className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Potential Savings</p>
                    <p className="text-sm text-muted-foreground">
                      By choosing the lowest price pharmacy
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    ${Math.max(...results.map(r => r.totalCost)) - results[0].totalCost}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    vs. most expensive option
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
