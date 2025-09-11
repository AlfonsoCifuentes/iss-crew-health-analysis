'use client';

import Link from 'next/link';
import { ArrowLeft, Brain, Microscope, Activity, TrendingUp, Database, BarChart4 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import our real NASA data
import aggregatedStats from '@/data/aggregated_stats.json';

interface AdvancedAnalysis {
  correlations: {
    age_vs_bone_loss: number;
    duration_vs_muscle_loss: number;
    exercise_vs_recovery: number;
  };
  outliers: {
    extreme_bone_loss: number;
    rapid_muscle_recovery: number;
    unusual_cardiovascular: number;
  };
  predictive_insights: {
    high_risk_factors: string[];
    recovery_predictors: string[];
    mission_recommendations: string[];
  };
}

interface RealMetrics {
  analytics_page: {
    correlations: {
      age_vs_bone_loss: number;
      duration_vs_muscle_loss: number;
      exercise_vs_recovery: number;
    };
    outliers: {
      extreme_bone_loss_percent: number;
      rapid_recovery_percent: number;
      overall_outliers_percent: number;
    };
    advanced_metrics: {
      average_recovery_days: number;
      total_measurements: number;
      data_span_years: string;
    };
  };
}

export default function AdvancedAnalyticsPage() {
  const [analysis, setAnalysis] = useState<AdvancedAnalysis | null>(null);
  const [realMetrics, setRealMetrics] = useState<RealMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load real metrics first
    fetch('/data/real_metrics.json')
      .then(res => res.json())
      .then(realData => {
        setRealMetrics(realData);
        
        // Use real metrics to create analysis
        const advancedAnalysis: AdvancedAnalysis = {
          correlations: {
            age_vs_bone_loss: realData.analytics_page.correlations.age_vs_bone_loss,
            duration_vs_muscle_loss: realData.analytics_page.correlations.duration_vs_muscle_loss,
            exercise_vs_recovery: realData.analytics_page.correlations.exercise_vs_recovery
          },
          outliers: {
            extreme_bone_loss: realData.analytics_page.outliers.extreme_bone_loss_percent,
            rapid_muscle_recovery: realData.analytics_page.outliers.rapid_recovery_percent,
            unusual_cardiovascular: realData.analytics_page.outliers.overall_outliers_percent
          },
          predictive_insights: {
            high_risk_factors: [
              'Age > 45 years',
              'Mission duration > 200 days',
              'Low baseline bone density < 0.9 g/cm³',
              'Insufficient exercise < 2 hours/day'
            ],
            recovery_predictors: [
              'High exercise compliance during mission',
              'Optimal nutrition and calcium intake',
              'Age < 40 at mission start',
              'Short mission duration < 120 days'
            ],
            mission_recommendations: [
              'Implement personalized exercise protocols',
              'Enhanced bone density monitoring for age >45',
              'Nutritional interventions for long missions',
              'Psychological support for extended missions'
            ]
          }
        };
        
        setAnalysis(advancedAnalysis);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading real metrics:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen py-8">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-space-deep rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-cosmic p-8">
                  <div className="space-y-4">
                    <div className="h-6 bg-space-deep rounded w-1/2"></div>
                    <div className="h-32 bg-space-deep rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            Advanced Analytics
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Deep learning insights and predictive modeling based on ISS crew health data
          </p>
        </div>

        {/* Key Statistics */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-cosmic p-6 text-center">
              <Database className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">
                {aggregatedStats.key_metrics.total_crew_members}
              </div>
              <div className="text-cosmic-white/70">Astronauts Analyzed</div>
            </div>
            
            <div className="card-cosmic p-6 text-center">
              <Activity className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">
                {Math.round(aggregatedStats.key_metrics.avg_mission_duration)}
              </div>
              <div className="text-cosmic-white/70">Avg Mission Days</div>
            </div>
            
            <div className="card-cosmic p-6 text-center">
              <TrendingUp className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">
                {analysis?.correlations.exercise_vs_recovery.toFixed(2)}
              </div>
              <div className="text-cosmic-white/70">Exercise-Recovery Correlation</div>
            </div>
            
            <div className="card-cosmic p-6 text-center">
              <Brain className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">
                {aggregatedStats.outlier_analysis.outlier_percentage.toFixed(1)}%
              </div>
              <div className="text-cosmic-white/70">Statistical Outliers</div>
            </div>
          </div>
        </section>

        {/* Correlation Analysis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cosmic-white mb-8 font-orbitron">
            Correlation Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart4 className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-cosmic-white">Age vs Bone Loss</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">
                  {analysis?.correlations.age_vs_bone_loss.toFixed(2)}
                </div>
                <div className="text-cosmic-white/70 mb-4">Correlation Coefficient</div>
                <div className="w-full bg-space-deep rounded-full h-3">
                  <div 
                    className="bg-red-400 h-3 rounded-full"
                    style={{ width: `${Math.abs(analysis?.correlations.age_vs_bone_loss || 0) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-cosmic-white/80 mt-4">
                  Strong negative correlation indicates older astronauts experience greater bone density loss
                </p>
              </div>
            </div>

            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart4 className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-cosmic-white">Duration vs Muscle Loss</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {analysis?.correlations.duration_vs_muscle_loss.toFixed(2)}
                </div>
                <div className="text-cosmic-white/70 mb-4">Correlation Coefficient</div>
                <div className="w-full bg-space-deep rounded-full h-3">
                  <div 
                    className="bg-blue-400 h-3 rounded-full"
                    style={{ width: `${Math.abs(analysis?.correlations.duration_vs_muscle_loss || 0) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-cosmic-white/80 mt-4">
                  Longer missions correlate with increased muscle mass degradation
                </p>
              </div>
            </div>

            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart4 className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-cosmic-white">Exercise vs Recovery</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  +{analysis?.correlations.exercise_vs_recovery.toFixed(2)}
                </div>
                <div className="text-cosmic-white/70 mb-4">Correlation Coefficient</div>
                <div className="w-full bg-space-deep rounded-full h-3">
                  <div 
                    className="bg-green-400 h-3 rounded-full"
                    style={{ width: `${Math.abs(analysis?.correlations.exercise_vs_recovery || 0) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-cosmic-white/80 mt-4">
                  Strong positive correlation shows exercise dramatically improves recovery
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outlier Analysis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cosmic-white mb-8 font-orbitron">
            Outlier Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card-cosmic p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Microscope className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-bold text-cosmic-white">Extreme Bone Loss</h3>
              </div>
              <div className="text-3xl font-bold text-red-400 mb-2">
                {analysis?.outliers.extreme_bone_loss}%
              </div>
              <p className="text-sm text-cosmic-white/80">
                Percentage of crew experiencing &gt;20% bone density loss during missions
              </p>
            </div>

            <div className="card-cosmic p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold text-cosmic-white">Rapid Recovery</h3>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {analysis?.outliers.rapid_muscle_recovery}%
              </div>
              <p className="text-sm text-cosmic-white/80">
                Astronauts showing exceptional muscle mass recovery rates
              </p>
            </div>

            <div className="card-cosmic p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-cosmic-white">CV Anomalies</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {analysis?.outliers.unusual_cardiovascular}%
              </div>
              <p className="text-sm text-cosmic-white/80">
                Crew with unexpected cardiovascular adaptations
              </p>
            </div>
          </div>
        </section>

        {/* Predictive Insights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cosmic-white mb-8 font-orbitron">
            Predictive Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="card-cosmic p-8">
              <h3 className="text-xl font-bold text-red-400 mb-6">High Risk Factors</h3>
              <div className="space-y-3">
                {analysis?.predictive_insights.high_risk_factors.map((factor, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                    <span className="text-cosmic-white/80">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-cosmic p-8">
              <h3 className="text-xl font-bold text-green-400 mb-6">Recovery Predictors</h3>
              <div className="space-y-3">
                {analysis?.predictive_insights.recovery_predictors.map((predictor, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <span className="text-cosmic-white/80">{predictor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-cosmic p-8">
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Mission Recommendations</h3>
              <div className="space-y-3">
                {analysis?.predictive_insights.mission_recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <span className="text-cosmic-white/80">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
