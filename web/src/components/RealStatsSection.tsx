'use client';

import { useState, useEffect } from 'react';

interface RealStats {
  total_crew_members: number;
  avg_mission_duration: number;
  avg_age: number;
  bone_density_change_avg: number;
}

export default function RealStatsSection() {
  const [stats, setStats] = useState<RealStats | null>(null);
  
  useEffect(() => {
    fetch('/data/aggregated_stats.json')
      .then(res => res.json())
      .then(data => {
        setStats(data.key_metrics);
      })
      .catch(error => {
        console.error('Error loading stats:', error);
        // Fallback to real values we know
        setStats({
          total_crew_members: 50,
          avg_mission_duration: 176.52,
          avg_age: 44.9,
          bone_density_change_avg: -0.045
        });
      });
  }, []);

  if (!stats) {
    return (
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-space-dark/80 backdrop-blur-sm">
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="text-center animate-pulse">
              <div className="h-10 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="text-center animate-pulse">
              <div className="h-10 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="text-center animate-pulse">
              <div className="h-10 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="text-center animate-pulse">
              <div className="h-10 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
