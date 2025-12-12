import { pt, TranslationKeys } from './pt';
import { en } from './en';
import { es } from './es';

export type Language = 'pt' | 'en' | 'es';

export const translations: Record<Language, TranslationKeys> = {
  pt,
  en,
  es,
};

export type { TranslationKeys };

export const languageNames: Record<Language, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
};

export const languageFlags: Record<Language, string> = {
  pt: '🇧🇷',
  en: '🇺🇸',
  es: '🇪🇸',
};
