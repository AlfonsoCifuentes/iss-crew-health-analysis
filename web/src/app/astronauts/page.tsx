'use client';

import Link from 'next/link';
import { ArrowLeft, Users, User, Activity, Heart, TrendingDown, TrendingUp, Filter } from 'lucide-react';
import AstronautComparisonSystem from '@/components/AstronautComparisonSystem';
import { useRealMetrics, useAggregatedStats } from '@/hooks/useStaticData';

export default function AstronautsPage() {
  const realMetrics = useRealMetrics();
  const aggregatedStats = useAggregatedStats();

  // Calculate some example crew statistics
  const totalCrew = aggregatedStats.key_metrics.total_crew_members;
  const avgAge = Math.round(aggregatedStats.key_metrics.avg_age);
  
  return (
    <main className="min-h-screen py-8 relative overflow-hidden">
      
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
            Astronaut Health Profiles
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Comprehensive individual crew member analysis from NASA LSDA data. Explore detailed 
            health profiles, mission timelines, and comparative studies across ISS expeditions.
          </p>
        </div>

        {/* Summary Stats */}
        <section className="mb-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="card-cosmic p-6 text-center interactive-glow">
              <Users className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">{totalCrew}</div>
              <div className="text-cosmic-white/70">Total Crew Members</div>
            </div>
            
            <div className="card-cosmic p-6 text-center interactive-glow">
              <User className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">{avgAge}</div>
              <div className="text-cosmic-white/70">Average Age (Years)</div>
            </div>
            
            <div className="card-cosmic p-6 text-center interactive-glow">
              <Activity className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">
                {realMetrics?.astronauts_page.health_metrics_count || '9'}
              </div>
              <div className="text-cosmic-white/70">Health Metrics</div>
            </div>
            
            <div className="card-cosmic p-6 text-center interactive-glow">
              <Heart className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-cosmic-white mb-2">
                {realMetrics?.astronauts_page.data_completeness_percent || '100'}%
              </div>
              <div className="text-cosmic-white/70">Data Completeness</div>
            </div>
          </div>
        </section>

        {/* Crew Roles Distribution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-star-gold mb-8 flex items-center space-x-3 font-orbitron">
            <Users className="w-8 h-8 text-yellow-400" />
            <span>Crew Roles & Distribution</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(aggregatedStats.crew_roles).map(([role, count]) => {
              const percentage = Math.round((count / totalCrew) * 100);
              const getIconForRole = (role: string) => {
                switch(role) {
                  case 'CDR': return <Users className="w-6 h-6 text-yellow-400" />;
                  case 'FE1': return <User className="w-6 h-6 text-blue-400" />;
                  case 'FE2': return <User className="w-6 h-6 text-yellow-400" />;
                  case 'FE3': return <User className="w-6 h-6 text-blue-400" />;
                  default: return <User className="w-6 h-6 text-cosmic-white" />;
                }
              };
              
              return (
                <div key={role} className="card-cosmic p-6 interactive-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getIconForRole(role)}
                      <span className="font-semibold text-cosmic-white">{role}</span>
                    </div>
                    <div className="text-2xl font-bold text-cosmic-white">{count}</div>
                  </div>
                  <div className="w-full bg-space-deep/50 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-cosmic-white/70">{percentage}% of crew</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Health Metrics Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-star-gold mb-8 flex items-center space-x-3 font-orbitron">
            <Activity className="w-8 h-8 text-yellow-400" />
            <span>Health Metrics Analysis</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Key Health Impacts */}
            <div className="card-cosmic p-8 interactive-glow">
              <h3 className="text-2xl font-bold text-cosmic-white mb-6">Key Health Impacts</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-yellow-400/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-5 h-5 text-yellow-400" />
                    <span className="text-cosmic-white">Bone Density Loss</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-yellow-400">
                      {Math.abs(Math.round(aggregatedStats.key_metrics.bone_density_change_avg * 100 * 10) / 10)}%
                    </span>
                    <div className="text-xs text-cosmic-white/60">Average Impact</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-400/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-5 h-5 text-blue-400" />
                    <span className="text-cosmic-white">Muscle Mass Loss</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-400">
                      {Math.abs(Math.round(aggregatedStats.key_metrics.muscle_mass_change_avg * 100 * 10) / 10)}%
                    </span>
                    <div className="text-xs text-cosmic-white/60">Average Impact</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-star-gold/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                    <span className="text-cosmic-white">Correlation Factor</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-yellow-400">
                      {Math.round(aggregatedStats.correlations.bone_muscle_correlation * 100)}%
                    </span>
                    <div className="text-xs text-cosmic-white/60">Bone-Muscle Link</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistical Insights */}
            <div className="card-cosmic p-8 interactive-glow">
              <h3 className="text-2xl font-bold text-cosmic-white mb-6">Statistical Insights</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-space-deep/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cosmic-white font-medium">Data Quality</span>
                    <span className="text-nebula-cyan font-bold">High</span>
                  </div>
                  <p className="text-sm text-cosmic-white/80">
                    Comprehensive health records with {realMetrics?.astronauts_page.health_metrics_count || '9'} metrics per crew member
                  </p>
                </div>
                
                <div className="p-4 bg-space-deep/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cosmic-white font-medium">Outlier Detection</span>
                    <span className="text-nebula-pink font-bold">{aggregatedStats.outlier_analysis.total_outliers}</span>
                  </div>
                  <p className="text-sm text-cosmic-white/80">
                    {Math.round(aggregatedStats.outlier_analysis.outlier_percentage)}% of crew show unusual health patterns
                  </p>
                </div>
                
                <div className="p-4 bg-space-deep/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cosmic-white font-medium">Mission Types</span>
                    <span className="text-star-gold font-bold">3 Categories</span>
                  </div>
                  <p className="text-sm text-cosmic-white/80">
                    Standard ({aggregatedStats.mission_types.ISS_Expedition_standard}), 
                    Short ({aggregatedStats.mission_types.ISS_Expedition_short}), 
                    Long ({aggregatedStats.mission_types.ISS_Expedition_long}) duration missions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Astronaut Comparison System */}
        <section className="mb-16">
          <AstronautComparisonSystem maxCompare={3} />
        </section>

        {/* Individual Profile Preview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-star-gold mb-8 font-orbitron">
            Individual Crew Analysis
          </h2>
          
          <div className="card-cosmic p-8 interactive-glow text-center">
            <div className="w-20 h-20 bg-nebula-cyan rounded-full mx-auto mb-8 flex items-center justify-center">
              <Filter className="w-10 h-10 text-cosmic-white" />
            </div>
            
            <h3 className="text-3xl font-bold text-cosmic-white mb-6">
              Advanced Individual Analysis
            </h3>
            
            <p className="text-lg text-cosmic-white/80 mb-8 max-w-3xl mx-auto">
              Detailed individual crew profiles are being developed with personalized health timelines, 
              mission-specific adaptations, and comparative analysis tools. This will include:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <User className="w-8 h-8 text-nebula-cyan mx-auto mb-3" />
                <div className="text-sm text-cosmic-white/90">Personal Health Profiles</div>
              </div>
              <div className="text-center">
                <Activity className="w-8 h-8 text-star-gold mx-auto mb-3" />
                <div className="text-sm text-cosmic-white/90">Mission Timeline Analysis</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-nebula-purple mx-auto mb-3" />
                <div className="text-sm text-cosmic-white/90">Comparative Studies</div>
              </div>
              <div className="text-center">
                <Heart className="w-8 h-8 text-nebula-pink mx-auto mb-3" />
                <div className="text-sm text-cosmic-white/90">Risk Assessment</div>
              </div>
            </div>
            
            <Link 
              href="/dashboard" 
              className="btn-cosmic inline-flex items-center space-x-2"
            >
              <Activity className="w-5 h-5" />
              <span>Explore Dashboard Analytics</span>
            </Link>
          </div>
        </section>

        {/* Navigation */}
        <section className="text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/dashboard" 
              className="btn-cosmic inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Activity className="w-5 h-5" />
              <span>View Health Dashboard</span>
            </Link>
            <Link 
              href="/simulators" 
              className="btn-outline-cosmic inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Try Mission Simulators</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
