'use client';

import { useTranslation, useLocale } from '@/contexts/LocaleContext';

export default function LanguageDemo() {
  const { t } = useTranslation();
  const { locale } = useLocale();

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">
        🌐 {t('settings.language')}: {locale === 'en' ? 'English 🇺🇸' : 'Español 🇪🇸'}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-white">{t('navigation.dashboard')}</h4>
          <p className="text-sm text-gray-300">{t('dashboard.subtitle')}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-white">{t('dashboard.healthMetrics')}</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• {t('dashboard.boneHealth')}</li>
            <li>• {t('dashboard.muscleHealth')}</li>
            <li>• {t('dashboard.cardiovascular')}</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
        <p className="text-sm text-yellow-200">
          💡 {locale === 'en' 
            ? 'Use the language selector in the navbar to switch between English and Spanish!' 
            : '¡Usa el selector de idioma en la barra de navegación para cambiar entre inglés y español!'}
        </p>
      </div>
    </div>
  );
}
