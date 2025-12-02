import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, ShieldAlert, Pill, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
// Removed Streamdown - using custom Markdown renderer instead

// Simple Markdown to HTML converter for bold text
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
    .replace(/\n/g, '<br/>'); // Line breaks
}

interface SafetyInfoTabProps {
  medicationName: string;
  rxcui?: string;
}

interface BlackBoxWarning {
  text: string;
}

interface FormattedSection {
  title: string;
  content: string;
}

interface SafetyData {
  blackBoxWarnings: FormattedSection[];
  warnings: FormattedSection[];
  contraindications: FormattedSection[];
  adverseReactions: FormattedSection[];
  drugInteractions: FormattedSection[];
  loading: boolean;
  error: string | null;
  formatting: boolean;
}

export function SafetyInfoTab({ medicationName, rxcui }: SafetyInfoTabProps) {
  const [safetyData, setSafetyData] = useState<SafetyData>({
    blackBoxWarnings: [],
    warnings: [],
    contraindications: [],
    adverseReactions: [],
    drugInteractions: [],
    loading: true,
    error: null,
    formatting: false,
  });

  const formatSafetyMutation = trpc.safety.formatSafetyInfo.useMutation();

  useEffect(() => {
    async function fetchSafetyInfo() {
      try {
        setSafetyData(prev => ({ ...prev, loading: true, error: null }));

        // Extract drug name from full medication string (e.g., "atorvastatin 20 MG Oral Tablet [Lipitor]" -> "atorvastatin" and "Lipitor")
        const brandMatch = medicationName.match(/\[([^\]]+)\]/);
        const brandName = brandMatch ? brandMatch[1] : '';
        const genericName = medicationName.split(' ')[0]; // First word is usually the generic name
        
        // Try brand name first, then generic name
        let url = '';
        if (brandName) {
          url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(brandName)}"&limit=1`;
        } else {
          url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(genericName)}"&limit=1`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`FDA API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          setSafetyData(prev => ({
            ...prev,
            loading: false,
            error: "No safety information found for this medication in the FDA database.",
          }));
          return;
        }

        const label = data.results[0];

        // First set raw data
        const rawData = {
          blackBoxWarnings: label.boxed_warning || [],
          warnings: label.warnings || [],
          contraindications: label.contraindications || [],
          adverseReactions: label.adverse_reactions || [],
          drugInteractions: label.drug_interactions || [],
        };

        setSafetyData(prev => ({
          ...prev,
          loading: false,
          formatting: true,
        }));

        // Format with LLM
        try {
          const formatted = await formatSafetyMutation.mutateAsync({
            ...rawData,
            medicationName,
          });

          setSafetyData({
            ...formatted,
            loading: false,
            error: null,
            formatting: false,
          });
        } catch (formatError) {
          console.error('Error formatting safety info:', formatError);
          // Fall back to raw data if formatting fails
          setSafetyData({
            blackBoxWarnings: rawData.blackBoxWarnings.map(text => ({ title: 'Warning', content: text })),
            warnings: rawData.warnings.map(text => ({ title: 'Warning', content: text })),
            contraindications: rawData.contraindications.map(text => ({ title: 'Contraindication', content: text })),
            adverseReactions: rawData.adverseReactions.map(text => ({ title: 'Reaction', content: text })),
            drugInteractions: rawData.drugInteractions.map(text => ({ title: 'Interaction', content: text })),
            loading: false,
            error: null,
            formatting: false,
          });
        }
      } catch (error) {
        console.error("Error fetching safety information:", error);
        setSafetyData(prev => ({
          ...prev,
          loading: false,
          error: "Unable to load safety information. Please try again later.",
        }));
      }
    }

    if (medicationName) {
      fetchSafetyInfo();
    }
  }, [medicationName]);

  if (safetyData.loading || safetyData.formatting) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              {safetyData.loading ? 'Loading safety information...' : 'Formatting with AI...'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (safetyData.error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800">{safetyData.error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Black Box Warnings */}
      {safetyData.blackBoxWarnings.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <CardTitle className="text-red-900">Black Box Warnings</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              Serious warnings from the FDA about potentially life-threatening risks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safetyData.blackBoxWarnings.map((warning, index) => (
                <div key={index} className="bg-white p-5 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">{warning.title}</h4>
                  <div 
                    className="text-sm text-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(warning.content) }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contraindications */}
      {safetyData.contraindications.length > 0 && (
        <Card className="border-orange-300 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-orange-900">Contraindications</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              Situations where this medication should NOT be used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyData.contraindications.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">{item.title}</h4>
                  <div 
                    className="text-sm text-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drug Interactions */}
      {safetyData.drugInteractions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-600" />
              <CardTitle>Major Drug Interactions</CardTitle>
            </div>
            <CardDescription>
              Medications and substances that may interact with {medicationName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyData.drugInteractions.map((item, index) => (
                <div key={index} className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">{item.title}</h4>
                  <div 
                    className="text-sm text-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warnings and Precautions */}
      {safetyData.warnings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600" />
              <CardTitle>Warnings and Precautions</CardTitle>
            </div>
            <CardDescription>
              Important safety information to discuss with your healthcare provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyData.warnings.map((item, index) => (
                <div key={index} className="bg-amber-50 p-5 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">{item.title}</h4>
                  <div 
                    className="text-sm text-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adverse Reactions */}
      {safetyData.adverseReactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Common Side Effects</CardTitle>
            <CardDescription>
              Adverse reactions reported in clinical trials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {safetyData.adverseReactions.map((item, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <div 
                    className="text-sm text-foreground prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(item.content) }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Medical Disclaimer</p>
              <p>
                This safety information is sourced from the FDA drug label database and is for educational purposes only. 
                Always consult your healthcare provider before starting, stopping, or changing any medication. 
                Report serious side effects to the FDA at 1-800-FDA-1088.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
