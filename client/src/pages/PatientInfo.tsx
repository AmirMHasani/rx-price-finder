import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  User, Heart, Pill, AlertTriangle, Users, Shield, 
  Plus, X, Save, ArrowLeft, Calendar 
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { SectionHeader } from "@/components/SectionHeader";
import { Layout } from "@/components/Layout";

import { INSURANCE_CARRIERS } from "@/data/insuranceCarriers";

// Common medical conditions for dropdown
const COMMON_CONDITIONS = [
  "Type 1 Diabetes",
  "Type 2 Diabetes",
  "Hypertension (High Blood Pressure)",
  "Hyperlipidemia (High Cholesterol)",
  "Asthma",
  "COPD",
  "Heart Disease",
  "Atrial Fibrillation",
  "Coronary Artery Disease",
  "Depression",
  "Anxiety Disorder",
  "Bipolar Disorder",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Arthritis",
  "Osteoporosis",
  "Chronic Kidney Disease",
  "Liver Disease",
  "Cancer (specify in notes)",
  "Stroke",
  "Other (specify below)",
];

// Common medication allergies
const COMMON_MEDICATION_ALLERGIES = [
  "Penicillin",
  "Sulfa drugs",
  "Aspirin",
  "Ibuprofen",
  "Codeine",
  "Morphine",
  "Latex",
  "Other (specify below)",
];

// Family relations
const FAMILY_RELATIONS = [
  "Mother",
  "Father",
  "Sibling",
  "Maternal Grandmother",
  "Maternal Grandfather",
  "Paternal Grandmother",
  "Paternal Grandfather",
  "Child",
  "Other",
];

// Insurance carriers and plans are now imported from @/data/insuranceCarriers

interface CurrentMedication {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
}

interface FamilyHistoryItem {
  condition: string;
  relation: string;
  ageOfOnset?: number;
}

