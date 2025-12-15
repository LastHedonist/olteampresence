import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKeys } from '@/translations';
import { useAuth } from '@/contexts/AuthContext';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const countryToLanguage: Record<string, Language> = {
  brasil: 'pt',
  argentina: 'es',
  chile: 'es',
  colombia: 'es',
  eua: 'en',
};

const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('en')) return 'en';
  return 'pt'; // fallback
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved) return saved as Language;
    return detectBrowserLanguage();
  });
  const [hasAutoDetected, setHasAutoDetected] = useState(false);

  // Auto-detect language based on user profile country
  useEffect(() => {
    const manuallySet = localStorage.getItem('language_manual');
    
    if (user && profile?.country && !manuallySet) {
      const langFromCountry = countryToLanguage[profile.country.toLowerCase()];
      if (langFromCountry && langFromCountry !== language) {
        setLanguageState(langFromCountry);
        setHasAutoDetected(true);
      }
    } else if (!user && !manuallySet && !hasAutoDetected) {
      const browserLang = detectBrowserLanguage();
      if (browserLang !== language) {
        setLanguageState(browserLang);
      }
    }
  }, [user, profile?.country]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    localStorage.setItem('language_manual', 'true'); // Mark as manually selected
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
