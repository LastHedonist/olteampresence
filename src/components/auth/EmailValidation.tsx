import { Check, X, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface EmailValidationProps {
  email: string;
}

export function EmailValidation({ email }: EmailValidationProps) {
  const validation = useMemo(() => {
    if (!email) {
      return { isValid: false, showValidation: false };
    }
    
    // Basic email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(email);
    
    return { isValid, showValidation: true };
  }, [email]);

  if (!validation.showValidation) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 text-sm">
        <div className="relative h-4 w-4">
          <Check className={cn(
            "h-4 w-4 text-emerald-500 absolute inset-0 transition-all duration-300",
            validation.isValid ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )} />
          <X className={cn(
            "h-4 w-4 text-destructive absolute inset-0 transition-all duration-300",
            validation.isValid ? "opacity-0 scale-75" : "opacity-100 scale-100"
          )} />
        </div>
        <span className={cn(
          "transition-colors duration-300",
          validation.isValid 
            ? "text-emerald-600 dark:text-emerald-400" 
            : "text-destructive"
        )}>
          {validation.isValid ? (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Email válido
            </span>
          ) : (
            'Formato de email inválido'
          )}
        </span>
      </div>
    </div>
  );
}
