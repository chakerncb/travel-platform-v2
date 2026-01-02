import { useApi } from './useApi';
import { tourService } from '@/src/services/tourService';
import { TourDto } from '@/src/types/api';

/**
 * Hook to fetch all tours
 */
export function useTours() {
  return useApi<TourDto[]>(
    () => tourService.getAll(),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch a single tour by ID
 */
export function useTour(id: string | null) {
  return useApi<TourDto>(
    () => tourService.getById(id!),
    { autoFetch: !!id }
  );
}

/**
 * Hook to fetch tours by agency
 */
export function useToursByAgency(agencyId: string | null) {
  return useApi<TourDto[]>(
    () => tourService.getByAgency(agencyId!),
    { autoFetch: !!agencyId }
  );
}

/**
 * Hook to fetch user's custom tour requests
 */
export function useMyCustomTours() {
  return useApi<TourDto[]>(
    () => tourService.getMyCustomTours(),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch featured tours
 */
export function useFeaturedTours(limit?: number) {
  return useApi<TourDto[]>(
    () => tourService.getFeatured(limit),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch tours by destination
 */
export function useToursByDestination(destinationId: string | null) {
  return useApi<TourDto[]>(
    () => tourService.getByDestination(destinationId!),
    { autoFetch: !!destinationId }
  );
}

/**
 * Hook to search tours
 */
export function useTourSearch(params: {
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  difficulty?: string;
}) {
  return useApi<TourDto[]>(
    () => tourService.search(params),
    { autoFetch: Object.keys(params).length > 0 }
  );
}
