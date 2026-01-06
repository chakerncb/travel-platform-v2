'use client';

import { useState, useEffect } from 'react';
import { userTourService } from '@/src/services';
import { UserTourDto } from '@/src/types/api';
import { useSession } from 'next-auth/react';

type TourFilter = 'all' | 'upcoming' | 'past';

export const useUserTours = (filter: TourFilter = 'all') => {
  const [tours, setTours] = useState<UserTourDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      loadTours();
    } else {
      setIsLoading(false);
    }
  }, [session, filter]);

  const loadTours = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data: UserTourDto[];
      
      switch (filter) {
        case 'upcoming':
          data = await userTourService.getUpcomingTours();
          break;
        case 'past':
          data = await userTourService.getPastTours();
          break;
        default:
          data = await userTourService.getAllTours();
      }
      
      setTours(data);
    } catch (err) {
      setError('Failed to load tours');
      console.error('Error loading tours:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = () => {
    loadTours();
  };

  return {
    tours,
    isLoading,
    error,
    refresh,
    isAuthenticated: !!session,
  };
};
