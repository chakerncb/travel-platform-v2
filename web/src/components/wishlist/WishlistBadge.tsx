'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { wishlistService } from '@/src/services';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface WishlistBadgeProps {
  className?: string;
  showCount?: boolean;
}

export const WishlistBadge: React.FC<WishlistBadgeProps> = ({
  className = '',
  showCount = true,
}) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      loadWishlistCount();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const loadWishlistCount = async () => {
    try {
      const wishlist = await wishlistService.getWishlist();
      setCount(wishlist.length);
    } catch (error) {
      console.error('Error loading wishlist count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Link
      href="/wishlist"
      className={`relative inline-flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      aria-label="View wishlist"
    >
      <Heart size={20} />
      {showCount && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
      <span className="hidden md:inline">Wishlist</span>
    </Link>
  );
};
