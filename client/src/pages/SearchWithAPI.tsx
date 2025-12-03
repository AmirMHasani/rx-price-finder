import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { InsurancePlanType } from "@/data/insurancePlans";
import { INSURANCE_CARRIERS, getCarrierPlans } from "@/data/insuranceCarriers";
import { Search as SearchIcon, Pill, Shield, Loader2, X } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { UserMenu } from "@/components/UserMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { searchMedications, getMedicationDetails, getCleanMedicationName, type MedicationResult } from "@/services/medicationService";
import { searchCommonMedications } from "@/data/commonMedications";
import { getSearchHistory, clearSearchHistory, formatTimeAgo, type SearchHistoryItem } from "@/services/searchHistory";
import { trpc } from "@/lib/trpc";

export default function SearchWithAPI() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [medicationResults, setMedicationResults] = useState<MedicationResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [searchInput, setSearchInput] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<MedicationResult | null>(null);
  const [selectedDosage, setSelectedDosage] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("1"); // Default to once daily
  const [quantity, setQuantity] = useState("30"); // Default to 30 days
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [selectedInsurance, setSelectedInsurance] = useState<InsurancePlanType | "">(""  );
  const [deductibleMet, setDeductibleMet] = useState(false);
  const [userZip, setUserZip] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  
  // Load user's insurance data
  const { data: insuranceData } = trpc.insurance.getInsuranceInfo.useQuery();
  
  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);
  
  // Auto-populate insurance when user data loads
  useEffect(() => {
    if (insuranceData && insuranceData.primaryCarrier && insuranceData.primaryPlan) {
      setSelectedCarrier(insuranceData.primaryCarrier);
      setSelectedInsurance(insuranceData.primaryPlan as InsurancePlanType);
      setDeductibleMet(insuranceData.deductibleMet);
      console.log('✅ [Insurance Auto-Population] Loaded user insurance:', insuranceData.primaryCarrier, insuranceData.primaryPlan);
    }
  }, [insuranceData]);
  
  // Dosage and form options
  const [availableDosages, setAvailableDosages] = useState<string[]>([]);
  const [availableForms, setAvailableForms] = useState<string[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  // Insurance plan is now handled by the new system

  // Debounced search - waits 300ms after user stops typing
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If input is less than 2 characters, clear results
    if (searchInput.length < 2) {
      setMedicationResults([]);
      setShowDropdown(false);
      return;
    }

    // First, search common medications (instant)
    const common = searchCommonMedications(searchInput);
    const commonResults = common.map(m => ({
      rxcui: m.rxcui,
      name: m.name,
      genericName: m.genericName,
      brandName: m.brandName,
      type: "COMMON",
      strength: "",
      dosages: m.dosages,
      forms: m.forms,
    }));
    
    setMedicationResults(commonResults);
    setShowDropdown(commonResults.length > 0);

    // Create AbortController for this search request
    const abortController = new AbortController();

    // Then, search RxNorm API (with debounce) for additional results
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        // Pass abort signal to searchMedications if it supports it
        // Note: searchMedications would need to accept signal and pass to fetch
        const results = await searchMedications(searchInput);
        
        // Check if this request was aborted before updating state
        if (abortController.signal.aborted) {
          console.log('[Search] Request aborted, ignoring results');
          return;
        }
        
        // Combine common medications with RxNorm results, avoiding duplicates
        const combined = [
          ...commonResults,
          ...results.filter(r => !common.some(c => c.rxcui === r.rxcui)),
        ];
        setMedicationResults(combined);
        setShowDropdown(combined.length > 0);
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('[Search] Request aborted');
          return;
        }
        console.error("Search error:", error);
        // Keep common medications results even if RxNorm fails
      } finally {
        if (!abortController.signal.aborted) {
          setSearchLoading(false);
        }
      }
    }, 300); // Wait 300ms after user stops typing

    // Cleanup: abort pending request and clear timeout on unmount or new input
    return () => {
      abortController.abort();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  const handleSelectMedication = async (medication: MedicationResult) => {
    setSelectedMedication(medication);
    setSearchInput("");
    setMedicationResults([]);
    setShowDropdown(false);
    setSelectedDosage("");
    setSelectedForm("");
    
    // Extract dosage from medication name
    // e.g., "omeprazole 20 MG Delayed Release Oral Capsule" -> "20mg"
    // Support decimal dosages like "Eliquis 2.5mg" or "hydrochlorothiazide 12.5mg"
    const strengthMatch = medication.name.match(/(\d+\.?\d*)\s*(MG|mg|mcg|MCG|g|G|IU|iu)/i);
    const extractedDosage = strengthMatch ? strengthMatch[1] + strengthMatch[2].toLowerCase() : null;
    
    // Use pre-loaded dosages from database if available
    let dosages: string[] = [];
    if (medication.dosages && medication.dosages.length > 0) {
      dosages = [...medication.dosages];
    }
    
    // If we extracted a dosage from the name, ensure it's in the list
    if (extractedDosage) {
      if (!dosages.includes(extractedDosage)) {
        // Add extracted dosage to the beginning of the list
        dosages = [extractedDosage, ...dosages];
      }
      setAvailableDosages(dosages);
      setSelectedDosage(extractedDosage);
    } else if (dosages.length > 0) {
      // No extracted dosage, but we have database dosages
      setAvailableDosages(dosages);
      setSelectedDosage(dosages[0]);
    } else {
      // No dosages at all
      setAvailableDosages([]);
    }
    
    if (medication.forms && medication.forms.length > 0) {
      setAvailableForms(medication.forms);
      setSelectedForm(medication.forms[0]);
    } else {
      // Extract form from medication name if not pre-loaded
      // e.g., "omeprazole 20 MG Delayed Release Oral Capsule" -> "Delayed Release Oral Capsule"
      const formMatch = medication.name.match(/\d+\s*(?:MG|mg|mcg|MCG|g|G|IU|iu)\s+(.+?)(?:\s*\[|$)/i);
      if (formMatch) {
        const form = formMatch[1].trim();
        setAvailableForms([form]);
        setSelectedForm(form);
      } else {
        setAvailableForms([]);
      }
    }

    // Try to fetch additional details from RxNorm if not from common medications
    // This is optional and won't block the user if it fails
    if (medication.type !== "COMMON") {
      setLoadingDetails(true);
      try {
        const details = await getMedicationDetails(medication.rxcui);
        // Only update if we got better data from the API
        // Use functional setState to preserve user's latest selection
        if (details.dosages && details.dosages.length > 1) {
          setAvailableDosages(details.dosages);
          // Use functional update to check against current state, not stale closure
          setSelectedDosage(current => {
            // If user hasn't changed selection and current isn't in new list, update
            if (current && details.dosages.includes(current)) {
              return current; // Keep user's selection
            }
            return details.dosages[0]; // Default to first option
          });
        }
        if (details.forms && details.forms.length > 1) {
          setAvailableForms(details.forms);
          // Use functional update to check against current state, not stale closure
          setSelectedForm(current => {
            // If user hasn't changed selection and current isn't in new list, update
            if (current && details.forms.includes(current)) {
              return current; // Keep user's selection
            }
            return details.forms[0]; // Default to first option
          });
        }
      } catch (error) {
        console.error("Error fetching medication details:", error);
        // Ignore errors - we already have data from the medication name
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setMedicationResults([]);
    setShowDropdown(false);
    setSelectedMedication(null);
    setAvailableDosages([]);
    setAvailableForms([]);
  };

  const handleSearch = () => {
    if (!selectedMedication || !selectedDosage || !selectedForm || !selectedInsurance) {
      return;
    }

    const totalPills = Math.ceil(parseFloat(selectedFrequency) * parseFloat(quantity));
    
    const params = new URLSearchParams({
      medication: selectedMedication.name,
      rxcui: selectedMedication.rxcui,
      dosage: selectedDosage,
      form: selectedForm,
      frequency: selectedFrequency,
      quantity: quantity,
      totalPills: totalPills.toString(),
      insurance: selectedInsurance,
      deductibleMet: deductibleMet.toString(),
      zip: userZip,
    });

    setLocation(`/results?${params.toString()}`);
  };

  const isSearchDisabled = !selectedMedication || !selectedDosage || !selectedForm || !selectedInsurance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container py-4 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">RxPriceFinder</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Compare prescription prices with your insurance</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserMenu />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight px-2">
              {t('home.hero.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-xl border-2">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('home.form.searchTitle')}
              </CardTitle>
              <CardDescription className="text-sm">
                {t('home.form.searchSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Medication Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Pill className="w-4 h-4" />
                  {t('common.medicationInfo')}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medication-search">{t('home.form.medicationName')}</Label>
                    <div className="space-y-2 relative">
                      <div className="relative">
                        <Input
                          id="medication-search"
                          placeholder={t('home.form.medicationPlaceholder')}
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onFocus={() => {
                            if (medicationResults.length > 0) {
                              setShowDropdown(true);
                            }
                          }}
                          disabled={!!selectedMedication}
                          className="w-full pr-10"
                        />
                        {searchInput && (
                          <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {searchLoading && (
                        <div className="absolute top-full left-0 right-0 z-50 border border-border rounded-md bg-background shadow-lg">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="px-4 py-2.5 border-b border-border last:border-b-0 animate-pulse">
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                <div className="h-5 bg-muted rounded w-12"></div>
                              </div>
                              <div className="h-3 bg-muted rounded w-1/2 mt-1.5"></div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!searchLoading && showDropdown && medicationResults.length > 0 && (
                        <div 
                          role="listbox"
                          aria-label="Medication suggestions"
                          className="absolute top-full left-0 right-0 z-50 border border-border rounded-md bg-background max-h-64 overflow-y-auto shadow-lg"
                        >
                          {medicationResults.map((medication, index) => (
                            <button
                              key={medication.rxcui}
                              role="option"
                              aria-selected={false}
                              onClick={() => handleSelectMedication(medication)}
                              onKeyDown={(e) => {
                                // Arrow down - focus next item
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  const next = e.currentTarget.nextElementSibling as HTMLElement;
                                  next?.focus();
                                }
                                // Arrow up - focus previous item
                                if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  const prev = e.currentTarget.previousElementSibling as HTMLElement;
                                  prev?.focus();
                                }
                                // Enter or Space - select item
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSelectMedication(medication);
                                }
                                // Escape - close dropdown
                                if (e.key === 'Escape') {
                                  e.preventDefault();
                                  setShowDropdown(false);
                                  // Return focus to search input
                                  const searchInput = document.querySelector('input[placeholder*="medication"]') as HTMLElement;
                                  searchInput?.focus();
                                }
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary border-b border-border last:border-b-0 transition-colors"
                            >
                              <div className="flex items-baseline justify-between gap-2">
                                <div className="font-medium text-sm flex-1">
                                  {(() => {
                                    const cleanName = getCleanMedicationName(medication);
                                    const searchLower = searchInput.toLowerCase();
                                    const nameLower = cleanName.toLowerCase();
                                    const index = nameLower.indexOf(searchLower);
                                    
                                    if (index === -1) return cleanName;
                                    
                                    return (
                                      <>
                                        {cleanName.substring(0, index)}
                                        <span className="bg-yellow-200 dark:bg-yellow-900">
                                          {cleanName.substring(index, index + searchInput.length)}
                                        </span>
                                        {cleanName.substring(index + searchInput.length)}
                                      </>
                                    );
                                  })()}
                                </div>
                                {medication.strength && (
                                  <div className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded">
                                    {medication.strength}
                                  </div>
                                )}
                              </div>
                              {medication.forms && medication.forms.length > 0 && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {medication.forms[0]}
                                  {medication.type === 'COMMON' && <span className="ml-2 text-green-600 dark:text-green-400">● Popular</span>}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {!searchLoading && searchInput.length >= 2 && medicationResults.length === 0 && (
                        <div className="p-4 bg-muted rounded-md">
                          <div className="text-center text-sm text-muted-foreground mb-3">
                            No medications found for "{searchInput}"
                          </div>
                          <div className="text-xs text-muted-foreground text-center mb-2">Try searching for:</div>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {['Metformin', 'Lisinopril', 'Atorvastatin', 'Omeprazole', 'Amlodipine'].map(med => (
                              <button
                                key={med}
                                onClick={() => setSearchInput(med)}
                                className="text-xs px-3 py-1.5 bg-background border border-border rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                {med}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedMedication && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm font-medium text-green-900">✓ Selected: {getCleanMedicationName(selectedMedication)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dosage Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="dosage">{t('home.form.dosage')}</Label>
                    {availableDosages.length > 0 && !loadingDetails ? (
                      <Select value={selectedDosage} onValueChange={setSelectedDosage} disabled={!selectedMedication}>
                        <SelectTrigger id="dosage">
                          <SelectValue placeholder={t('home.form.dosagePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDosages.map((dosage) => (
                            <SelectItem key={dosage} value={dosage}>
                              {dosage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="dosage"
                        placeholder={t('home.form.dosagePlaceholder')}
                        value={selectedDosage}
                        onChange={(e) => setSelectedDosage(e.target.value)}
                        disabled={!selectedMedication || loadingDetails}
                      />
                    )}
                  </div>

                  {/* Form Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="form">{t('home.form.form')}</Label>
                    {availableForms.length > 0 && !loadingDetails ? (
                      <Select value={selectedForm} onValueChange={setSelectedForm} disabled={!selectedMedication}>
                        <SelectTrigger id="form">
                          <SelectValue placeholder={t('home.form.formPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableForms.map((form) => (
                            <SelectItem key={form} value={form}>
                              {form}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="form"
                        placeholder={t('home.form.formPlaceholder')}
                        value={selectedForm}
                        onChange={(e) => setSelectedForm(e.target.value)}
                        disabled={!selectedMedication || loadingDetails}
                      />
                    )}
                  </div>

                  {/* Frequency Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="frequency">{t('home.form.frequency')}</Label>
                    <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{t('home.frequency.onceDaily')}</SelectItem>
                        <SelectItem value="2">{t('home.frequency.twiceDaily')}</SelectItem>
                        <SelectItem value="3">{t('home.frequency.threeTimes')}</SelectItem>
                        <SelectItem value="4">{t('home.frequency.fourTimes')}</SelectItem>
                        <SelectItem value="0.5">{t('home.frequency.everyOtherDay')}</SelectItem>
                        <SelectItem value="0.14">{t('home.frequency.onceWeekly')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t('home.form.quantity')}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="30"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      max="365"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('home.form.totalPills')} {Math.ceil(parseFloat(selectedFrequency) * parseFloat(quantity) || 0)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">{t('home.form.zipCode')}</Label>
                    <Input
                      id="zip"
                      placeholder="02108"
                      value={userZip}
                      onChange={(e) => setUserZip(e.target.value)}
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Section */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Shield className="w-4 h-4" />
                  {t('common.insuranceInfo')}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Step 1: Select Insurance Carrier */}
                  <div className="space-y-2">
                    <Label htmlFor="carrier">{t('home.form.insuranceCarrier')}</Label>
                    <Select 
                      value={selectedCarrier} 
                      onValueChange={(value) => {
                        setSelectedCarrier(value);
                        setSelectedInsurance(""); // Reset plan when carrier changes
                      }}
                    >
                      <SelectTrigger id="carrier">
                        <SelectValue placeholder={t('home.form.carrierPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          // Sort carriers: Medicare/Medicaid first, then A-Z, then No Insurance last
                          const priority = ['medicare', 'medicaid'];
                          const cashPay = 'cash';
                          
                          const priorityCarriers = INSURANCE_CARRIERS.filter(c => priority.includes(c.id));
                          const regularCarriers = INSURANCE_CARRIERS.filter(c => !priority.includes(c.id) && c.id !== cashPay)
                            .sort((a, b) => a.name.localeCompare(b.name));
                          const cashCarrier = INSURANCE_CARRIERS.filter(c => c.id === cashPay);
                          
                          return [...priorityCarriers, ...regularCarriers, ...cashCarrier].map(carrier => (
                            <SelectItem key={carrier.id} value={carrier.id}>
                              {carrier.name}
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Step 2: Select Specific Plan (only shown after carrier is selected) */}
                  <div className="space-y-2">
                    <Label htmlFor="insurance">{t('home.form.insurancePlan')}</Label>
                    <Select 
                      value={selectedInsurance} 
                      onValueChange={(value) => setSelectedInsurance(value as InsurancePlanType | "")}
                      disabled={!selectedCarrier}
                    >
                      <SelectTrigger id="insurance">
                        <SelectValue placeholder={selectedCarrier ? t('home.form.insurancePlaceholder') : t('home.form.selectCarrierFirst')} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCarrier && (() => {
                          const carrier = INSURANCE_CARRIERS.find(c => c.id === selectedCarrier);
                          if (!carrier) return null;
                          
                          // For BCBS, group plans by region
                          if (carrier.id === 'bcbs') {
                            const plansByRegion: Record<string, typeof carrier.plans> = {};
                            carrier.plans.forEach(plan => {
                              const region = plan.region || 'Other';
                              if (!plansByRegion[region]) plansByRegion[region] = [];
                              plansByRegion[region].push(plan);
                            });
                            
                            return Object.entries(plansByRegion).map(([region, plans]) => (
                              <SelectGroup key={region}>
                                <SelectLabel>{region}</SelectLabel>
                                {plans.map(plan => (
                                  <SelectItem key={plan.id} value={plan.id}>
                                    {plan.regionalCarrier ? `${plan.name} (${plan.regionalCarrier})` : plan.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ));
                          }
                          
                          // For other carriers, show plans normally
                          return carrier.plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name}
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Checkbox
                      id="deductible"
                      checked={deductibleMet}
                      onCheckedChange={(checked) => setDeductibleMet(checked as boolean)}
                    />
                    <Label
                      htmlFor="deductible"
                      className="text-sm font-normal cursor-pointer"
                    >
                      {t('home.form.deductibleMet')}
                    </Label>
                  </div>
                </div>

                {/* Display Selected Insurance */}
                {selectedCarrier && selectedInsurance && (
                  <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">{t('home.form.selectedInsurance')}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">{t('home.form.carrier')}:</span>{' '}
                        {INSURANCE_CARRIERS.find(c => c.id === selectedCarrier)?.name}
                      </p>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">{t('home.form.plan')}:</span>{' '}
                        {INSURANCE_CARRIERS.find(c => c.id === selectedCarrier)?.plans.find(p => p.id === selectedInsurance)?.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearchDisabled}
                className="w-full h-12 text-base"
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                {t('home.form.compareButton')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Searches removed from main page - now only in menu */}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">
                {t('home.features.realData.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('home.features.realData.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">
                {t('home.features.insurancePricing.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('home.features.insurancePricing.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <SearchIcon className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="text-lg">
                {t('home.features.saveMoney.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('home.features.saveMoney.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
