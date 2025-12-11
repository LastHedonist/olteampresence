import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckinStatus } from '@/hooks/useOfficeCheckins';

interface CheckinIndicatorProps {
  status: CheckinStatus;
  isCurrentUser: boolean;
  canCheckIn: boolean;
  canValidate: boolean;
  onCheckIn?: () => void;
  onValidate?: () => void;
  onCancelCheckin?: () => void;
  validatedByName?: string;
}

export function CheckinIndicator({
  status,
  isCurrentUser,
  canCheckIn,
  canValidate,
  onCheckIn,
  onValidate,
  onCancelCheckin,
  validatedByName,
}: CheckinIndicatorProps) {
  // Current user with no check-in - show check-in button
  if (isCurrentUser && status === 'none' && canCheckIn) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-primary/10"
            onClick={onCheckIn}
          >
            <Circle className="h-4 w-4 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Fazer check-in</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Current user with pending check-in - show pending with cancel option
  if (isCurrentUser && status === 'pending') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            onClick={onCancelCheckin}
          >
            <Clock className="h-4 w-4 text-amber-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Aguardando validação (clique para cancelar)</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Current user validated
  if (isCurrentUser && status === 'validated') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </TooltipTrigger>
        <TooltipContent>
          <span>Check-in validado{validatedByName ? ` por ${validatedByName}` : ''}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Other user with pending - show validate button if allowed
  if (!isCurrentUser && status === 'pending' && canValidate) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
            onClick={onValidate}
          >
            <Clock className="h-4 w-4 text-amber-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Clique para validar presença</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Other user with pending (can't validate)
  if (!isCurrentUser && status === 'pending') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Clock className="h-4 w-4 text-amber-500" />
        </TooltipTrigger>
        <TooltipContent>
          <span>Aguardando validação</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Other user validated
  if (!isCurrentUser && status === 'validated') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </TooltipTrigger>
        <TooltipContent>
          <span>Presença confirmada</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  // No status to show
  return null;
}
