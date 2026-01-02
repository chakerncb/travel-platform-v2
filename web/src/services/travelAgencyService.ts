import { api } from '@/src/lib/apiClient';
import { 
  TravelAgencyDto, 
  CreateTravelAgencyDto, 
  UpdateTravelAgencyDto 
} from '@/src/types/api';

export const travelAgencyService = {
  // Public endpoints
  /**
   * Get travel agency by ID
   */
  getById: async (id: string): Promise<TravelAgencyDto> => {
    return api.get<TravelAgencyDto>(`/travel-agencies/${id}`);
  },

  /**
   * Update travel agency
   */
  update: async (id: string, data: UpdateTravelAgencyDto): Promise<TravelAgencyDto> => {
    return api.put<TravelAgencyDto>(`/travel-agencies/${id}`, data);
  },

  /**
   * Delete travel agency
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/travel-agencies/${id}`);
  },

  /**
   * Get travel agencies by user ID
   */
  getByUserId: async (userId: string): Promise<TravelAgencyDto[]> => {
    return api.get<TravelAgencyDto[]>(`/travel-agencies/user/${userId}`);
  },

  /**
   * Create travel agency for user
   */
  create: async (userId: string, data: CreateTravelAgencyDto): Promise<TravelAgencyDto> => {
    return api.post<TravelAgencyDto>(`/travel-agencies/${userId}`, data);
  },

  
  // Admin endpoints
  /**
   * Get all travel agencies (Admin only)
   */
  getAllAdmin: async (): Promise<TravelAgencyDto[]> => {
    return api.get<TravelAgencyDto[]>('/admin/travel-agencies');
  },

  /**
   * Get verified travel agencies (Admin only)
   */
  getVerifiedAdmin: async (): Promise<TravelAgencyDto[]> => {
    return api.get<TravelAgencyDto[]>('/admin/travel-agencies/verified');
  },

  /**
   * Get travel agency by ID (Admin only)
   */
  getByIdAdmin: async (id: string): Promise<TravelAgencyDto> => {
    return api.get<TravelAgencyDto>(`/admin/travel-agencies/${id}`);
  },

  /**
   * Update travel agency (Admin only)
   */
  updateAdmin: async (id: string, data: UpdateTravelAgencyDto): Promise<TravelAgencyDto> => {
    return api.put<TravelAgencyDto>(`/admin/travel-agencies/${id}`, data);
  },

  /**
   * Delete travel agency (Admin only)
   */
  deleteAdmin: async (id: string): Promise<void> => {
    return api.delete<void>(`/admin/travel-agencies/${id}`);
  },

  /**
   * Get travel agencies by user ID (Admin only)
   */
  getByUserIdAdmin: async (userId: string): Promise<TravelAgencyDto[]> => {
    return api.get<TravelAgencyDto[]>(`/admin/travel-agencies/user/${userId}`);
  },

  /**
   * Create travel agency for user (Admin only)
   */
  createAdmin: async (userId: string, data: CreateTravelAgencyDto): Promise<TravelAgencyDto> => {
    return api.post<TravelAgencyDto>(`/admin/travel-agencies/${userId}`, data);
  },

  /**
   * Verify travel agency (Admin only)
   */
  verifyAdmin: async (id: string): Promise<TravelAgencyDto> => {
    return api.patch<TravelAgencyDto>(`/admin/travel-agencies/${id}/verify`);
  },
};
