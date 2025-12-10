import { useState } from 'react';
import { format, isToday, isBefore, startOfDay, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Building2, Home, Coffee, Plane } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LocationCell } from './LocationCell';
import { OfficeTimeDialog } from './OfficeTimeDialog';
import { UserWithLocations, LocationStatus, LocationData } from '@/hooks/useLocations';
import { cn } from '@/lib/utils';

interface WeeklyTableProps {
  users: UserWithLocations[];
  weekDays: Date[];
  currentUserId?: string;
  onUpdateLocation: (date: Date, status: LocationStatus, notes?: string, arrivalTime?: string, departureTime?: string) => void;
  canEdit: boolean;
}

export function WeeklyTable({
  users,
  weekDays,
  currentUserId,
  onUpdateLocation,
  canEdit,
}: WeeklyTableProps) {
  const [officeTimeDialog, setOfficeTimeDialog] = useState<{
    open: boolean;
    date: Date | null;
    initialArrivalTime?: string;
    initialDepartureTime?: string;
  }>({
    open: false,
    date: null,
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleStatusSelect = (day: Date, newStatus: LocationStatus, locationData?: LocationData) => {
    if (newStatus === 'office') {
      // Open dialog to set times
      setOfficeTimeDialog({
        open: true,
        date: day,
        initialArrivalTime: locationData?.arrival_time || '09:00',
        initialDepartureTime: locationData?.departure_time || '18:00',
      });
    } else {
      onUpdateLocation(day, newStatus);
    }
  };

  const handleOfficeTimeConfirm = (arrivalTime: string, departureTime: string) => {
    if (officeTimeDialog.date) {
      onUpdateLocation(officeTimeDialog.date, 'office', undefined, arrivalTime, departureTime);
    }
    setOfficeTimeDialog({ open: false, date: null });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px] sticky left-0 bg-background z-10">
                Recurso
              </TableHead>
              {weekDays.map((day) => (
                <TableHead
                  key={day.toISOString()}
                  className={cn(
                    'min-w-[100px] text-center',
                    isToday(day) && 'bg-primary/10'
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-normal text-muted-foreground capitalize">
                      {format(day, 'EEE', { locale: ptBR })}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isToday(day) && 'rounded-full bg-primary px-2 py-0.5 text-primary-foreground'
                      )}
                    >
                      {format(day, 'dd')}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className={cn(
                  user.id === currentUserId && 'bg-accent/50'
                )}
              >
                <TableCell className="sticky left-0 bg-background z-10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.full_name}</span>
                      {user.id === currentUserId && (
                        <span className="text-xs text-muted-foreground">Você</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                {weekDays.map((day) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const locationData = user.locations[dateStr];
                  // Default weekends to day_off if no status is set
                  const status = locationData?.status ?? (isWeekend(day) ? 'day_off' : undefined);
                  const isCurrentUser = user.id === currentUserId;
                  const isPastDay = isBefore(startOfDay(day), startOfDay(new Date()));
                  const canEditCell = isCurrentUser && canEdit && !isPastDay;

                  return (
                    <TableCell
                      key={day.toISOString()}
                      className={cn(
                        'text-center p-1',
                        isToday(day) && 'bg-primary/5'
                      )}
                    >
                      <LocationCell
                        status={status}
                        arrivalTime={locationData?.arrival_time}
                        departureTime={locationData?.departure_time}
                        canEdit={canEditCell}
                        onSelect={(newStatus) => handleStatusSelect(day, newStatus, locationData)}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OfficeTimeDialog
        open={officeTimeDialog.open}
        onOpenChange={(open) => !open && setOfficeTimeDialog({ open: false, date: null })}
        onConfirm={handleOfficeTimeConfirm}
        initialArrivalTime={officeTimeDialog.initialArrivalTime}
        initialDepartureTime={officeTimeDialog.initialDepartureTime}
      />
    </>
  );
}