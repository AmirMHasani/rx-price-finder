import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { insurancePlans, insuranceCarriers } from "@/data/insurance";
import { Search as SearchIcon, Pill, Shield, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { searchMedications, type MedicationResult } from "@/services/medicationService";

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

  const selectedIns = insurancePlans.find(i => i.id === selectedInsurance);

  // Real-time search with minimal debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchInput.length >= 2) {
        setSearchLoading(true);
        try {
          const results = await searchMedications(searchInput);
          setMedicationResults(results);
        } catch (error) {
          console.error("Search error:", error);
          setMedicationResults([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setMedicationResults([]);
      }
    }, 100); // Reduced debounce to 100ms for faster response

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSelectMedication = (medication: MedicationResult) => {
    setSelectedMedication(medication);
    setSelectedDosage("");
    setSelectedForm("");
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
                    <div className="space-y-2">
                      <Input
                        id="medication-search"
                        placeholder="Search medications (e.g., metformin, lipitor)..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        disabled={searchLoading}
                        className="w-full"
                      />
                      {searchLoading && (
                        <div className="flex items-center justify-center p-4 bg-muted rounded-md">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span className="text-sm text-muted-foreground">Searching medications...</span>
                        </div>
                      )}
                      {!searchLoading && medicationResults.length > 0 && (
                        <div className="border border-border rounded-md bg-background max-h-64 overflow-y-auto">
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

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 500mg, 10mg"
                      value={selectedDosage}
                      onChange={(e) => setSelectedDosage(e.target.value)}
                      disabled={!selectedMedication}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form">Form</Label>
                    <Input
                      id="form"
                      placeholder="e.g., Tablet, Capsule"
                      value={selectedForm}
                      onChange={(e) => setSelectedForm(e.target.value)}
                      disabled={!selectedMedication}
                    />
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
