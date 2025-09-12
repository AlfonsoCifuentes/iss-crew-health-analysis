'use client';

import { useAggregatedStats } from '@/hooks/useStaticData';

export default function RealStatsSection() {
  const aggregatedStats = useAggregatedStats();
  const stats = aggregatedStats.key_metrics;

  return (
    <section className="py-20 px-6 sm:px-8 lg:px-12 bg-space-dark/80 backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-2">
              {stats.total_crew_members}
            </div>
            <div className="text-xs md:text-base text-white/70">Real Astronauts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-blue-400 mb-2">
              {Math.round(stats.avg_mission_duration)}
            </div>
            <div className="text-xs md:text-base text-white/70">Avg Mission Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-2">
              {stats.avg_age.toFixed(1)}
            </div>
            <div className="text-xs md:text-base text-white/70">Avg Age (years)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-blue-400 mb-2">
              {(Math.abs(stats.bone_density_change_avg) * 100).toFixed(1)}%
            </div>
            <div className="text-xs md:text-base text-white/70">Avg Bone Loss</div>
          </div>
        </div>
      </div>
    </section>
  );
}
