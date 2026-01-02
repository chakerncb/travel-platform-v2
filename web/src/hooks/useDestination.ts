import { useApi } from './useApi';
import { destinationService } from '@/src/services/destinationService';
import { DestinationDto } from '@/src/types/api';

/**
 * Hook to fetch a single destination by ID
 */
export function useDestination(id: string | null) {
  return useApi<DestinationDto>(
    () => destinationService.getById(id!),
    { autoFetch: !!id }
  );
}
