import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle2, Info, TrendingDown, Pill } from "lucide-react";

interface AIAlternativesTabProps {
  medicationName: string;
  dosage: string;
  indication?: string;
}

interface AlternativeRecommendation {
  name: string;
  genericName: string;
  drugClass: string;
  whyRecommended: string;
  rxcui?: string;
}

export function AIAlternativesTab({ medicationName, dosage }: AIAlternativesTabProps) {
  const [alternatives, setAlternatives] = useState<AlternativeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlternatives() {
      try {
        setLoading(true);
        setError(null);

        // Extract drug name from medication string (e.g., "atorvastatin 20 MG Oral Tablet [Lipitor]")
        const brandMatch = medicationName.match(/\[([^\]]+)\]/);
        const brandName = brandMatch ? brandMatch[1] : '';
        const genericName = medicationName.split(' ')[0];
        const searchName = brandName || genericName;

        // Step 1: Get drug class from RxClass API
        const classUrl = `https://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json?drugName=${encodeURIComponent(searchName)}&relaSource=ATC`;
        const classResponse = await fetch(classUrl);
        
        if (!classResponse.ok) {
          throw new Error(`Unable to find drug class`);
        }

        const classData = await classResponse.json();
        
        if (!classData.rxclassDrugInfoList || classData.rxclassDrugInfoList.rxclassDrugInfo.length === 0) {
          setAlternatives([]);
          setError("No therapeutic alternatives found for this medication.");
          setLoading(false);
          return;
        }

        // Get the first (most specific) drug class
        const drugClassInfo = classData.rxclassDrugInfoList.rxclassDrugInfo[0];
        const classId = drugClassInfo.rxclassMinConceptItem.classId;
        const className = drugClassInfo.rxclassMinConceptItem.className;

        // Step 2: Get all drugs in the same class
        const membersUrl = `https://rxnav.nlm.nih.gov/REST/rxclass/classMembers.json?classId=${classId}&relaSource=ATC`;
        const membersResponse = await fetch(membersUrl);
        
        if (!membersResponse.ok) {
          throw new Error(`Unable to find alternative medications`);
        }

        const membersData = await membersResponse.json();
        
        if (!membersData.drugMemberGroup || !membersData.drugMemberGroup.drugMember) {
          setAlternatives([]);
          setError("No therapeutic alternatives found.");
          setLoading(false);
          return;
        }

        // Filter out the current medication and limit to 5 alternatives
        const currentDrugLower = searchName.toLowerCase();
        const alternativeDrugs = membersData.drugMemberGroup.drugMember
          .filter((drug: any) => !drug.minConcept.name.toLowerCase().includes(currentDrugLower))
          .slice(0, 5);

        // Format alternatives
        const recommendations: AlternativeRecommendation[] = alternativeDrugs.map((drug: any) => ({
          name: drug.minConcept.name,
          genericName: drug.minConcept.name,
          drugClass: className,
          whyRecommended: `Same therapeutic class (${className}). Works through a similar mechanism of action.`,
          rxcui: drug.minConcept.rxcui,
        }));

        setAlternatives(recommendations);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching alternatives:", err);
        setError("Unable to load alternative medications. Please try again later.");
        setLoading(false);
      }
    }

    fetchAlternatives();
  }, [medicationName, dosage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Sparkles className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-muted-foreground">Finding therapeutic alternatives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Info className="w-5 h-5" />
            No Alternatives Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-800">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (alternatives.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Alternatives Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We couldn't find any therapeutic alternatives for this medication at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-purple-600" />
            Therapeutic Alternatives
          </CardTitle>
          <CardDescription>
            These medications are in the same therapeutic class and may be suitable alternatives. 
            Always consult your healthcare provider before switching medications.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {alternatives.map((alt, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{alt.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="outline" className="mr-2">
                      {alt.drugClass}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Why This Alternative
                </h4>
                <p className="text-sm text-muted-foreground">{alt.whyRecommended}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  ⚠️ <strong>Important:</strong> This information is for educational purposes only. 
                  Consult your healthcare provider before making any changes to your medication regimen.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            About These Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            These alternatives are identified based on their therapeutic classification and mechanism of action. 
            They may have different:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Dosing schedules</li>
            <li>Side effect profiles</li>
            <li>Drug interactions</li>
            <li>Costs and insurance coverage</li>
          </ul>
          <p className="pt-2">
            <strong>Always discuss with your healthcare provider</strong> before switching medications, 
            as individual factors may make one alternative more suitable than another.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
