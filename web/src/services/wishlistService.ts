import { api } from '@/src/lib/apiClient';
import {
  WishlistItemDto,
  AddToWishlistDto,
  WishlistCheckDto,
  WishlistItemType
} from '@/src/types/api';

export const wishlistService = {
  /**
   * Get all wishlist items for the authenticated user
   */
  getWishlist: async (): Promise<WishlistItemDto[]> => {
    const response = await api.get<{ data: WishlistItemDto[] }>('/v1/wishlist');
    return response.data;
  },

  /**
   * Add an item to the wishlist
   */
  addToWishlist: async (data: AddToWishlistDto): Promise<WishlistItemDto> => {
    const response = await api.post<{ data: WishlistItemDto }>('/v1/wishlist', data);
    return response.data;
  },

  /**
   * Remove an item from the wishlist by wishlist ID
   */
  removeFromWishlist: async (wishlistId: number): Promise<void> => {
    await api.delete(`/v1/wishlist/${wishlistId}`);
  },

  /**
   * Remove an item from the wishlist by type and item ID
   */
  removeByTypeAndId: async (type: WishlistItemType, id: number): Promise<void> => {
    await api.delete('/v1/wishlist/remove/item', { type, id });
  },

  /**
   * Check if an item is in the wishlist
   */
  checkWishlist: async (type: WishlistItemType, id: number): Promise<boolean> => {
    const response = await api.get<WishlistCheckDto>('/v1/wishlist/check', { type, id });
    return response.in_wishlist;
  },

  /**
   * Toggle wishlist status for an item
   */
  toggleWishlist: async (type: WishlistItemType, id: number): Promise<{ added: boolean }> => {
    const isInWishlist = await wishlistService.checkWishlist(type, id);
    
    if (isInWishlist) {
      await wishlistService.removeByTypeAndId(type, id);
      return { added: false };
    } else {
      await wishlistService.addToWishlist({ type, id });
      return { added: true };
    }
  },
};
