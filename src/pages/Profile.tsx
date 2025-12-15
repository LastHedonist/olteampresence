import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

type ResourceGroup = 'head' | 'lead' | 'equipe';

const RESOURCE_GROUP_LABELS: Record<ResourceGroup, string> = {
  head: 'Head',
  lead: 'Lead',
  equipe: 'Equipe',
};

const countries = ['argentina', 'brasil', 'chile', 'colombia', 'eua'] as const;
type Country = typeof countries[number];

const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  jobFunction: z.string().trim().min(1, 'Função é obrigatória').max(100, 'Função muito longa'),
  country: z.enum(countries, { required_error: 'País é obrigatório' }),
});

export default function Profile() {
  const { user, profile, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [jobFunction, setJobFunction] = useState('');
  const [resourceGroup, setResourceGroup] = useState<ResourceGroup>('equipe');
  const [country, setCountry] = useState<Country | ''>('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; jobFunction?: string; country?: string }>({});

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setJobFunction(profile.job_function || '');
      setResourceGroup((profile.resource_group as ResourceGroup) || 'equipe');
      setCountry((profile.country as Country) || '');
    }
  }, [profile]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    if (!user) return;

    setErrors({});
    
    const result = profileSchema.safeParse({ fullName, jobFunction, country: country || undefined });
    if (!result.success) {
      const fieldErrors: { fullName?: string; jobFunction?: string; country?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'fullName') fieldErrors.fullName = err.message;
        if (err.path[0] === 'jobFunction') fieldErrors.jobFunction = err.message;
        if (err.path[0] === 'country') fieldErrors.country = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName.trim(),
          job_function: jobFunction.trim(),
          country: country || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(t.profile.updateSuccess);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t.profile.updateError);
    } finally {
      setIsSaving(false);
    }
  };

  const countryLabels: Record<Country, string> = {
    argentina: t.auth.countries.argentina,
    brasil: t.auth.countries.brasil,
    chile: t.auth.countries.chile,
    colombia: t.auth.countries.colombia,
    eua: t.auth.countries.eua,
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t.profile.title}</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
            <CardDescription>
              Atualize suas informações de perfil aqui.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-lg font-medium">{profile?.full_name}</p>
                <p className="text-sm text-muted-foreground">{profile?.job_function}</p>
                <p className="text-xs text-muted-foreground">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.profile.fullName} *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className={errors.fullName ? 'border-destructive' : ''}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobFunction">{t.profile.jobFunction} *</Label>
                <Input
                  id="jobFunction"
                  value={jobFunction}
                  onChange={(e) => setJobFunction(e.target.value)}
                  placeholder="Ex: Desenvolvedor, Designer, Gerente"
                  className={errors.jobFunction ? 'border-destructive' : ''}
                />
                {errors.jobFunction && (
                  <p className="text-xs text-destructive">{errors.jobFunction}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t.auth.country} *</Label>
                <Select value={country} onValueChange={(value) => setCountry(value as Country)}>
                  <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t.auth.selectCountry} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {countryLabels[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-xs text-destructive">{errors.country}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceGroup">{t.profile.resourceGroup}</Label>
                <Input
                  id="resourceGroup"
                  value={RESOURCE_GROUP_LABELS[resourceGroup]}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t.profile.groupAdminOnly}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.profile.email}</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado.
                </p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t.common.save}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}