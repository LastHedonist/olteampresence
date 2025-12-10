import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, addMonths, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';
import { LocationStatus, LocationData, UserWithLocations } from './useLocations';

export function useMonthlyLocations(monthOffset: number = 0) {
  const { user } = useAuth();
  const [allUsersLocations, setAllUsersLocations] = useState<UserWithLocations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentMonth = addMonths(new Date(), monthOffset);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Memoize date strings to prevent infinite loops
  const startDateStr = format(monthStart, 'yyyy-MM-dd');
  const endDateStr = format(monthEnd, 'yyyy-MM-dd');

  const fetchLocations = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('*')
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      if (locationsError) throw locationsError;

      // Fetch all active profiles using secure function (excludes email)
      const { data: profilesData, error: profilesError } = await supabase
        .rpc('get_team_profiles');

      if (profilesError) throw profilesError;

      const usersWithLocations: UserWithLocations[] = (profilesData || []).map((profile) => {
        const userLocations: Record<string, LocationData> = {};
        locationsData
          ?.filter((loc) => loc.user_id === profile.id)
          .forEach((loc) => {
            userLocations[loc.date] = {
              status: loc.status as LocationStatus,
              arrival_time: loc.arrival_time,
              departure_time: loc.departure_time,
            };
          });

        return {
          id: profile.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          locations: userLocations,
        };
      });

      setAllUsersLocations(usersWithLocations);
    } catch (error) {
      console.error('Error fetching monthly locations:', error);
      toast.error('Erro ao carregar localizações do mês');
    } finally {
      setIsLoading(false);
    }
  }, [user, startDateStr, endDateStr]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    allUsersLocations,
    isLoading,
    monthDays,
    monthStart,
    monthEnd,
    currentMonth,
    refetch: fetchLocations,
  };
}
