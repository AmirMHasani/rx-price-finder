import { Alert, AlertDescription } from "./ui/alert";
import { Info } from "lucide-react";

export function DataTransparencyBanner() {
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-sm text-blue-900">
        <strong>Data Transparency:</strong> Pharmacy locations are real (via Google Places API). 
        Medication names are real (via RxNorm API). Cost Plus Drugs pricing is real (via API). 
        Local pharmacy prices and insurance copays are <strong>estimates</strong> based on industry data and formulary tiers.
      </AlertDescription>
    </Alert>
  );
}
