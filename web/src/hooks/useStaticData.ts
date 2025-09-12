// Custom hook for accessing static data without fetch
import { 
  aggregatedStats, 
  crewHealthData, 
  modelMetadata, 
  rawCrewData, 
  realMetrics 
} from '@/data/static';

// Type definitions for better type safety
export type AggregatedStats = typeof aggregatedStats;
export type CrewHealthData = typeof crewHealthData;
export type ModelMetadata = typeof modelMetadata;
export type RawCrewData = typeof rawCrewData;
export type RealMetrics = typeof realMetrics;

// Hook to provide all static data
export function useStaticData() {
  return {
    aggregatedStats,
    crewHealthData,
    modelMetadata,
    rawCrewData,
    realMetrics,
  } as const;
}

// Individual hooks for specific data types
export function useAggregatedStats() {
  return aggregatedStats;
}

export function useCrewHealthData() {
  return crewHealthData;
}

export function useModelMetadata() {
  return modelMetadata;
}

export function useRawCrewData() {
  return rawCrewData;
}

export function useRealMetrics() {
  return realMetrics;
}