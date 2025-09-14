'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLocale, useTranslation } from '@/contexts/LocaleContext';

export default function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: 'en' | 'es') => {
    setLocale(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-yellow-500/20 
                 bg-black/20 hover:bg-yellow-400/10 hover:border-yellow-400/40
                 text-white/80 hover:text-yellow-400 transition-all duration-300"
        aria-label={t('settings.changeLanguage')}
      >
        <Globe size={14} className="flex-shrink-0" />
        <span className="text-xs">{currentLanguage?.flag}</span>
        <span className="text-xs font-medium hidden xl:block">{currentLanguage?.name}</span>
        <ChevronDown 
          size={12} 
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-black/90 backdrop-blur-md
                      border border-yellow-500/20 rounded-lg shadow-xl 
                      py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 
                        hover:bg-yellow-400/10 hover:text-yellow-400 transition-colors
                        ${locale === lang.code ? 'bg-yellow-400/20 text-yellow-400 border-l-2 border-yellow-400' : 'text-white/80'}`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
