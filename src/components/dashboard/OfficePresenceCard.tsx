import { format } from 'date-fns';
import { Building2, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocations } from '@/hooks/useLocations';
import { useOfficeCheckins, CheckinStatus } from '@/hooks/useOfficeCheckins';

interface OfficeUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  arrivalTime?: string | null;
  departureTime?: string | null;
  checkinStatus: CheckinStatus;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const CheckinStatusBadge = ({ status }: { status: CheckinStatus }) => {
  switch (status) {
    case 'validated':
      return (
        <Badge variant="default" className="gap-1 bg-emerald-600 hover:bg-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Validado
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock className="h-3 w-3" />
          Pendente
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <Circle className="h-3 w-3" />
          Sem check-in
        </Badge>
      );
  }
};

export function OfficePresenceCard() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const { allUsersLocations } = useLocations(0);
  const { getCheckinStatus } = useOfficeCheckins(today, today);

  // Get users who are in the office today
  const officeUsers: OfficeUser[] = allUsersLocations
    .filter((u) => u.locations[today]?.status === 'office')
    .map((u) => ({
      id: u.id,
      full_name: u.full_name,
      avatar_url: u.avatar_url,
      arrivalTime: u.locations[today]?.arrival_time,
      departureTime: u.locations[today]?.departure_time,
      checkinStatus: getCheckinStatus(u.id, today).status,
    }))
    .sort((a, b) => {
      // Sort by check-in status: validated first, then pending, then none
      const statusOrder = { validated: 0, pending: 1, none: 2 };
      return statusOrder[a.checkinStatus] - statusOrder[b.checkinStatus];
    });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">No Escritório Hoje</CardTitle>
        <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
          <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </CardHeader>
      <CardContent>
        {officeUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ninguém no escritório hoje.</p>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-3">
              {officeUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar_url || undefined} alt={user.full_name} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.full_name}</p>
                      {user.arrivalTime && user.departureTime && (
                        <p className="text-xs text-muted-foreground">
                          {user.arrivalTime.slice(0, 5)} - {user.departureTime.slice(0, 5)}
                        </p>
                      )}
                    </div>
                  </div>
                  <CheckinStatusBadge status={user.checkinStatus} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
