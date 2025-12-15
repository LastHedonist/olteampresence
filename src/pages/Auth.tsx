import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import overlabsLogo from '@/assets/overlabs-logo.png';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { EmailValidation } from '@/components/auth/EmailValidation';
import { PasswordMatchValidation } from '@/components/auth/PasswordMatchValidation';
import { useLanguage } from '@/contexts/LanguageContext';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número');
const nameSchema = z.string().min(2, 'Nome deve ter pelo menos 2 caracteres');

const countries = ['argentina', 'brasil', 'chile', 'colombia', 'eua'] as const;
type Country = typeof countries[number];

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerCountry, setRegisterCountry] = useState<Country | ''>('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Forgot password form
  const [resetEmail, setResetEmail] = useState('');

  // Register form validation
  const isRegisterFormValid = useMemo(() => {
    const isNameValid = registerName.trim().length >= 2;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail);
    const isCountryValid = registerCountry !== '';
    const isPasswordValid = 
      registerPassword.length >= 8 &&
      /[a-z]/.test(registerPassword) &&
      /[A-Z]/.test(registerPassword) &&
      /[0-9]/.test(registerPassword);
    const doPasswordsMatch = registerPassword === registerConfirmPassword && registerPassword.length > 0;
    
    return isNameValid && isEmailValid && isCountryValid && isPasswordValid && doPasswordsMatch;
  }, [registerName, registerEmail, registerCountry, registerPassword, registerConfirmPassword]);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateLoginForm = () => {
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: error.errors[0].message,
        });
      }
      return false;
    }
  };

  const validateRegisterForm = () => {
    try {
      nameSchema.parse(registerName);
      emailSchema.parse(registerEmail);
      passwordSchema.parse(registerPassword);
      
      if (registerPassword !== registerConfirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: 'As senhas não coincidem',
        });
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: error.errors[0].message,
        });
      }
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao entrar',
        description: error.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : error.message,
      });
    } else {
      toast({
        title: 'Bem-vindo!',
        description: 'Login realizado com sucesso.',
      });
      navigate('/');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    const { error } = await signUp(registerEmail, registerPassword, registerName, registerCountry);
    setIsLoading(false);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes('User already registered')) {
        errorMessage = 'Este email já está registrado. Tente fazer login.';
      }
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar',
        description: errorMessage,
      });
    } else {
      toast({
        title: 'Conta criada!',
        description: 'Sua conta foi criada com sucesso.',
      });
      navigate('/');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(resetEmail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: 'destructive',
          title: 'Erro de validação',
          description: error.errors[0].message,
        });
      }
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/`,
    });
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar email',
        description: error.message,
      });
    } else {
      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      setShowForgotPassword(false);
      setResetEmail('');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img 
            src={overlabsLogo} 
            alt="Overlabs - Simplify to Amplify" 
            className="h-28 w-auto mb-3"
          />
          <p className="text-2xl font-bold text-muted-foreground">Work Mode</p>
        </div>

        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <Button
              variant="ghost"
              size="sm"
              className="w-fit -ml-2 mb-2"
              onClick={() => setShowForgotPassword(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.common.back}
            </Button>
            <CardTitle>{t.auth.resetPassword}</CardTitle>
            <CardDescription>
              {t.auth.sendResetLink}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">{t.auth.email}</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.common.loading}
                  </>
                ) : (
                  t.auth.sendResetLink
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.auth.tagline}
      </p>
    </div>
  );
}

return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <img 
          src={overlabsLogo} 
          alt="Overlabs - Simplify to Amplify" 
          className="h-28 w-auto mb-3"
        />
        <p className="text-2xl font-bold text-muted-foreground">Work Mode</p>
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <Tabs defaultValue="login" className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t.auth.signIn}</TabsTrigger>
              <TabsTrigger value="register">{t.auth.signUp}</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            {/* Login Tab */}
            <TabsContent value="login" className="mt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t.auth.email}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">{t.auth.password}</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="px-0 h-auto font-normal text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setShowForgotPassword(true)}
                >
                  {t.auth.forgotPassword}
                </Button>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.common.loading}
                    </>
                  ) : (
                    t.auth.signIn
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="mt-0">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">{t.auth.fullName}</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Seu nome"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">{t.auth.email}</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <EmailValidation email={registerEmail} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-country">{t.auth.country}</Label>
                  <Select
                    value={registerCountry}
                    onValueChange={(value: Country) => setRegisterCountry(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="register-country">
                      <SelectValue placeholder={t.auth.selectCountry} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {t.auth.countries[country]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">{t.auth.password}</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <PasswordRequirements password={registerPassword} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm">{t.auth.confirmPassword}</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <PasswordMatchValidation 
                    password={registerPassword} 
                    confirmPassword={registerConfirmPassword} 
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !isRegisterFormValid}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.common.loading}
                    </>
                  ) : (
                    t.auth.signUp
                  )}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.auth.tagline}
      </p>
    </div>
  );
}