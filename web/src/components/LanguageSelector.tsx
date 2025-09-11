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
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                 text-gray-700 dark:text-gray-300 transition-colors"
        aria-label={t('settings.changeLanguage')}
      >
        <Globe size={16} />
        <span className="text-sm">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium hidden sm:block">{currentLanguage?.name}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg 
                      py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-3 py-2 text-left flex items-center gap-2 
                        hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                        ${locale === lang.code ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'}`}
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
