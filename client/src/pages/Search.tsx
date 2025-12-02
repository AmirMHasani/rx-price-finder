import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { medications } from "@/data/medications";
import { insurancePlans, insuranceCarriers } from "@/data/insurance";
import { Search as SearchIcon, Pill, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { UserMenu } from "@/components/UserMenu";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function Search() {
  const [, setLocation] = useLocation();
  const [selectedMedication, setSelectedMedication] = useState("");
  const [selectedDosage, setSelectedDosage] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [deductibleMet, setDeductibleMet] = useState(false);
  const [userZip, setUserZip] = useState("");

  const selectedMed = medications.find(m => m.id === selectedMedication);
  const selectedIns = insurancePlans.find(i => i.id === selectedInsurance);

  const handleSearch = () => {
    if (!selectedMedication || !selectedDosage || !selectedForm || !selectedInsurance) {
      return;
    }

    const params = new URLSearchParams({
      medication: selectedMedication,
      dosage: selectedDosage,
      form: selectedForm,
      insurance: selectedInsurance,
      deductibleMet: deductibleMet.toString(),
      zip: userZip
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
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <UserMenu />
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
                Select your medication details and insurance information to compare prices
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
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication Name</Label>
                    <Select value={selectedMedication} onValueChange={setSelectedMedication}>
                      <SelectTrigger id="medication">
                        <SelectValue placeholder="Select medication" />
                      </SelectTrigger>
                      <SelectContent>
                        {medications.map(med => (
                          <SelectItem key={med.id} value={med.id}>
                            {med.name} ({med.genericName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Select 
                      value={selectedDosage} 
                      onValueChange={setSelectedDosage}
                      disabled={!selectedMed}
                    >
                      <SelectTrigger id="dosage">
                        <SelectValue placeholder="Select dosage" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedMed?.dosages.map(dosage => (
                          <SelectItem key={dosage} value={dosage}>
                            {dosage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form">Form</Label>
                    <Select 
                      value={selectedForm} 
                      onValueChange={setSelectedForm}
                      disabled={!selectedMed}
                    >
                      <SelectTrigger id="form">
                        <SelectValue placeholder="Select form" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedMed?.forms.map(form => (
                          <SelectItem key={form} value={form}>
                            {form}
                          </SelectItem>
                        ))}
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
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Plan Details:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Tier 1 Copay: <span className="font-medium text-foreground">${selectedIns.tier1Copay}</span></div>
                      <div>Tier 2 Copay: <span className="font-medium text-foreground">${selectedIns.tier2Copay}</span></div>
                      <div>Tier 3 Copay: <span className="font-medium text-foreground">${selectedIns.tier3Copay}</span></div>
                      <div>Tier 4 Copay: <span className="font-medium text-foreground">${selectedIns.tier4Copay}</span></div>
                      <div className="col-span-2">Annual Deductible: <span className="font-medium text-foreground">${selectedIns.deductible}</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={isSearchDisabled}
                className="w-full"
                size="lg"
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                Compare Prices
              </Button>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Insurance-Based Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See actual prices based on your specific insurance plan, not just cash prices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Local Pharmacies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare prices at nearby pharmacies including CVS, Walgreens, Walmart, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Save Money</CardTitle>
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
