'use client';

import { useTranslation, useLocale } from '@/contexts/LocaleContext';

export default function TranslationDebug() {
  const { t } = useTranslation();
  const { locale, messages } = useLocale();
  
  // Test translations
  const testKeys = [
    'dashboard.healthCorrelations',
    'dashboard.boneMuscleCorrelation', 
    'dashboard.correlationDescription',
    'dashboard.exploreAdvancedAnalysis',
    'dashboard.advancedAnalysisDescription'
  ];

  console.log('=== TRANSLATION DEBUG ===');
  console.log('Current locale:', locale);
  console.log('Messages available:', !!messages);
  console.log('Dashboard section:', !!messages.dashboard);
  console.log('Dashboard keys count:', messages.dashboard ? Object.keys(messages.dashboard).length : 'N/A');
  
  if (messages.dashboard && typeof messages.dashboard === 'object') {
    console.log('Available dashboard keys (first 10):', Object.keys(messages.dashboard).slice(0, 10));
    console.log('Has healthCorrelations key:', 'healthCorrelations' in messages.dashboard);
  }
  
  testKeys.forEach(key => {
    const translation = t(key);
    console.log(`${key} -> ${translation}`);
  });

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg text-xs max-w-md z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Translation Debug:</h3>
      <div className="mb-2">Locale: {locale}</div>
      <div className="mb-2">Messages: {messages ? '✅' : '❌'}</div>
      <div className="mb-2">Dashboard: {messages?.dashboard ? '✅' : '❌'}</div>
      {messages?.dashboard && (
        <div className="mb-2">Dashboard keys: {Object.keys(messages.dashboard).length}</div>
      )}
      <hr className="my-2" />
      {testKeys.map(key => (
        <div key={key} className="mb-1 text-xs">
          <strong>{key}:</strong> {t(key)}
        </div>
      ))}
    </div>
  );
}