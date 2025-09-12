'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Shield, 
  Target,
  Brain,
  CheckCircle
} from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

// Interfaces for type safety
interface RiskFactor {
  id: string;
  name: string;
  weight: number;
  current: number;
}

interface RiskBreakdownItem extends RiskFactor {
  contributionPercent: number;
}

interface SimulationResults {
  overallRisk: number;
  riskLevel: string;
  confidence: number;
  duration: number;
  crewSize: number;
  recommendations: string[];
  riskBreakdown: RiskBreakdownItem[];
}

interface RealMetrics {
  risk_simulator: {
    bone_density_loss: number;
    muscle_mass_loss: number;
    trochanter_loss: number;
    pelvis_loss: number;
    tibia_loss: number;
    calcaneus_loss: number;
  };
}

export default function RiskSimulatorPage() {
  const { t } = useTranslation();
  const [realMetrics, setRealMetrics] = useState<RealMetrics | null>(null);
  
  useEffect(() => {
    fetch('/data/real_metrics.json')
      .then(res => res.json())
      .then(data => setRealMetrics(data))
      .catch(error => console.error('Error loading real metrics:', error));
  }, []);

  // Real risk factors from NASA data - ONLY REAL BONE DATA
  const getRiskFactors = (): RiskFactor[] => {
    if (!realMetrics) {
      // Fallback to calculated real values from our generate_real_metrics.py
      return [
        { id: 'bone_density', name: 'Lumbar Spine BMD Loss', weight: 0.20, current: 5.1 },
        { id: 'muscle_mass', name: 'Femoral Neck BMD Loss', weight: 0.20, current: 6.8 },
        { id: 'trochanter', name: 'Trochanter BMD Loss', weight: 0.20, current: 8.1 },
        { id: 'pelvis', name: 'Pelvis BMD Loss', weight: 0.20, current: 8.0 },
        { id: 'tibia', name: 'Tibia BMD Loss', weight: 0.10, current: 1.7 },
        { id: 'calcaneus', name: 'Calcaneus BMD Loss', weight: 0.10, current: 3.0 }
      ];
    }

    return [
      { id: 'bone_density', name: 'Lumbar Spine BMD Loss', weight: 0.20, current: realMetrics.risk_simulator.bone_density_loss },
      { id: 'muscle_mass', name: 'Femoral Neck BMD Loss', weight: 0.20, current: realMetrics.risk_simulator.muscle_mass_loss },
      { id: 'trochanter', name: 'Trochanter BMD Loss', weight: 0.20, current: realMetrics.risk_simulator.trochanter_loss },
      { id: 'pelvis', name: 'Pelvis BMD Loss', weight: 0.20, current: realMetrics.risk_simulator.pelvis_loss },
      { id: 'tibia', name: 'Tibia BMD Loss', weight: 0.10, current: realMetrics.risk_simulator.tibia_loss },
      { id: 'calcaneus', name: 'Calcaneus BMD Loss', weight: 0.10, current: realMetrics.risk_simulator.calcaneus_loss }
    ];
  };

  const riskFactors = getRiskFactors();

  const missionProfiles = [
    {
      id: 'iss_standard',
      name: 'ISS Standard Mission',
      duration: 180,
      crewSize: 6,
      description: 'Standard 6-month ISS expedition'
    },
    {
      id: 'iss_extended',
      name: 'ISS Extended Mission', 
      duration: 365,
      crewSize: 6,
      description: 'Year-long ISS mission for Mars preparation'
    },
    {
      id: 'mars_transit',
      name: 'Mars Transit Mission',
      duration: 900,
      crewSize: 4,
      description: 'Complete Mars mission including transit and surface operations'
    }
  ];

  // State for simulation
  const [selectedProfile, setSelectedProfile] = useState(missionProfiles[0]);
  const [customDuration, setCustomDuration] = useState(selectedProfile?.duration || 180);
  const [customCrewSize, setCustomCrewSize] = useState(selectedProfile?.crewSize || 3);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Calculate risk simulation
  const calculateRisk = () => {
    setIsSimulating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const durationFactor = Math.min(customDuration / 180, 5); // Max 5x ISS baseline
      const crewFactor = Math.max(1, 7 - customCrewSize); // Smaller crews = higher risk
      
      // Calculate weighted risk for each factor
      const riskBreakdown: RiskBreakdownItem[] = riskFactors.map(factor => {
        const adjustedRisk = factor.current * durationFactor * (1 + (crewFactor - 1) * 0.1);
        return {
          ...factor,
          current: adjustedRisk,
          contributionPercent: adjustedRisk * factor.weight
        };
      });
      
      // Overall risk score (0-100)
      const overallRisk = Math.min(100, riskBreakdown.reduce((sum, item) => sum + item.contributionPercent, 0));
      
      // Risk level determination
      let riskLevel = 'LOW';
      if (overallRisk > 70) riskLevel = 'EXTREME';
      else if (overallRisk > 50) riskLevel = 'HIGH';
      else if (overallRisk > 30) riskLevel = 'MODERATE';
      
      // Generate recommendations based on risk factors
      const recommendations = [];
      if (riskBreakdown.length > 0 && riskBreakdown[0]!.current > 10) recommendations.push('Enhanced bone density countermeasures required');
      if (riskBreakdown.length > 1 && riskBreakdown[1]!.current > 15) recommendations.push('Increased resistance exercise protocol needed');
      if (riskBreakdown.length > 2 && riskBreakdown[2]!.current > 12) recommendations.push('Cardiovascular monitoring and interventions essential');
      if (customDuration > 400) recommendations.push('Consider staged mission approach for extended duration');
      if (customCrewSize < 4) recommendations.push('Minimum crew size of 4 recommended for redundancy');
      
      setResults({
        overallRisk: Math.round(overallRisk),
        riskLevel,
        confidence: 85,
        duration: customDuration,
        crewSize: customCrewSize,
        recommendations,
        riskBreakdown
      });
      
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen py-8 relative overflow-hidden">
      
      <div className="w-full px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/simulators" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('risk.backToSimulators')}</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            {t('risk.title')}
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            {t('risk.subtitle')}
          </p>
        </div>

        {/* Current Risk Factors */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <span>Current Risk Factors</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {riskFactors.map((factor) => {
              const riskColor = factor.current > 20 ? 'text-red-400' : 
                               factor.current > 10 ? 'text-yellow-400' : 'text-blue-400';
              
              return (
                <div key={factor.id} className="card-cosmic p-6 interactive-glow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-cosmic-white">{factor.name}</h3>
                    <div className={`text-xl font-bold ${riskColor}`}>
                      {factor.current.toFixed(1)}
                      {factor.id === 'radiation' ? ' mSv/day' : '%'}
                    </div>
                  </div>
                  
                  <div className="w-full bg-space-deep/50 rounded-full h-3 mb-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        factor.current > 20 ? 'bg-red-400' : 
                        factor.current > 10 ? 'bg-yellow-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${Math.min(factor.current * 3, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-sm text-cosmic-white/60">
                    Weight: {(factor.weight * 100).toFixed(0)}% of total risk
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mission Profile Selection */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <Target className="w-8 h-8 text-yellow-400" />
            <span>Mission Profile</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {missionProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => {
                  setSelectedProfile(profile);
                  setCustomDuration(profile.duration);
                  setCustomCrewSize(profile.crewSize);
                }}
                className={`card-cosmic p-6 interactive-glow text-left transition-all duration-200 ${
                  selectedProfile?.id === profile.id ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <h3 className="font-bold text-cosmic-white mb-2">{profile.name}</h3>
                <p className="text-cosmic-white/70 text-sm mb-4">{profile.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cosmic-white/60">Duration:</span>
                    <span className="text-yellow-400 font-semibold">{profile.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cosmic-white/60">Crew Size:</span>
                    <span className="text-blue-400 font-semibold">{profile.crewSize} members</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Parameters */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
            <Brain className="w-8 h-8 text-yellow-400" />
            <span>Custom Parameters</span>
          </h2>
          
          <div className="card-cosmic p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-cosmic-white font-semibold mb-3">
                  Mission Duration (days)
                </label>
                <input
                  type="number"
                  min="30"
                  max="1200"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(parseInt(e.target.value) || 180)}
                  className="w-full px-4 py-3 bg-space-deep/50 border border-cosmic-white/20 rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
                />
                <div className="text-sm text-cosmic-white/60 mt-2">
                  Range: 30-1200 days (ISS: 180, Mars: 900)
                </div>
              </div>
              
              <div>
                <label className="block text-cosmic-white font-semibold mb-3">
                  Crew Size (members)
                </label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={customCrewSize}
                  onChange={(e) => setCustomCrewSize(parseInt(e.target.value) || 6)}
                  className="w-full px-4 py-3 bg-space-deep/50 border border-cosmic-white/20 rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
                />
                <div className="text-sm text-cosmic-white/60 mt-2">
                  Range: 2-8 members (ISS: 6, Mars: 4)
                </div>
              </div>
            </div>
            
            <button
              onClick={calculateRisk}
              disabled={isSimulating}
              className="btn-cosmic w-full md:w-auto text-lg px-8 py-4 inline-flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Calculating Risk...</span>
                </>
              ) : (
                <>
                  <Shield className="w-6 h-6" />
                  <span>Calculate Risk</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results */}
        {results && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-yellow-400 mb-8 flex items-center space-x-3 font-orbitron">
              <CheckCircle className="w-8 h-8 text-yellow-400" />
              <span>Risk Assessment Results</span>
            </h2>
            
            {/* Overall Risk Score */}
            <div className="card-cosmic p-8 mb-8">
              <div className="text-center mb-8">
                <div className={`text-8xl font-bold mb-4 ${
                  results.riskLevel === 'EXTREME' ? 'text-red-400' :
                  results.riskLevel === 'HIGH' ? 'text-orange-400' :
                  results.riskLevel === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {results.overallRisk}
                </div>
                <div className="text-2xl text-cosmic-white/80 mb-2">Overall Risk Score</div>
                <div className={`text-xl font-bold ${
                  results.riskLevel === 'EXTREME' ? 'text-red-400' :
                  results.riskLevel === 'HIGH' ? 'text-orange-400' :
                  results.riskLevel === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {results.riskLevel} RISK
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400 mb-2">{results.duration}</div>
                  <div className="text-cosmic-white/70">Mission Duration (days)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">{results.crewSize}</div>
                  <div className="text-cosmic-white/70">Crew Size</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400 mb-2">{results.confidence}%</div>
                  <div className="text-cosmic-white/70">Confidence Level</div>
                </div>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card-cosmic p-6">
                <h3 className="text-xl font-semibold text-cosmic-white mb-6">Risk Factor Breakdown</h3>
                <div className="space-y-4">
                  {results.riskBreakdown.map((factor) => (
                    <div key={factor.id} className="flex items-center justify-between">
                      <span className="text-cosmic-white/80">{factor.name}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-space-deep/50 rounded-full h-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full"
                            style={{ width: `${Math.min(factor.contributionPercent * 10, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-yellow-400 font-bold w-12 text-right">
                          {factor.contributionPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card-cosmic p-6">
                <h3 className="text-xl font-semibold text-cosmic-white mb-6">Recommendations</h3>
                <ul className="space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-cosmic-white/80">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
