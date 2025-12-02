import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { searchMedications, MedicationResult } from '@/services/medicationService';
import { logger } from '@/lib/logger';

/**
 * React Query hook for medication search with caching
 * Automatically caches results for 5 minutes and keeps them for 30 minutes
 * Only searches when query is 2+ characters
 * 
 * @param searchTerm - The medication name to search for
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with medication data
 * 
 * @example
 * const { data, isLoading, error } = useMedicationQuery(debouncedSearchTerm);
 */
export function useMedicationQuery(
  searchTerm: string,
  enabled: boolean = true
): UseQueryResult<MedicationResult[], Error> {
  return useQuery({
    queryKey: ['medications', 'search', searchTerm.toLowerCase()],
    queryFn: async () => {
      const startTime = performance.now();
      logger.api('GET', `RxNorm Search: ${searchTerm}`);
      
      const results = await searchMedications(searchTerm);
      
      const duration = performance.now() - startTime;
      logger.perf(`Medication search for "${searchTerm}"`, duration);
      logger.info(`Found ${results.length} medications for "${searchTerm}"`);
      
      return results;
    },
    enabled: enabled && searchTerm.length >= 2, // Only search if 2+ characters
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * React Query hook for getting medication details by RXCUI
 * 
 * @param rxcui - The RxNorm concept unique identifier
 * @param enabled - Whether the query should run (default: true)
 * @returns Query result with medication details
 */
export function useMedicationDetails(
  rxcui: string | null,
  enabled: boolean = true
): UseQueryResult<MedicationResult | null, Error> {
  return useQuery({
    queryKey: ['medications', 'details', rxcui],
    queryFn: async () => {
      if (!rxcui) return null;
      
      logger.api('GET', `RxNorm Details: ${rxcui}`);
      
      // This would call a getMedicationDetails function
      // For now, we'll return null as placeholder
      return null;
    },
    enabled: enabled && !!rxcui,
    staleTime: 10 * 60 * 1000, // 10 minutes - details change less frequently
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Prefetch medication search results
 * Useful for preloading common searches
 * 
 * @param queryClient - React Query client instance
 * @param searchTerm - The medication name to prefetch
 */
export async function prefetchMedicationSearch(
  queryClient: any,
  searchTerm: string
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: ['medications', 'search', searchTerm.toLowerCase()],
    queryFn: () => searchMedications(searchTerm),
    staleTime: 5 * 60 * 1000,
  });
}

export default useMedicationQuery;
