import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AppRole = 'admin' | 'employee';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  job_function: string;
  avatar_url: string | null;
  is_active: boolean;
  role: AppRole;
  created_at: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (profilesError) throw profilesError;

      // Fetch all roles (admin can see all)
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: AdminUser[] = profiles.map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          job_function: profile.job_function,
          avatar_url: profile.avatar_url,
          is_active: profile.is_active,
          role: (userRole?.role as AppRole) || 'employee',
          created_at: profile.created_at,
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = async (userId: string, updates: { full_name?: string; is_active?: boolean }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário atualizado com sucesso');
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário');
      return { success: false, error };
    }
  };

  const updateUserRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Papel do usuário atualizado');
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erro ao atualizar papel');
      return { success: false, error };
    }
  };

  const createUser = async (email: string, password: string, fullName: string, jobFunction: string, role: AppRole) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: { email, password, fullName, jobFunction, role },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success('Usuário criado com sucesso');
      await fetchUsers();
      return { success: true };
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Erro ao criar usuário');
      return { success: false, error };
    }
  };

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    return updateUser(userId, { is_active: !isActive });
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    fetchUsers,
    updateUser,
    updateUserRole,
    createUser,
    toggleUserActive,
  };
}