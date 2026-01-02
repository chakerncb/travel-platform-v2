import { api } from '@/src/lib/apiClient';
import { ImageDto } from '@/src/types/api';

export const imageService = {
  // Destination Images
  /**
   * Get images for destination
   */
  getDestinationImages: async (destinationId: string): Promise<ImageDto[]> => {
    return api.get<ImageDto[]>(`/Image/destination/${destinationId}`);
  },

  /**
   * Upload image for destination
   */
  uploadDestinationImage: async (destinationId: string, file: File): Promise<ImageDto> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<ImageDto>(`/Image/destination/${destinationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Bulk upload images for destination
   */
  bulkUploadDestinationImages: async (destinationId: string, files: File[]): Promise<ImageDto[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return api.post<ImageDto[]>(`/Image/destination/${destinationId}/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Tour Images
  /**
   * Get images for tour
   */
  getTourImages: async (tourId: string): Promise<ImageDto[]> => {
    return api.get<ImageDto[]>(`/Image/tour/${tourId}`);
  },

  /**
   * Upload image for tour
   */
  uploadTourImage: async (tourId: string, file: File): Promise<ImageDto> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<ImageDto>(`/Image/tour/${tourId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Bulk upload images for tour
   */
  bulkUploadTourImages: async (tourId: string, files: File[]): Promise<ImageDto[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return api.post<ImageDto[]>(`/Image/tour/${tourId}/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Hotel Images
  /**
   * Get images for hotel
   */
  getHotelImages: async (hotelId: string): Promise<ImageDto[]> => {
    return api.get<ImageDto[]>(`/Image/hotel/${hotelId}`);
  },

  /**
   * Upload image for hotel
   */
  uploadHotelImage: async (hotelId: string, file: File): Promise<ImageDto> => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<ImageDto>(`/Image/hotel/${hotelId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Bulk upload images for hotel
   */
  bulkUploadHotelImages: async (hotelId: string, files: File[]): Promise<ImageDto[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return api.post<ImageDto[]>(`/Image/hotel/${hotelId}/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Generic Image Operations
  /**
   * Get image by ID
   */
  getById: async (id: string): Promise<ImageDto> => {
    return api.get<ImageDto>(`/Image/${id}`);
  },

  /**
   * Update image
   */
  update: async (id: string, data: { altText?: string; caption?: string }): Promise<ImageDto> => {
    return api.put<ImageDto>(`/Image/${id}`, data);
  },

  /**
   * Delete image
   */
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/Image/${id}`);
  },

  /**
   * Set image as primary
   */
  setPrimary: async (id: string): Promise<ImageDto> => {
    return api.put<ImageDto>(`/Image/${id}/set-primary`, {});
  },

  /**
   * Reorder images
   */
  reorder: async (imageOrders: { imageId: string; displayOrder: number }[]): Promise<ImageDto[]> => {
    return api.put<ImageDto[]>('/Image/reorder', imageOrders);
  },

  // Helper methods
  /**
   * Get images for any entity type
   */
  getByEntity: async (entityType: 'destination' | 'tour' | 'hotel', entityId: string): Promise<ImageDto[]> => {
    switch (entityType) {
      case 'destination':
        return imageService.getDestinationImages(entityId);
      case 'tour':
        return imageService.getTourImages(entityId);
      case 'hotel':
        return imageService.getHotelImages(entityId);
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  },

  /**
   * Upload image for any entity type
   */
  upload: async (entityType: 'destination' | 'tour' | 'hotel', entityId: string, file: File): Promise<ImageDto> => {
    switch (entityType) {
      case 'destination':
        return imageService.uploadDestinationImage(entityId, file);
      case 'tour':
        return imageService.uploadTourImage(entityId, file);
      case 'hotel':
        return imageService.uploadHotelImage(entityId, file);
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  },

  /**
   * Bulk upload images for any entity type
   */
  uploadMultiple: async (entityType: 'destination' | 'tour' | 'hotel', entityId: string, files: File[]): Promise<ImageDto[]> => {
    switch (entityType) {
      case 'destination':
        return imageService.bulkUploadDestinationImages(entityId, files);
      case 'tour':
        return imageService.bulkUploadTourImages(entityId, files);
      case 'hotel':
        return imageService.bulkUploadHotelImages(entityId, files);
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  },

  /**
   * Get image URL (for display)
   */
  getImageUrl: (path?: string): string => {
    if (!path) return '/assets/imgs/placeholder.jpg';
    if (path.startsWith('http')) return path;
    
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:5288/storage';
    return `${storageUrl}/${path}`;
  },

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl: (path?: string): string => {
    if (!path) return '/assets/imgs/placeholder-thumb.jpg';
    if (path.startsWith('http')) return path;
    
    const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:5288/storage';
    return `${storageUrl}/thumbnails/${path}`;
  },
};
