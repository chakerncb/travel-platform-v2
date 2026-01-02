import { useApi } from './useApi';
import { travelAgencyService } from '@/src/services/travelAgencyService';
import { TravelAgencyDto } from '@/src/types/api';

/**
 * Hook to fetch all travel agencies
 */
export function useTravelAgencies() {
  return useApi<TravelAgencyDto[]>(
    () => travelAgencyService.getAll(),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch a single travel agency by ID
 */
export function useTravelAgency(id: string | null) {
  return useApi<TravelAgencyDto>(
    () => travelAgencyService.getById(id!),
    { autoFetch: !!id }
  );
}

/**
 * Hook to fetch travel agency by slug
 */
export function useTravelAgencyBySlug(slug: string | null) {
  return useApi<TravelAgencyDto>(
    () => travelAgencyService.getBySlug(slug!),
    { autoFetch: !!slug }
  );
}

/**
 * Hook to fetch verified agencies
 */
export function useVerifiedAgencies() {
  return useApi<TravelAgencyDto[]>(
    () => travelAgencyService.getVerified(),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch top rated agencies
 */
export function useTopRatedAgencies(limit?: number) {
  return useApi<TravelAgencyDto[]>(
    () => travelAgencyService.getTopRated(limit),
    { autoFetch: true }
  );
}

/**
 * Hook to search agencies
 */
export function useAgencySearch(params: {
  city?: string;
  specialization?: string;
  minRating?: number;
}) {
  return useApi<TravelAgencyDto[]>(
    () => travelAgencyService.search(params),
    { autoFetch: Object.keys(params).length > 0 }
  );
}

/**
 * Hook to fetch agency by user ID
 */
export function useAgencyByUserId(userId: string | null) {
  return useApi<TravelAgencyDto>(
    () => travelAgencyService.getByUserId(userId!),
    { autoFetch: !!userId }
  );
}
