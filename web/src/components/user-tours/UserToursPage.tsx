'use client';

import React, { useEffect, useState } from 'react';
import { userTourService } from '@/src/services';
import { UserTourDto } from '@/src/types/api';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface UserToursPageProps {
  filter?: 'all' | 'upcoming' | 'past';
}

export const UserToursPage: React.FC<UserToursPageProps> = ({ filter = 'all' }) => {
  const [tours, setTours] = useState<UserTourDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>(filter);

  useEffect(() => {
    loadTours();
  }, [activeTab]);

  const loadTours = async () => {
    try {
      setIsLoading(true);
      let data: UserTourDto[];
      
      switch (activeTab) {
        case 'upcoming':
          data = await userTourService.getUpcomingTours();
          break;
        case 'past':
          data = await userTourService.getPastTours();
          break;
        default:
          data = await userTourService.getAllTours();
      }
      
      setTours(data || []);
    } catch (err) {
      setError('Failed to load tours');
      console.error('Error loading tours:', err);
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <h1 className="text-3xl font-bold mb-8">My Tours</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Tours
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'past'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past Tours
        </button>
      </div>

      {!tours || tours.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tours found</p>
          <Link
            href="/tours"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Explore Tours
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {tours.map((userTour) => (
            <div
              key={userTour.booking_id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="md:flex">
                {/* Tour image */}
                <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-200">
                  {userTour.tour.destinations && userTour.tour.destinations[0]?.primary_image && (
                    <Image
                      src={
                        userTour.tour.destinations[0].primary_image.image_path ||
                        '/placeholder.jpg'
                      }
                      alt={userTour.tour.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Tour details */}
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{userTour.tour.title}</h2>
                      <p className="text-sm text-gray-500">
                        Booking Reference: {userTour.booking_reference}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          userTour.booking_status
                        )}`}
                      >
                        {userTour.booking_status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                          userTour.payment_status
                        )}`}
                      >
                        {userTour.payment_status}
                      </span>
                    </div>
                  </div>

                  {userTour.tour.short_description && (
                    <p className="text-gray-600 mb-4">{userTour.tour.short_description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>
                        {new Date(userTour.start_date).toLocaleDateString()} -{' '}
                        {new Date(userTour.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      <span>{userTour.tour.duration_days} days</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2" />
                      <span>
                        {userTour.adults_count} adult(s), {userTour.children_count} child(ren)
                      </span>
                    </div>

                    <div className="flex items-center text-sm font-semibold text-primary">
                      <DollarSign size={16} className="mr-1" />
                      <span>{userTour.total_price}</span>
                    </div>
                  </div>

                  {userTour.tour.destinations && userTour.tour.destinations.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={16} className="mr-2" />
                        <span className="font-medium">Destinations:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userTour.tour.destinations.map((dest) => (
                          <span
                            key={dest.id}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {dest.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link
                      href={`/bookings/${userTour.booking_reference}`}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/tours/${userTour.tour.id}`}
                      className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      View Tour
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
