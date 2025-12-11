import { Building2, Home, Coffee, Plane, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const LEGEND_ITEMS = [
  { status: 'office', label: 'Escritório', color: 'bg-emerald-500', icon: Building2 },
  { status: 'home_office', label: 'Home Office', color: 'bg-blue-500', icon: Home },
  { status: 'corporate_travel', label: 'Viagem Corporativa', color: 'bg-cyan-500', icon: Briefcase },
  { status: 'day_off', label: 'Day Off', color: 'bg-amber-500', icon: Coffee },
  { status: 'vacation', label: 'Férias', color: 'bg-purple-500', icon: Plane },
];

export function MonthlyLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <span className="text-sm font-medium text-muted-foreground">Legenda:</span>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.status} className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded',
              item.color
            )}
          >
            <item.icon className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
