import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle, CheckCircle2, Info, TrendingDown } from "lucide-react";

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
  indications: string[];
  contraindications: string[];
  majorInteractions: string[];
  commonSideEffects: string[];
  estimatedCostSavings?: number;
  strengthOfRecommendation: "high" | "medium" | "low";
}

export function AIAlternativesTab({ medicationName, dosage, indication }: AIAlternativesTabProps) {
  const [alternatives, setAlternatives] = useState<AlternativeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateAlternatives() {
      try {
        setLoading(true);
        setError(null);

        // Call LLM API to generate intelligent alternative recommendations
        const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
        const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;

        if (!apiKey || !apiUrl) {
          throw new Error("API configuration missing");
        }

        const prompt = `You are a clinical pharmacist AI assistant. Analyze the medication "${medicationName}" (${dosage}) and provide 3-5 therapeutically equivalent alternative medications.

For each alternative, provide:
1. Generic name and brand name (if applicable)
2. Drug class
3. Why this alternative is recommended (mechanism of action similarity, efficacy, safety profile)
4. Primary indications
5. Key contraindications
6. Major drug interactions
7. Common side effects
8. Estimated cost savings percentage (if typically cheaper)

Format your response as a JSON array with this structure:
[
  {
    "name": "Brand Name",
    "genericName": "generic name",
    "drugClass": "Drug Class Name",
    "whyRecommended": "Brief explanation of why this is a good alternative",
    "indications": ["indication 1", "indication 2"],
    "contraindications": ["contraindication 1", "contraindication 2"],
    "majorInteractions": ["interaction 1", "interaction 2"],
    "commonSideEffects": ["side effect 1", "side effect 2"],
    "estimatedCostSavings": 20,
    "strengthOfRecommendation": "high"
  }
]

Focus on evidence-based recommendations. Only suggest alternatives in the same therapeutic class or with similar mechanisms of action.`;

        const response = await fetch(`${apiUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a clinical pharmacist AI providing evidence-based medication alternatives. Always respond with valid JSON only, no additional text.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse JSON response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error("Invalid response format from AI");
        }

        const recommendations: AlternativeRecommendation[] = JSON.parse(jsonMatch[0]);
        setAlternatives(recommendations);
        setLoading(false);
      } catch (err) {
        console.error("Error generating alternatives:", err);
        setError("Unable to generate AI recommendations. Please try again later.");
        setLoading(false);
      }
    }

    if (medicationName) {
      generateAlternatives();
    }
  }, [medicationName, dosage]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>AI is analyzing therapeutic alternatives...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <CardTitle>AI-Powered Alternative Recommendations</CardTitle>
          </div>
          <CardDescription>
            Intelligent suggestions based on therapeutic equivalence, safety profiles, and clinical evidence. 
            Always consult your healthcare provider before making medication changes.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Alternatives */}
      {alternatives.map((alt, index) => (
        <Card key={index} className="border-2 hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl">{alt.name}</CardTitle>
                  <Badge 
                    variant={
                      alt.strengthOfRecommendation === "high" ? "default" : 
                      alt.strengthOfRecommendation === "medium" ? "secondary" : 
                      "outline"
                    }
                  >
                    {alt.strengthOfRecommendation === "high" ? "Highly Recommended" : 
                     alt.strengthOfRecommendation === "medium" ? "Recommended" : 
                     "Consider"}
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {alt.genericName} • {alt.drugClass}
                </CardDescription>
              </div>
              {alt.estimatedCostSavings && alt.estimatedCostSavings > 0 && (
                <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
                  <TrendingDown className="w-4 h-4 text-green-700" />
                  <span className="font-semibold text-green-700">~{alt.estimatedCostSavings}% savings</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Why Recommended */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Why This Alternative?</h4>
                  <p className="text-sm text-blue-800">{alt.whyRecommended}</p>
                </div>
              </div>
            </div>

            {/* Indications */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Indications
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {alt.indications.map((indication, i) => (
                  <li key={i}>{indication}</li>
                ))}
              </ul>
            </div>

            {/* Contraindications */}
            {alt.contraindications.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Contraindications
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {alt.contraindications.map((contra, i) => (
                    <li key={i}>{contra}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Major Interactions */}
            {alt.majorInteractions.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Major Drug Interactions
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {alt.majorInteractions.map((interaction, i) => (
                    <li key={i}>{interaction}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side Effects */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Common Side Effects</h4>
              <div className="flex flex-wrap gap-2">
                {alt.commonSideEffects.map((effect, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Important Medical Disclaimer</p>
              <p>
                These AI-generated recommendations are for informational purposes only and should not replace professional medical advice. 
                Always consult your healthcare provider or pharmacist before switching medications. Individual patient factors, 
                medical history, and current medications must be considered when selecting alternatives.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
