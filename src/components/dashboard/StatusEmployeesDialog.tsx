import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Home, Coffee, Plane, LucideIcon } from 'lucide-react';
import { LocationStatus } from '@/hooks/useLocations';

interface Employee {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

interface StatusEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: LocationStatus | null;
  employees: Employee[];
}

const STATUS_CONFIG: Record<LocationStatus, { label: string; icon: LucideIcon; color: string }> = {
  office: { label: 'No Escritório', icon: Building2, color: 'text-emerald-600 dark:text-emerald-400' },
  home_office: { label: 'Home Office', icon: Home, color: 'text-blue-600 dark:text-blue-400' },
  day_off: { label: 'Day Off', icon: Coffee, color: 'text-amber-600 dark:text-amber-400' },
  vacation: { label: 'Férias', icon: Plane, color: 'text-purple-600 dark:text-purple-400' },
};

export function StatusEmployeesDialog({ open, onOpenChange, status, employees }: StatusEmployeesDialogProps) {
  if (!status) return null;

  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {config.label} Hoje
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {employees.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum funcionário com este status hoje.
            </p>
          ) : (
            <div className="space-y-2">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar_url || undefined} alt={employee.full_name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(employee.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{employee.full_name}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
