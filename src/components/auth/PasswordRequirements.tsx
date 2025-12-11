import { Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PasswordRequirementsProps {
  password: string;
}

interface RequirementProps {
  met: boolean;
  label: string;
}

function Requirement({ met, label }: RequirementProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="relative h-4 w-4">
        <Check className={cn(
          "h-4 w-4 text-emerald-500 absolute inset-0 transition-all duration-300",
          met ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )} />
        <X className={cn(
          "h-4 w-4 text-muted-foreground absolute inset-0 transition-all duration-300",
          met ? "opacity-0 scale-75" : "opacity-100 scale-100"
        )} />
      </div>
      <span className={cn(
        "transition-colors duration-300",
        met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
}

function getStrengthInfo(metCount: number): { label: string; color: string; progressColor: string } {
  if (metCount === 0) return { label: '', color: 'text-muted-foreground', progressColor: 'bg-muted' };
  if (metCount <= 1) return { label: 'Fraca', color: 'text-destructive', progressColor: 'bg-destructive' };
  if (metCount <= 2) return { label: 'Média', color: 'text-amber-500', progressColor: 'bg-amber-500' };
  if (metCount <= 3) return { label: 'Boa', color: 'text-emerald-500', progressColor: 'bg-emerald-500' };
  return { label: 'Forte', color: 'text-emerald-600', progressColor: 'bg-emerald-600' };
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    { met: password.length >= 8, label: '8 caracteres no mínimo' },
    { met: /[A-Z]/.test(password), label: 'Letra maiúscula' },
    { met: /[a-z]/.test(password), label: 'Letra minúscula' },
    { met: /[0-9]/.test(password), label: 'Número' },
  ];

  const metCount = requirements.filter(r => r.met).length;
  const strengthPercent = (metCount / requirements.length) * 100;
  const { label, color, progressColor } = getStrengthInfo(metCount);

  return (
    <div className="space-y-3 rounded-md bg-muted/50 p-3 animate-fade-in">
      {password.length > 0 && (
        <div className="space-y-1.5 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Força da senha</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px] text-center">
                    <p className="text-xs">A força é calculada com base nos requisitos atendidos: maiúscula, minúscula, número e tamanho mínimo.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className={cn("font-medium transition-colors", color)}>{label}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-300", progressColor)}
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
        </div>
      )}
      <div className="space-y-1.5">
        {requirements.map((req, index) => (
          <Requirement key={index} met={req.met} label={req.label} />
        ))}
      </div>
    </div>
  );
}
