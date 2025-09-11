'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Messages>({});

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'es')) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Load messages for current locale
    const loadMessages = async () => {
      try {
        const response = await fetch(`/messages/${locale}.json`);
        const newMessages = await response.json();
        setMessages(newMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        // Fallback to English if error
        if (locale !== 'en') {
          const fallbackResponse = await fetch('/messages/en.json');
          const fallbackMessages = await fallbackResponse.json();
          setMessages(fallbackMessages);
        }
      }
    };

    loadMessages();
  }, [locale]);

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
