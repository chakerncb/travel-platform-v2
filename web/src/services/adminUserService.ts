import { api } from '@/src/lib/apiClient';
import { 
  UserDto, 
  UpdateUserDto 
} from '@/src/types/api';

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  agencyUsers: number;
  regularUsers: number;
}

export const adminUserService = {
  /**
   * Get all users (Admin only)
   */
  getAll: async (): Promise<UserDto[]> => {
    return api.get<UserDto[]>('/admin/users');
  },

  /**
   * Get user by ID (Admin only)
   */
  getById: async (id: string): Promise<UserDto> => {
    return api.get<UserDto>(`/admin/users/${id}`);
  },

  /**
   * Update user (Admin only)
   */
  update: async (id: string, data: UpdateUserDto): Promise<UserDto> => {
    return api.put<UserDto>(`/admin/users/${id}`, data);
  },

  /**
   * Delete user (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/admin/users/${id}`);
  },

  /**
   * Activate user (Admin only)
   */
  activate: async (id: string): Promise<UserDto> => {
    return api.post<UserDto>(`/admin/users/${id}/activate`, {});
  },

  /**
   * Deactivate user (Admin only)
   */
  deactivate: async (id: string): Promise<UserDto> => {
    return api.post<UserDto>(`/admin/users/${id}/deactivate`, {});
  },

  /**
   * Get user statistics (Admin only)
   */
  getStatistics: async (): Promise<UserStatistics> => {
    return api.get<UserStatistics>('/admin/users/statistics');
  },
};
