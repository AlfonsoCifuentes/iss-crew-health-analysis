'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Users, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import StatsOverview from '@/components/StatsOverview';
import HealthMetricsChart from '@/components/charts/HealthMetricsChart';
import MissionTypesChart from '@/components/charts/MissionTypesChart';
import CrewRolesChart from '@/components/charts/CrewRolesChart';
import RealTimeMetrics from '@/components/RealTimeMetrics';
import DataExportSystem from '@/components/DataExportSystem';
import LanguageDemo from '@/components/LanguageDemo';
import { useTranslation } from '@/contexts/LocaleContext';

interface AggregatedStats {
  key_metrics: {
    total_crew_members: number;
    avg_mission_duration: number;
    avg_age: number;
    bone_density_change_avg: number;
    muscle_mass_change_avg: number;
  };
  mission_types: {
    ISS_Expedition_standard: number;
    ISS_Expedition_short: number;  
    ISS_Expedition_long: number;
  };
  crew_roles: {
    CDR: number;
    FE1: number;
    FE2: number;
    FE3: number;
  };
  correlations: {
    bone_muscle_correlation: number;
  };
  outlier_analysis: {
    total_outliers: number;
    outlier_percentage: number;
  };
}

export default function DashboardPage() {
  const [aggregatedStats, setAggregatedStats] = useState<AggregatedStats | null>(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    fetch('/data/aggregated_stats.json')
      .then(res => res.json())
      .then(data => {
        setAggregatedStats(data);
      })
      .catch(error => {
        console.error('Error loading dashboard data:', error);
      });
  }, []);

  if (!aggregatedStats) {
    return (
      <main className="min-h-screen py-8 relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-cosmic-white/70">Loading real NASA data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 relative">
      <div className="w-full px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            {t('dashboard.title')}
          </h1>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xl text-cosmic-white/80 max-w-4xl mb-4 lg:mb-0">
              {t('dashboard.subtitle')}
            </p>
            <DataExportSystem />
          </div>
        </div>

        {/* Language Demo */}
        <section className="mb-12">
          <LanguageDemo />
        </section>

        {/* Key Statistics Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <span>Mission Statistics</span>
          </h2>
          <StatsOverview 
            stats={{
              total_crew_members: aggregatedStats.key_metrics.total_crew_members,
              avg_mission_duration: aggregatedStats.key_metrics.avg_mission_duration,
              avg_age: aggregatedStats.key_metrics.avg_age,
              outlier_percentage: aggregatedStats.outlier_analysis.outlier_percentage
            }}
          />
        </section>

        {/* Health Metrics Analysis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <Brain className="w-8 h-8 text-yellow-400" />
            <span>Health Impact Analysis</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">Health Metrics Timeline</h3>
              <HealthMetricsChart 
                data={{
                  bone_density_change_avg: aggregatedStats.key_metrics.bone_density_change_avg,
                  muscle_mass_change_avg: aggregatedStats.key_metrics.muscle_mass_change_avg
                }}
              />
            </div>
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">Key Findings</h3>
              <ul className="space-y-3 text-cosmic-white/80">
                <li>
                  <span className="font-semibold text-yellow-400">Bone Density:</span> Average loss of {Math.abs(Math.round(aggregatedStats.key_metrics.bone_density_change_avg * 100 * 10) / 10)}% during spaceflight
                </li>
                <li>
                  <span className="font-semibold text-blue-400">Muscle Mass:</span> Average loss of {Math.abs(Math.round(aggregatedStats.key_metrics.muscle_mass_change_avg * 100 * 10) / 10)}% in microgravity
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mission Types Distribution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <BarChart3 className="w-8 h-8 text-yellow-400" />
            <span>Mission Types Distribution</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-cosmic p-6">
              <MissionTypesChart data={aggregatedStats.mission_types} />
            </div>
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">Mission Insights</h3>
              <ul className="space-y-3 text-cosmic-white/80">
                <li>
                  <span className="font-semibold text-yellow-400">Total Missions:</span> {Object.values(aggregatedStats.mission_types).reduce((a: number, b: number) => a + b, 0)}
                </li>
                <li>
                  <span className="font-semibold text-blue-400">Most Common:</span> Standard Expeditions ({aggregatedStats.mission_types.ISS_Expedition_standard} missions)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Crew Roles Analysis */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <Users className="w-8 h-8 text-yellow-400" />
            <span>Crew Roles & Leadership</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-cosmic p-6">
              <CrewRolesChart 
                data={aggregatedStats.crew_roles}
              />
            </div>
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">Role Distribution</h3>
              <ul className="space-y-3 text-cosmic-white/80">
                <li>
                  <span className="font-semibold text-yellow-400">Total Roles:</span> {Object.values(aggregatedStats.crew_roles).reduce((a: number, b: number) => a + b, 0)} assignments
                </li>
                <li>
                  <span className="font-semibold text-yellow-400">Most Common:</span> Mission Commander ({aggregatedStats.crew_roles.CDR} assignments)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Advanced Correlations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <PieChart className="w-8 h-8 text-yellow-400" />
            <span>Health Correlations</span>
          </h2>
          <div className="card-cosmic p-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-blue-400 mb-2">
                {Math.round(aggregatedStats.correlations.bone_muscle_correlation * 100)}%
              </div>
              <div className="text-xl text-cosmic-white/80">Bone-Muscle Loss Correlation</div>
            </div>
            
            <div className="w-full bg-space-dark/50 rounded-full h-4 mb-6">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-blue-400 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${aggregatedStats.correlations.bone_muscle_correlation * 100}%` }}
              ></div>
            </div>

            <p className="text-cosmic-white/80 text-center max-w-2xl mx-auto">
              Strong correlation indicates that bone density and muscle mass changes occur together during spaceflight, 
              suggesting shared physiological mechanisms in microgravity adaptation.
            </p>
          </div>
        </section>

        {/* Real-time Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <span>Real-time Analysis</span>
          </h2>
          <RealTimeMetrics />
        </section>

        {/* Advanced Analysis CTA */}
        <section className="mb-16">
          <div className="card-cosmic p-8 text-center">
            <h3 className="text-2xl font-bold text-cosmic-white mb-4">Explore Advanced Analysis</h3>
            <p className="text-cosmic-white/80 mb-6 max-w-2xl mx-auto">
              Apply sophisticated filters to analyze specific subsets of NASA data. 
              Filter by mission type, crew role, duration, and more to uncover detailed insights.
            </p>
            <Link 
              href="/analysis"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-300 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Advanced Analysis
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
