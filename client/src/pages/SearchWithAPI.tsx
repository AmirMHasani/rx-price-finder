import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { insurancePlans, insuranceCarriers } from "@/data/insurance";
import { Search as SearchIcon, Pill, Shield, Loader2, X } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLocation } from "wouter";
import { searchMedications, getMedicationDetails, type MedicationResult } from "@/services/medicationService";
import { searchCommonMedications } from "@/data/commonMedications";
import { getSearchHistory, clearSearchHistory, formatTimeAgo, type SearchHistoryItem } from "@/services/searchHistory";

export default function SearchWithAPI() {
  const [, setLocation] = useLocation();
  const [medicationResults, setMedicationResults] = useState<MedicationResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [searchInput, setSearchInput] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<MedicationResult | null>(null);
  const [selectedDosage, setSelectedDosage] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("1"); // Default to once daily
  const [quantity, setQuantity] = useState("30"); // Default to 30 days
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [deductibleMet, setDeductibleMet] = useState(false);
  const [userZip, setUserZip] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  
  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);
  
  // Dosage and form options
  const [availableDosages, setAvailableDosages] = useState<string[]>([]);
  const [availableForms, setAvailableForms] = useState<string[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const selectedIns = insurancePlans.find(i => i.id === selectedInsurance);

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

    // Then, search RxNorm API (with debounce) for additional results
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchMedications(searchInput);
        // Combine common medications with RxNorm results, avoiding duplicates
        const combined = [
          ...commonResults,
          ...results.filter(r => !common.some(c => c.rxcui === r.rxcui)),
        ];
        setMedicationResults(combined);
        setShowDropdown(combined.length > 0);
      } catch (error) {
        console.error("Search error:", error);
        // Keep common medications results even if RxNorm fails
      } finally {
        setSearchLoading(false);
      }
    }, 300); // Wait 300ms after user stops typing

    // Cleanup timeout on unmount
    return () => {
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
        if (details.dosages && details.dosages.length > 1) {
          setAvailableDosages(details.dosages);
          // Keep the current selection if it's in the list
          if (!details.dosages.includes(selectedDosage)) {
            setSelectedDosage(details.dosages[0]);
          }
        }
        if (details.forms && details.forms.length > 1) {
          setAvailableForms(details.forms);
          // Keep the current selection if it's in the list
          if (!details.forms.includes(selectedForm)) {
            setSelectedForm(details.forms[0]);
          }
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">RxPriceFinder</h1>
                <p className="text-sm text-muted-foreground">Compare prescription prices with your insurance</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Find the Best Price for Your Prescription
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Compare real insurance-based prices at local pharmacies. Enter your medication and insurance information below to see which pharmacy offers the lowest price with your coverage.
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="w-5 h-5" />
                Search for Your Medication
              </CardTitle>
              <CardDescription>
                Search from real medication database and insurance information to compare prices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Medication Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Pill className="w-4 h-4" />
                  Medication Information
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medication-search">Medication Name</Label>
                    <div className="space-y-2 relative">
                      <div className="relative">
                        <Input
                          id="medication-search"
                          placeholder="Search medications (e.g., lipitor, metformin)..."
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
                        <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">Searching medications...</span>
                        </div>
                      )}

                      {!searchLoading && showDropdown && medicationResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 border border-border rounded-md bg-background max-h-64 overflow-y-auto shadow-lg">
                          {medicationResults.map((medication) => (
                            <button
                              key={medication.rxcui}
                              onClick={() => handleSelectMedication(medication)}
                              className="w-full text-left px-4 py-3 hover:bg-muted border-b border-border last:border-b-0 transition-colors"
                            >
                              <div className="font-medium text-sm">{medication.brandName || medication.name}</div>
                              {medication.genericName && medication.genericName !== medication.brandName && (
                                <div className="text-xs text-muted-foreground">
                                  Generic: {medication.genericName}
                                </div>
                              )}
                              {medication.strength && (
                                <div className="text-xs text-muted-foreground">
                                  {medication.strength}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {!searchLoading && searchInput.length >= 2 && medicationResults.length === 0 && (
                        <div className="p-4 bg-muted rounded-md text-center text-sm text-muted-foreground">
                          No medications found. Try a different search.
                        </div>
                      )}

                      {selectedMedication && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm font-medium text-green-900">✓ Selected: {selectedMedication.brandName || selectedMedication.name}</p>
                          {selectedMedication.genericName && selectedMedication.genericName !== selectedMedication.brandName && (
                            <p className="text-xs text-green-700">Generic: {selectedMedication.genericName}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dosage Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    {availableDosages.length > 0 && !loadingDetails ? (
                      <Select value={selectedDosage} onValueChange={setSelectedDosage} disabled={!selectedMedication}>
                        <SelectTrigger id="dosage">
                          <SelectValue placeholder="Select dosage" />
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
                        placeholder="e.g., 500mg, 10mg"
                        value={selectedDosage}
                        onChange={(e) => setSelectedDosage(e.target.value)}
                        disabled={!selectedMedication || loadingDetails}
                      />
                    )}
                  </div>

                  {/* Form Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="form">Form</Label>
                    {availableForms.length > 0 && !loadingDetails ? (
                      <Select value={selectedForm} onValueChange={setSelectedForm} disabled={!selectedMedication}>
                        <SelectTrigger id="form">
                          <SelectValue placeholder="Select form" />
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
                        placeholder="e.g., Tablet, Capsule"
                        value={selectedForm}
                        onChange={(e) => setSelectedForm(e.target.value)}
                        disabled={!selectedMedication || loadingDetails}
                      />
                    )}
                  </div>

                  {/* Frequency Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="frequency">How often do you take it?</Label>
                    <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Once daily</SelectItem>
                        <SelectItem value="2">Twice daily</SelectItem>
                        <SelectItem value="3">Three times daily</SelectItem>
                        <SelectItem value="4">Four times daily</SelectItem>
                        <SelectItem value="0.5">Every other day</SelectItem>
                        <SelectItem value="0.14">Once weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">How many days supply?</Label>
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
                      Total pills: {Math.ceil(parseFloat(selectedFrequency) * parseFloat(quantity) || 0)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">Your ZIP Code (Optional)</Label>
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
                  Insurance Information
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="insurance">Insurance Plan</Label>
                    <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                      <SelectTrigger id="insurance">
                        <SelectValue placeholder="Select your insurance plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {insuranceCarriers.map(carrier => {
                          const carrierPlans = insurancePlans.filter(p => p.carrier === carrier);
                          if (carrierPlans.length === 0) return null;
                          
                          return carrierPlans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.carrier} - {plan.planName} ({plan.planType})
                            </SelectItem>
                          ));
                        })}
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
                      I have already met my deductible this year
                    </Label>
                  </div>
                </div>

                {selectedIns && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-2">Insurance Plan Details:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                      <div>Tier 1 Copay: ${selectedIns.tier1Copay}</div>
                      <div>Tier 2 Copay: ${selectedIns.tier2Copay}</div>
                      <div>Tier 3 Copay: ${selectedIns.tier3Copay}</div>
                      <div>Tier 4 Copay: ${selectedIns.tier4Copay}</div>
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
                Compare Prices
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Searches */}
        {searchHistory.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Searches</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearSearchHistory();
                  setSearchHistory([]);
                }}
              >
                Clear History
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchHistory.map((item) => {
                const insurance = insurancePlans.find(i => i.id === item.insurance);
                return (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setLocation(item.url.replace(window.location.origin, ''))}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{item.medication}</CardTitle>
                      <CardDescription>
                        {item.dosage} {item.form}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>{insurance?.carrier} - {insurance?.planName}</div>
                        <div>ZIP: {item.zip}</div>
                        <div className="text-xs">{formatTimeAgo(item.timestamp)}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">
                Real Medication Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Search from the official FDA and RxNorm medication databases with real drug names and information.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">
                Insurance-Based Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See actual prices based on your specific insurance plan, not just cash prices.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300 border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <SearchIcon className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="text-lg">
                Save Money
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find the lowest price for your prescription and save hundreds of dollars per year.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
