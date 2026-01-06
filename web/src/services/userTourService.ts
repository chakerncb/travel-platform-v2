import { api } from '@/src/lib/apiClient';
import { UserTourDto } from '@/src/types/api';

export const userTourService = {
  /**
   * Get all tours for the authenticated user
   */
  getAllTours: async (): Promise<UserTourDto[]> => {
    const response = await api.get<{ data: UserTourDto[] }>('/v1/user/tours');
    return response.data;
  },

  /**
   * Get upcoming tours for the authenticated user
   */
  getUpcomingTours: async (): Promise<UserTourDto[]> => {
    const response = await api.get<{ data: UserTourDto[] }>('/v1/user/tours/upcoming');
    return response.data;
  },

  /**
   * Get past tours for the authenticated user
   */
  getPastTours: async (): Promise<UserTourDto[]> => {
    const response = await api.get<{ data: UserTourDto[] }>('/v1/user/tours/past');
    return response.data;
  },
};
