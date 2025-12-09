import { Building2, Home, Coffee, Plane, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LocationStatus, getStatusConfig, STATUS_OPTIONS } from '@/hooks/useLocations';
import { cn } from '@/lib/utils';

interface LocationCellProps {
  status?: LocationStatus;
  canEdit: boolean;
  onSelect: (status: LocationStatus) => void;
}

const iconMap = {
  Building2,
  Home,
  Coffee,
  Plane,
};

export function LocationCell({ status, canEdit, onSelect }: LocationCellProps) {
  const config = status ? getStatusConfig(status) : null;
  const Icon = config ? iconMap[config.icon as keyof typeof iconMap] : null;

  if (!canEdit) {
    if (!status) {
      return (
        <div className="flex items-center justify-center py-2">
          <span className="text-xs text-muted-foreground">-</span>
        </div>
      );
    }

    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          config?.color
        )}
      >
        {Icon && <Icon className="h-3 w-3" />}
        <span className="hidden sm:inline">{config?.shortLabel}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-auto w-full min-h-[36px] px-2 py-1',
            status && config?.color,
            !status && 'border border-dashed border-muted-foreground/30 hover:border-primary/50'
          )}
        >
          {status && Icon ? (
            <div className="flex items-center gap-1.5">
              <Icon className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">{config?.shortLabel}</span>
            </div>
          ) : (
            <Plus className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-40 bg-popover">
        {STATUS_OPTIONS.map((option) => {
          const optionConfig = getStatusConfig(option.value);
          const OptionIcon = iconMap[optionConfig.icon as keyof typeof iconMap];
          
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={cn(
                'cursor-pointer',
                status === option.value && 'bg-accent'
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn('rounded p-1', optionConfig.color)}>
                  <OptionIcon className="h-3 w-3" />
                </div>
                <span>{option.label}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
