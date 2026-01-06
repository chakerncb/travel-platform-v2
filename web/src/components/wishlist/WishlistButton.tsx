'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { WishlistItemType } from '@/src/types/api';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/src/hooks/useWishlist';

interface WishlistButtonProps {
  type: WishlistItemType;
  itemId: number;
  className?: string;
  iconSize?: number;
  showLabel?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  type,
  itemId,
  className = '',
  iconSize = 20,
  showLabel = false,
}) => {
  const router = useRouter();
  const { isInWishlist, isLoading, isChecking, toggle, isAuthenticated } = useWishlist(type, itemId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    await toggle();
  };

  if (isChecking) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 p-2 rounded-full transition-all duration-200 bg-gray-100 ${className}`}
      >
        <Heart size={iconSize} className="text-gray-400" />
        {showLabel && <span className="text-sm">Loading...</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isInWishlist
          ? 'text-red-500 bg-red-50'
          : 'text-gray-500 bg-white hover:bg-gray-50'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSize}
        fill={isInWishlist ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};
