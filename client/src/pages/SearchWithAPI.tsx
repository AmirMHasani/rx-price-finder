import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { insurancePlans, insuranceCarriers } from "@/data/insurance";
import { Search as SearchIcon, Pill, Shield, Loader2, X } from "lucide-react";
import { useLocation } from "wouter";
import { searchMedications, getMedicationDetails, type MedicationResult } from "@/services/medicationService";
import { searchCommonMedications } from "@/data/commonMedications";

export default function SearchWithAPI() {
  const [, setLocation] = useLocation();
  const [medicationResults, setMedicationResults] = useState<MedicationResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [searchInput, setSearchInput] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<MedicationResult | null>(null);
  const [selectedDosage, setSelectedDosage] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [deductibleMet, setDeductibleMet] = useState(false);
  const [userZip, setUserZip] = useState("");
  const [quantity, setQuantity] = useState("30"); // 30-day or 90-day supply
  const [frequency, setFrequency] = useState("once"); // once, twice, three times daily
  const [showDropdown, setShowDropdown] = useState(false);
  
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
    
    // Use pre-loaded dosages/forms if available (from common medications)
    if (medication.dosages && medication.dosages.length > 0) {
      setAvailableDosages(medication.dosages);
      setSelectedDosage(medication.dosages[0]);
    } else {
      // Extract dosage from medication name if not pre-loaded
      // e.g., "omeprazole 20 MG Delayed Release Oral Capsule" -> "20mg"
      const strengthMatch = medication.name.match(/(\d+)\s*(MG|mg|mcg|MCG|g|G|IU|iu)/i);
      if (strengthMatch) {
        const dosage = strengthMatch[1] + strengthMatch[2].toLowerCase();
        setAvailableDosages([dosage]);
        setSelectedDosage(dosage);
      } else {
        setAvailableDosages([]);
      }
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

    const params = new URLSearchParams({
      medication: selectedMedication.name,
      rxcui: selectedMedication.rxcui,
      dosage: selectedDosage,
      form: selectedForm,
      insurance: selectedInsurance,
      deductibleMet: deductibleMet.toString(),
      zip: userZip,
      quantity: quantity,
      frequency: frequency,
    });

    setLocation(`/results?${params.toString()}`);
  };

  const isSearchDisabled = !selectedMedication || !selectedDosage || !selectedForm || !selectedInsurance;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">RxPriceFinder</h1>
              <p className="text-sm text-muted-foreground">Compare prescription prices with your insurance</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Find the Best Price for Your Prescription
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compare real insurance-based prices at local pharmacies. Enter your medication and insurance information below to see which pharmacy offers the lowest price with your coverage.
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-lg">
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

                  {/* Quantity Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Select value={quantity} onValueChange={setQuantity}>
                      <SelectTrigger id="quantity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30-day supply</SelectItem>
                        <SelectItem value="90">90-day supply</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Frequency Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="three">Three times daily</SelectItem>
                        <SelectItem value="asneeded">As needed</SelectItem>
                      </SelectContent>
                    </Select>
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

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Real Medication Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Search from the official FDA and RxNorm medication databases with real drug names and information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Insurance-Based Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See actual prices based on your specific insurance plan, not just cash prices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SearchIcon className="w-5 h-5 text-primary" />
                  Save Money
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find the lowest price for your prescription and save hundreds of dollars per year.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
