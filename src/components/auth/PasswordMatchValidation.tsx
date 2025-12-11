import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordMatchValidationProps {
  password: string;
  confirmPassword: string;
}

export function PasswordMatchValidation({ password, confirmPassword }: PasswordMatchValidationProps) {
  if (!confirmPassword) {
    return null;
  }

  const matches = password === confirmPassword && password.length > 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 text-sm">
        <div className="relative h-4 w-4">
          <Check className={cn(
            "h-4 w-4 text-emerald-500 absolute inset-0 transition-all duration-300",
            matches ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )} />
          <X className={cn(
            "h-4 w-4 text-destructive absolute inset-0 transition-all duration-300",
            matches ? "opacity-0 scale-75" : "opacity-100 scale-100"
          )} />
        </div>
        <span className={cn(
          "transition-colors duration-300",
          matches 
            ? "text-emerald-600 dark:text-emerald-400" 
            : "text-destructive"
        )}>
          {matches ? 'As senhas coincidem' : 'As senhas não coincidem'}
        </span>
      </div>
    </div>
  );
}
