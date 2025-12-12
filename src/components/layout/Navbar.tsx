import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Settings,
  Users,
  BarChart3,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import overlabsLogo from '@/assets/overlabs-logo.png';
import { LanguageSelector } from '@/components/LanguageSelector';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={overlabsLogo} 
                alt="Overlabs" 
                className="h-8 w-auto"
              />
              <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                Work Mode
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden flex-1 max-w-md mx-8 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.navbar.searchPlaceholder}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                {t.navbar.reports}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/charts">
                <PieChart className="mr-2 h-4 w-4" />
                {t.navbar.charts}
              </Link>
            </Button>
            {isAdmin && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <Users className="mr-2 h-4 w-4" />
                  {t.navbar.admin}
                </Link>
              </Button>
            )}

            <LanguageSelector />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t.navbar.profile}</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.navbar.settings}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.navbar.signOut}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden',
            isMobileMenuOpen ? 'block' : 'hidden'
          )}
        >
          <div className="space-y-4 pb-4 pt-2">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.navbar.searchPlaceholder}
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-background"
              />
            </div>

            {/* Mobile Nav Items */}
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/reports">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {t.navbar.reports}
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link to="/charts">
                  <PieChart className="mr-2 h-4 w-4" />
                  {t.navbar.charts}
                </Link>
              </Button>
              {isAdmin && (
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/admin">
                    <Users className="mr-2 h-4 w-4" />
                    {t.navbar.admin}
                  </Link>
                </Button>
              )}
              <Button variant="ghost" className="justify-start" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>
                <User className="mr-2 h-4 w-4" />
                {t.navbar.profile}
              </Button>
              {isAdmin && (
                <Button variant="ghost" className="justify-start" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t.navbar.settings}
                </Button>
              )}
              <div className="flex items-center gap-2 px-4 py-2">
                <LanguageSelector />
              </div>
              <Button
                variant="ghost"
                className="justify-start text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t.navbar.signOut}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
