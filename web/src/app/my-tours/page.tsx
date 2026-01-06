import { UserToursPage } from '@/src/components/user-tours';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Tours | Eco Travel',
  description: 'View your booked tours and travel history',
};

export default function MyTours() {
  return <UserToursPage />;
}
