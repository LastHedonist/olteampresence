import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TeamProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  is_active: boolean;
}

interface LocationData {
  user_id: string;
  date: string;
  status: 'office' | 'home_office' | 'day_off' | 'vacation';
}

const COLORS = {
  office: 'hsl(152, 69%, 41%)',
  home_office: 'hsl(217, 91%, 60%)',
  day_off: 'hsl(38, 92%, 50%)',
  vacation: 'hsl(271, 91%, 65%)',
};

const statusLabels: Record<string, string> = {
  office: 'Escritório',
  home_office: 'Home Office',
  day_off: 'Day Off',
  vacation: 'Férias',
};

export default function Charts() {
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));

  if (!authLoading && !isAdmin) {
    navigate('/');
    return null;
  }

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

  const { data: teamProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['team-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_team_profiles');
      if (error) throw error;
      return data as TeamProfile[];
    },
  });

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ['locations-charts', startDate, endDate],
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

  const pieData = useMemo(() => {
    if (!locations) return [];
    
    const counts = {
      office: 0,
      home_office: 0,
      day_off: 0,
      vacation: 0,
    };

    locations.forEach(loc => {
      counts[loc.status]++;
    });

    return Object.entries(counts).map(([key, value]) => ({
      name: statusLabels[key],
      value,
      color: COLORS[key as keyof typeof COLORS],
    }));
  }, [locations]);

  const barData = useMemo(() => {
    if (!teamProfiles || !locations) return [];

    return teamProfiles.map(profile => {
      const userLocations = locations.filter(loc => loc.user_id === profile.id);
      
      const stats = {
        name: profile.full_name.split(' ')[0],
        fullName: profile.full_name,
        office: 0,
        home_office: 0,
        day_off: 0,
        vacation: 0,
      };

      userLocations.forEach(loc => {
        stats[loc.status]++;
      });

      return stats;
    }).filter(stat => stat.office + stat.home_office + stat.day_off + stat.vacation > 0);
  }, [teamProfiles, locations]);

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
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Gráficos</h1>
            <p className="text-muted-foreground">
              Visualização gráfica da disponibilidade da equipe
            </p>
          </div>
          
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
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie Chart - Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição Geral</CardTitle>
                <CardDescription>
                  Proporção de cada tipo de status no mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart - By Employee */}
            <Card>
              <CardHeader>
                <CardTitle>Por Funcionário</CardTitle>
                <CardDescription>
                  Comparativo de status por pessoa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip 
                        formatter={(value, name) => [value, statusLabels[name as string] || name]}
                        labelFormatter={(label) => {
                          const item = barData.find(d => d.name === label);
                          return item?.fullName || label;
                        }}
                      />
                      <Legend formatter={(value) => statusLabels[value] || value} />
                      <Bar dataKey="office" stackId="a" fill={COLORS.office} />
                      <Bar dataKey="home_office" stackId="a" fill={COLORS.home_office} />
                      <Bar dataKey="day_off" stackId="a" fill={COLORS.day_off} />
                      <Bar dataKey="vacation" stackId="a" fill={COLORS.vacation} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Legend Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Legenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div 
                        className="h-4 w-4 rounded" 
                        style={{ backgroundColor: COLORS[key as keyof typeof COLORS] }} 
                      />
                      <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
