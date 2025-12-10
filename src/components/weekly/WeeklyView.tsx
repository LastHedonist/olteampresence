import { useState } from 'react';
import { format, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocations } from '@/hooks/useLocations';
import { WeeklyTable } from './WeeklyTable';
import { useAuth } from '@/contexts/AuthContext';

interface WeeklyViewProps {
  searchQuery?: string;
}

export function WeeklyView({ searchQuery = '' }: WeeklyViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const { allUsersLocations, isLoading, weekDays, weekStart, weekEnd, updateLocation } = useLocations(weekOffset);
  const { user } = useAuth();

  // Filter by search query
  const filteredUsers = allUsersLocations.filter((u) =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users: current user first, then alphabetically by name
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.id === user?.id) return -1;
    if (b.id === user?.id) return 1;
    return a.full_name.localeCompare(b.full_name, 'pt-BR');
  });

  const canEditWeek = !isBefore(startOfDay(weekEnd), startOfDay(new Date()));

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">
            Visão Semanal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[200px] text-center">
              <span className="text-sm font-medium">
                {format(weekStart, "dd 'de' MMM", { locale: ptBR })} -{' '}
                {format(weekEnd, "dd 'de' MMM, yyyy", { locale: ptBR })}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {weekOffset !== 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWeekOffset(0)}
              >
                Hoje
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhum recurso encontrado' : 'Nenhum recurso cadastrado'}
            </p>
          </div>
        ) : (
          <WeeklyTable
            users={sortedUsers}
            weekDays={weekDays}
            currentUserId={user?.id}
            onUpdateLocation={updateLocation}
            canEdit={canEditWeek}
          />
        )}
      </CardContent>
    </Card>
  );
}
