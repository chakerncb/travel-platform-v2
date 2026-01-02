import { useApi } from './useApi';
import { hotelService } from '@/src/services/hotelService';
import { HotelDto, HotelSearchParams } from '@/src/types/api';

/**
 * Hook to fetch all hotels
 */
export function useHotels() {
  return useApi<HotelDto[]>(
    () => hotelService.getAll(),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch a single hotel by ID
 */
export function useHotel(id: string | null) {
  return useApi<HotelDto>(
    () => hotelService.getById(id!),
    { autoFetch: !!id }
  );
}

/**
 * Hook to fetch hotels by destination
 */
export function useHotelsByDestination(destinationId: string | null) {
  return useApi<HotelDto[]>(
    () => hotelService.getByDestination(destinationId!),
    { autoFetch: !!destinationId }
  );
}

/**
 * Hook to search hotels
 */
export function useHotelSearch(params: HotelSearchParams) {
  return useApi<HotelDto[]>(
    () => hotelService.search(params),
    { autoFetch: Object.keys(params).length > 0 }
  );
}

/**
 * Hook to fetch featured hotels
 */
export function useFeaturedHotels(limit?: number) {
  return useApi<HotelDto[]>(
    () => hotelService.getFeatured(limit),
    { autoFetch: true }
  );
}

/**
 * Hook to fetch hotels by city
 */
export function useHotelsByCity(city: string | null) {
  return useApi<HotelDto[]>(
    () => hotelService.getByCity(city!),
    { autoFetch: !!city }
  );
}
