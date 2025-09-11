// ISS Crew Health Analysis - TypeScript Type Definitions
// Generated from NASA LSDA data structure

export interface CrewMember {
  mission_duration_days: number;
  crew_age: number;
  pre_flight_bone_density: number;
  exercise_hours_per_week: number;
  bone_density_change: number;
  muscle_mass_change: number;
  cardiovascular_change: number;
  psychological_score_change: number;
  mission_type: 'ISS_Expedition_standard' | 'ISS_Expedition_long';
  crew_role: 'CDR' | 'FE1' | 'FE2' | 'FE3';
  data_source: string;
  study_references: string;
  crew_age_numeric: number;
  bone_related: boolean;
  muscle_related: boolean;
  cardio_related: boolean;
  outliers_iqr: boolean;
  outliers_zscore: boolean;
  outliers_isolation: boolean;
  outlier_consensus: number;
}

export interface CrewHealthDataset {
  metadata: {
    total_records: number;
    total_features: number;
    last_updated: string;
    source: string;
  };
  statistics: {
    numerical_summary: Record<string, Record<string, number>>;
    missing_values: Record<string, number>;
    data_types: Record<string, string>;
  };
  records: CrewMember[];
}

export interface CrewRecord {
  id: string;
  name?: string;
  age?: number;
  mission_duration?: number;
  role?: string;
  health_metrics?: Record<string, number>;
  [key: string]: unknown;
}

export interface RawCrewDataset {
  metadata: {
    total_records: number;
    source: string;
    last_updated: string;
  };
  records: CrewRecord[];
}

export interface ModelMetadata {
  metadata: {
    total_models: number;
    last_updated: string;
    source: string;
  };
  models: Record<string, {
    type: string;
    parameters?: Record<string, string | number | boolean>;
    description?: string;
  }>;
}

export interface AggregatedStats {
  key_metrics: {
    total_crew_members: number;
    avg_mission_duration: number;
    avg_age: number;
    bone_density_change_avg: number;
    muscle_mass_change_avg: number;
  };
  mission_types: Record<string, number>;
  crew_roles: Record<string, number>;
  correlations: {
    bone_muscle_correlation: number;
  };
  outlier_analysis: {
    total_outliers: number;
    outlier_percentage: number;
  };
}

export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
  crew_role?: string;
  mission_type?: string;
}

export interface HealthMetricTrend {
  metric_name: string;
  timeline: {
    date: string;
    value: number;
    crew_member_id?: string;
  }[];
  average_trend: number;
  correlation_with_duration: number;
}

export interface MissionPrediction {
  duration_days: number;
  predicted_bone_density_change: number;
  predicted_muscle_mass_change: number;
  predicted_cardiovascular_change: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendations: string[];
}

export interface FilterOptions {
  mission_types: string[];
  crew_roles: string[];
  age_range: {
    min: number;
    max: number;
  };
  duration_range: {
    min: number;
    max: number;
  };
}

export interface DashboardMetrics {
  total_missions: number;
  total_crew_members: number;
  average_mission_duration: number;
  critical_health_changes: number;
  success_rate: number;
}

// Utility types for charts and visualizations
export type ChartType = 'line' | 'bar' | 'scatter' | 'heatmap' | 'pie' | 'radar';

export interface ChartConfig {
  type: ChartType;
  title: string;
  subtitle?: string;
  xAxis: {
    label: string;
    field: keyof CrewMember;
  };
  yAxis: {
    label: string;
    field: keyof CrewMember;
  };
  colorBy?: keyof CrewMember;
  filterBy?: Partial<FilterOptions>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

export interface HealthAnalysisResult {
  crew_member: CrewMember;
  risk_assessment: {
    bone_health_risk: 'Low' | 'Medium' | 'High';
    muscle_health_risk: 'Low' | 'Medium' | 'High';
    cardiovascular_risk: 'Low' | 'Medium' | 'High';
    overall_risk: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  recommendations: string[];
  similar_cases: CrewMember[];
}

// Mars Mission specific types
export interface MarsMissionScenario {
  duration_days: number;
  crew_size: number;
  exercise_protocol: 'Standard' | 'Enhanced' | 'Minimal';
  radiation_shielding: 'Basic' | 'Enhanced' | 'Advanced';
  nutrition_supplementation: boolean;
}

export interface MarsMissionPrediction {
  scenario: MarsMissionScenario;
  predictions: {
    bone_density_loss_percentage: number;
    muscle_mass_loss_percentage: number;
    cardiovascular_deconditioning: number;
    psychological_impact_score: number;
    recovery_time_days: number;
  };
  crew_survival_probability: number;
  critical_factors: string[];
}

// Interactive tool types
export interface SurvivalCalculatorInput {
  age: number;
  gender: 'Male' | 'Female';
  fitness_level: 'Poor' | 'Average' | 'Good' | 'Excellent';
  medical_conditions: string[];
  space_experience: 'None' | 'Suborbital' | 'ISS' | 'Long-duration';
}

export interface SurvivalCalculatorResult {
  survival_score: number; // 0-100
  risk_factors: {
    factor: string;
    impact: 'Low' | 'Medium' | 'High';
    description: string;
  }[];
  recommendations: string[];
  comparison_to_astronauts: {
    better_than_percentage: number;
    similar_astronauts: CrewMember[];
  };
}
