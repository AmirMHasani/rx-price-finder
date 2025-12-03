import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dna, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Download,
  FileText,
  Beaker,
  Package,
  Upload
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { 
  GenomicProfile, 
  getRandomGenomicProfile, 
  getGenomicProfileById 
} from "@/data/mockGenomicProfiles";

export default function MyGenomic() {
  const { t } = useLanguage();
  const [genomicProfile, setGenomicProfile] = useState<GenomicProfile | null>(null);
  const [testStatus, setTestStatus] = useState<"none" | "requested" | "completed">("none");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has genomic data in localStorage
    const storedProfile = localStorage.getItem("genomicProfile");
    const storedStatus = localStorage.getItem("genomicTestStatus");
    
    if (storedProfile) {
      try {
        const profileData = JSON.parse(storedProfile);
        const profile = getGenomicProfileById(profileData.id);
        if (profile) {
          setGenomicProfile(profile);
          setTestStatus("completed");
        }
      } catch (error) {
        console.error("Error loading genomic profile:", error);
      }
    } else if (storedStatus === "requested") {
      setTestStatus("requested");
    }
    
    setIsLoading(false);
  }, []);

  const handleRequestTest = () => {
    setTestStatus("requested");
    localStorage.setItem("genomicTestStatus", "requested");
    toast.success(
      "Test Kit Requested",
      {
        description: "We'll send you a DNA collection kit within 3-5 business days. Instructions for sample collection will be included in the package."
      }
    );
  };

  const handleLoadResults = () => {
    // Randomly select a mock profile
    const randomProfile = getRandomGenomicProfile();
    setGenomicProfile(randomProfile);
    setTestStatus("completed");
    
    // Store in localStorage
    localStorage.setItem("genomicProfile", JSON.stringify({ id: randomProfile.id }));
    localStorage.setItem("genomicTestStatus", "completed");
    
    toast.success(
      "Genomic Results Loaded",
      {
        description: `Your pharmacogenomics report (${randomProfile.reportId}) is now available.`
      }
    );
  };

  const getMetabolizerBadgeColor = (type: string) => {
    switch (type) {
      case "Poor":
        return "bg-red-100 text-red-800 border-red-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Normal":
        return "bg-green-100 text-green-800 border-green-300";
      case "Rapid":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Ultra-rapid":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRecommendationBadgeColor = (recommendation: string) => {
    switch (recommendation) {
      case "Use as directed":
        return "bg-green-100 text-green-800 border-green-300";
      case "Use with caution":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Consider alternatives":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Avoid":
        return "bg-red-100 text-red-800 border-red-300";
      case "Dose adjustment needed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSignificanceBadgeColor = (significance: string) => {
    switch (significance) {
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <Dna className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading genomic data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // No test requested yet
  if (testStatus === "none") {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="container py-12">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Dna className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Pharmacogenomics Testing
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover how your genes affect your response to medications. Get personalized medication recommendations based on your unique genetic profile.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Personalized Dosing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Know which medications require dose adjustments based on your genetic makeup.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <AlertTriangle className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Avoid Adverse Reactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Identify medications that may cause serious side effects based on your genes.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg">Comprehensive Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Receive detailed analysis of 12+ genes affecting medication response.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* How it Works */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">How It Works</CardTitle>
                  <CardDescription>Simple 3-step process to get your pharmacogenomics report</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">1. Request Test Kit</h3>
                        <p className="text-gray-600">
                          Click the button below to request your DNA collection kit. We'll ship it to you within 3-5 business days.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Beaker className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">2. Collect Sample</h3>
                        <p className="text-gray-600">
                          Use the provided cheek swab to collect your DNA sample. Follow the simple instructions included in the kit.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Upload className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">3. Get Results</h3>
                        <p className="text-gray-600">
                          Mail back your sample using the prepaid envelope. Results will be available in 2-3 weeks.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
                  onClick={handleRequestTest}
                >
                  <Package className="w-5 h-5 mr-2" />
                  Request Genomic Test Kit
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Free for RxPriceFinder members • Results in 2-3 weeks
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Test requested, waiting for results
  if (testStatus === "requested" && !genomicProfile) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl">Test Kit Requested</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Your pharmacogenomics test kit is on its way!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      <strong>What's Next:</strong> We'll send you a DNA collection kit within 3-5 business days. 
                      The kit includes everything you need: cheek swabs, instructions, and a prepaid return envelope.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Kit Requested</p>
                          <p className="text-sm text-gray-600">Today</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
                        <div>
                          <p className="font-medium text-gray-500">Kit Arrives</p>
                          <p className="text-sm text-gray-600">3-5 business days</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
                        <div>
                          <p className="font-medium text-gray-500">Sample Collection & Return</p>
                          <p className="text-sm text-gray-600">At your convenience</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
                        <div>
                          <p className="font-medium text-gray-500">Results Ready</p>
                          <p className="text-sm text-gray-600">2-3 weeks after lab receives sample</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      For demo purposes, you can load sample results now:
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={handleLoadResults}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Load Sample Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Results available - show full genomic report
  if (genomicProfile) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="container py-8">
            {/* Report Header */}
            <Card className="mb-6 border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Dna className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">Pharmacogenomics Report</CardTitle>
                      <CardDescription className="text-purple-100 mt-1">
                        {genomicProfile.labName} • Report ID: {genomicProfile.reportId}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient ID</p>
                    <p className="font-semibold">{genomicProfile.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Test Date</p>
                    <p className="font-semibold">{new Date(genomicProfile.testDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Genes Analyzed</p>
                    <p className="font-semibold">{genomicProfile.summary.totalGenesAnalyzed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Risk Level</p>
                    <Badge className={
                      genomicProfile.summary.riskLevel === "High" ? "bg-red-100 text-red-800 border-red-300" :
                      genomicProfile.summary.riskLevel === "Moderate" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                      "bg-green-100 text-green-800 border-green-300"
                    }>
                      {genomicProfile.summary.riskLevel}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Warnings */}
            {genomicProfile.criticalWarnings.length > 0 && (
              <Alert className="mb-6 border-red-300 bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <AlertDescription>
                  <p className="font-semibold text-red-900 mb-2">Critical Medication Warnings</p>
                  <ul className="space-y-1">
                    {genomicProfile.criticalWarnings.map((warning, index) => (
                      <li key={index} className="text-red-800">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Executive Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {genomicProfile.summary.keyInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs for detailed information */}
            <Tabs defaultValue="genes" className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="genes">Gene Variants</TabsTrigger>
                <TabsTrigger value="medications">Medication Recommendations</TabsTrigger>
              </TabsList>

              {/* Gene Variants Tab */}
              <TabsContent value="genes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Genetic Variants Analyzed</CardTitle>
                    <CardDescription>
                      Your genetic variants and their impact on medication metabolism
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Gene</TableHead>
                          <TableHead>Alleles</TableHead>
                          <TableHead>Phenotype</TableHead>
                          <TableHead>Metabolizer Type</TableHead>
                          <TableHead>Clinical Significance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {genomicProfile.geneVariants.map((variant, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-semibold">{variant.gene}</TableCell>
                            <TableCell className="font-mono text-sm">{variant.alleles}</TableCell>
                            <TableCell>{variant.phenotype}</TableCell>
                            <TableCell>
                              <Badge className={getMetabolizerBadgeColor(variant.metabolizerType)}>
                                {variant.metabolizerType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getSignificanceBadgeColor(variant.clinicalSignificance)}>
                                {variant.clinicalSignificance}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Medication Recommendations Tab */}
              <TabsContent value="medications" className="mt-6">
                <div className="space-y-6">
                  {genomicProfile.medicationRecommendations.map((category, categoryIndex) => (
                    <Card key={categoryIndex}>
                      <CardHeader>
                        <CardTitle className="text-xl">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {category.medications.map((med, medIndex) => (
                            <div 
                              key={medIndex} 
                              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">{med.name}</h4>
                                  <p className="text-sm text-gray-500">{med.genericName}</p>
                                </div>
                                <Badge className={getRecommendationBadgeColor(med.recommendation)}>
                                  {med.recommendation}
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-2">{med.reason}</p>
                              {med.alternativeSuggestion && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                                  <p className="text-sm text-blue-900">
                                    <strong>Alternative:</strong> {med.alternativeSuggestion}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Disclaimer */}
            <Card className="bg-gray-50 border-gray-300">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">
                  <strong>Important Disclaimer:</strong> This pharmacogenomics report is for informational purposes only 
                  and should not replace professional medical advice. Always consult with your healthcare provider before 
                  making any changes to your medication regimen. Genetic testing is one of many factors that influence 
                  medication response. Other factors include age, weight, kidney/liver function, drug interactions, and 
                  overall health status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
}
