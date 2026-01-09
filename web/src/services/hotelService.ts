import { api } from '@/src/lib/apiClient';
import { 
  HotelDto, 
  CreateHotelDto, 
  UpdateHotelDto,
  HotelSearchParams 
} from '@/src/types/api';

export const hotelService = {
  /**
   * Get all hotels
   */
  getAll: async (): Promise<HotelDto[]> => {
    return api.get<HotelDto[]>('/v1/hotels');
  },

  /**
   * Get hotel by ID
   */
  getById: async (id: string): Promise<HotelDto> => {
    return api.get<HotelDto>(`/v1/hotels/${id}`);
  },

  /**
   * Search hotels
   */
  search: async (params: HotelSearchParams): Promise<HotelDto[]> => {
    const queryParams = new URLSearchParams();
    
    if (params.city) queryParams.append('city', params.city);
    if (params.minStarRating) queryParams.append('star_rating', params.minStarRating.toString());
    if (params.maxPrice) queryParams.append('max_price', params.maxPrice.toString());
    if (params.name) queryParams.append('search', params.name);

    return api.get<HotelDto[]>(`/v1/hotels?${queryParams.toString()}`);
  },

  /**
   * Get featured hotels
   */
  getFeatured: async (limit?: number): Promise<HotelDto[]> => {
    const hotels = await api.get<HotelDto[]>('/v1/hotels');
    const featured = hotels
      .filter(h => h.rating >= 4.0)
      .sort((a, b) => b.rating - a.rating);
    
    return limit ? featured.slice(0, limit) : featured;
  },

  /**
   * Get top rated hotels
   */
  getTopRated: async (limit: number = 6): Promise<HotelDto[]> => {
    return api.get<HotelDto[]>(`/v1/hotels?top_rated=true&limit=${limit}`);
  },

  /**
   * Get hotels by city
   */
  getByCity: async (city: string): Promise<HotelDto[]> => {
    return hotelService.search({ city });
  },

  /**
   * Get hotels by star rating
   */
  getByStarRating: async (minRating: number): Promise<HotelDto[]> => {
    return hotelService.search({ minStarRating: minRating });
  },

  // Admin endpoints
  /**
   * Create new hotel (Admin only)
   */
  create: async (data: CreateHotelDto): Promise<HotelDto> => {
    return api.post<HotelDto>('/v1/hotels', data);
  },

  /**
   * Update hotel (Admin only)
   */
  update: async (id: string, data: UpdateHotelDto): Promise<HotelDto> => {
    return api.put<HotelDto>(`/v1/hotels/${id}`, data);
  },

  /**
   * Delete hotel (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/v1/hotels/${id}`);
  },
};
