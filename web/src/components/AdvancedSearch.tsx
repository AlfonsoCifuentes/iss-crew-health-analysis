/**
 * Advanced Search Component for ISS Crew Health Analysis
 * Search through astronauts, missions, and health metrics using real NASA data
 * NO HARDCODED VALUES - All data from real NASA CSVs
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, User, Calendar, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  type: 'astronaut' | 'mission' | 'metric';
  title: string;
  description: string;
  value?: string | number;
  category?: string;
  url?: string;
}

interface SearchFilters {
  type: 'all' | 'astronaut' | 'mission' | 'metric';
  duration: 'all' | 'short' | 'standard' | 'long';
  gender: 'all' | 'male' | 'female';
}

interface RealDataStructure {
  aggregated: {
    key_metrics?: {
      total_crew_members?: number;
    };
    mission_types?: {
      ISS_Expedition_short?: number;
      ISS_Expedition_standard?: number;
      ISS_Expedition_long?: number;
    };
  };
  rawCrew: {
    crew_profiles?: Array<{
      id: string;
      age: number;
      gender: string;
      mission_duration: number;
      crew_type?: string;
    }>;
  };
  realMetrics: {
    risk_simulator?: {
      bone_density_loss?: number;
      muscle_mass_loss?: number;
    };
    simulators_page?: {
      ml_model_accuracy_percent?: number;
    };
  };
}

export default function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    duration: 'all',
    gender: 'all'
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [realData, setRealData] = useState<RealDataStructure | null>(null);
  const [loading, setLoading] = useState(false);

  // Load real NASA data for search
  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const [aggregatedRes, rawCrewRes, realMetricsRes] = await Promise.all([
          fetch('/api/data/aggregated_stats'),
          fetch('/api/data/raw_crew_data'),
          fetch('/api/data/real_metrics')
        ]);

        const [aggregated, rawCrew, realMetrics] = await Promise.all([
          aggregatedRes.json(),
          rawCrewRes.json(),
          realMetricsRes.json()
        ]);

        setRealData({ aggregated, rawCrew, realMetrics });
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };

    if (isOpen && !realData) {
      loadSearchData();
    }
  }, [isOpen, realData]);

  // Generate search results from real data
  const searchResults = useMemo(() => {
    if (!realData || !query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search through real astronaut profiles
    if (filters.type === 'all' || filters.type === 'astronaut') {
      realData.rawCrew.crew_profiles?.forEach((astronaut) => {
        if (
          astronaut.id.toLowerCase().includes(searchTerm) ||
          astronaut.age.toString().includes(searchTerm) ||
          astronaut.gender.toLowerCase().includes(searchTerm) ||
          astronaut.crew_type?.toLowerCase().includes(searchTerm)
        ) {
          // Apply gender filter
          if (filters.gender !== 'all' && astronaut.gender.toLowerCase() !== filters.gender) {
            return;
          }

          // Apply duration filter
          if (filters.duration !== 'all') {
            const duration = astronaut.mission_duration;
            if (
              (filters.duration === 'short' && duration >= 160) ||
              (filters.duration === 'standard' && (duration < 160 || duration > 200)) ||
              (filters.duration === 'long' && duration <= 200)
            ) {
              return;
            }
          }

          results.push({
            id: astronaut.id,
            type: 'astronaut',
            title: `${astronaut.id} - ${astronaut.gender}, Age ${astronaut.age}`,
            description: `${astronaut.mission_duration} days mission, ${astronaut.crew_type}`,
            category: 'Astronaut Profile',
            url: '/astronauts'
          });
        }
      });
    }

    // Search through real metrics
    if (filters.type === 'all' || filters.type === 'metric') {
      const metrics = [
        {
          key: 'bone_density_loss',
          title: 'Bone Density Loss',
          value: realData.realMetrics.risk_simulator?.bone_density_loss,
          description: 'Lumbar spine BMD loss percentage',
          category: 'Bone Health'
        },
        {
          key: 'muscle_mass_loss',
          title: 'Muscle Mass Loss',
          value: realData.realMetrics.risk_simulator?.muscle_mass_loss,
          description: 'Femoral neck BMD loss percentage',
          category: 'Muscle Health'
        },
        {
          key: 'ml_accuracy',
          title: 'ML Model Accuracy',
          value: realData.realMetrics.simulators_page?.ml_model_accuracy_percent,
          description: 'Machine learning model prediction accuracy',
          category: 'AI Performance'
        },
        {
          key: 'total_astronauts',
          title: 'Total Astronauts',
          value: realData.aggregated.key_metrics?.total_crew_members,
          description: 'Total crew members in dataset',
          category: 'Dataset Info'
        }
      ];

      metrics.forEach(metric => {
        if (
          metric.title.toLowerCase().includes(searchTerm) ||
          metric.description.toLowerCase().includes(searchTerm) ||
          metric.category.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: metric.key,
            type: 'metric',
            title: metric.title,
            description: metric.description,
            value: metric.value || 0,
            category: metric.category,
            url: '/analytics'
          });
        }
      });
    }

    // Search through mission types
    if (filters.type === 'all' || filters.type === 'mission') {
      const missions = [
        {
          key: 'short_missions',
          title: 'Short Duration Missions',
          value: realData.aggregated.mission_types?.ISS_Expedition_short,
          description: 'Missions under 160 days',
          category: 'Mission Duration'
        },
        {
          key: 'standard_missions', 
          title: 'Standard Duration Missions',
          value: realData.aggregated.mission_types?.ISS_Expedition_standard,
          description: 'Missions 160-200 days',
          category: 'Mission Duration'
        },
        {
          key: 'long_missions',
          title: 'Long Duration Missions', 
          value: realData.aggregated.mission_types?.ISS_Expedition_long,
          description: 'Missions over 200 days',
          category: 'Mission Duration'
        }
      ];

      missions.forEach(mission => {
        if (
          mission.title.toLowerCase().includes(searchTerm) ||
          mission.description.toLowerCase().includes(searchTerm) ||
          searchTerm.includes('mission') ||
          searchTerm.includes('duration')
        ) {
          results.push({
            id: mission.key,
            type: 'mission',
            title: mission.title,
            description: mission.description,
            value: mission.value || 0,
            category: mission.category,
            url: '/dashboard'
          });
        }
      });
    }

    return results.slice(0, 10); // Limit to 10 results
  }, [realData, query, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResults(searchResults);
      setLoading(false);
    }, 300);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'astronaut': return <User className="w-4 h-4" />;
      case 'mission': return <Calendar className="w-4 h-4" />;
      case 'metric': return <Activity className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-space-black/50 border border-cosmic-white/20 rounded-lg hover:border-yellow-400/50 transition-colors"
      >
        <Search className="w-4 h-4 text-cosmic-white/70" />
        <span className="text-cosmic-white/70 text-sm">Search NASA data...</span>
        <kbd className="px-2 py-1 text-xs bg-cosmic-white/10 rounded">⌘K</kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl mx-4 bg-space-black border border-cosmic-white/20 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 p-4 border-b border-cosmic-white/10">
                <Search className="w-5 h-5 text-yellow-400" />
                <form onSubmit={handleSearch} className="flex-1">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search astronauts, missions, or metrics..."
                    className="w-full bg-transparent text-cosmic-white placeholder-cosmic-white/50 outline-none"
                    autoFocus
                  />
                </form>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-cosmic-white/10 rounded"
                >
                  <X className="w-4 h-4 text-cosmic-white/70" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 p-4 border-b border-cosmic-white/10">
                <Filter className="w-4 h-4 text-cosmic-white/70" />
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as SearchFilters['type'] })}
                  className="bg-space-black border border-cosmic-white/20 rounded px-2 py-1 text-sm text-cosmic-white"
                >
                  <option value="all">All Types</option>
                  <option value="astronaut">Astronauts</option>
                  <option value="mission">Missions</option>
                  <option value="metric">Metrics</option>
                </select>
                
                <select
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value as SearchFilters['duration'] })}
                  className="bg-space-black border border-cosmic-white/20 rounded px-2 py-1 text-sm text-cosmic-white"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short (&lt; 160 days)</option>
                  <option value="standard">Standard (160-200 days)</option>
                  <option value="long">Long (&gt; 200 days)</option>
                </select>

                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({ ...filters, gender: e.target.value as SearchFilters['gender'] })}
                  className="bg-space-black border border-cosmic-white/20 rounded px-2 py-1 text-sm text-cosmic-white"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="divide-y divide-cosmic-white/10">
                    {results.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 hover:bg-cosmic-white/5 cursor-pointer"
                        onClick={() => {
                          if (result.url) {
                            window.location.href = result.url;
                          }
                          setIsOpen(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-yellow-400/10 rounded-lg">
                            {getTypeIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-cosmic-white truncate">
                                {result.title}
                              </h3>
                              {result.value !== undefined && (
                                <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded text-xs">
                                  {typeof result.value === 'number' ? result.value.toFixed(1) : result.value}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-cosmic-white/70 mt-1">
                              {result.description}
                            </p>
                            {result.category && (
                              <span className="inline-block mt-2 px-2 py-1 bg-cosmic-white/10 text-cosmic-white/60 rounded text-xs">
                                {result.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="py-8 text-center text-cosmic-white/50">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="py-8 text-center text-cosmic-white/50">
                    Start typing to search through NASA data...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
