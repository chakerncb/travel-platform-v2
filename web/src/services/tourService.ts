import { api } from '@/src/lib/apiClient';
import { 
  TourDto,
  TourApiResponse,
  CreateTourRequestDto, 
  UpdateTourRequestDto,
  CustomTourRequestDto,
  TourStatus,
  PaginatedResponse
} from '@/src/types/api';

export const tourService = {
  /**
   * Get all tours
   */
  getAll: async (): Promise<TourApiResponse[]> => {
    const response = await api.get<TourApiResponse[]>('/v1/tours');
    return response;
  },

  /**
   * Get tour by ID
   */
  getById: async (id: string, includeBookingStats: boolean = true): Promise<TourDto> => {
    const params = includeBookingStats ? '?include_booking_stats=1' : '';
    return api.get<TourDto>(`/v1/tours/${id}${params}`);
  },

  /**
   * Get featured tours
   */
  getFeatured: async (limit?: number): Promise<TourApiResponse[]> => {
    const tours = await api.get<TourApiResponse[]>('/v1/tours');
    const featured = tours
      .filter(t => t.is_active)
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
    
    return limit ? featured.slice(0, limit) : featured;
  },

  /**
   * Get tours by destination
   */
  getByDestination: async (destinationId: string): Promise<TourDto[]> => {
    const tours = await api.get<TourDto[]>('/v1/tours');
    return tours.filter(t => 
      t.is_active && 
      t.destinations?.some(d => d.id === parseInt(destinationId))
    );
  },

  /**
   * Search tours
   */
  search: async (params: {
    destination?: string;
    minPrice?: number;
    maxPrice?: number;
    minDuration?: number;
    maxDuration?: number;
    difficulty?: string;
  }): Promise<TourDto[]> => {
    const queryParams = new URLSearchParams();
    
    if (params.destination) queryParams.append('search', params.destination);
    if (params.minPrice) queryParams.append('min_price', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('max_price', params.maxPrice.toString());
    if (params.minDuration) queryParams.append('min_duration', params.minDuration.toString());
    if (params.maxDuration) queryParams.append('max_duration', params.maxDuration.toString());
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);

    return api.get<TourDto[]>(`/v1/tours?${queryParams.toString()}`);
  },

  /**
   * Create tour (Agency/Admin only)
   */
  create: async (data: CreateTourRequestDto): Promise<TourDto> => {
    return api.post<TourDto>('/v1/tours', data);
  },

  /**
   * Update tour (Agency/Admin only)
   */
  update: async (id: string, data: UpdateTourRequestDto): Promise<TourDto> => {
    return api.put<TourDto>(`/v1/tours/${id}`, data);
  },

  /**
   * Delete tour (Agency/Admin only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/v1/tours/${id}`);
  },

  // Tour Destinations
  /**
   * Get tour destinations
   */
  getDestinations: async (tourId: string): Promise<any[]> => {
    return api.get<any[]>(`/v1/tours/${tourId}/destinations`);
  },

  /**
   * Add destination to tour
   */
  addDestination: async (tourId: string, destinationId: string): Promise<void> => {
    return api.post<void>(`/v1/tours/${tourId}/destinations`, { destinationId });
  },

  /**
   * Remove destination from tour
   */
  removeDestination: async (tourId: string, destinationId: string): Promise<void> => {
    return api.delete<void>(`/v1/tours/${tourId}/destinations/${destinationId}`);
  },

  // Tour Hotels
  /**
   * Get tour hotels
   */
  getHotels: async (tourId: string): Promise<any[]> => {
    return api.get<any[]>(`/v1/tours/${tourId}/hotels`);
  },

  /**
   * Add hotel to tour
   */
  addHotel: async (tourId: string, hotelId: string): Promise<void> => {
    return api.post<void>(`/v1/tours/${tourId}/hotels`, { hotelId });
  },

  /**
   * Remove hotel from tour
   */
  removeHotel: async (tourId: string, hotelId: string): Promise<void> => {
    return api.delete<void>(`/v1/tours/${tourId}/hotels/${hotelId}`);
  },
};
