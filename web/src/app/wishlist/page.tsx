import { WishlistPage } from '@/src/components/wishlist';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Wishlist | Eco Travel',
  description: 'View and manage your saved tours, destinations, and hotels',
};

export default function Wishlist() {
  return <WishlistPage />;
}
