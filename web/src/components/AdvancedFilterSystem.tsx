/**
 * Advanced Filter System for ISS Crew Health Analysis
 * Filter real NASA data by multiple criteria
 * NO HARDCODED VALUES - All filters based on real NASA CSVs
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Filter, X, Calendar, Users, Target, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOptions {
  missions: string[];
  roles: string[];
  ageRanges: { min: number; max: number; label: string }[];
  durationRanges: { min: number; max: number; label: string }[];
  countries: string[];
}

interface FilterState {
  missions: string[];
  roles: string[];
  ageRange: { min: number; max: number } | null;
  durationRange: { min: number; max: number } | null;
  countries: string[];
  dateRange: { start: string; end: string } | null;
}

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

interface AdvancedFilterSystemProps {
  onFilterChange: (filteredData: CrewMember[], activeFilters: FilterState) => void;
  className?: string;
}

export default function AdvancedFilterSystem({ onFilterChange, className = '' }: AdvancedFilterSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [crewData, setCrewData] = useState<CrewMember[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    missions: [],
    roles: [],
    ageRanges: [],
    durationRanges: [],
    countries: []
  });
  
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    missions: [],
    roles: [],
    ageRange: null,
    durationRange: null,
    countries: [],
    dateRange: null
  });

  // Load real NASA crew data on component mount
  useEffect(() => {
    const loadCrewData = async () => {
      try {
        const response = await fetch('/data/raw_crew_data.json');
        const data = await response.json();
        
        if (data.crew_profiles && Array.isArray(data.crew_profiles)) {
          setCrewData(data.crew_profiles);
          
          // Extract unique filter options from real data
          const missionTypes = data.crew_profiles.map((member: CrewMember) => member.mission_type) as string[];
          const crewRoles = data.crew_profiles.map((member: CrewMember) => member.role) as string[];
          const crewCountries = data.crew_profiles.map((member: CrewMember) => member.country) as string[];
          
          const missions = [...new Set(missionTypes)].filter(Boolean).sort();
          const roles = [...new Set(crewRoles)].filter(Boolean).sort();
          const countries = [...new Set(crewCountries)].filter(Boolean).sort();
          
          // Calculate age ranges from real data
          const ages = data.crew_profiles.map((member: CrewMember) => member.age) as number[];
          const validAges = ages.filter(age => typeof age === 'number' && !isNaN(age));
          const minAge = Math.min(...validAges);
          const maxAge = Math.max(...validAges);
          const ageRanges = [
            { min: minAge, max: Math.floor((minAge + maxAge) / 3), label: `${minAge}-${Math.floor((minAge + maxAge) / 3)} years` },
            { min: Math.floor((minAge + maxAge) / 3) + 1, max: Math.floor((minAge + maxAge) * 2 / 3), label: `${Math.floor((minAge + maxAge) / 3) + 1}-${Math.floor((minAge + maxAge) * 2 / 3)} years` },
            { min: Math.floor((minAge + maxAge) * 2 / 3) + 1, max: maxAge, label: `${Math.floor((minAge + maxAge) * 2 / 3) + 1}-${maxAge} years` }
          ];
          
          // Calculate duration ranges from real data
          const durations = data.crew_profiles.map((member: CrewMember) => member.duration_days) as number[];
          const validDurations = durations.filter(duration => typeof duration === 'number' && !isNaN(duration));
          const minDuration = Math.min(...validDurations);
          const maxDuration = Math.max(...validDurations);
          const durationRanges = [
            { min: minDuration, max: Math.floor((minDuration + maxDuration) / 3), label: `${minDuration}-${Math.floor((minDuration + maxDuration) / 3)} days` },
            { min: Math.floor((minDuration + maxDuration) / 3) + 1, max: Math.floor((minDuration + maxDuration) * 2 / 3), label: `${Math.floor((minDuration + maxDuration) / 3) + 1}-${Math.floor((minDuration + maxDuration) * 2 / 3)} days` },
            { min: Math.floor((minDuration + maxDuration) * 2 / 3) + 1, max: maxDuration, label: `${Math.floor((minDuration + maxDuration) * 2 / 3) + 1}-${maxDuration} days` }
          ];
          
          setFilterOptions({
            missions,
            roles,
            countries,
            ageRanges,
            durationRanges
          });
        }
      } catch (error) {
        console.error('Error loading crew data for filters:', error);
      }
    };

    loadCrewData();
  }, []);

  // Apply filters and notify parent component
  const filteredData = useMemo(() => {
    let filtered = crewData;

    // Apply mission filter
    if (activeFilters.missions.length > 0) {
      filtered = filtered.filter(member => activeFilters.missions.includes(member.mission_type));
    }

    // Apply role filter
    if (activeFilters.roles.length > 0) {
      filtered = filtered.filter(member => activeFilters.roles.includes(member.role));
    }

    // Apply age range filter
    if (activeFilters.ageRange) {
      filtered = filtered.filter(member => 
        member.age >= activeFilters.ageRange!.min && member.age <= activeFilters.ageRange!.max
      );
    }

    // Apply duration range filter
    if (activeFilters.durationRange) {
      filtered = filtered.filter(member => 
        member.duration_days >= activeFilters.durationRange!.min && 
        member.duration_days <= activeFilters.durationRange!.max
      );
    }

    // Apply country filter
    if (activeFilters.countries.length > 0) {
      filtered = filtered.filter(member => activeFilters.countries.includes(member.country));
    }

    // Apply date range filter
    if (activeFilters.dateRange) {
      filtered = filtered.filter(member => {
        const missionDate = new Date(member.mission_start_date);
        const startDate = new Date(activeFilters.dateRange!.start);
        const endDate = new Date(activeFilters.dateRange!.end);
        return missionDate >= startDate && missionDate <= endDate;
      });
    }

    return filtered;
  }, [crewData, activeFilters]);

  // Notify parent when filtered data changes
  useEffect(() => {
    onFilterChange(filteredData, activeFilters);
  }, [filteredData, activeFilters, onFilterChange]);

  const handleMissionToggle = (mission: string) => {
    setActiveFilters(prev => ({
      ...prev,
      missions: prev.missions.includes(mission)
        ? prev.missions.filter(m => m !== mission)
        : [...prev.missions, mission]
    }));
  };

  const handleRoleToggle = (role: string) => {
    setActiveFilters(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleCountryToggle = (country: string) => {
    setActiveFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country]
    }));
  };

  const handleAgeRangeSelect = (range: { min: number; max: number } | null) => {
    setActiveFilters(prev => ({ ...prev, ageRange: range }));
  };

  const handleDurationRangeSelect = (range: { min: number; max: number } | null) => {
    setActiveFilters(prev => ({ ...prev, durationRange: range }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      missions: [],
      roles: [],
      ageRange: null,
      durationRange: null,
      countries: [],
      dateRange: null
    });
  };

  const getActiveFilterCount = () => {
    return (
      activeFilters.missions.length +
      activeFilters.roles.length +
      activeFilters.countries.length +
      (activeFilters.ageRange ? 1 : 0) +
      (activeFilters.durationRange ? 1 : 0) +
      (activeFilters.dateRange ? 1 : 0)
    );
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`relative ${className}`}>
      {/* Filter Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg hover:bg-yellow-400/20 transition-colors"
      >
        <Filter className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400 text-sm font-medium">
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </span>
        <ChevronDown className={`w-4 h-4 text-yellow-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-space-black border border-cosmic-white/20 rounded-xl shadow-2xl z-50 max-w-4xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-cosmic-white">Advanced Filters</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-cosmic-white/60">
                    {filteredData.length} of {crewData.length} astronauts
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-cosmic-white/60 hover:text-cosmic-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Mission Types */}
                <div>
                  <h4 className="text-sm font-medium text-cosmic-white mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    Mission Types
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterOptions.missions.map(mission => (
                      <label key={mission} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.missions.includes(mission)}
                          onChange={() => handleMissionToggle(mission)}
                          className="rounded border-cosmic-white/30 bg-transparent text-yellow-400 focus:ring-yellow-400"
                        />
                        <span className="text-sm text-cosmic-white/80">{mission}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Crew Roles */}
                <div>
                  <h4 className="text-sm font-medium text-cosmic-white mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-400" />
                    Crew Roles
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterOptions.roles.map(role => (
                      <label key={role} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.roles.includes(role)}
                          onChange={() => handleRoleToggle(role)}
                          className="rounded border-cosmic-white/30 bg-transparent text-yellow-400 focus:ring-yellow-400"
                        />
                        <span className="text-sm text-cosmic-white/80">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Countries */}
                <div>
                  <h4 className="text-sm font-medium text-cosmic-white mb-3">Countries</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {filterOptions.countries.map(country => (
                      <label key={country} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeFilters.countries.includes(country)}
                          onChange={() => handleCountryToggle(country)}
                          className="rounded border-cosmic-white/30 bg-transparent text-yellow-400 focus:ring-yellow-400"
                        />
                        <span className="text-sm text-cosmic-white/80">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Age Ranges */}
                <div>
                  <h4 className="text-sm font-medium text-cosmic-white mb-3">Age Range</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAgeRangeSelect(null)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        !activeFilters.ageRange ? 'bg-yellow-400/20 text-yellow-400' : 'text-cosmic-white/80 hover:bg-cosmic-white/5'
                      }`}
                    >
                      All Ages
                    </button>
                    {filterOptions.ageRanges.map(range => (
                      <button
                        key={range.label}
                        onClick={() => handleAgeRangeSelect(range)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          activeFilters.ageRange?.min === range.min && activeFilters.ageRange?.max === range.max
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'text-cosmic-white/80 hover:bg-cosmic-white/5'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Ranges */}
                <div>
                  <h4 className="text-sm font-medium text-cosmic-white mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Mission Duration
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDurationRangeSelect(null)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        !activeFilters.durationRange ? 'bg-yellow-400/20 text-yellow-400' : 'text-cosmic-white/80 hover:bg-cosmic-white/5'
                      }`}
                    >
                      All Durations
                    </button>
                    {filterOptions.durationRanges.map(range => (
                      <button
                        key={range.label}
                        onClick={() => handleDurationRangeSelect(range)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          activeFilters.durationRange?.min === range.min && activeFilters.durationRange?.max === range.max
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'text-cosmic-white/80 hover:bg-cosmic-white/5'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Data Authenticity Badge */}
                <div className="lg:col-span-2 xl:col-span-1">
                  <div className="p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
                    <h4 className="text-sm font-medium text-green-400 mb-1">✅ Real NASA Data</h4>
                    <p className="text-xs text-green-400/80">
                      All filters use authentic data from NASA LSDA. No simulated or hardcoded values.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
