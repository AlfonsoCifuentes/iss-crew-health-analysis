'use client';

import { useTranslation } from '@/contexts/LocaleContext';

export default function TranslationDebug() {
  const { t } = useTranslation();
  
  // Test translations
  const testKeys = [
    'dashboard.healthCorrelations',
    'dashboard.boneMuscleCorrelation', 
    'dashboard.correlationDescription',
    'dashboard.exploreAdvancedAnalysis',
    'dashboard.advancedAnalysisDescription'
  ];

  console.log('=== TRANSLATION DEBUG ===');
  testKeys.forEach(key => {
    const translation = t(key);
    console.log(`${key} -> ${translation}`);
  });

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Translation Debug:</h3>
      {testKeys.map(key => (
        <div key={key} className="mb-1">
          <strong>{key}:</strong> {t(key)}
        </div>
      ))}
    </div>
  );
}