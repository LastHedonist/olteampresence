import { Building2, Home, Coffee, Plane, Plus, Clock, Briefcase, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LocationStatus, getStatusConfig, STATUS_OPTIONS } from '@/hooks/useLocations';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LocationCellProps {
  status?: LocationStatus;
  arrivalTime?: string | null;
  departureTime?: string | null;
  canEdit: boolean;
  onSelect: (status: LocationStatus) => void;
  onClear?: () => void;
}

const iconMap = {
  Building2,
  Home,
  Briefcase,
  Coffee,
  Plane,
};

export function LocationCell({ status, arrivalTime, departureTime, canEdit, onSelect, onClear }: LocationCellProps) {
  const config = status ? getStatusConfig(status) : null;
  const Icon = config ? iconMap[config.icon as keyof typeof iconMap] : null;

  const hasOfficeTime = status === 'office' && arrivalTime && departureTime;
  const timeDisplay = hasOfficeTime ? `${arrivalTime} - ${departureTime}` : null;
  
  // Check if office time is default (09:00-18:00)
  const isDefaultOfficeTime = status === 'office' && hasOfficeTime && arrivalTime === '09:00' && departureTime === '18:00';
  
  // Use darker green for default office times
  const getStatusColor = () => {
    if (isDefaultOfficeTime) {
      return 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800/50 dark:text-emerald-300';
    }
    return config?.color;
  };

  if (!canEdit) {
    if (!status) {
      return (
        <div className="flex items-center justify-center py-2">
          <span className="text-xs text-muted-foreground">-</span>
        </div>
      );
    }

    const content = (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          getStatusColor()
        )}
      >
        {Icon && <Icon className="h-3 w-3" />}
        <span className="hidden sm:inline">{config?.shortLabel}</span>
      </div>
    );

    if (timeDisplay) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeDisplay}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-auto w-full min-h-[36px] px-2 py-1',
                status && getStatusColor(),
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
        </TooltipTrigger>
        {timeDisplay && (
          <TooltipContent>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{timeDisplay}</span>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
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
        {status && onClear && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onClear}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <div className="flex items-center gap-2">
                <div className="rounded p-1 bg-destructive/10">
                  <X className="h-3 w-3" />
                </div>
                <span>Limpar</span>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}