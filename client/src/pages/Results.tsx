import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { medications } from "@/data/medications";
import { insurancePlans } from "@/data/insurance";
import { getAllPricesForMedication, PriceResult } from "@/data/pricing";
import { ArrowLeft, MapPin, Phone, Clock, Truck, Car, DollarSign, TrendingDown } from "lucide-react";
import { MapView } from "@/components/Map";
import { getMockMedicationId } from "@/services/medicationMappingService";
import { generatePharmaciesForZip } from "@/services/pharmacyGenerator";
import { fetchRealPharmacies, calculateDistance, type RealPharmacy } from "@/services/realPharmacyService";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { getZipCodeLocation } from "@/services/zipCodeService";
import { saveSearch } from "@/services/searchHistory";
import { getMedicationAlternatives, type MedicationAlternative } from "@/services/alternativesService";
import { findTherapeuticAlternatives } from "@/services/rxclassApi";
import { CostPlusCard } from "@/components/CostPlusCard";
import { PharmacyTransparencyCard } from "@/components/PharmacyTransparencyCard";
import { DataTransparencyBanner } from "@/components/DataTransparencyBanner";
import { SafetyInfoTab } from "@/components/SafetyInfoTab";
import { AIAlternativesTab } from "@/components/AIAlternativesTab";

