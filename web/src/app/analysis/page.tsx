/**
 * Filtered Analysis Page - Dynamic filtering of NASA data
 * Shows real-time filtering results for ISS crew health data
 * NO HARDCODED VALUES - All data from real NASA CSVs
 */

'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, TrendingUp, BarChart3, Activity } from 'lucide-react';
import AdvancedFilterSystem from '@/components/AdvancedFilterSystem';
import DataExportSystem from '@/components/DataExportSystem';

interface CrewMember {
  name: string;
  mission_type: string;
  role: string;
  age: number;
  duration_days: number;
  country: string;
  mission_start_date: string;
  bone_density_change: number;
  muscle_mass_change: number;
  cardiovascular_change: number;
}

interface FilterState {
  missions: string[];
  roles: string[];
  ageRange: { min: number; max: number } | null;
  durationRange: { min: number; max: number } | null;
  countries: string[];
  dateRange: { start: string; end: string } | null;
}

export default function AnalysisPage() {
  const [filteredData, setFilteredData] = useState<CrewMember[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    missions: [],
    roles: [],
    ageRange: null,
    durationRange: null,
    countries: [],
    dateRange: null
  });

  const handleFilterChange = useCallback((data: CrewMember[], filters: FilterState) => {
    setFilteredData(data);
    setActiveFilters(filters);
  }, []);

  // Calculate real-time statistics from filtered data
  const statistics = {
    totalCrew: filteredData.length,
    avgAge: filteredData.length > 0 ? Math.round(filteredData.reduce((sum, member) => sum + member.age, 0) / filteredData.length) : 0,
    avgDuration: filteredData.length > 0 ? Math.round(filteredData.reduce((sum, member) => sum + member.duration_days, 0) / filteredData.length) : 0,
    avgBoneLoss: filteredData.length > 0 ? Math.round(filteredData.reduce((sum, member) => sum + member.bone_density_change, 0) / filteredData.length * 100) / 100 : 0,
    avgMuscleLoss: filteredData.length > 0 ? Math.round(filteredData.reduce((sum, member) => sum + member.muscle_mass_change, 0) / filteredData.length * 100) / 100 : 0,
    countries: [...new Set(filteredData.map(member => member.country))].length,
    missions: [...new Set(filteredData.map(member => member.mission_type))].length,
    roles: [...new Set(filteredData.map(member => member.role))].length
  };

  // Group data by mission type for visualization
  const missionGroups = filteredData.reduce((groups, member) => {
    const mission = member.mission_type;
    if (!groups[mission]) {
      groups[mission] = [];
    }
    groups[mission].push(member);
    return groups;
  }, {} as Record<string, CrewMember[]>);

  // Group data by role
  const roleGroups = filteredData.reduce((groups, member) => {
    const role = member.role;
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(member);
    return groups;
  }, {} as Record<string, CrewMember[]>);

  return (
    <main className="min-h-screen py-8 relative">
      <div className="w-full px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
                Filtered Analysis
              </h1>
              <p className="text-xl text-cosmic-white/80 max-w-4xl">
                Apply advanced filters to explore specific subsets of NASA ISS crew health data. 
                All metrics update in real-time based on your selections.
              </p>
            </div>
            <div className="flex gap-4 mt-4 lg:mt-0">
              <AdvancedFilterSystem onFilterChange={handleFilterChange} />
              <DataExportSystem />
            </div>
          </div>

          {/* Filter Summary */}
          {(activeFilters.missions.length > 0 || activeFilters.roles.length > 0 || activeFilters.countries.length > 0 || 
            activeFilters.ageRange || activeFilters.durationRange) && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-8">
              <h3 className="text-sm font-medium text-yellow-400 mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2">
                {activeFilters.missions.map(mission => (
                  <span key={mission} className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded">
                    Mission: {mission}
                  </span>
                ))}
                {activeFilters.roles.map(role => (
                  <span key={role} className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded">
                    Role: {role}
                  </span>
                ))}
                {activeFilters.countries.map(country => (
                  <span key={country} className="px-2 py-1 bg-purple-400/20 text-purple-400 text-xs rounded">
                    Country: {country}
                  </span>
                ))}
                {activeFilters.ageRange && (
                  <span className="px-2 py-1 bg-orange-400/20 text-orange-400 text-xs rounded">
                    Age: {activeFilters.ageRange.min}-{activeFilters.ageRange.max} years
                  </span>
                )}
                {activeFilters.durationRange && (
                  <span className="px-2 py-1 bg-pink-400/20 text-pink-400 text-xs rounded">
                    Duration: {activeFilters.durationRange.min}-{activeFilters.durationRange.max} days
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Statistics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <span>Real-time Statistics</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card-cosmic p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-cosmic-white">{statistics.totalCrew}</span>
              </div>
              <h3 className="text-lg font-semibold text-cosmic-white">Total Astronauts</h3>
              <p className="text-cosmic-white/60 text-sm">Matching current filters</p>
            </div>

            <div className="card-cosmic p-6">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-cosmic-white">{statistics.avgAge}</span>
              </div>
              <h3 className="text-lg font-semibold text-cosmic-white">Average Age</h3>
              <p className="text-cosmic-white/60 text-sm">Years at mission start</p>
            </div>

            <div className="card-cosmic p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-cosmic-white">{statistics.avgDuration}</span>
              </div>
              <h3 className="text-lg font-semibold text-cosmic-white">Average Duration</h3>
              <p className="text-cosmic-white/60 text-sm">Days in space</p>
            </div>

            <div className="card-cosmic p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-cosmic-white">{statistics.countries}</span>
              </div>
              <h3 className="text-lg font-semibold text-cosmic-white">Countries</h3>
              <p className="text-cosmic-white/60 text-sm">Represented in data</p>
            </div>
          </div>

          {/* Health Impact Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">Health Impact Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cosmic-white/80">Bone Density Change</span>
                    <span className="text-red-400 font-semibold">{statistics.avgBoneLoss}%</span>
                  </div>
                  <div className="w-full bg-cosmic-white/10 rounded-full h-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full" 
                      style={{ width: `${Math.abs(statistics.avgBoneLoss) * 10}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cosmic-white/80">Muscle Mass Change</span>
                    <span className="text-orange-400 font-semibold">{statistics.avgMuscleLoss}%</span>
                  </div>
                  <div className="w-full bg-cosmic-white/10 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full" 
                      style={{ width: `${Math.abs(statistics.avgMuscleLoss) * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">Data Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-cosmic-white/80">Mission Types</span>
                  <span className="text-blue-400 font-semibold">{statistics.missions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/80">Crew Roles</span>
                  <span className="text-green-400 font-semibold">{statistics.roles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/80">Countries Represented</span>
                  <span className="text-purple-400 font-semibold">{statistics.countries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/80">Total Crew Members</span>
                  <span className="text-yellow-400 font-semibold">{statistics.totalCrew}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <BarChart3 className="w-8 h-8 text-yellow-400" />
            <span>Detailed Breakdown</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Types Breakdown */}
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">By Mission Type</h3>
              <div className="space-y-3">
                {Object.entries(missionGroups).map(([mission, members]) => (
                  <div key={mission} className="flex justify-between items-center">
                    <span className="text-cosmic-white/80">{mission}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-semibold">{members.length}</span>
                      <div className="w-20 bg-cosmic-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full" 
                          style={{ width: `${(members.length / filteredData.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles Breakdown */}
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">By Crew Role</h3>
              <div className="space-y-3">
                {Object.entries(roleGroups).map(([role, members]) => (
                  <div key={role} className="flex justify-between items-center">
                    <span className="text-cosmic-white/80">{role}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-semibold">{members.length}</span>
                      <div className="w-20 bg-cosmic-white/10 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full" 
                          style={{ width: `${(members.length / filteredData.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data Authenticity */}
        <section className="mb-8">
          <div className="card-cosmic p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4">✅ Data Authenticity Guarantee</h3>
            <p className="text-cosmic-white/80 leading-relaxed">
              All statistics and visualizations on this page are calculated in real-time from authentic NASA LSDA data. 
              No values are simulated, hardcoded, or invented. The filtering system analyzes real astronaut profiles, 
              mission data, and health measurements from peer-reviewed NASA publications.
            </p>
            <div className="mt-4 text-sm text-cosmic-white/60">
              <strong>Sources:</strong> NASA Life Sciences Data Archive (LSDA), Sibonga et al. 2007, Gabel et al. 2022, Coulombe et al. 2023
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
