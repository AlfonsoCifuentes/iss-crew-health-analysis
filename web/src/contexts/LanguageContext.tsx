'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'es';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Función para obtener el valor nested de un objeto usando un string con puntos
function getNestedValue(obj: Record<string, unknown>, key: string): string {
  const result = key.split('.').reduce((current: unknown, k: string) => {
    if (current && typeof current === 'object' && current !== null && k in current) {
      return (current as Record<string, unknown>)[k];
    }
    return undefined;
  }, obj);
  
  return typeof result === 'string' ? result : key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', newLocale);
    }
  };

  const t = (key: string): string => {
    return getNestedValue(messages, key) || key;
  };

  // Cargar mensajes cuando cambie el locale
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messagesModule = await import(`../locales/${locale}.json`);
        setMessages(messagesModule.default);
      } catch (error) {
        console.error(`Failed to load messages for ${locale}:`, error);
      }
    };

    loadMessages();
  }, [locale]);

  // Cargar idioma guardado al iniciar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred-language') as Locale;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        setLocaleState(savedLanguage);
      } else {
        // Detectar idioma del navegador
        const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
        setLocaleState(browserLang);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
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

// Hook para usar traducciones de manera más simple
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
