import { useApi } from './useApi';
import { hotelService } from '@/src/services/hotelService';
import { HotelDto } from '@/src/types/api';

/**
 * Hook to fetch hotels in a specific city
 */
export function useHotelsByCity(city: string | null) {
  return useApi<HotelDto[]>(
    () => hotelService.getByCity(city!),
    { autoFetch: !!city, initialData: [] }
  );
}
