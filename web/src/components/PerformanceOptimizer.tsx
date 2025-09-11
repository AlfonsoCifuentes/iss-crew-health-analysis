'use client';

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Skeleton loader component
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="h-48 bg-gray-700 rounded"></div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="h-8 bg-gray-700 rounded w-1/3"></div>
    </div>
  </div>
);

// Performance optimized wrapper component
interface PerformanceWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const PerformanceWrapper = ({ 
  children, 
  fallback = <ChartSkeleton />,
  className = ""
}: PerformanceWrapperProps) => {
  return (
    <Suspense fallback={fallback}>
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          ease: "easeOut",
          staggerChildren: 0.1 
        }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};

// Lazy loaded chart components
export const LazyChart = lazy(() => 
  import('react-chartjs-2').then(module => ({ 
    default: module.Line 
  }))
);

export const LazyBarChart = lazy(() => 
  import('react-chartjs-2').then(module => ({ 
    default: module.Bar 
  }))
);

export const LazyDoughnutChart = lazy(() => 
  import('react-chartjs-2').then(module => ({ 
    default: module.Doughnut 
  }))
);

// Export skeletons for reuse
export { ChartSkeleton, CardSkeleton };

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const perfData = {
      navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
      paint: performance.getEntriesByType('paint'),
      cls: 0, // Will be populated by Speed Insights
      fid: 0, // Will be populated by Speed Insights
      lcp: 0, // Will be populated by Speed Insights
    };
    
    // Log performance data for debugging
    console.log('Performance Metrics:', perfData);
    
    return perfData;
  }
  
  return null;
};
