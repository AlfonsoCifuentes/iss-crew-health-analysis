import Link from 'next/link';
import { ArrowLeft, Brain, Users, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import StatsOverview from '@/components/StatsOverview';
import HealthMetricsChart from '@/components/charts/HealthMetricsChart';
import MissionTypesChart from '@/components/charts/MissionTypesChart';
import CrewRolesChart from '@/components/charts/CrewRolesChart';
import RealTimeMetrics from '@/components/RealTimeMetrics';

// Import data
import aggregatedStats from '@/data/aggregated_stats.json';

export const metadata = {
  title: 'Interactive Dashboard',
  description: 'Real-time analysis and visualization of ISS crew health data from NASA LSDA',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen py-8 relative">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            ISS Crew Health Dashboard
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Comprehensive analysis of International Space Station crew health data using NASA LSDA. 
            Explore real-time metrics, correlations, and predictive insights from microgravity research.
          </p>
        </div>

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

        {/* Health Impact Analysis */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Real-Time Metrics */}
            <div>
              <RealTimeMetrics />
            </div>

            {/* Health Metrics Chart */}
            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-cosmic-white">Health Impact Analysis</h3>
              </div>
              <HealthMetricsChart 
                data={{
                  bone_density_change_avg: aggregatedStats.key_metrics.bone_density_change_avg,
                  muscle_mass_change_avg: aggregatedStats.key_metrics.muscle_mass_change_avg
                }} 
              />
              <div className="mt-4 p-4 bg-black/30 rounded-lg">
                <p className="text-sm text-white/80">
                  <span className="font-semibold text-yellow-400">Bone Density:</span> Average loss of {Math.abs(Math.round(aggregatedStats.key_metrics.bone_density_change_avg * 100 * 10) / 10)}% during missions
                  <br />
                  <span className="font-semibold text-blue-400">Muscle Mass:</span> Average loss of {Math.abs(Math.round(aggregatedStats.key_metrics.muscle_mass_change_avg * 100 * 10) / 10)}% in microgravity
                </p>
              </div>
            </div>

            {/* Mission Types Distribution */}
            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-cosmic-white">Mission Distribution</h3>
              </div>
              <MissionTypesChart data={aggregatedStats.mission_types} />
              <div className="mt-4 p-4 bg-space-deep/30 rounded-lg">
                <p className="text-sm text-cosmic-white/80">
                  <span className="font-semibold text-yellow-400">Total Missions:</span> {Object.values(aggregatedStats.mission_types).reduce((a, b) => a + b, 0)}
                  <br />
                  <span className="font-semibold text-blue-400">Most Common:</span> Standard Expeditions ({aggregatedStats.mission_types.ISS_Expedition_standard} missions)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Crew Roles and Correlations */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cosmic-white mb-8 flex items-center space-x-3 font-orbitron">
            <Users className="w-8 h-8 text-blue-400" />
            <span>Crew Analysis</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Crew Roles */}
            <div className="card-cosmic p-8 interactive-glow">
              <h3 className="text-2xl font-bold text-cosmic-white mb-6">Crew Roles Distribution</h3>
              <div className="h-80">
                <CrewRolesChart
                  data={aggregatedStats.crew_roles}
                />
              </div>
              <div className="mt-4 p-4 bg-space-deep/30 rounded-lg">
                <p className="text-sm text-cosmic-white/80">
                  <span className="font-semibold text-yellow-400">Total Roles:</span> {Object.values(aggregatedStats.crew_roles).reduce((a, b) => a + b, 0)} assignments
                  <br />
                  <span className="font-semibold text-yellow-400">Most Common:</span> Mission Commander ({aggregatedStats.crew_roles.CDR} assignments)
                </p>
              </div>
            </div>

            {/* Health Correlations */}
            <div className="card-cosmic p-8 interactive-glow">
              <h3 className="text-2xl font-bold text-cosmic-white mb-6">Health Correlations</h3>
              <div className="space-y-6">
                <div className="p-4 bg-yellow-400/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cosmic-white font-medium">Bone-Muscle Correlation</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      {Math.round(aggregatedStats.correlations.bone_muscle_correlation * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-space-deep/50 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${aggregatedStats.correlations.bone_muscle_correlation * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-cosmic-white/80 mt-3">
                    Strong positive correlation between bone density loss and muscle mass reduction in microgravity environment.
                  </p>
                </div>

                <div className="p-4 bg-blue-400/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cosmic-white font-medium">Outlier Detection</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {aggregatedStats.outlier_analysis.total_outliers}
                    </span>
                  </div>
                  <p className="text-sm text-cosmic-white/80">
                    {Math.round(aggregatedStats.outlier_analysis.outlier_percentage)}% of crew members show unusual health patterns requiring specialized monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="text-center">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/simulators" 
              className="btn-cosmic inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Brain className="w-5 h-5" />
              <span>Try Mars Mission Simulator</span>
            </Link>
            <Link 
              href="/astronauts" 
              className="btn-outline-cosmic inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Users className="w-5 h-5" />
              <span>Explore Crew Profiles</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
