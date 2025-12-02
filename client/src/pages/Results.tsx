import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { medications } from "@/data/medications";
import { insurancePlans } from "@/data/insurance";
import { PriceResult } from "@/data/pricing"; // Old type, keeping for compatibility
import { PharmacyPricing } from "@/services/realPricingService"; // New type for real pricing
import { ArrowLeft, MapPin, Phone, Clock, Truck, Car, DollarSign, TrendingDown } from "lucide-react";
import { MapView } from "@/components/Map";
// Removed: getMockMedicationId - now using real Cost Plus API pricing
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
import { getPharmacyFeatures, getPharmacyHours } from "@/data/pharmacyFeatures";
import { SafetyInfoTab } from "@/components/SafetyInfoTab";
import { AIAlternativesTab } from "@/components/AIAlternativesTab";
import { fetchRealPricing } from "@/services/realPricingService";

// Helper function to get clean pharmacy display name for map markers
const getPharmacyDisplayName = (pharmacy: RealPharmacy): string => {
  // If it's a known chain, return the chain name
  const chainNames: Record<string, string> = {
    'cvs': 'CVS Pharmacy',
    'walgreens': 'Walgreens',
    'walmart': 'Walmart Pharmacy',
    'riteaid': 'Rite Aid',
    'costco': 'Costco Pharmacy',
    'target': 'Target Pharmacy',
    'stopshop': 'Stop & Shop Pharmacy',
  };

  if (pharmacy.chain && pharmacy.chain !== 'independent' && chainNames[pharmacy.chain]) {
    return chainNames[pharmacy.chain];
  }

  // For independent pharmacies, return the name as-is
  return pharmacy.name;
};

// Calculate best price for each pharmacy (lowest of member, coupon, insurance, cash)
const getBestPrice = (r: any) => {
  const prices = [
    r.membershipPrice,
    r.couponPrice,
    r.insurancePrice,
    r.cashPrice
  ].filter((p): p is number => p != null && p > 0);
  return prices.length > 0 ? Math.min(...prices) : r.insurancePrice;
};

