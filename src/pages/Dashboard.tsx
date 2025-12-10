import { useState, useEffect } from 'react';
import { isWeekend } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Building2, Home, Coffee, Plane, CalendarDays, Calendar } from 'lucide-react';
import { WeeklyView } from '@/components/weekly';
import { MonthlyView } from '@/components/monthly';
import { useLocations, LocationStatus } from '@/hooks/useLocations';
import { StatusEmployeesDialog } from '@/components/dashboard/StatusEmployeesDialog';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, profile, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<LocationStatus | null>(null);
  const { allUsersLocations, weekDays } = useLocations(0);

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

  // Calculate today's stats
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayStats = {
    office: 0,
    home_office: 0,
    day_off: 0,
    vacation: 0,
  };

  const isTodayWeekend = isWeekend(new Date());
  
  allUsersLocations.forEach((u) => {
    const savedStatus = u.locations[today];
    // Default weekends to day_off if no status is set
    const status = savedStatus ?? (isTodayWeekend ? 'day_off' : undefined);
    if (status) {
      todayStats[status]++;
    }
  });

  const stats = [
    {
      title: 'No Escritório Hoje',
      value: todayStats.office.toString(),
      icon: Building2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      status: 'office' as LocationStatus,
    },
    {
      title: 'Home Office',
      value: todayStats.home_office.toString(),
      icon: Home,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      status: 'home_office' as LocationStatus,
    },
    {
      title: 'Day Off',
      value: todayStats.day_off.toString(),
      icon: Coffee,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      status: 'day_off' as LocationStatus,
    },
    {
      title: 'Férias',
      value: todayStats.vacation.toString(),
      icon: Plane,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      status: 'vacation' as LocationStatus,
    },
  ];

  const getEmployeesForStatus = (status: LocationStatus) => {
    return allUsersLocations
      .filter((u) => {
        const savedStatus = u.locations[today];
        // Default weekends to day_off if no status is set
        const effectiveStatus = savedStatus ?? (isTodayWeekend ? 'day_off' : undefined);
        return effectiveStatus === status;
      })
      .map((u) => ({
        id: u.id,
        full_name: u.full_name,
        avatar_url: u.avatar_url,
      }));
  };

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
            <Card
              key={stat.title}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedStatus(stat.status)}
            >
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

        {/* Status Employees Dialog */}
        <StatusEmployeesDialog
          open={selectedStatus !== null}
          onOpenChange={(open) => !open && setSelectedStatus(null)}
          status={selectedStatus}
          employees={selectedStatus ? getEmployeesForStatus(selectedStatus) : []}
        />

        {/* Views Tabs */}
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Semanal
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Mensal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <WeeklyView searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="monthly">
            <MonthlyView searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
