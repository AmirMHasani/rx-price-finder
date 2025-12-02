import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Info } from 'lucide-react';
import { searchNADACPricing, formatNADACData, calculatePharmacyMarkup, getMarkupIndicator, type NADACRecord } from '@/services/nadacApi';

interface PharmacyTransparencyCardProps {
  medicationName: string;
  averageRetailPrice: number;
  lowestRetailPrice: number;
  highestRetailPrice: number;
}

export function PharmacyTransparencyCard({ 
  medicationName, 
  averageRetailPrice,
  lowestRetailPrice,
  highestRetailPrice 
}: PharmacyTransparencyCardProps) {
  const [loading, setLoading] = useState(true);
  const [nadacData, setNadacData] = useState<NADACRecord | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchNADACData() {
      setLoading(true);
      setError(false);
      
      try {
        const result = await searchNADACPricing(medicationName);
        
        if (result) {
          setNadacData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching NADAC data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchNADACData();
  }, [medicationName]);

  if (loading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Price Transparency
          </CardTitle>
          <CardDescription>Loading pharmacy cost data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !nadacData) {
    return null; // Don't show card if data is unavailable
  }

  const formatted = formatNADACData(nadacData);
  const avgMarkup = calculatePharmacyMarkup(averageRetailPrice, formatted.pricePerUnit);
  const lowMarkup = calculatePharmacyMarkup(lowestRetailPrice, formatted.pricePerUnit);
  const highMarkup = calculatePharmacyMarkup(highestRetailPrice, formatted.pricePerUnit);
  
  const avgIndicator = getMarkupIndicator(avgMarkup.markupPercent);

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          💡 Price Transparency
        </CardTitle>
        <CardDescription>
          Understanding pharmacy pricing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pharmacy Acquisition Cost */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <div className="text-sm font-semibold text-blue-900 mb-2">
            Pharmacy Acquisition Cost (NADAC)
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-blue-600">
              ${formatted.pricePerUnit.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">
              per {formatted.pricingUnit}
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            This is what pharmacies pay wholesalers for this medication
          </div>
          <div className="text-xs text-muted-foreground">
            Data from: {formatted.effectiveDate}
          </div>
        </div>

        {/* Markup Analysis */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-foreground">
            Pharmacy Markup Analysis
          </div>
          
          {/* Average Markup */}
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Average Retail Price:</span>
              <span className="font-semibold">${averageRetailPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Markup:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{avgMarkup.markupPercent}%</span>
                <Badge variant="secondary" className={avgIndicator.color}>
                  {avgIndicator.icon} {avgIndicator.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-lg p-3 border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Lowest Price:</span>
              <div className="text-right">
                <div className="font-semibold">${lowestRetailPrice.toFixed(2)}</div>
                <div className="text-xs text-green-600">+{lowMarkup.markupPercent}% markup</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Highest Price:</span>
              <div className="text-right">
                <div className="font-semibold">${highestRetailPrice.toFixed(2)}</div>
                <div className="text-xs text-orange-600">+{highMarkup.markupPercent}% markup</div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-amber-900 mb-1">
            💡 Why do prices vary?
          </div>
          <div className="text-xs text-amber-800 space-y-1">
            <p>• Different pharmacies apply different markup percentages</p>
            <p>• Chain pharmacies typically markup 200-400% above cost</p>
            <p>• Online pharmacies often have lower markups (150-250%)</p>
            <p>• Your insurance negotiates discounts off retail prices</p>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          ✅ Real data from CMS NADAC (National Average Drug Acquisition Cost)
        </p>
      </CardContent>
    </Card>
  );
}
