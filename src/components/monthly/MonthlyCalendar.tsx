import { format, isSameDay, isToday, getDay, startOfMonth, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { UserWithLocations, LocationStatus, getStatusConfig } from '@/hooks/useLocations';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Building2, Home, Coffee, Plane, Briefcase } from 'lucide-react';

interface MonthlyCalendarProps {
  monthDays: Date[];
  allUsersLocations: UserWithLocations[];
  monthStart: Date;
}

const STATUS_COLORS: Record<LocationStatus, string> = {
  office: 'bg-emerald-500',
  home_office: 'bg-blue-500',
  corporate_travel: 'bg-cyan-500',
  day_off: 'bg-amber-500',
  vacation: 'bg-purple-500',
};

const STATUS_ICONS: Record<LocationStatus, React.ComponentType<{ className?: string }>> = {
  office: Building2,
  home_office: Home,
  corporate_travel: Briefcase,
  day_off: Coffee,
  vacation: Plane,
};

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function MonthlyCalendar({ monthDays, allUsersLocations, monthStart }: MonthlyCalendarProps) {
  const firstDayOfMonth = getDay(startOfMonth(monthStart));
  const emptyDays = Array(firstDayOfMonth).fill(null);

  const getStatsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const stats: Record<LocationStatus, number> = {
      office: 0,
      home_office: 0,
      corporate_travel: 0,
      day_off: 0,
      vacation: 0,
    };

    allUsersLocations.forEach((user) => {
      const locationData = user.locations[dateStr];
      // Default weekends to day_off if no status is set
      const status = locationData?.status ?? (isWeekend(date) ? 'day_off' : undefined);
      if (status) {
        stats[status]++;
      }
    });

    return stats;
  };

  const getUsersForDay = (date: Date, status: LocationStatus) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return allUsersLocations
      .filter((user) => {
        const locationData = user.locations[dateStr];
        // Default weekends to day_off if no status is set
        const effectiveStatus = locationData?.status ?? (isWeekend(date) ? 'day_off' : undefined);
        return effectiveStatus === status;
      })
      .map((user) => user.full_name);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Month days */}
        {monthDays.map((day) => {
          const stats = getStatsForDay(day);
          const hasData = Object.values(stats).some((v) => v > 0);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'relative flex aspect-square flex-col rounded-lg border p-1 transition-colors',
                today
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:border-border hover:bg-muted/30'
              )}
            >
              {/* Day number */}
              <span
                className={cn(
                  'ml-1 text-xs font-medium',
                  today ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Status indicators */}
              {hasData && (
                <div className="mt-auto flex flex-wrap gap-1">
                  {(Object.entries(stats) as [LocationStatus, number][])
                    .filter(([_, count]) => count > 0)
                    .map(([status, count]) => {
                      const Icon = STATUS_ICONS[status];
                      const users = getUsersForDay(day, status);
                      const config = getStatusConfig(status);

                      return (
                        <Tooltip key={status}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                'flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-1.5 text-sm font-bold text-white shadow-md transition-transform hover:scale-110',
                                STATUS_COLORS[status]
                              )}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{count}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 font-medium">
                                <Icon className="h-4 w-4" />
                                {config.label} ({count})
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {users.slice(0, 5).join(', ')}
                                {users.length > 5 && ` +${users.length - 5} mais`}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