export default function Results() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const [results, setResults] = useState<PriceResult[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  
  // Debug logging for selectedPharmacy changes
  useEffect(() => {
    console.log('🔵 [MARKER DEBUG] selectedPharmacy state changed to:', selectedPharmacy);
  }, [selectedPharmacy]);
  const [alternatives, setAlternatives] = useState<MedicationAlternative[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [realPharmacies, setRealPharmacies] = useState<RealPharmacy[]>([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("prices");
  
  // Filter and sort state

  const [distanceFilter, setDistanceFilter] = useState<string>("all");
  const [featureFilters, setFeatureFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price");

  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const userZip = params.get("zip") || "02108"; // Default to Boston if no ZIP provided
  const medicationName = params.get("medication") || "";
  const rxcui = params.get("rxcui") || "";
  const dosage = params.get("dosage") || "";
  const form = params.get("form") || "";
  const frequency = params.get("frequency") || "1";
  const quantity = params.get("quantity") || "30";
  const totalPills = parseInt(params.get("totalPills") || "30");
  const insuranceId = params.get("insurance") || "";
  const deductibleMet = params.get("deductibleMet") === "true";
  
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

  // Fetch real pharmacies when map is ready
  useEffect(() => {
    async function loadRealPharmacies() {
      if (!map || !userZip || loadingPharmacies) return;
      
      setLoadingPharmacies(true);
      try {
        console.log('🏥 [RESULTS] Fetching real pharmacies for ZIP:', userZip);
        const pharmacies = await fetchRealPharmacies(map, userZip);
        setRealPharmacies(pharmacies);
        console.log('✅ [RESULTS] Loaded', pharmacies.length, 'real pharmacies');
      } catch (error) {
        console.error('❌ [RESULTS] Failed to load real pharmacies, using fallback:', error);
        // Fallback to mock pharmacies if Places API fails
        const fallbackPharmacies = generatePharmaciesForZip(userZip, 8);
        // Convert mock pharmacies to RealPharmacy format
        const converted: RealPharmacy[] = fallbackPharmacies.map(p => ({
          placeId: p.id,
          name: p.name,
          address: p.address,
          lat: p.lat,
          lng: p.lng,
          phone: p.phone,
          chain: p.chain,
        }));
        setRealPharmacies(converted);
      } finally {
        setLoadingPharmacies(false);
      }
    }
    
    loadRealPharmacies();
  }, [map, userZip]);

  // Generate pricing when we have real pharmacies
  useEffect(() => {
    if (medicationName && dosage && form && insuranceId && mockMedicationId && realPharmacies.length > 0) {
      console.log('💰 [RESULTS] Generating pricing for', realPharmacies.length, 'pharmacies');
      
      // Get user's location for distance calculation
      const userLocation = getZipCodeLocation(userZip);
      
      // Convert real pharmacies to mock pharmacy format for pricing
      const pharmaciesForPricing = realPharmacies.map(rp => ({
        id: rp.placeId,
        name: rp.name,
        address: rp.address,
        city: '', // Not provided by Places API
        state: '', // Not provided by Places API
        zip: userZip,
        lat: rp.lat,
        lng: rp.lng,
        phone: rp.phone || '(555) 000-0000',
        hours: rp.openNow ? 'Open now' : 'Hours vary',
        chain: rp.chain || 'independent',
        hasDelivery: Math.random() > 0.5,
        hasDriveThru: Math.random() > 0.5,
      }));
      
      // Use the mapped mock medication ID for pricing data
      const priceResults = getAllPricesForMedication(
        mockMedicationId,
        dosage,
        form,
        insuranceId,
        deductibleMet,
        userLocation.lat,
        userLocation.lng,
        pharmaciesForPricing
      );
      setResults(priceResults);
      console.log('✅ [RESULTS] Generated pricing for', priceResults.length, 'pharmacies');
    }
  }, [medicationName, dosage, form, insuranceId, deductibleMet, mockMedicationId, realPharmacies, userZip]);

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

  // Load medication alternatives using RxClass API
  useEffect(() => {
    async function loadAlternatives() {
      if (!medicationName) return;
      
      // Try RxClass API first for dynamic therapeutic alternatives
      const rxclassAlternatives = await findTherapeuticAlternatives(medicationName);
      
      if (rxclassAlternatives.length > 0) {
        // Convert RxClass results to MedicationAlternative format
        const formattedAlts: MedicationAlternative[] = rxclassAlternatives.slice(0, 5).map(alt => ({
          medicationId: alt.rxcui,
          name: alt.name.charAt(0).toUpperCase() + alt.name.slice(1), // Capitalize
          type: "therapeutic" as const,
          description: "Same therapeutic class (via RxClass API)",
          estimatedSavings: 10,
        }));
        setAlternatives(formattedAlts);
      } else if (mockMedicationId) {
        // Fallback to manual mappings if RxClass API returns nothing
        const manualAlts = getMedicationAlternatives(mockMedicationId);
        setAlternatives(manualAlts);
      }
    }
    
    loadAlternatives();
  }, [medicationName, mockMedicationId]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];
    
    // Apply distance filter
    if (distanceFilter !== "all") {
      const maxDistance = parseFloat(distanceFilter);
      filtered = filtered.filter(r => (r.distance || 0) <= maxDistance);
    }
    
    // Apply feature filters
    if (featureFilters.length > 0) {
      filtered = filtered.filter(r => {
        // Check feature filters
        if (featureFilters.includes("24hour") && !r.pharmacy.hours?.includes('24')) return false;
        if (featureFilters.includes("driveThru") && !r.pharmacy.hasDriveThru) return false;
        if (featureFilters.includes("delivery") && !r.pharmacy.hasDelivery) return false;
        
        // Check pharmacy chain filter
        const chainFilter = featureFilters.find(f => f.startsWith('chain:'));
        if (chainFilter) {
          const selectedChain = chainFilter.replace('chain:', '');
          const pharmacyName = r.pharmacy.name.toLowerCase();
          const chainName = r.pharmacy.chain?.toLowerCase() || '';
          
          // Match by name or chain field
          if (!pharmacyName.includes(selectedChain) && !chainName.includes(selectedChain)) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return a.insurancePrice - b.insurancePrice;
      } else if (sortBy === "distance") {
        return (a.distance || 0) - (b.distance || 0);
      } else if (sortBy === "savings") {
        const savingsA = a.cashPrice - a.insurancePrice;
        const savingsB = b.cashPrice - b.insurancePrice;
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
    console.log('[DEBUG] Marker useEffect triggered. selectedPharmacy:', selectedPharmacy);
    if (!mapReady || !map || filteredAndSortedResults.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => {
      marker.map = null;
    });

    // Create new markers
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    const bounds = new google.maps.LatLngBounds();

    filteredAndSortedResults.forEach((result, index) => {
      const position = { lat: result.pharmacy.lat, lng: result.pharmacy.lng };
      const isSelected = selectedPharmacy === result.pharmacy.id;
      const isLowestPrice = index === 0;
      
      console.log(`🎯 [MARKER] Pharmacy ${result.pharmacy.name} (${result.pharmacy.id})`);
      console.log(`   - Index: ${index}, isLowestPrice: ${isLowestPrice}`);
      console.log(`   - isSelected: ${isSelected} (selectedPharmacy: ${selectedPharmacy})`);
      
      // Create custom marker content
      const markerContent = document.createElement("div");
      markerContent.className = "relative cursor-pointer";
      
      const priceLabel = document.createElement("div");
      // Green for selected, gold for lowest price (if not selected), blue for others
      const markerColor = isSelected ? 'green' : isLowestPrice ? 'amber' : 'blue';
      console.log(`   - Marker color: ${markerColor}`);
      
      priceLabel.className = isSelected
        ? "bg-green-600 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg border-2 border-white"
        : isLowestPrice
        ? "bg-amber-500 text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-lg border-2 border-white"
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
        console.log(`🖱️ [MARKER CLICK] User clicked marker for ${result.pharmacy.name}`);
        setSelectedPharmacy(result.pharmacy.id);
        // Scroll to pharmacy card
        const pharmacyCard = document.getElementById(`pharmacy-${result.pharmacy.id}`);
        if (pharmacyCard) {
          pharmacyCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);
    map.fitBounds(bounds);
  }, [mapReady, map, filteredAndSortedResults, selectedPharmacy]);

  const lowestPrice = results.length > 0 ? Math.min(...results.map(r => r.insurancePrice)) : 0;
  const highestPrice = results.length > 0 ? Math.max(...results.map(r => r.insurancePrice)) : 0;
  const potentialSavings = highestPrice - lowestPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50">
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
              {t('results.header.newSearch')}
            </Button>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">RxPriceFinder</h1>
              <LanguageToggle />
            </div>
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
                {t('results.header.print')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert(t('results.header.linkCopied'));
                }}
                className="gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {t('results.header.share')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        {/* Data Transparency Banner */}
        <DataTransparencyBanner />
        
        {/* Medication Info Card - Always visible */}
        <Card className="mb-6">
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

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="prices">Prices & Pharmacies</TabsTrigger>
            <TabsTrigger value="safety">Safety Information</TabsTrigger>
            <TabsTrigger value="alternatives">AI Alternatives</TabsTrigger>
          </TabsList>

          {/* Prices Tab */}
          <TabsContent value="prices">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2">

            {/* Medication Alternatives */}
            {alternatives.length > 0 && (
              <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t('results.alternatives.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('results.alternatives.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alternatives.map((alt, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{alt.name}</h4>
                              <Badge variant={alt.type === "generic" ? "default" : "outline"} className="text-xs">
                                {alt.type === "generic" ? t('results.alternatives.generic') : t('results.alternatives.alternative')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{alt.description}</p>
                          </div>
                          {alt.estimatedSavings && alt.estimatedSavings > 0 && (
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-green-600">
                                {t('results.alternatives.savePercent').replace('{{percent}}', alt.estimatedSavings.toString())}
                              </div>
                              <div className="text-xs text-muted-foreground">{t('results.alternatives.estimated')}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price Comparison Summary */}
            {filteredAndSortedResults.length > 0 && (() => {
              const prices = filteredAndSortedResults.map(r => r.insurancePrice).filter(p => p != null && !isNaN(p));
              if (prices.length === 0) return null;
              
              const lowestPrice = Math.min(...prices);
              const highestPrice = Math.max(...prices);
              const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
              const savings = highestPrice - lowestPrice;
              const recommended = filteredAndSortedResults[0]; // Best overall (already sorted)
              
              if (!recommended || recommended.insurancePrice == null) return null;
              
              return (
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">{t('results.priceSummary.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">{t('results.priceSummary.lowestPrice')}</div>
                        <div className="text-2xl font-bold text-green-600">${lowestPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t('results.priceSummary.highestPrice')}</div>
                        <div className="text-2xl font-bold text-red-600">${highestPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t('results.priceSummary.averagePrice')}</div>
                        <div className="text-2xl font-bold text-blue-600">${avgPrice.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{t('results.priceSummary.potentialSavings')}</div>
                        <div className="text-2xl font-bold text-green-600">${savings.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900 mb-2">{t('results.priceSummary.recommended')}</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{recommended.pharmacy.name}</div>
                          <div className="text-sm text-muted-foreground">{t('results.priceSummary.milesAway').replace('{{distance}}', recommended.distance?.toFixed(1) || '0.0')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${recommended.insurancePrice.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">{t('results.priceSummary.bestValue')}</div>
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
                      <label className="text-sm font-medium mb-2 block">{t('results.filters.distance')}</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={distanceFilter}
                        onChange={(e) => setDistanceFilter(e.target.value)}
                      >
                        <option value="all">{t('results.filters.allDistances')}</option>
                        <option value="1">{t('results.filters.lessThan1Mile')}</option>
                        <option value="5">{t('results.filters.lessThan5Miles')}</option>
                        <option value="10">{t('results.filters.lessThan10Miles')}</option>
                      </select>
                    </div>
                    
                    {/* Feature Filters */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('results.filters.features')}</label>
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
                          {t('results.filters.feature24Hour')}
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
                          {t('results.filters.featureDriveThru')}
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
                          {t('results.filters.featureDelivery')}
                        </label>
                      </div>
                    </div>
                    
                    {/* ZIP Code Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Change Location</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="Enter ZIP code"
                          className="flex-1 p-2 border rounded-md"
                          defaultValue={userZip}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const newZip = (e.target as HTMLInputElement).value;
                              if (newZip && /^\d{5}$/.test(newZip)) {
                                // Update URL with new ZIP
                                const newParams = new URLSearchParams(searchParams);
                                newParams.set('zip', newZip);
                                setLocation(`/results?${newParams.toString()}`);
                              }
                            }
                          }}
                        />
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            const newZip = input.value;
                            if (newZip && /^\d{5}$/.test(newZip)) {
                              const newParams = new URLSearchParams(searchParams);
                              newParams.set('zip', newZip);
                              setLocation(`/results?${newParams.toString()}`);
                            }
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </div>

                    {/* Pharmacy Chain Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pharmacy Chain</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => {
                          const chain = e.target.value;
                          if (chain === 'all') {
                            setFeatureFilters(featureFilters.filter(f => !f.startsWith('chain:')));
                          } else {
                            setFeatureFilters([...featureFilters.filter(f => !f.startsWith('chain:')), `chain:${chain}`]);
                          }
                        }}
                      >
                        <option value="all">All Pharmacies</option>
                        <option value="cvs">CVS Pharmacy</option>
                        <option value="walgreens">Walgreens</option>
                        <option value="walmart">Walmart Pharmacy</option>
                        <option value="costco">Costco Pharmacy</option>
                        <option value="riteaid">Rite Aid</option>
                        <option value="kroger">Kroger Pharmacy</option>
                        <option value="target">Target Pharmacy</option>
                      </select>
                    </div>
                    
                    {/* Sort Options */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('results.filters.sortBy')}</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="price">{t('results.filters.sortPriceLowHigh')}</option>
                        <option value="distance">{t('results.filters.sortDistanceNearFar')}</option>
                        <option value="savings">{t('results.filters.sortSavingsHighLow')}</option>
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
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">{t('results.pharmacies.found').replace('{{count}}', filteredAndSortedResults.length.toString())}</h2>
                    <Badge className="bg-green-600 text-white">
                      ✅ Real Locations
                    </Badge>
                  </div>
                  {potentialSavings > 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      {t('results.pharmacies.saveUpTo').replace('{{amount}}', potentialSavings.toFixed(0))}
                    </Badge>
                  )}
                </div>

                {filteredAndSortedResults.map((result, index) => (
                  <Card
                    key={result.pharmacy.id}
                    id={`pharmacy-${result.pharmacy.id}`}
                    className={`cursor-pointer transition-all ${
                      selectedPharmacy === result.pharmacy.id
                        ? "ring-2 ring-primary shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => {
                      console.log(`🖱️ [CARD CLICK] User clicked card for ${result.pharmacy.name}`);
                      setSelectedPharmacy(result.pharmacy.id);
                    }}
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
                              <Badge className="bg-green-100 text-green-800">{t('results.pharmacies.lowestPrice')}</Badge>
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
                                  {t('results.filters.featureDelivery')}
                                </Badge>
                              )}
                              {result.pharmacy.hasDriveThru && (
                                <Badge variant="outline" className="text-xs">
                                  <Car className="w-3 h-3 mr-1" />
                                  {t('results.filters.featureDriveThru')}
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(result.pharmacy.address)}`;
                                window.open(mapsUrl, '_blank');
                              }}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              Get Directions
                            </Button>
                          </div>
                        </div>

                        {/* Pricing Info */}
                        <div className="space-y-3">
                          {/* Insurance Pricing */}
                          <div className="bg-blue-50 p-4 rounded-lg relative">
                            {/* Estimated Price Badge */}
                            <div className="absolute top-2 right-2">
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-300">
                                📊 Estimated
                              </Badge>
                            </div>
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
                          
                          {/* Coupon Pricing */}
                          {result.couponPrice && (
                            <div className={`p-4 rounded-lg ${
                              result.bestOption === "coupon" 
                                ? "bg-green-50 border-2 border-green-300" 
                                : "bg-gray-50"
                            }`}>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-muted-foreground">
                                    With {result.couponProvider} Coupon
                                  </p>
                                  {result.bestOption === "coupon" && (
                                    <Badge className="bg-green-600 text-white text-xs">
                                      Best Price!
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                  ${result.couponPrice}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Save ${result.couponSavings} vs cash price
                                </p>
                              </div>
                            </div>
                          )}
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

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Map */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Pharmacy Locations</CardTitle>
                <CardDescription>Click markers to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <MapView 
                    onMapReady={handleMapReady} 
                    initialCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
                    initialZoom={12}
                  />
                  {/* Custom Zoom Controls */}
                  {map && (
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white shadow-lg hover:bg-gray-100"
                        onClick={() => {
                          const currentZoom = map.getZoom() || 12;
                          map.setZoom(currentZoom + 1);
                        }}
                        title="Zoom in"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white shadow-lg hover:bg-gray-100"
                        onClick={() => {
                          const currentZoom = map.getZoom() || 12;
                          map.setZoom(currentZoom - 1);
                        }}
                        title="Zoom out"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white shadow-lg hover:bg-gray-100 text-xs px-2"
                        onClick={() => {
                          if (filteredAndSortedResults.length > 0) {
                            const bounds = new google.maps.LatLngBounds();
                            filteredAndSortedResults.forEach(result => {
                              bounds.extend({ lat: result.pharmacy.lat, lng: result.pharmacy.lng });
                            });
                            map.fitBounds(bounds);
                          }
                        }}
                        title="Fit all pharmacies"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cost Plus Drugs Card */}
            {filteredAndSortedResults.length > 0 && (() => {
              const avgPrice = filteredAndSortedResults.reduce((sum, r) => sum + (r.insurancePrice || 0), 0) / filteredAndSortedResults.length;
              return (
                <CostPlusCard
                  medicationName={medicationName}
                  strength={dosage}
                  quantity={totalPills}
                  averageRetailPrice={avgPrice}
                />
              );
            })()}

            {/* Pharmacy Transparency Card */}
            {filteredAndSortedResults.length > 0 && (() => {
              const prices = filteredAndSortedResults.map(r => r.insurancePrice).filter(p => p != null && !isNaN(p));
              if (prices.length === 0) return null;
              
              const lowestPrice = Math.min(...prices);
              const highestPrice = Math.max(...prices);
              const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
              
              return (
                <PharmacyTransparencyCard
                  medicationName={medicationName}
                  averageRetailPrice={avgPrice}
                  lowestRetailPrice={lowestPrice}
                  highestRetailPrice={highestPrice}
                />
              );
            })()}
          </div>
        </div>
      </TabsContent>

      {/* Safety Information Tab */}
      <TabsContent value="safety">
        <SafetyInfoTab medicationName={medicationName} rxcui={rxcui} />
      </TabsContent>

      {/* AI Alternatives Tab */}
      <TabsContent value="alternatives">
        <AIAlternativesTab medicationName={medicationName} dosage={dosage} />
      </TabsContent>
    </Tabs>
      </div>
    </div>
  );
}