export default function Results() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const [results, setResults] = useState<PharmacyPricing[]>([]);
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
  // Removed activeTab state - using accordions instead
  
  // Filter and sort state
  const [distanceFilter, setDistanceFilter] = useState<string>("all");
  const [featureFilters, setFeatureFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price");
  const [showAllPharmacies, setShowAllPharmacies] = useState(false);

  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const userZip = params.get("zipCode") || params.get("zip") || "02108"; // Default to Boston if no ZIP provided
  const medicationName = params.get("medication") || "";
  const rxcui = params.get("rxcui") || "";
  const dosage = params.get("dosage") || "";
  const form = params.get("form") || "";
  const frequency = params.get("frequency") || "1";
  const quantity = params.get("quantity") || "30";
  const totalPills = parseInt(params.get("totalPills") || "30");
  // Support both old single insurance param and new two-tier system
  const insuranceId = params.get("insurancePlan") || params.get("insurance") || "";
  const deductibleMet = params.get("deductibleMet") === "true";
  
  // Get user's location from ZIP code for map centering
  const userLocation = useMemo(() => {
    return getZipCodeLocation(userZip);
  }, [userZip]);

  // No longer need mock medication ID - using real pricing from Cost Plus API

  // Create medication object from URL parameters
  const medication = {
    id: 'real', // No longer using mock IDs
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
        console.log('🏭 [RESULTS] Fetching real pharmacies for ZIP:', userZip);
        const pharmacies = await fetchRealPharmacies(map, userZip);
        // Add id and pharmacy features to each pharmacy
        const pharmaciesWithFeatures = pharmacies.map(p => {
          const features = getPharmacyFeatures(p.chain || 'independent');
          return {
            ...p,
            id: p.placeId,  // Add id alias for compatibility
            hours: getPharmacyHours(features.has24Hour),
            hasDelivery: features.hasDelivery,
            hasDriveThru: features.hasDriveThru,
          };
        });
        setRealPharmacies(pharmaciesWithFeatures);
        console.log('✅ [RESULTS] Loaded', pharmaciesWithFeatures.length, 'real pharmacies with features');
      } catch (error) {
        console.error('❌ [RESULTS] Failed to load real pharmacies, using fallback:', error);
        // Fallback to mock pharmacies if Places API fails
        const fallbackPharmacies = generatePharmaciesForZip(userZip, 8);
        // Convert mock pharmacies to RealPharmacy format with features
        const converted: RealPharmacy[] = fallbackPharmacies.map(p => {
          const features = getPharmacyFeatures(p.chain || 'independent');
          return {
            placeId: p.id,
            id: p.id,  // Add id alias
            name: p.name,
            address: p.address,
            lat: p.lat,
            lng: p.lng,
            phone: p.phone,
            chain: p.chain,
            hours: getPharmacyHours(features.has24Hour),
            hasDelivery: features.hasDelivery,
            hasDriveThru: features.hasDriveThru,
          };
        });
        setRealPharmacies(converted);
      } finally {
        setLoadingPharmacies(false);
      }
    }
    
    loadRealPharmacies();
  }, [map, userZip]);

  // Generate pricing when we have real pharmacies
  useEffect(() => {
    async function fetchPricing() {
      if (medicationName && dosage && form && insuranceId && realPharmacies.length > 0) {
        console.log('💰 [RESULTS] Fetching real pricing for', realPharmacies.length, 'pharmacies');
        
        // Fetch real pricing from Cost Plus API
        // Pass realPharmacies directly - they already have all needed data
        const realPricing = await fetchRealPricing(
          medicationName,
          dosage,
          totalPills,
          realPharmacies,
          insuranceId,
          deductibleMet,
          rxcui,  // Pass RXCUI for insurance formulary lookup
          userZip  // Pass user ZIP code for regional pricing
        );
        
        // Use PharmacyPricing directly (no conversion needed)
        setResults(realPricing);
        console.log('✅ [RESULTS] Fetched real pricing for', realPricing.length, 'pharmacies');
      }
    }
    
    fetchPricing();
  }, [medicationName, dosage, form, insuranceId, deductibleMet, totalPills, realPharmacies, userZip]);

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
      } else {
        // No alternatives found from RxClass API
        setAlternatives([]);
      }
    }
    
    loadAlternatives();
  }, [medicationName]);

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
        // Sort by best price (lowest of all options)
        const bestPriceA = getBestPrice(a);
        const bestPriceB = getBestPrice(b);
        return bestPriceA - bestPriceB;
      } else if (sortBy === "distance") {
        return (a.distance || 0) - (b.distance || 0);
      } else if (sortBy === "savings") {
        // Savings = cash price - best price
        const bestPriceA = getBestPrice(a);
        const bestPriceB = getBestPrice(b);
        const savingsA = a.cashPrice - bestPriceA;
        const savingsB = b.cashPrice - bestPriceB;
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
        title: getPharmacyDisplayName(result.pharmacy),
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
  
  const lowestPrice = results.length > 0 ? Math.min(...results.map(getBestPrice)) : 0;
  const highestPrice = results.length > 0 ? Math.max(...results.map(getBestPrice)) : 0;
  const potentialSavings = highestPrice - lowestPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container py-3 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('results.header.newSearch')}</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">RxPriceFinder</h1>
              <LanguageToggle />
            </div>
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-1 sm:gap-2 hidden sm:flex"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span className="hidden md:inline">{t('results.header.print')}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert(t('results.header.linkCopied'));
                }}
                className="gap-1 sm:gap-2 hidden sm:flex"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="hidden md:inline">{t('results.header.share')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-6 md:py-10 px-4 md:px-6">
        {/* Medication Info Card - Always visible */}
        <Card className="mb-4 sm:mb-8 shadow-sm">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{medicationName}</CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2 space-y-0.5 sm:space-y-1">
              <div className="text-xs sm:text-sm">{dosage} {form} • {frequency === "1" ? "Once daily" : frequency === "2" ? "Twice daily" : frequency === "3" ? "Three times daily" : frequency === "4" ? "Four times daily" : frequency === "0.5" ? "Every other day" : "Once weekly"}</div>
              <div className="text-xs sm:text-sm">{quantity} days supply ({totalPills} pills)</div>
              <div className="font-medium text-blue-600 text-xs sm:text-sm">{insurance?.carrier} - {insurance?.planName}</div>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="prices" className="w-full">
          <TabsList className="mb-6 grid grid-cols-4 w-full bg-gray-100 shadow-sm p-1 rounded-xl gap-1">
            <TabsTrigger 
              value="prices" 
              className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white transition-all"
            >
              <span>💰</span>
              <span>Prices</span>
            </TabsTrigger>
            <TabsTrigger 
              value="safety" 
              className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white transition-all"
            >
              <span>🛡️</span>
              <span className="hidden sm:inline">Safety Info</span>
              <span className="sm:hidden">Safety</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alternatives" 
              className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white transition-all"
            >
              <span>💊</span>
              <span className="hidden sm:inline">Alternatives</span>
              <span className="sm:hidden">Alts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 font-semibold rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-white transition-all"
            >
              <span>📊</span>
              <span className="hidden sm:inline">About Data</span>
              <span className="sm:hidden">Data</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Prices */}
          <TabsContent value="prices">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="lg:col-span-2">


            {/* Price Comparison Summary */}
            {filteredAndSortedResults.length > 0 && (() => {
              // Get best price for each pharmacy
              const prices = filteredAndSortedResults.map(r => {
                const allPrices = [
                  r.membershipPrice,
                  r.couponPrice,
                  r.insurancePrice,
                  r.cashPrice
                ].filter((p): p is number => p != null && p > 0);
                return allPrices.length > 0 ? Math.min(...allPrices) : r.insurancePrice;
              }).filter(p => p != null && !isNaN(p));
              
              if (prices.length === 0) return null;
              
              const lowestPrice = Math.min(...prices);
              const highestPrice = Math.max(...prices);
              const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
              const savings = highestPrice - lowestPrice;
              const recommended = filteredAndSortedResults[0]; // Best overall (already sorted)
              
              if (!recommended || recommended.insurancePrice == null) return null;
              
              return (
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">{t('results.priceSummary.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{t('results.priceSummary.lowestPrice')}</div>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">${lowestPrice?.toFixed(2) || '0.00'}</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{t('results.priceSummary.highestPrice')}</div>
                        <div className="text-xl sm:text-2xl font-bold text-red-600">${highestPrice?.toFixed(2) || '0.00'}</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{t('results.priceSummary.averagePrice')}</div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">${avgPrice?.toFixed(2) || '0.00'}</div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{t('results.priceSummary.potentialSavings')}</div>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">${savings?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-white rounded-lg border border-blue-200">
                      <div className="text-xs sm:text-sm font-medium text-blue-900 mb-2">💡 {t('results.priceSummary.recommended')}</div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm sm:text-base">{recommended.pharmacy.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{t('results.priceSummary.milesAway').replace('{{distance}}', recommended.distance?.toFixed(1) || '0.0')}</div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-green-600">${getBestPrice(recommended).toFixed(2)}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{t('results.priceSummary.bestValue')}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Filter and Sort Controls - Compact Single Row */}
            {results.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3">
                    {/* Distance Filter */}
                    <div className="flex-1 sm:min-w-[140px]">
                      <label className="text-xs font-medium mb-1 block text-gray-600">Distance</label>
                      <select 
                        className="w-full p-2 text-sm border rounded-md bg-white"
                        value={distanceFilter}
                        onChange={(e) => setDistanceFilter(e.target.value)}
                      >
                        <option value="all">All distances</option>
                        <option value="1">&lt; 1 mile</option>
                        <option value="5">&lt; 5 miles</option>
                        <option value="10">&lt; 10 miles</option>
                      </select>
                    </div>
                    
                    {/* Pharmacy Chain Filter */}
                    <div className="flex-1 sm:min-w-[140px]">
                      <label className="text-xs font-medium mb-1 block text-gray-600">Pharmacy</label>
                      <select 
                        className="w-full p-2 text-sm border rounded-md bg-white"
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
                        <option value="cvs">CVS</option>
                        <option value="walgreens">Walgreens</option>
                        <option value="walmart">Walmart</option>
                        <option value="costco">Costco</option>
                        <option value="riteaid">Rite Aid</option>
                        <option value="kroger">Kroger</option>
                        <option value="target">Target</option>
                      </select>
                    </div>
                    
                    {/* Sort Options */}
                    <div className="flex-1 sm:min-w-[140px]">
                      <label className="text-xs font-medium mb-1 block text-gray-600">Sort by</label>
                      <select 
                        className="w-full p-2 text-sm border rounded-md bg-white"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="price">Price: Low to High</option>
                        <option value="distance">Distance: Near to Far</option>
                        <option value="savings">Savings: High to Low</option>
                      </select>
                    </div>
                    
                    {/* Feature Filters - Inline Checkboxes */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:ml-2">
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap">
                        <input 
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
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
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap">
                        <input 
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
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
                      <label className="flex items-center gap-1.5 text-xs cursor-pointer hover:text-blue-600 transition-colors whitespace-nowrap">
                        <input 
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
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
                    
                    {/* ZIP Code Filter */}
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                      <input 
                        type="text"
                        placeholder="ZIP code"
                        className="w-24 p-2 text-sm border rounded-md"
                        defaultValue={userZip}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newZip = (e.target as HTMLInputElement).value;
                            if (newZip && /^\d{5}$/.test(newZip)) {
                              const newParams = new URLSearchParams(searchParams);
                              newParams.set('zip', newZip);
                              setLocation(`/results?${newParams.toString()}`);
                            }
                          }
                        }}
                      />
                      <Button 
                        size="sm"
                        className="h-9"
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
                      {t('results.pharmacies.saveUpTo').replace('{{amount}}', potentialSavings?.toFixed(0) || '0')}
                    </Badge>
                  )}
                </div>

                {filteredAndSortedResults.slice(0, showAllPharmacies ? filteredAndSortedResults.length : 5).map((result, index) => (
                  <Card
                    key={result.pharmacy.id}
                    id={`pharmacy-${result.pharmacy.id}`}
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      selectedPharmacy === result.pharmacy.id
                        ? "ring-2 ring-blue-500 shadow-xl border-blue-300 bg-blue-50/30"
                        : "hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5 border-gray-200"
                    }`}
                    onClick={() => {
                      console.log(`🖱️ [CARD CLICK] User clicked card for ${result.pharmacy.name}`);
                      setSelectedPharmacy(result.pharmacy.id);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Top Row: Pharmacy Name and Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-lg text-foreground">{result.pharmacy.name}</h3>
                            {index === 0 && (
                              <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
                                ⭐ Lowest Price
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Address */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{result.pharmacy.address}</span>
                        </div>
                        
                        {/* Features Row */}
                        <div className="flex flex-wrap gap-2 items-center">
                          {result.pharmacy.hasDelivery && (
                            <Badge variant="outline" className="text-xs px-2 py-1 border-blue-300 text-blue-700">
                              <Truck className="w-3 h-3 mr-1.5" />
                              Delivery
                            </Badge>
                          )}
                          {result.pharmacy.hasDriveThru && (
                            <Badge variant="outline" className="text-xs px-2 py-1 border-purple-300 text-purple-700">
                              <Car className="w-3 h-3 mr-1.5" />
                              Drive-Thru
                            </Badge>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(result.pharmacy.address)}`;
                              window.open(mapsUrl, '_blank');
                            }}
                          >
                            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Get Directions
                          </Button>
                        </div>
                        
                        {/* 4-Tier Pricing Section */}
                        <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {/* RxPrice Membership */}
                            <div className="space-y-1">
                              <p className="text-[10px] sm:text-xs font-medium text-gray-600">RxPrice Member</p>
                              <p className={`font-bold ${
                                result.bestOption === "membership" ? "text-xl sm:text-2xl text-purple-600" : "text-lg sm:text-xl text-gray-700"
                              }`}>
                                ${result.membershipPrice?.toFixed(2) || '0.00'}
                              </p>
                              {result.bestOption === "membership" && (
                                <Badge className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5">
                                  🏆 Best
                                </Badge>
                              )}
                            </div>
                            
                            {/* Coupon Price */}
                            <div className="space-y-1">
                              <p className="text-[10px] sm:text-xs font-medium text-gray-600">
                                {result.couponProvider ? `${result.couponProvider}` : "Coupon"}
                              </p>
                              {result.couponPrice ? (
                                <>
                                  <p className={`font-bold ${
                                    result.bestOption === "coupon" ? "text-xl sm:text-2xl text-green-600" : "text-lg sm:text-xl text-gray-700"
                                  }`}>
                                    ${result.couponPrice.toFixed(2)}
                                  </p>
                                  {result.bestOption === "coupon" && (
                                    <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0.5">
                                      🏆 Best
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <p className="text-[10px] sm:text-xs text-gray-500 italic">Not accepted</p>
                              )}
                            </div>
                            
                            {/* Insurance Price */}
                            <div className="space-y-1">
                              <p className="text-[10px] sm:text-xs font-medium text-gray-600">Insurance</p>
                              <p className={`font-bold ${
                                result.bestOption === "insurance" ? "text-xl sm:text-2xl text-blue-600" : "text-lg sm:text-xl text-gray-700"
                              }`}>
                                ${result.insurancePrice?.toFixed(2) || '0.00'}
                              </p>
                              {result.bestOption === "insurance" && (
                                <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5">
                                  🏆 Best
                                </Badge>
                              )}
                            </div>
                            
                            {/* Cash Price */}
                            <div className="space-y-1">
                              <p className="text-[10px] sm:text-xs font-medium text-gray-600">Cash Price</p>
                              <p className={`font-bold ${
                                result.bestOption === "cash" ? "text-xl sm:text-2xl text-gray-700" : "text-lg sm:text-xl text-gray-500"
                              }`}>
                                ${result.cashPrice?.toFixed(2) || '0.00'}
                              </p>
                              {result.bestOption === "cash" && (
                                <Badge className="bg-gray-600 text-white text-[10px] px-1.5 py-0.5">
                                  🏆 Best
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Best Savings Summary */}
                          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-xs sm:text-sm font-semibold text-green-700">
                              ✓ Best option saves ${(
                                (result.cashPrice || 0) - Math.min(
                                  result.membershipPrice || Infinity,
                                  result.couponPrice || Infinity,
                                  result.insurancePrice || Infinity
                                )
                              ).toFixed(2)} vs cash
                            </p>
                            <Badge variant="outline" className="text-[10px] h-5 px-2 text-amber-700 border-amber-300">
                              📊 Estimated
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Load More Button */}
                {!showAllPharmacies && filteredAndSortedResults.length > 5 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllPharmacies(true)}
                      className="w-full md:w-auto"
                    >
                      Load More ({filteredAndSortedResults.length - 5} more pharmacies)
                    </Button>
                  </div>
                )}
                
                {/* Cost Plus Drugs Card */}
                {(() => {
                  const avgPrice = filteredAndSortedResults.reduce((sum, r) => sum + (r.insurancePrice || 0), 0) / filteredAndSortedResults.length;
                  return (
                    <div className="mt-4">
                      <CostPlusCard
                        medicationName={medicationName}
                        strength={dosage}
                        quantity={totalPills}
                        averageRetailPrice={avgPrice}
                      />
                    </div>
                  );
                })()}
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


          </div>
        </div>
          </TabsContent>

          {/* Tab 2: Safety Info */}
          <TabsContent value="safety">
            <SafetyInfoTab medicationName={medicationName} rxcui={rxcui} />
          </TabsContent>

          {/* Tab 3: Alternatives */}
          <TabsContent value="alternatives">
            <AIAlternativesTab medicationName={medicationName} dosage={dosage} />
          </TabsContent>

          {/* Tab 4: About Data */}
          <TabsContent value="data">
            <div className="space-y-6">
              <DataTransparencyBanner />
              
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
