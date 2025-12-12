import { useLanguage } from '@/contexts/LanguageContext';
import { Language, languageFlags } from '@/translations';
import { useState } from 'react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: languageFlags.pt },
  { code: 'en', label: 'English', flag: languageFlags.en },
  { code: 'es', label: 'Español', flag: languageFlags.es },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((l) => l.code === language);
  const otherLanguages = languages.filter((l) => l.code !== language);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors text-xl"
        aria-label="Select language"
      >
        {currentLanguage?.flag}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-md shadow-md py-1 min-w-[120px] z-50">
          {otherLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              <span className="text-lg">{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
