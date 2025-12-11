import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, subMonths, eachDayOfInterval, isWeekend } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Building2, Home, Coffee, Palmtree, Briefcase, Loader2, FileDown } from 'lucide-react';

interface TeamProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
}

interface LocationData {
  user_id: string;
  date: string;
  status: 'office' | 'home_office' | 'corporate_travel' | 'day_off' | 'vacation';
}

interface UserStats {
  userId: string;
  name: string;
  office: number;
  homeOffice: number;
  corporateTravel: number;
  dayOff: number;
  vacation: number;
  total: number;
}

const statusLabels: Record<string, string> = {
  office: 'Escritório',
  home_office: 'Home Office',
  corporate_travel: 'Viagem Corporativa',
  day_off: 'Day Off',
  vacation: 'Férias',
};

const statusColors: Record<string, string> = {
  office: 'bg-emerald-500',
  home_office: 'bg-blue-500',
  corporate_travel: 'bg-cyan-500',
  day_off: 'bg-amber-500',
  vacation: 'bg-purple-500',
};

export default function Reports() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));

  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = subMonths(new Date(), i);
      options.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy', { locale: ptBR }),
      });
    }
    return options;
  }, []);

  const { startDate, endDate } = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    return {
      startDate: format(startOfMonth(date), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(date), 'yyyy-MM-dd'),
    };
  }, [selectedMonth]);

  const workingDaysInMonth = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1);
    const days = eachDayOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    });
    return days.filter(day => !isWeekend(day)).length;
  }, [selectedMonth]);

  const { data: teamProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['team-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_team_profiles');
      if (error) throw error;
      return data as TeamProfile[];
    },
  });

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations-report', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('user_id, date, status')
        .gte('date', startDate)
        .lte('date', endDate);
      if (error) throw error;
      return data as LocationData[];
    },
  });

  const userStats = useMemo((): UserStats[] => {
    if (!teamProfiles || !locations) return [];

    return teamProfiles.map(profile => {
      const userLocations = locations.filter(loc => loc.user_id === profile.id);
      
      const stats = {
        userId: profile.id,
        name: profile.full_name,
        office: 0,
        homeOffice: 0,
        corporateTravel: 0,
        dayOff: 0,
        vacation: 0,
        total: userLocations.length,
      };

      userLocations.forEach(loc => {
        switch (loc.status) {
          case 'office':
            stats.office++;
            break;
          case 'home_office':
            stats.homeOffice++;
            break;
          case 'corporate_travel':
            stats.corporateTravel++;
            break;
          case 'day_off':
            stats.dayOff++;
            break;
          case 'vacation':
            stats.vacation++;
            break;
        }
      });

      return stats;
    });
  }, [teamProfiles, locations]);

  const totals = useMemo(() => {
    return userStats.reduce(
      (acc, stat) => ({
        office: acc.office + stat.office,
        homeOffice: acc.homeOffice + stat.homeOffice,
        corporateTravel: acc.corporateTravel + stat.corporateTravel,
        dayOff: acc.dayOff + stat.dayOff,
        vacation: acc.vacation + stat.vacation,
        total: acc.total + stat.total,
      }),
      { office: 0, homeOffice: 0, corporateTravel: 0, dayOff: 0, vacation: 0, total: 0 }
    );
  }, [userStats]);

  const handleExportCSV = () => {
    const headers = ['Recurso', 'Escritório', 'Home Office', 'Viagem Corporativa', 'Day Off', 'Férias', 'Total Registros'];
    const rows = userStats.map(stat => [
      stat.name,
      stat.office,
      stat.homeOffice,
      stat.corporateTravel,
      stat.dayOff,
      stat.vacation,
      stat.total,
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-${selectedMonth}.csv`;
    link.click();
  };

  // Early returns AFTER all hooks
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const isLoading = profilesLoading || locationsLoading;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Relatórios</h1>
            <p className="text-muted-foreground">
              Estatísticas de disponibilidade da equipe
            </p>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handleExportCSV} disabled={isLoading}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Escritório</CardTitle>
              <Building2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.office}</div>
              <p className="text-xs text-muted-foreground">
                dias registrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Home Office</CardTitle>
              <Home className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.homeOffice}</div>
              <p className="text-xs text-muted-foreground">
                dias registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Viagem Corp.</CardTitle>
              <Briefcase className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.corporateTravel}</div>
              <p className="text-xs text-muted-foreground">
                dias registrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Day Off</CardTitle>
              <Coffee className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.dayOff}</div>
              <p className="text-xs text-muted-foreground">
                dias registrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Férias</CardTitle>
              <Palmtree className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.vacation}</div>
              <p className="text-xs text-muted-foreground">
                dias registrados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Recurso</CardTitle>
            <CardDescription>
              {workingDaysInMonth} dias úteis no mês selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recurso</TableHead>
                      <TableHead className="text-center">Escritório</TableHead>
                      <TableHead className="text-center">Home Office</TableHead>
                      <TableHead className="text-center">Viagem Corp.</TableHead>
                      <TableHead className="text-center">Day Off</TableHead>
                      <TableHead className="text-center">Férias</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userStats.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          Nenhum dado encontrado para o período selecionado
                        </TableCell>
                      </TableRow>
                    ) : (
                      userStats.map(stat => (
                        <TableRow key={stat.userId}>
                          <TableCell className="font-medium">{stat.name}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              {stat.office}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                              {stat.homeOffice}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
                              {stat.corporateTravel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                              {stat.dayOff}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                              {stat.vacation}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-medium">{stat.total}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
