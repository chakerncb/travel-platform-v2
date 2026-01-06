'use client';

import { useState, useEffect } from 'react';
import { wishlistService } from '@/src/services';
import { WishlistItemType } from '@/src/types/api';
import { useSession } from 'next-auth/react';

export const useWishlist = (type: WishlistItemType, itemId: number) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      checkWishlistStatus();
    } else {
      setIsChecking(false);
    }
  }, [session, type, itemId]);

  const checkWishlistStatus = async () => {
    try {
      setIsChecking(true);
      const inWishlist = await wishlistService.checkWishlist(type, itemId);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const toggle = async () => {
    if (!session) {
      return false;
    }

    setIsLoading(true);
    try {
      const result = await wishlistService.toggleWishlist(type, itemId);
      setIsInWishlist(result.added);
      return result.added;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return isInWishlist;
    } finally {
      setIsLoading(false);
    }
  };

  const add = async () => {
    if (!session) {
      return false;
    }

    setIsLoading(true);
    try {
      await wishlistService.addToWishlist({ type, id: itemId });
      setIsInWishlist(true);
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async () => {
    if (!session) {
      return false;
    }

    setIsLoading(true);
    try {
      await wishlistService.removeByTypeAndId(type, itemId);
      setIsInWishlist(false);
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInWishlist,
    isLoading,
    isChecking,
    toggle,
    add,
    remove,
    isAuthenticated: !!session,
  };
};
