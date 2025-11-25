import { useState, useCallback } from "react";

export interface MedicationResult {
  source: "rxnorm" | "fda";
  rxcui?: string;
  ndc?: string;
  name: string;
  type?: string;
  genericName?: string;
  manufacturer?: string;
}

export interface MedicationDetails {
  rxcui: string;
  name: string;
  dosages: string[];
  forms: string[];
  strengths: string[];
}

export function useMedicationSearch() {
  const [results, setResults] = useState<MedicationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/medications/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error("Failed to search medications");
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetails = useCallback(async (rxcui: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/medications/${rxcui}/details`);

      if (!response.ok) {
        throw new Error("Failed to get medication details");
      }

      const data = await response.json();
      return data.medication as MedicationDetails;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAlternatives = useCallback(async (brandName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/medications/alternatives?brandName=${encodeURIComponent(brandName)}`
      );

      if (!response.ok) {
        throw new Error("Failed to get alternatives");
      }

      const data = await response.json();
      return data.alternatives || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    search,
    getDetails,
    getAlternatives,
  };
}
