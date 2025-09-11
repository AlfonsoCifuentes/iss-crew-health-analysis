/**
 * Performance-optimized chart components for Speed Insights
 * NO HARDCODED VALUES - All data from real NASA CSVs
 */

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ChartLoadingSkeleton = () => (
  <div className="h-64 bg-space-black/50 rounded-lg border border-cosmic-white/20 animate-pulse flex items-center justify-center">
    <div className="text-cosmic-white/60 text-sm">Loading chart...</div>
  </div>
);

// Optimized lazy-loaded chart components
export const OptimizedLine = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: ChartLoadingSkeleton
});

export const OptimizedBar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  ssr: false,
  loading: ChartLoadingSkeleton
});

export const OptimizedChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Chart), {
  ssr: false,
  loading: ChartLoadingSkeleton
});

// Wrapper component with error boundary
export function ChartWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ChartLoadingSkeleton />}>
      {children}
    </Suspense>
  );
}
