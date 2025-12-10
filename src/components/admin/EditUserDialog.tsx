import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminUser } from '@/hooks/useAdminUsers';

const editUserSchema = z.object({
  full_name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  job_function: z.string().min(2, 'Função deve ter no mínimo 2 caracteres').max(100),
});

interface EditUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { full_name: string; job_function: string }) => Promise<void>;
}

export function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [jobFunction, setJobFunction] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setJobFunction(user.job_function || '');
      setError(null);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = editUserSchema.safeParse({ full_name: fullName, job_function: jobFunction });
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || 'Erro de validação');
      return;
    }

    setIsLoading(true);
    await onSave({ full_name: fullName.trim(), job_function: jobFunction.trim() });
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-fullName">Nome Completo</Label>
              <Input
                id="edit-fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="João Silva"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-jobFunction">Função</Label>
              <Input
                id="edit-jobFunction"
                value={jobFunction}
                onChange={(e) => setJobFunction(e.target.value)}
                placeholder="Desenvolvedor"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}