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
        className="flex items-center gap-1 px-2 py-1.5 rounded-md 
                 bg-yellow-400/10 border border-yellow-400/20 hover:bg-yellow-400/20 
                 text-white/90 hover:text-yellow-400 transition-all duration-300 
                 text-xs font-medium min-w-[60px] justify-center"
        aria-label={t('settings.changeLanguage')}
        title={`${t('settings.changeLanguage')}: ${currentLanguage?.name}`}
      >
        <Globe size={12} className="flex-shrink-0" />
        <span className="text-xs flex-shrink-0">{currentLanguage?.flag}</span>
        <ChevronDown 
          size={10} 
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-black/90 backdrop-blur-md
                      border border-yellow-400/20 rounded-lg shadow-lg 
                      py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 
                        hover:bg-yellow-400/10 transition-colors text-sm
                        ${locale === lang.code ? 'bg-yellow-400/20 text-yellow-400' : 'text-white/90 hover:text-yellow-400'}`}
            >
              <span className="text-xs">{lang.flag}</span>
              <span className="text-xs font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
