import { useApi } from './useApi';
import { destinationService } from '@/src/services/destinationService';
import { DestinationDto } from '@/src/types/api';

/**
 * Hook to fetch all destinations
 */
export function useDestinations() {
  return useApi<DestinationDto[]>(
    () => destinationService.getAll(),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch a single destination by ID
 */
export function useDestination(id: string | null) {
  return useApi<DestinationDto>(
    () => destinationService.getById(id!),
    { autoFetch: !!id }
  );
}

/**
 * Hook to fetch destination by slug
 */
export function useDestinationBySlug(slug: string | null) {
  return useApi<DestinationDto>(
    () => destinationService.getBySlug(slug!),
    { autoFetch: !!slug }
  );
}

/**
 * Hook to fetch featured destinations
 */
export function useFeaturedDestinations() {
  return useApi<DestinationDto[]>(
    () => destinationService.getFeatured(),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch destinations by country
 */
export function useDestinationsByCountry(country: string | null) {
  return useApi<DestinationDto[]>(
    () => destinationService.getByCountry(country!),
    { autoFetch: !!country }
  );
}
