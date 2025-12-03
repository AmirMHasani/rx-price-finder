import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dna, FileText, CheckCircle2, AlertTriangle, XCircle,
  ArrowLeft, Calendar, Download, Info, Pill, Heart,
  Brain, Activity, Zap, Shield
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Layout } from "@/components/Layout";

// Sample genomic data - in production, this would come from API
const SAMPLE_GENOMIC_DATA = {
  testStatus: "completed" as const,
  requestDate: "2024-11-15",
  resultsDate: "2024-12-01",
  testType: "Comprehensive Pharmacogenomic Panel",
  testProvider: "GeneDx Laboratories",
  
  genes: [
    { gene: "CYP2D6", variant: "*1/*1", phenotype: "Normal Metabolizer", activity: "Normal" },
    { gene: "CYP2C19", variant: "*2/*17", phenotype: "Intermediate Metabolizer", activity: "Reduced" },
    { gene: "CYP2C9", variant: "*1/*3", phenotype: "Intermediate Metabolizer", activity: "Reduced" },
    { gene: "SLCO1B1", variant: "*1/*1", phenotype: "Normal Function", activity: "Normal" },
    { gene: "VKORC1", variant: "GG", phenotype: "Low Sensitivity", activity: "Normal" },
  ],
  
  medicationCategories: [
    {
      category: "Cardiovascular Medications",
      icon: Heart,
      medications: [
        {
          name: "Clopidogrel (Plavix)",
          gene: "CYP2C19",
          safetyLevel: "caution" as const,
          interpretation: "Reduced CYP2C19 activity may decrease the effectiveness of clopidogrel. The medication may not provide adequate antiplatelet protection.",
          recommendation: "Consider alternative antiplatelet therapy such as prasugrel or ticagrelor, or increase monitoring for cardiovascular events.",
          evidenceLevel: "Strong",
          guidelineSource: "CPIC"
        },
        {
          name: "Warfarin (Coumadin)",
          gene: "CYP2C9, VKORC1",
          safetyLevel: "caution" as const,
          interpretation: "CYP2C9 *1/*3 genotype may require dose adjustment. VKORC1 GG genotype suggests normal sensitivity.",
          recommendation: "Start with lower initial dose (3-4 mg/day instead of 5 mg/day). Monitor INR closely and adjust dose based on response.",
          evidenceLevel: "Strong",
          guidelineSource: "CPIC, FDA"
        },
        {
          name: "Simvastatin (Zocor)",
          gene: "SLCO1B1",
          safetyLevel: "safe" as const,
          interpretation: "Normal SLCO1B1 function. Standard dosing is appropriate with normal risk of myopathy.",
          recommendation: "Use standard dosing. No genetic contraindications identified.",
          evidenceLevel: "Strong",
          guidelineSource: "CPIC"
        },
      ]
    },
    {
      category: "Antidepressants",
      icon: Brain,
      medications: [
        {
          name: "Sertraline (Zoloft)",
          gene: "CYP2C19",
          safetyLevel: "caution" as const,
          interpretation: "Intermediate CYP2C19 metabolizer status may lead to increased sertraline levels and higher risk of side effects.",
          recommendation: "Consider 25-50% dose reduction or alternative SSRI. Monitor for side effects including GI disturbance and sexual dysfunction.",
          evidenceLevel: "Moderate",
          guidelineSource: "CPIC"
        },
        {
          name: "Escitalopram (Lexapro)",
          gene: "CYP2C19",
          safetyLevel: "caution" as const,
          interpretation: "Reduced CYP2C19 activity may increase escitalopram plasma concentrations.",
          recommendation: "Consider 50% dose reduction. Alternative: citalopram with dose adjustment or mirtazapine.",
          evidenceLevel: "Moderate",
          guidelineSource: "CPIC"
        },
        {
          name: "Venlafaxine (Effexor)",
          gene: "CYP2D6",
          safetyLevel: "safe" as const,
          interpretation: "Normal CYP2D6 activity. Standard dosing is appropriate.",
          recommendation: "Use standard dosing. No genetic contraindications identified.",
          evidenceLevel: "Moderate",
          guidelineSource: "CPIC"
        },
      ]
    },
    {
      category: "Pain Management",
      icon: Zap,
      medications: [
        {
          name: "Codeine",
          gene: "CYP2D6",
          safetyLevel: "safe" as const,
          interpretation: "Normal CYP2D6 metabolizer. Codeine will be converted to morphine at normal rates for adequate pain relief.",
          recommendation: "Use standard dosing. Normal analgesic effect expected.",
          evidenceLevel: "Strong",
          guidelineSource: "CPIC, FDA"
        },
        {
          name: "Tramadol",
          gene: "CYP2D6",
          safetyLevel: "safe" as const,
          interpretation: "Normal CYP2D6 activity ensures adequate conversion to active metabolite (O-desmethyltramadol).",
          recommendation: "Use standard dosing. Normal analgesic effect expected.",
          evidenceLevel: "Moderate",
          guidelineSource: "CPIC"
        },
        {
          name: "Celecoxib (Celebrex)",
          gene: "CYP2C9",
          safetyLevel: "caution" as const,
          interpretation: "CYP2C9 *1/*3 genotype may lead to increased celecoxib exposure and higher risk of cardiovascular and GI adverse events.",
          recommendation: "Consider 50% dose reduction. Start with lowest effective dose. Monitor for adverse events.",
          evidenceLevel: "Moderate",
          guidelineSource: "CPIC"
        },
      ]
    },
    {
      category: "Diabetes Medications",
      icon: Activity,
      medications: [
        {
          name: "Metformin (Glucophage)",
          gene: "No significant gene interactions",
          safetyLevel: "safe" as const,
          interpretation: "No pharmacogenomic interactions identified for metformin. Standard dosing is appropriate.",
          recommendation: "Use standard dosing based on renal function and clinical response.",
          evidenceLevel: "Strong",
          guidelineSource: "Clinical Guidelines"
        },
        {
          name: "Glipizide (Glucotrol)",
          gene: "CYP2C9",
          safetyLevel: "caution" as const,
          interpretation: "CYP2C9 *1/*3 may lead to increased glipizide exposure and higher risk of hypoglycemia.",
          recommendation: "Start with lower dose (2.5 mg instead of 5 mg). Monitor blood glucose closely and adjust dose carefully.",
          evidenceLevel: "Moderate",
          guidelineSource: "PharmGKB"
        },
      ]
    },
  ]
};

