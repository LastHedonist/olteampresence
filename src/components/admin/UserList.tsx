import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal, UserCheck, UserX, Pencil, Shield, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AdminUser, AppRole } from '@/hooks/useAdminUsers';
import { EditUserDialog } from './EditUserDialog';
import { useAuth } from '@/contexts/AuthContext';

interface UserListProps {
  users: AdminUser[];
  onToggleActive: (userId: string, isActive: boolean) => Promise<{ success: boolean }>;
  onUpdateUser: (userId: string, updates: { full_name?: string }) => Promise<{ success: boolean }>;
  onUpdateRole: (userId: string, role: AppRole) => Promise<{ success: boolean }>;
}

export function UserList({ users, onToggleActive, onUpdateUser, onUpdateRole }: UserListProps) {
  const { user: currentUser } = useAuth();
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className={!user.is_active ? 'opacity-60' : ''}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.full_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? (
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        Funcionário
                      </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'outline' : 'destructive'}>
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateRole(user.id, user.role === 'admin' ? 'employee' : 'admin')
                        }
                        disabled={user.id === currentUser?.id}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleActive(user.id, user.is_active)}
                        disabled={user.id === currentUser?.id}
                        className={user.is_active ? 'text-destructive' : 'text-green-600'}
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Desativar Conta
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Ativar Conta
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onSave={async (updates) => {
          if (editingUser) {
            const result = await onUpdateUser(editingUser.id, updates);
            if (result.success) {
              setEditingUser(null);
            }
          }
        }}
      />
    </>
  );
}