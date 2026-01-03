import { api } from '@/src/lib/apiClient';
import { 
  BookingDto,
  CreateBookingDto,
  BookingAvailabilityDto,
  ApiResponse
} from '@/src/types/api';

export const bookingService = {
  /**
   * Create a new booking
   */
  create: async (data: CreateBookingDto): Promise<ApiResponse<{ booking_id: number; booking_reference: string; booking: BookingDto }>> => {
    return api.post<ApiResponse<{ booking_id: number; booking_reference: string; booking: BookingDto }>>('/bookings', data);
  },

  /**
   * Get all bookings for the current user
   */
  getAll: async (): Promise<ApiResponse<BookingDto[]>> => {
    return api.get<ApiResponse<BookingDto[]>>('/bookings');
  },

  /**
   * Get booking by ID
   */
  getById: async (id: string): Promise<ApiResponse<BookingDto>> => {
    return api.get<ApiResponse<BookingDto>>(`/bookings/${id}`);
  },

  /**
   * Get booking by reference
   */
  getByReference: async (reference: string): Promise<ApiResponse<BookingDto>> => {
    return api.get<ApiResponse<BookingDto>>(`/bookings/reference/${reference}`);
  },

  /**
   * Get tour availability
   */
  getTourAvailability: async (tourId: number): Promise<ApiResponse<BookingAvailabilityDto>> => {
    return api.get<ApiResponse<BookingAvailabilityDto>>(`/bookings/tours/${tourId}/availability`);
  },

  /**
   * Check if user has already booked this tour
   */
  checkUserBooking: async (tourId: number, email?: string): Promise<ApiResponse<{ has_booking: boolean }>> => {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return api.get<ApiResponse<{ has_booking: boolean }>>(`/bookings/tours/${tourId}/check-user-booking${params}`);
  },

  /**
   * Update booking
   */
  update: async (id: string, data: Partial<BookingDto>): Promise<ApiResponse<BookingDto>> => {
    return api.put<ApiResponse<BookingDto>>(`/bookings/${id}`, data);
  },

  /**
   * Cancel booking
   */
  cancel: async (id: string, reason?: string): Promise<ApiResponse<BookingDto>> => {
    return api.post<ApiResponse<BookingDto>>(`/bookings/${id}/cancel`, { reason });
  },

  /**
   * Confirm booking (admin only)
   */
  confirm: async (id: string): Promise<ApiResponse<BookingDto>> => {
    return api.post<ApiResponse<BookingDto>>(`/bookings/${id}/confirm`, {});
  },

  /**
   * Delete booking
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<ApiResponse<void>>(`/bookings/${id}`);
  },
};
