import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  User, Heart, Pill, AlertTriangle, Users, Shield, 
  Plus, X, Save, ArrowLeft, Calendar 
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

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

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save personal info
      await updatePersonalInfo.mutateAsync({
        dateOfBirth: dateOfBirth || null,
        gender: (gender as any) || null,
      });

      // Save medical conditions
      await updateConditions.mutateAsync({
        conditions: selectedConditions,
      });

      // Save allergies
      await updateAllergies.mutateAsync({
        medications: medicationAllergies,
      });

      // Save insurance
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
      
      toast.success("Patient information saved successfully");
    } catch (error) {
      toast.error("Failed to save patient information");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Patient Information</h1>
                  <p className="text-sm text-muted-foreground">Manage your medical profile and insurance</p>
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Basic demographic information</CardDescription>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
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
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Medical Conditions
            </CardTitle>
            <CardDescription>Select all conditions that apply to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {COMMON_CONDITIONS.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedConditions.includes(condition)}
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
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Allergies
            </CardTitle>
            <CardDescription>Important for avoiding adverse reactions</CardDescription>
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
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Insurance Information
            </CardTitle>
            <CardDescription>
              This information will auto-populate when searching for medication prices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Insurance */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Primary Insurance</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-carrier">Insurance Carrier</Label>
                  <Input
                    id="primary-carrier"
                    placeholder="e.g., Blue Cross Blue Shield"
                    value={primaryCarrier}
                    onChange={(e) => setPrimaryCarrier(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-plan">Plan Name</Label>
                  <Input
                    id="primary-plan"
                    placeholder="e.g., Silver PPO"
                    value={primaryPlan}
                    onChange={(e) => setPrimaryPlan(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-member-id">Member ID</Label>
                  <Input
                    id="primary-member-id"
                    placeholder="Member ID number"
                    value={primaryMemberId}
                    onChange={(e) => setPrimaryMemberId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-group">Group Number</Label>
                  <Input
                    id="primary-group"
                    placeholder="Group number"
                    value={primaryGroupNumber}
                    onChange={(e) => setPrimaryGroupNumber(e.target.value)}
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rx-pcn">RxPCN</Label>
                    <Input
                      id="rx-pcn"
                      placeholder="PCN"
                      value={primaryRxPcn}
                      onChange={(e) => setPrimaryRxPcn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rx-group">RxGroup</Label>
                    <Input
                      id="rx-group"
                      placeholder="Group"
                      value={primaryRxGroup}
                      onChange={(e) => setPrimaryRxGroup(e.target.value)}
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
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </main>
    </div>
  );
}
