import { api } from '@/src/lib/apiClient';
import { 
  UserDto, 
  LoginDto, 
  RegisterDto, 
  UpdateUserDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from '@/src/types/api';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginDto): Promise<UserDto> => {
    return api.post<UserDto>('/login', credentials);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterDto): Promise<UserDto> => {
    return api.post<UserDto>('/register', data);
  },

  /**
   * Confirm email
   */
  confirmEmail: async (id: string, hash: string): Promise<{ message: string }> => {
    return api.get<{ message: string }>(`/email/verify/${id}/${hash}`);
  },

  /**
   * Resend confirmation email
   */
  resendConfirmationEmail: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/email/resend');
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserDto> => {
    return api.get<UserDto>('/profile');
  },

  /**
   * Logout (client-side only - NextAuth handles this)
   */
  logout: async (): Promise<void> => {
    return api.post<void>('/logout');
  },
};
  // deleteAccount: async (): Promise<{ message: string }> => {
  //   return api.delete<{ message: string }>('/account');
  // },

