import { api } from '@/src/lib/apiClient';
import { 
  DestinationDto, 
  CreateDestinationDto, 
  UpdateDestinationDto,
  PaginatedResponse
} from '@/src/types/api';

export const destinationService = {
  /**
   * Get all destinations
   */
  getAll: async (): Promise<DestinationDto[]> => {
    const destinations = await api.get<DestinationDto[]>('/v1/destinations');
    return destinations;
  },

  /**
   * Get destination by ID
   */
  getById: async (id: string): Promise<DestinationDto> => {
    return api.get<DestinationDto>(`/v1/destinations/${id}`);
  },

  /**
   * Get featured destinations
   */
  getFeatured: async (): Promise<DestinationDto[]> => {
    const destinations = await api.get<DestinationDto[]>('/v1/destinations');
    // Filter for active destinations only since is_featured doesn't exist in API
    return destinations.filter(d => d.is_active);
  },

  /**
   * Search destinations
   */
  search: async (query: string): Promise<DestinationDto[]> => {
    const destinations = await api.get<DestinationDto[]>(`/v1/destinations?search=${encodeURIComponent(query)}`);
    return destinations;
  },

  /**
   * Get destinations by country
   */
  getByCountry: async (country: string): Promise<DestinationDto[]> => {
    const destinations = await api.get<DestinationDto[]>(`/v1/destinations?country=${encodeURIComponent(country)}`);
    return destinations;
  },

  // Admin endpoints
  /**
   * Create new destination (Admin only)
   */
  create: async (data: CreateDestinationDto): Promise<DestinationDto> => {
    return api.post<DestinationDto>('/v1/destinations', data);
  },

  /**
   * Update destination (Admin only)
   */
  update: async (id: string, data: UpdateDestinationDto): Promise<DestinationDto> => {
    return api.put<DestinationDto>(`/v1/destinations/${id}`, data);
  },

  /**
   * Delete destination (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/v1/destinations/${id}`);
  },
};
