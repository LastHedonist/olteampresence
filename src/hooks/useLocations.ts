import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfWeek, endOfWeek, addWeeks, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';
import { validateNotes } from '@/lib/validation';

export type LocationStatus = 'office' | 'home_office' | 'day_off' | 'vacation';

export interface Location {
  id: string;
  user_id: string;
  date: string;
  status: LocationStatus;
  notes: string | null;
}

export interface UserWithLocations {
  id: string;
  full_name: string;
  avatar_url: string | null;
  locations: Record<string, LocationStatus>;
}

export function useLocations(weekOffset: number = 0) {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [allUsersLocations, setAllUsersLocations] = useState<UserWithLocations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Memoize date strings to prevent infinite loops
  const startDateStr = format(weekStart, 'yyyy-MM-dd');
  const endDateStr = format(weekEnd, 'yyyy-MM-dd');

  const fetchLocations = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch all locations for the week
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

      // Combine profiles with their locations
      const usersWithLocations: UserWithLocations[] = profilesData.map((profile) => {
        const userLocations: Record<string, LocationStatus> = {};
        locationsData
          ?.filter((loc) => loc.user_id === profile.id)
          .forEach((loc) => {
            userLocations[loc.date] = loc.status as LocationStatus;
          });

        return {
          id: profile.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          locations: userLocations,
        };
      });

      setAllUsersLocations(usersWithLocations);
      setLocations(locationsData || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Erro ao carregar localizações');
    } finally {
      setIsLoading(false);
    }
  }, [user, startDateStr, endDateStr]);

  const updateLocation = async (date: Date, status: LocationStatus, notes?: string) => {
    if (!user) return;

    const dateStr = format(date, 'yyyy-MM-dd');

    // Validate and sanitize notes input
    const notesValidation = validateNotes(notes);
    if (!notesValidation.isValid) {
      toast.error(notesValidation.error || 'Notas inválidas');
      return;
    }
    const sanitizedNotes = notesValidation.sanitized;

    try {
      // Check if location exists
      const { data: existing } = await supabase
        .from('locations')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('locations')
          .update({ status, notes: sanitizedNotes, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('locations')
          .insert({
            user_id: user.id,
            date: dateStr,
            status,
            notes: sanitizedNotes,
          });

        if (error) throw error;
      }

      toast.success('Disponibilidade atualizada');
      fetchLocations();
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Erro ao atualizar disponibilidade');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    allUsersLocations,
    isLoading,
    weekDays,
    weekStart,
    weekEnd,
    updateLocation,
    refetch: fetchLocations,
  };
}

export function getStatusConfig(status: LocationStatus) {
  const configs = {
    office: {
      label: 'Escritório',
      shortLabel: 'Escritório',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      icon: 'Building2',
    },
    home_office: {
      label: 'Home Office',
      shortLabel: 'Home',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      icon: 'Home',
    },
    day_off: {
      label: 'Day Off',
      shortLabel: 'Folga',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      icon: 'Coffee',
    },
    vacation: {
      label: 'Férias',
      shortLabel: 'Férias',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      icon: 'Plane',
    },
  };
  return configs[status];
}

export const STATUS_OPTIONS: { value: LocationStatus; label: string }[] = [
  { value: 'office', label: 'Escritório' },
  { value: 'home_office', label: 'Home Office' },
  { value: 'day_off', label: 'Day Off' },
  { value: 'vacation', label: 'Férias' },
];
