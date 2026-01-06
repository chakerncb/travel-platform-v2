'use client';

import React, { useEffect, useState } from 'react';
import { wishlistService } from '@/src/services';
import { WishlistItemDto, WishlistItemType } from '@/src/types/api';
import { Trash2, MapPin, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data || []);
    } catch (err) {
      setError('Failed to load wishlist');
      console.error('Error loading wishlist:', err);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (wishlistId: number) => {
    try {
      await wishlistService.removeFromWishlist(wishlistId);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const getItemLink = (item: WishlistItemDto) => {
    const type = item.type.toLowerCase();
    return `/${type}s/${item.item.id}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {!wishlist || wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link
            href="/tours"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((wishlistItem) => (
            <div
              key={wishlistItem.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={getItemLink(wishlistItem)}>
                <div className="relative h-48 bg-gray-200">
                  {wishlistItem.item.primary_image && (
                    <Image
                      src={wishlistItem.item.primary_image.image_path || '/placeholder.jpg'}
                      alt={wishlistItem.item.title || wishlistItem.item.name || ''}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                    {wishlistItem.type}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {wishlistItem.item.title || wishlistItem.item.name}
                  </h3>

                  {wishlistItem.item.short_description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {wishlistItem.item.short_description}
                    </p>
                  )}

                  <div className="space-y-2">
                    {wishlistItem.item.city && wishlistItem.item.country && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={16} className="mr-2" />
                        {wishlistItem.item.city}, {wishlistItem.item.country}
                      </div>
                    )}

                    {wishlistItem.type === WishlistItemType.Tour && (
                      <>
                        {wishlistItem.item.duration_days && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-2" />
                            {wishlistItem.item.duration_days} days
                          </div>
                        )}
                        {wishlistItem.item.price && (
                          <div className="flex items-center text-sm font-semibold text-primary">
                            <DollarSign size={16} className="mr-1" />
                            {wishlistItem.item.price}
                          </div>
                        )}
                      </>
                    )}

                    {wishlistItem.type === WishlistItemType.Hotel && (
                      <>
                        {wishlistItem.item.star_rating && (
                          <div className="flex items-center text-sm text-yellow-500">
                            {'⭐'.repeat(wishlistItem.item.star_rating)}
                          </div>
                        )}
                        {wishlistItem.item.price_per_night && (
                          <div className="flex items-center text-sm font-semibold text-primary">
                            <DollarSign size={16} className="mr-1" />
                            {wishlistItem.item.price_per_night}/night
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Link>

              <div className="px-4 pb-4">
                <button
                  onClick={() => handleRemove(wishlistItem.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
