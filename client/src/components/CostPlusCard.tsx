import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, ExternalLink, TrendingDown } from 'lucide-react';
import { searchCostPlusMedication, formatCostPlusDrug, calculateCostPlusSavings, type CostPlusDrugResult } from '@/services/costPlusApi';

interface CostPlusCardProps {
  medicationName: string;
  strength?: string;
  quantity: number;
  averageRetailPrice?: number;
}

export function CostPlusCard({ medicationName, strength, quantity, averageRetailPrice }: CostPlusCardProps) {
  const [loading, setLoading] = useState(true);
  const [drugData, setDrugData] = useState<CostPlusDrugResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCostPlusData() {
      setLoading(true);
      setError(false);
      
      try {
        console.log('🔍 [COST PLUS] Searching for:', { medicationName, strength, quantity });
        
        // Define brand-to-generic mapping upfront
        const brandToGeneric: Record<string, string> = {
          'lipitor': 'atorvastatin',
          'crestor': 'rosuvastatin',
          'zocor': 'simvastatin',
          'norvasc': 'amlodipine',
          'glucophage': 'metformin',
          'synthroid': 'levothyroxine',
          'zoloft': 'sertraline',
          'prozac': 'fluoxetine',
          'lexapro': 'escitalopram',
          'xanax': 'alprazolam',
          'ambien': 'zolpidem',
          'viagra': 'sildenafil',
          'cialis': 'tadalafil',
          'prilosec': 'omeprazole',
          'nexium': 'esomeprazole',
          'advil': 'ibuprofen',
          'tylenol': 'acetaminophen',
          'motrin': 'ibuprofen',
          'aleve': 'naproxen',
        };
        
        // Check if this is a brand name and get generic equivalent
        const genericName = brandToGeneric[medicationName.toLowerCase()];
        const searchName = genericName || medicationName;
        
        if (genericName) {
          console.log(`🔄 [COST PLUS] Detected brand name "${medicationName}", using generic "${genericName}"`);
        }
        
        // Try with full parameters first (using generic name if available)
        let result = await searchCostPlusMedication(searchName, strength, quantity);
        
        // If no result, try without strength (get any available strength)
        if (!result) {
          console.log('⚠️ [COST PLUS] No exact match, trying without strength...');
          result = await searchCostPlusMedication(searchName, undefined, quantity);
        }
        
        // If still no result, try without quantity
        if (!result) {
          console.log('⚠️ [COST PLUS] Still no match, trying medication name only...');
          result = await searchCostPlusMedication(searchName);
        }
        
        // If still no result, try lowercase
        if (!result) {
          console.log('⚠️ [COST PLUS] Trying lowercase...');
          result = await searchCostPlusMedication(searchName.toLowerCase());
        }
        
        // If still no result and we haven't tried the original name yet (because we used generic), try original
        if (!result && genericName) {
          console.log('⚠️ [COST PLUS] Generic not found, trying original brand name...');
          result = await searchCostPlusMedication(medicationName);
        }
        
        // If still no result, try generic equivalent API
        if (!result) {
          console.log('⚠️ [COST PLUS] Trying generic equivalent API...');
          const { searchCostPlusGeneric } = await import('@/services/costPlusApi');
          result = await searchCostPlusGeneric(medicationName, strength, quantity);
        }
        
        if (result) {
          console.log('✅ [COST PLUS] Found:', result.medication_name, result.strength);
          setDrugData(result);
        } else {
          console.log('❌ [COST PLUS] No results found for', medicationName);
          setError(true);
        }
      } catch (err) {
        console.error('❌ [COST PLUS] Error fetching data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCostPlusData();
  }, [medicationName, strength, quantity]);

  if (loading) {
    return (
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📦 Cost Plus Drugs (Online)
          </CardTitle>
          <CardDescription>Loading pricing data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !drugData) {
    return (
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📦 Cost Plus Drugs (Online)
          </CardTitle>
          <CardDescription>Not available for this medication</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This medication is not currently available through Cost Plus Drugs.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatted = formatCostPlusDrug(drugData);
  const savings = averageRetailPrice 
    ? calculateCostPlusSavings(formatted.totalPrice || formatted.unitPrice, averageRetailPrice)
    : null;

  return (
    <Card className="border-2 border-purple-200 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📦 Cost Plus Drugs (Online Alternative)
        </CardTitle>
        <CardDescription>
          Transparent pricing • Ships to your home
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="bg-white rounded-lg p-4 border border-purple-200">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                ${formatted.totalPrice?.toFixed(2) || (formatted.unitPrice * quantity).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatted.quantity || quantity} {formatted.form}s
              </div>
            </div>
            {savings && savings.savingsPercent > 0 && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <TrendingDown className="w-4 h-4" />
                  Save {savings.savingsPercent}%
                </div>
                <div className="text-sm text-muted-foreground">
                  vs avg retail
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Unit price: ${formatted.unitPrice.toFixed(2)} per {formatted.form.toLowerCase()}
          </div>
        </div>

        {/* Medication Info */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Medication:</span>
            <span className="font-medium">{formatted.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Strength:</span>
            <span className="font-medium">{formatted.strength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Form:</span>
            <span className="font-medium">{formatted.form}</span>
          </div>
          {formatted.isGeneric && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-green-600">Generic</span>
            </div>
          )}
        </div>

        {/* Pricing Model */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-blue-900 mb-1">
            💡 Transparent Pricing Model
          </div>
          <div className="text-xs text-blue-800">
            Cost Plus Drugs charges: <strong>Drug Cost + 15% + $3 pharmacy fee</strong>
            <br />
            No hidden markups or insurance games.
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={() => window.open(formatted.url, '_blank')}
        >
          Order from Cost Plus Drugs
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          ✅ Real pricing data from Cost Plus Drugs API
        </p>
      </CardContent>
    </Card>
  );
}
