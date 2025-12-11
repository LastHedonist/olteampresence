import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      {met ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={cn(
        "transition-colors",
        met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    { met: password.length >= 8, label: '8 caracteres no mínimo' },
    { met: /[A-Z]/.test(password), label: 'Letra maiúscula' },
    { met: /[a-z]/.test(password), label: 'Letra minúscula' },
    { met: /[0-9]/.test(password), label: 'Número' },
  ];

  return (
    <div className="space-y-1.5 rounded-md bg-muted/50 p-3">
      {requirements.map((req, index) => (
        <Requirement key={index} met={req.met} label={req.label} />
      ))}
    </div>
  );
}
