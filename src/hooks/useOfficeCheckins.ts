import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

export interface OfficeCheckin {
  id: string;
  user_id: string;
  date: string;
  checked_in_at: string;
  validated_by: string | null;
  validated_at: string | null;
}

export type CheckinStatus = 'none' | 'pending' | 'validated';

export function useOfficeCheckins(startDate: string, endDate: string) {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<OfficeCheckin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCheckins = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('office_checkins')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      setCheckins(data || []);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, startDate, endDate]);

  // Real-time subscription
  useEffect(() => {
    fetchCheckins();

    const channel = supabase
      .channel('office-checkins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'office_checkins',
        },
        () => {
          fetchCheckins();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCheckins]);

  const checkIn = async (date: Date) => {
    if (!user) return;

    const dateStr = format(date, 'yyyy-MM-dd');

    try {
      const { error } = await supabase
        .from('office_checkins')
        .insert({
          user_id: user.id,
          date: dateStr,
        });

      if (error) throw error;
      toast.success('Check-in realizado! Aguardando validação de um colega.');
      fetchCheckins();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Você já fez check-in hoje');
      } else {
        console.error('Error checking in:', error);
        toast.error('Erro ao fazer check-in');
      }
    }
  };

  const validateCheckin = async (checkinId: string, targetUserId: string) => {
    if (!user) return;

    // Can't validate own check-in
    if (targetUserId === user.id) {
      toast.error('Você não pode validar seu próprio check-in');
      return;
    }

    try {
      const { error } = await supabase
        .from('office_checkins')
        .update({
          validated_by: user.id,
          validated_at: new Date().toISOString(),
        })
        .eq('id', checkinId);

      if (error) throw error;
      toast.success('Presença validada com sucesso!');
      fetchCheckins();
    } catch (error) {
      console.error('Error validating check-in:', error);
      toast.error('Erro ao validar presença');
    }
  };

  const cancelCheckin = async (date: Date) => {
    if (!user) return;

    const dateStr = format(date, 'yyyy-MM-dd');

    try {
      const { error } = await supabase
        .from('office_checkins')
        .delete()
        .eq('user_id', user.id)
        .eq('date', dateStr);

      if (error) throw error;
      toast.success('Check-in cancelado');
      fetchCheckins();
    } catch (error) {
      console.error('Error cancelling check-in:', error);
      toast.error('Erro ao cancelar check-in');
    }
  };

  const getCheckinStatus = (userId: string, date: string): { status: CheckinStatus; checkin?: OfficeCheckin } => {
    const checkin = checkins.find(c => c.user_id === userId && c.date === date);
    
    if (!checkin) return { status: 'none' };
    if (checkin.validated_at) return { status: 'validated', checkin };
    return { status: 'pending', checkin };
  };

  const canUserValidate = (targetUserId: string, date: string): boolean => {
    if (!user) return false;
    
    // Can't validate own check-in
    if (targetUserId === user.id) return false;
    
    // Check if the target user has a pending check-in
    const targetCheckin = getCheckinStatus(targetUserId, date);
    if (targetCheckin.status !== 'pending') return false;
    
    // Check if current user is validated or has admin/lead role for today
    const myCheckin = getCheckinStatus(user.id, date);
    
    // User can validate if they have a validated check-in for the same date
    return myCheckin.status === 'validated';
  };

  return {
    checkins,
    isLoading,
    checkIn,
    validateCheckin,
    cancelCheckin,
    getCheckinStatus,
    canUserValidate,
    refetch: fetchCheckins,
  };
}
