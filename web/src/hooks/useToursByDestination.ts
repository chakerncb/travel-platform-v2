import { useApi } from './useApi';
import { tourService } from '@/src/services/tourService';
import { TourDto } from '@/src/types/api';

/**
 * Hook to fetch tours that contain a specific destination
 */
export function useToursByDestination(destinationId: string | null) {
  return useApi<TourDto[]>(
    () => tourService.getByDestination(destinationId!),
    { autoFetch: !!destinationId, initialData: [] }
  );
}