export default function MyGenomic() {
  const [, setLocation] = useLocation();
  const [hasTest, setHasTest] = useState(false);
  const [requestingTest, setRequestingTest] = useState(false);
  const [testNotes, setTestNotes] = useState("");
  const [genomicData, setGenomicData] = useState<any>(null);

  // Load genomic test data from API
  const { data: testData, isLoading, refetch } = trpc.genomic.getGenomicTest.useQuery();
  const requestTest = trpc.genomic.requestGenomicTest.useMutation();
  const seedSampleData = trpc.genomic.seedSampleData.useMutation();

  useEffect(() => {
    if (testData) {
      setHasTest(true);
      // Transform API data to match component structure
      const transformedData = {
        testStatus: testData.test.status,
        requestDate: testData.test.requestDate ? new Date(testData.test.requestDate).toLocaleDateString() : "",
        resultsDate: testData.test.resultsDate ? new Date(testData.test.resultsDate).toLocaleDateString() : "",
        testType: testData.test.testType,
        testProvider: testData.test.testProvider,
        genes: [
          { gene: "CYP2D6", variant: "*1/*1", phenotype: "Normal Metabolizer", activity: "Normal" },
          { gene: "CYP2C19", variant: "*2/*17", phenotype: "Intermediate Metabolizer", activity: "Reduced" },
          { gene: "CYP2C9", variant: "*1/*3", phenotype: "Intermediate Metabolizer", activity: "Reduced" },
          { gene: "SLCO1B1", variant: "*1/*1", phenotype: "Normal Function", activity: "Normal" },
          { gene: "VKORC1", variant: "GG", phenotype: "Low Sensitivity", activity: "Normal" },
        ],
        medicationCategories: groupMedicationsByCategory(testData.interactions),
      };
      setGenomicData(transformedData);
    }
  }, [testData]);

  const groupMedicationsByCategory = (interactions: any[]) => {
    const categories: any = {};
    interactions.forEach(interaction => {
      const category = interaction.medicationClass || "Other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        name: interaction.medicationName,
        gene: interaction.gene,
        safetyLevel: interaction.safetyLevel,
        interpretation: interaction.interpretation,
        recommendation: interaction.recommendation,
        evidenceLevel: interaction.evidenceLevel,
        guidelineSource: interaction.guidelineSource,
      });
    });

    const iconMap: any = {
      "Cardiovascular": Heart,
      "Antidepressants": Brain,
      "Pain Management": Activity,
      "Diabetes": Zap,
    };

    return Object.keys(categories).map(category => ({
      category: category,
      icon: iconMap[category] || Pill,
      medications: categories[category],
    }));
  };

  const handleRequestTest = async () => {
    setRequestingTest(true);
    try {
      await requestTest.mutateAsync({
        testType: "Comprehensive Pharmacogenomic Panel",
        notes: testNotes,
      });
      toast.success("Genomic test request submitted successfully");
      setHasTest(true);
      refetch();
    } catch (error) {
      toast.error("Failed to submit test request");
      console.error(error);
    } finally {
      setRequestingTest(false);
    }
  };

  const handleSeedSampleData = async () => {
    try {
      await seedSampleData.mutateAsync();
      toast.success("Sample genomic data loaded");
      refetch();
    } catch (error) {
      toast.error("Failed to load sample data");
      console.error(error);
    }
  };

  const getSafetyIcon = (level: "safe" | "caution" | "avoid") => {
    switch (level) {
      case "safe":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "caution":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "avoid":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getSafetyBadge = (level: "safe" | "caution" | "avoid") => {
    const variants = {
      safe: "bg-green-100 text-green-800 border-green-300",
      caution: "bg-yellow-100 text-yellow-800 border-yellow-300",
      avoid: "bg-red-100 text-red-800 border-red-300"
    };
    
    const labels = {
      safe: "Use as Directed",
      caution: "Dose Adjustment May Be Needed",
      avoid: "Use Alternative Medication"
    };

    return (
      <Badge variant="outline" className={variants[level]}>
        {labels[level]}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Page Header */}
        <div className="bg-white border-b border-border shadow-sm">
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
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Dna className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">My Pharmacogenomic Profile</h1>
                  <p className="text-sm text-muted-foreground">Personalized medication guidance based on your genetics</p>
                </div>
              </div>
            </div>
            {hasTest && (
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            )}
          </div>
          </div>
        </div>

      {/* Main Content */}
      <main className="container py-8 space-y-6">
        {!hasTest ? (
          /* Request Test Section */
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="w-6 h-6" />
                Request Pharmacogenomic Testing
              </CardTitle>
              <CardDescription>
                Discover how your genes affect medication response and get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  What is Pharmacogenomic Testing?
                </h3>
                <p className="text-sm text-blue-800">
                  Pharmacogenomic (PGx) testing analyzes your DNA to identify genetic variations that affect how your body processes medications. This helps your healthcare provider choose the right medication and dose for you, potentially improving effectiveness and reducing side effects.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">What to Expect:</h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-semibold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Sample Collection</p>
                      <p className="text-sm text-muted-foreground">A simple cheek swab or saliva sample will be collected at a participating lab</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-semibold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Laboratory Analysis</p>
                      <p className="text-sm text-muted-foreground">Your sample is analyzed for key genetic markers (typically 2-3 weeks)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 font-semibold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Results & Recommendations</p>
                      <p className="text-sm text-muted-foreground">Receive personalized medication guidance based on your genetic profile</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="test-notes"
                  placeholder="Any specific medications or conditions you'd like to focus on..."
                  value={testNotes}
                  onChange={(e) => setTestNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleRequestTest} 
                  disabled={requestingTest}
                  className="w-full"
                  size="lg"
                >
                  {requestingTest ? "Submitting Request..." : "Request Pharmacogenomic Test"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or for demo</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSeedSampleData} 
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Load Sample Genomic Data
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By requesting this test, you consent to genetic testing. Results will be shared with your healthcare provider.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Test Results Section */
          <>
            {/* Test Status Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Test Information
                    </CardTitle>
                    <CardDescription>
                      {(genomicData || SAMPLE_GENOMIC_DATA).testType} • {(genomicData || SAMPLE_GENOMIC_DATA).testProvider}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Request Date</p>
                      <p className="font-medium">{(genomicData || SAMPLE_GENOMIC_DATA).requestDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Results Date</p>
                      <p className="font-medium">{(genomicData || SAMPLE_GENOMIC_DATA).resultsDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Genetic Variants Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="w-5 h-5" />
                  Your Genetic Variants
                </CardTitle>
                <CardDescription>
                  Key genes that affect medication metabolism
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {(genomicData || SAMPLE_GENOMIC_DATA).genes.map((gene: any) => (
                    <div key={gene.gene} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{gene.gene}</h3>
                        <Badge variant={gene.activity === "Normal" ? "default" : "secondary"}>
                          {gene.activity}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Variant:</span> {gene.variant}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Phenotype:</span> {gene.phenotype}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medication Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medication Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized guidance based on your genetic profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Legend */}
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Safety Level Guide
                  </h3>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Use as Directed</p>
                        <p className="text-xs text-muted-foreground">Standard dosing appropriate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-sm">Dose Adjustment May Be Needed</p>
                        <p className="text-xs text-muted-foreground">Consult your doctor</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-sm">Use Alternative</p>
                        <p className="text-xs text-muted-foreground">High risk, avoid if possible</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medication Categories */}
                <Accordion type="multiple" className="space-y-2">
                  {(genomicData || SAMPLE_GENOMIC_DATA).medicationCategories.map((category: any, catIndex: number) => {
                    const CategoryIcon = category.icon;
                    const safeCount = category.medications.filter((m: any) => m.safetyLevel === "safe").length;
                    const cautionCount = category.medications.filter((m: any) => m.safetyLevel === "caution").length;
                    const avoidCount = category.medications.filter((m: any) => m.safetyLevel === "avoid").length;

                    return (
                      <AccordionItem key={catIndex} value={`category-${catIndex}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              <CategoryIcon className="w-5 h-5 text-primary" />
                              <span className="font-semibold">{category.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {safeCount > 0 && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  {safeCount} <CheckCircle2 className="w-3 h-3 ml-1" />
                                </Badge>
                              )}
                              {cautionCount > 0 && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  {cautionCount} <AlertTriangle className="w-3 h-3 ml-1" />
                                </Badge>
                              )}
                              {avoidCount > 0 && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                  {avoidCount} <XCircle className="w-3 h-3 ml-1" />
                                </Badge>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            {category.medications.map((med: any, medIndex: number) => (
                              <div
                                key={medIndex}
                                className={`p-4 rounded-lg border-l-4 ${
                                  med.safetyLevel === "safe"
                                    ? "bg-green-50 border-green-500"
                                    : med.safetyLevel === "caution"
                                    ? "bg-yellow-50 border-yellow-500"
                                    : "bg-red-50 border-red-500"
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    {getSafetyIcon(med.safetyLevel)}
                                    <h4 className="font-semibold">{med.name}</h4>
                                  </div>
                                  {getSafetyBadge(med.safetyLevel)}
                                </div>
                                
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <p className="font-medium text-muted-foreground">Affected Gene:</p>
                                    <p>{med.gene}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium text-muted-foreground">Interpretation:</p>
                                    <p>{med.interpretation}</p>
                                  </div>
                                  
                                  <div>
                                    <p className="font-medium text-muted-foreground">Recommendation:</p>
                                    <p className="font-medium">{med.recommendation}</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                                    <span>Evidence: {med.evidenceLevel}</span>
                                    <span>•</span>
                                    <span>Source: {med.guidelineSource}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Important:</strong> This pharmacogenomic information is intended to supplement, not replace, the expertise and judgment of your healthcare provider. Always consult with your doctor before making any changes to your medications. Medications should not be changed based solely on test results.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
    </Layout>
  );
}
