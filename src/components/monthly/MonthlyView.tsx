import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlyLocations } from '@/hooks/useMonthlyLocations';
import { MonthlyCalendar } from './MonthlyCalendar';
import { MonthlyLegend } from './MonthlyLegend';

interface MonthlyViewProps {
  searchQuery?: string;
}

export function MonthlyView({ searchQuery = '' }: MonthlyViewProps) {
  const [monthOffset, setMonthOffset] = useState(0);
  const { allUsersLocations, isLoading, monthDays, monthStart, currentMonth } =
    useMonthlyLocations(monthOffset);

  const filteredUsers = searchQuery
    ? allUsersLocations.filter((user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUsersLocations;

  const goToPreviousMonth = () => setMonthOffset((prev) => prev - 1);
  const goToNextMonth = () => setMonthOffset((prev) => prev + 1);
  const goToCurrentMonth = () => setMonthOffset(0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Visão Mensal</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousMonth}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              onClick={goToCurrentMonth}
              className="min-w-[160px] text-sm font-medium capitalize"
            >
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <MonthlyLegend />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MonthlyCalendar
            monthDays={monthDays}
            allUsersLocations={filteredUsers}
            monthStart={monthStart}
          />
        )}

        <div className="text-center text-sm text-muted-foreground">
          {filteredUsers.length} recurso{filteredUsers.length !== 1 ? 's' : ''} •
          Passe o mouse sobre os indicadores para ver detalhes
        </div>
      </CardContent>
    </Card>
  );
}