export default function PatientInfo() {
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);

  // Section edit states
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(true);
  const [editingMedicalConditions, setEditingMedicalConditions] = useState(true);
  const [editingCurrentMedications, setEditingCurrentMedications] = useState(true);
  const [editingAllergies, setEditingAllergies] = useState(true);
  const [editingFamilyHistory, setEditingFamilyHistory] = useState(true);
  const [editingInsurance, setEditingInsurance] = useState(true);

  // Personal Information
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // Medical Conditions
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [otherCondition, setOtherCondition] = useState("");

  // Current Medications
  const [currentMedications, setCurrentMedications] = useState<CurrentMedication[]>([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedFrequency, setNewMedFrequency] = useState("");
  const [medSearchQuery, setMedSearchQuery] = useState("");
  const [medSearchResults, setMedSearchResults] = useState<any[]>([]);
  const [medSearching, setMedSearching] = useState(false);

  // Allergies
  const [medicationAllergies, setMedicationAllergies] = useState<string[]>([]);
  const [otherMedAllergy, setOtherMedAllergy] = useState("");
  const [foodAllergies, setFoodAllergies] = useState("");

  // Family History
  const [familyHistory, setFamilyHistory] = useState<FamilyHistoryItem[]>([]);
  const [newFamilyCondition, setNewFamilyCondition] = useState("");
  const [newFamilyRelation, setNewFamilyRelation] = useState("");
  const [newFamilyAge, setNewFamilyAge] = useState("");

  // Insurance Information
  const [primaryCarrier, setPrimaryCarrier] = useState("");
  const [primaryPlan, setPrimaryPlan] = useState("");
  const [primaryMemberId, setPrimaryMemberId] = useState("");
  const [primaryGroupNumber, setPrimaryGroupNumber] = useState("");
  const [primaryRxBin, setPrimaryRxBin] = useState("");
  const [primaryRxPcn, setPrimaryRxPcn] = useState("");
  const [primaryRxGroup, setPrimaryRxGroup] = useState("");
  
  const [hasSecondary, setHasSecondary] = useState(false);
  const [secondaryCarrier, setSecondaryCarrier] = useState("");
  const [secondaryPlan, setSecondaryPlan] = useState("");
  const [secondaryMemberId, setSecondaryMemberId] = useState("");
  const [secondaryGroupNumber, setSecondaryGroupNumber] = useState("");
  
  const [deductibleMet, setDeductibleMet] = useState(false);
  const [deductibleAmount, setDeductibleAmount] = useState("");

  // Load existing data from API
  const { data: profileData, isLoading: profileLoading } = trpc.patientProfile.getProfile.useQuery();
  const { data: insuranceData, isLoading: insuranceLoading } = trpc.insurance.getInsuranceInfo.useQuery();
  const { data: familyHistoryData } = trpc.patientProfile.getFamilyHistory.useQuery();

  // Mutations
  const updatePersonalInfo = trpc.patientProfile.updatePersonalInfo.useMutation();
  const updateConditions = trpc.patientProfile.updateMedicalConditions.useMutation();
  const addMedication = trpc.patientProfile.addCurrentMedication.useMutation();
  const removeMedication = trpc.patientProfile.removeCurrentMedication.useMutation();
  const updateAllergies = trpc.patientProfile.updateAllergies.useMutation();
  const addFamilyHistoryMutation = trpc.patientProfile.addFamilyHistory.useMutation();
  const removeFamilyHistoryMutation = trpc.patientProfile.removeFamilyHistory.useMutation();
  const updateInsurance = trpc.insurance.updateInsuranceInfo.useMutation();

  // Load data on mount
  useEffect(() => {
    if (profileData) {
      setDateOfBirth(profileData.personalInfo.dateOfBirth ? new Date(profileData.personalInfo.dateOfBirth).toISOString().split('T')[0] : "");
      setGender(profileData.personalInfo.gender || "");
      setSelectedConditions(profileData.medicalConditions);
      setCurrentMedications(profileData.currentMedications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
      })));
      setMedicationAllergies(profileData.allergies.medications);
      setFoodAllergies(profileData.allergies.foods);
    }
  }, [profileData]);

  useEffect(() => {
    if (insuranceData) {
      setPrimaryCarrier(insuranceData.primaryCarrier);
      setPrimaryPlan(insuranceData.primaryPlan);
      setPrimaryMemberId(insuranceData.primaryMemberId);
      setPrimaryGroupNumber(insuranceData.primaryGroupNumber);
      setPrimaryRxBin(insuranceData.primaryRxBin);
      setPrimaryRxPcn(insuranceData.primaryRxPcn);
      setPrimaryRxGroup(insuranceData.primaryRxGroup);
      setHasSecondary(insuranceData.hasSecondary);
      setSecondaryCarrier(insuranceData.secondaryCarrier);
      setSecondaryPlan(insuranceData.secondaryPlan);
      setSecondaryGroupNumber(insuranceData.secondaryGroupNumber);
      setSecondaryMemberId(insuranceData.secondaryMemberId);
      setDeductibleMet(insuranceData.deductibleMet);
      setDeductibleAmount(insuranceData.deductibleAmount?.toString() || "");
    }
  }, [insuranceData]);

  useEffect(() => {
    if (familyHistoryData) {
      setFamilyHistory(familyHistoryData.map(fh => ({
        condition: fh.condition,
        relation: fh.relation,
        ageOfOnset: fh.ageOfOnset || undefined,
      })));
    }
  }, [familyHistoryData]);

  const handleAddMedication = () => {
    if (!newMedName || !newMedDosage || !newMedFrequency) {
      toast.error("Please fill in all medication fields");
      return;
    }

    setCurrentMedications([
      ...currentMedications,
      {
        name: newMedName,
        dosage: newMedDosage,
        frequency: newMedFrequency,
      },
    ]);

    setNewMedName("");
    setNewMedDosage("");
    setNewMedFrequency("");
    toast.success("Medication added");
  };

  const handleRemoveMedication = (index: number) => {
    setCurrentMedications(currentMedications.filter((_, i) => i !== index));
    toast.success("Medication removed");
  };

  const handleAddFamilyHistory = () => {
    if (!newFamilyCondition || !newFamilyRelation) {
      toast.error("Please select condition and relation");
      return;
    }

    setFamilyHistory([
      ...familyHistory,
      {
        condition: newFamilyCondition,
        relation: newFamilyRelation,
        ageOfOnset: newFamilyAge ? parseInt(newFamilyAge) : undefined,
      },
    ]);

    setNewFamilyCondition("");
    setNewFamilyRelation("");
    setNewFamilyAge("");
    toast.success("Family history added");
  };

  const handleRemoveFamilyHistory = (index: number) => {
    setFamilyHistory(familyHistory.filter((_, i) => i !== index));
    toast.success("Family history removed");
  };

  // Section-specific save handlers
  const handleSavePersonalInfo = async () => {
    setSaving(true);
    try {
      await updatePersonalInfo.mutateAsync({
        dateOfBirth: dateOfBirth || null,
        gender: (gender as any) || null,
      });
      setEditingPersonalInfo(false);
      toast.success("Personal information saved");
    } catch (error) {
      toast.error("Failed to save personal information");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMedicalConditions = async () => {
    setSaving(true);
    try {
      await updateConditions.mutateAsync({
        conditions: selectedConditions,
      });
      setEditingMedicalConditions(false);
      toast.success("Medical conditions saved");
    } catch (error) {
      toast.error("Failed to save medical conditions");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllergies = async () => {
    setSaving(true);
    try {
      await updateAllergies.mutateAsync({
        medications: medicationAllergies,
      });
      setEditingAllergies(false);
      toast.success("Allergies saved");
    } catch (error) {
      toast.error("Failed to save allergies");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInsurance = async () => {
    setSaving(true);
    try {
      await updateInsurance.mutateAsync({
        primaryCarrier,
        primaryPlan,
        primaryMemberId,
        primaryGroupNumber,
        primaryRxBin,
        primaryRxPcn,
        primaryRxGroup,
        hasSecondary,
        secondaryCarrier,
        secondaryPlan,
        secondaryGroupNumber,
        secondaryMemberId,
        deductibleMet,
        deductibleAmount: deductibleAmount ? parseFloat(deductibleAmount) : null,
      });
      setEditingInsurance(false);
      toast.success("Insurance information saved");
    } catch (error) {
      toast.error("Failed to save insurance information");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Main Content */}
        <main className="container py-8 space-y-6">
          {/* Page Title */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Patient Information</h1>
              <p className="text-sm text-muted-foreground">Manage your medical profile and insurance</p>
            </div>
          </div>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={<User className="w-5 h-5" />}
              title="Personal Information"
              description="Basic demographic information"
              isEditing={editingPersonalInfo}
              onSave={handleSavePersonalInfo}
              onEdit={() => setEditingPersonalInfo(true)}
              saving={saving}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!editingPersonalInfo}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender} disabled={!editingPersonalInfo}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Conditions */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={<Heart className="w-5 h-5" />}
              title="Medical Conditions"
              description="Select all conditions that apply to you"
              isEditing={editingMedicalConditions}
              onSave={handleSaveMedicalConditions}
              onEdit={() => setEditingMedicalConditions(true)}
              saving={saving}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {COMMON_CONDITIONS.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors"
                >
                  <Checkbox
                    id={condition}
                    checked={selectedConditions.includes(condition)}
                    disabled={!editingMedicalConditions}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedConditions([...selectedConditions, condition]);
                      } else {
                        setSelectedConditions(selectedConditions.filter((c) => c !== condition));
                      }
                    }}
                  />
                  <span className="text-sm">{condition}</span>
                </label>
              ))}
            </div>
            
            {selectedConditions.includes("Other (specify below)") && (
              <div className="space-y-2">
                <Label htmlFor="other-condition">Other Condition (please specify)</Label>
                <Textarea
                  id="other-condition"
                  placeholder="Describe your condition..."
                  value={otherCondition}
                  onChange={(e) => setOtherCondition(e.target.value)}
                  rows={3}
                />
              </div>
            )}
            
            {selectedConditions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedConditions.map((condition) => (
                  <Badge key={condition} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Current Medications
            </CardTitle>
            <CardDescription>List all medications you are currently taking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing medications list */}
            {currentMedications.length > 0 && (
              <div className="space-y-2">
                {currentMedications.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new medication */}
            <div className="space-y-3 p-4 border border-dashed rounded-lg">
              <p className="text-sm font-medium">Add New Medication</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    placeholder="e.g., Metformin"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="med-dosage">Dosage</Label>
                  <Input
                    id="med-dosage"
                    placeholder="e.g., 500mg"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="med-frequency">Frequency</Label>
                  <Select value={newMedFrequency} onValueChange={setNewMedFrequency}>
                    <SelectTrigger id="med-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                      <SelectItem value="Four times daily">Four times daily</SelectItem>
                      <SelectItem value="Every other day">Every other day</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddMedication} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Allergies"
              description="Important for avoiding adverse reactions"
              isEditing={editingAllergies}
              onSave={handleSaveAllergies}
              onEdit={() => setEditingAllergies(true)}
              saving={saving}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Medication Allergies</Label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {COMMON_MEDICATION_ALLERGIES.map((allergy) => (
                  <label
                    key={allergy}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={medicationAllergies.includes(allergy)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setMedicationAllergies([...medicationAllergies, allergy]);
                        } else {
                          setMedicationAllergies(medicationAllergies.filter((a) => a !== allergy));
                        }
                      }}
                    />
                    <span className="text-sm">{allergy}</span>
                  </label>
                ))}
              </div>
              
              {medicationAllergies.includes("Other (specify below)") && (
                <div className="space-y-2 mt-3">
                  <Label htmlFor="other-allergy">Other Medication Allergy</Label>
                  <Input
                    id="other-allergy"
                    placeholder="Specify medication allergy..."
                    value={otherMedAllergy}
                    onChange={(e) => setOtherMedAllergy(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="food-allergies">Food Allergies</Label>
              <Textarea
                id="food-allergies"
                placeholder="List any food allergies (e.g., peanuts, shellfish, dairy)..."
                value={foodAllergies}
                onChange={(e) => setFoodAllergies(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Family History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family History
            </CardTitle>
            <CardDescription>Genetic conditions in your family</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing family history */}
            {familyHistory.length > 0 && (
              <div className="space-y-2">
                {familyHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.condition}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.relation}
                        {item.ageOfOnset && ` • Age of onset: ${item.ageOfOnset}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFamilyHistory(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new family history */}
            <div className="space-y-3 p-4 border border-dashed rounded-lg">
              <p className="text-sm font-medium">Add Family History</p>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="family-condition">Condition</Label>
                  <Select value={newFamilyCondition} onValueChange={setNewFamilyCondition}>
                    <SelectTrigger id="family-condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_CONDITIONS.filter(c => !c.includes("Other")).map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family-relation">Relation</Label>
                  <Select value={newFamilyRelation} onValueChange={setNewFamilyRelation}>
                    <SelectTrigger id="family-relation">
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {FAMILY_RELATIONS.map((relation) => (
                        <SelectItem key={relation} value={relation}>
                          {relation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family-age">Age of Onset (optional)</Label>
                  <Input
                    id="family-age"
                    type="number"
                    placeholder="e.g., 45"
                    value={newFamilyAge}
                    onChange={(e) => setNewFamilyAge(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddFamilyHistory} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Family History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={<Shield className="w-5 h-5" />}
              title="Insurance Information"
              description="This information will auto-populate when searching for medication prices"
              isEditing={editingInsurance}
              onSave={handleSaveInsurance}
              onEdit={() => setEditingInsurance(true)}
              saving={saving}
            />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Insurance */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Primary Insurance</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-carrier">Insurance Carrier</Label>
                  <Select value={primaryCarrier} onValueChange={(value) => {
                    setPrimaryCarrier(value);
                    setPrimaryPlan(""); // Reset plan when carrier changes
                  }} disabled={!editingInsurance}>
                    <SelectTrigger id="primary-carrier">
                      <SelectValue placeholder="Select carrier" />
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
                <div className="space-y-2">
                  <Label htmlFor="primary-plan">Plan Name</Label>
                  <Select 
                    value={primaryPlan} 
                    onValueChange={setPrimaryPlan}
                    disabled={!editingInsurance || !primaryCarrier}
                  >
                    <SelectTrigger id="primary-plan">
                      <SelectValue placeholder={primaryCarrier ? "Select plan" : "Select carrier first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {primaryCarrier && (() => {
                        const carrier = INSURANCE_CARRIERS.find(c => c.id === primaryCarrier);
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
                <div className="space-y-2">
                  <Label htmlFor="primary-member-id">Member ID</Label>
                  <Input
                    id="primary-member-id"
                    placeholder="Member ID number"
                    value={primaryMemberId}
                    onChange={(e) => setPrimaryMemberId(e.target.value)}
                    disabled={!editingInsurance}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-group">Group Number</Label>
                  <Input
                    id="primary-group"
                    placeholder="Group number"
                    value={primaryGroupNumber}
                    onChange={(e) => setPrimaryGroupNumber(e.target.value)}
                    disabled={!editingInsurance}
                  />
                </div>
              </div>
              
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Pharmacy Benefit Information (optional)</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="rx-bin">RxBIN</Label>
                    <Input
                      id="rx-bin"
                      placeholder="6-digit BIN"
                      value={primaryRxBin}
                      onChange={(e) => setPrimaryRxBin(e.target.value)}
                      disabled={!editingInsurance}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rx-pcn">RxPCN</Label>
                    <Input
                      id="rx-pcn"
                      placeholder="PCN"
                      value={primaryRxPcn}
                      onChange={(e) => setPrimaryRxPcn(e.target.value)}
                      disabled={!editingInsurance}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rx-group">RxGroup</Label>
                    <Input
                      id="rx-group"
                      placeholder="Group"
                      value={primaryRxGroup}
                      onChange={(e) => setPrimaryRxGroup(e.target.value)}
                      disabled={!editingInsurance}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Insurance */}
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={hasSecondary}
                  onCheckedChange={(checked) => setHasSecondary(checked as boolean)}
                />
                <span className="font-semibold">I have secondary insurance</span>
              </label>

              {hasSecondary && (
                <div className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="secondary-carrier">Secondary Carrier</Label>
                    <Input
                      id="secondary-carrier"
                      placeholder="Insurance carrier"
                      value={secondaryCarrier}
                      onChange={(e) => setSecondaryCarrier(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-plan">Plan Name</Label>
                    <Input
                      id="secondary-plan"
                      placeholder="Plan name"
                      value={secondaryPlan}
                      onChange={(e) => setSecondaryPlan(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-member-id">Member ID</Label>
                    <Input
                      id="secondary-member-id"
                      placeholder="Member ID"
                      value={secondaryMemberId}
                      onChange={(e) => setSecondaryMemberId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-group">Group Number</Label>
                    <Input
                      id="secondary-group"
                      placeholder="Group number"
                      value={secondaryGroupNumber}
                      onChange={(e) => setSecondaryGroupNumber(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Deductible */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={deductibleMet}
                  onCheckedChange={(checked) => setDeductibleMet(checked as boolean)}
                />
                <span className="font-medium">I have already met my deductible this year</span>
              </label>
              
              <div className="space-y-2">
                <Label htmlFor="deductible-amount">Annual Deductible Amount (optional)</Label>
                <Input
                  id="deductible-amount"
                  type="number"
                  placeholder="e.g., 1500"
                  value={deductibleAmount}
                  onChange={(e) => setDeductibleAmount(e.target.value)}
                  disabled={!editingInsurance}
                />
              </div>
            </div>
          </CardContent>
        </Card>


      </main>
    </div>
    </Layout>
  );
}
