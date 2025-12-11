import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfWeek, endOfWeek, addWeeks, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';
import { validateNotes } from '@/lib/validation';

export type LocationStatus = 'office' | 'home_office' | 'corporate_travel' | 'day_off' | 'vacation';

export interface Location {
  id: string;
  user_id: string;
  date: string;
  status: LocationStatus;
  notes: string | null;
  arrival_time: string | null;
  departure_time: string | null;
}

export type ResourceGroup = 'head' | 'lead' | 'equipe';

export interface LocationData {
  status: LocationStatus;
  arrival_time?: string | null;
  departure_time?: string | null;
}

export interface UserWithLocations {
  id: string;
  full_name: string;
  avatar_url: string | null;
  resource_group: ResourceGroup;
  locations: Record<string, LocationData>;
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
          resource_group: profile.resource_group as ResourceGroup,
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

  const updateLocation = async (date: Date, status: LocationStatus, notes?: string, arrivalTime?: string, departureTime?: string) => {
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
          .update({ 
            status, 
            notes: sanitizedNotes, 
            arrival_time: status === 'office' ? arrivalTime : null,
            departure_time: status === 'office' ? departureTime : null,
            updated_at: new Date().toISOString() 
          })
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
            arrival_time: status === 'office' ? arrivalTime : null,
            departure_time: status === 'office' ? departureTime : null,
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

  const deleteLocation = async (date: Date) => {
    if (!user) return;

    const dateStr = format(date, 'yyyy-MM-dd');

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('user_id', user.id)
        .eq('date', dateStr);

      if (error) throw error;

      toast.success('Disponibilidade removida');
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Erro ao remover disponibilidade');
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
    deleteLocation,
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
    corporate_travel: {
      label: 'Viagem Corporativa',
      shortLabel: 'Viagem',
      color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      icon: 'Briefcase',
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
  { value: 'corporate_travel', label: 'Viagem Corporativa' },
  { value: 'day_off', label: 'Day Off' },
  { value: 'vacation', label: 'Férias' },
];
