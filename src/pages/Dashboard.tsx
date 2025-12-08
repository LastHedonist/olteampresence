import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Home, Coffee, Plane, Users, Calendar, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    {
      title: 'No Escritório Hoje',
      value: '0',
      icon: Building2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      title: 'Home Office',
      value: '0',
      icon: Home,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Day Off',
      value: '0',
      icon: Coffee,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      title: 'Férias',
      value: '0',
      icon: Plane,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <MainLayout onSearch={setSearchQuery}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua disponibilidade e veja quem está no escritório.
          </p>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={isAdmin ? 'default' : 'secondary'}>
            {isAdmin ? 'Administrador' : 'Funcionário'}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Team Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Visão da Equipe</CardTitle>
              </div>
              <CardDescription>
                Veja a disponibilidade de todos os membros da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Nenhum registro ainda</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Registre sua disponibilidade para começar
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Ações Rápidas</CardTitle>
              </div>
              <CardDescription>
                Gerencie sua disponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Card className="cursor-pointer transition-colors hover:bg-accent">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                      <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">Escritório</p>
                      <p className="text-xs text-muted-foreground">Marcar presença</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-colors hover:bg-accent">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                      <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Home Office</p>
                      <p className="text-xs text-muted-foreground">Trabalho remoto</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-colors hover:bg-accent">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                      <Coffee className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium">Day Off</p>
                      <p className="text-xs text-muted-foreground">Folga programada</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-colors hover:bg-accent">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                      <Plane className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Férias</p>
                      <p className="text-xs text-muted-foreground">Período de descanso</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
