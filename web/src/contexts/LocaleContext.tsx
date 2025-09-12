'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { messages as enMessages } from '@/data/messages/en';
import { messages as esMessages } from '@/data/messages/es';

type Locale = 'en' | 'es';

interface Messages {
  [key: string]: string | Messages;
}

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Pre-loaded messages for better performance and reliability
const messageMap = {
  en: enMessages,
  es: esMessages,
} as const;

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Messages>(messageMap.en);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setMessages(messageMap[newLocale]);
    localStorage.setItem('locale', newLocale);
  };

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'es')) {
      setLocaleState(savedLocale);
      setMessages(messageMap[savedLocale]);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

// Helper function to get translated text
export function useTranslation() {
  const { messages } = useLocale();
  
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: string | Messages | undefined = messages;
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    return (typeof value === 'string' ? value : defaultValue) || key;
  };

  return { t };
}
