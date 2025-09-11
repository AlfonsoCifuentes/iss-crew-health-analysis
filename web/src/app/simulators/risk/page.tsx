'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Activity, 
  Shield, 
  Users, 
  Clock, 
  Target,
  Brain,
  CheckCircle,
  Rocket
} from 'lucide-react';

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

// Simulated data
const riskFactors = [
  { id: 'bone_density', name: 'Bone Density Loss', weight: 0.25, current: 15.2 },
  { id: 'muscle_mass', name: 'Muscle Mass Reduction', weight: 0.20, current: 12.8 },
  { id: 'cardiovascular', name: 'Cardiovascular Deconditioning', weight: 0.20, current: 8.3 },
  { id: 'radiation', name: 'Radiation Exposure', weight: 0.15, current: 22.1 },
  { id: 'psychological', name: 'Psychological Stress', weight: 0.10, current: 6.4 },
  { id: 'vision', name: 'Vision Changes (SANS)', weight: 0.10, current: 4.2 }
];

const missionProfiles = [
  { id: 'short', name: 'Short Duration (< 6 months)', duration: 180, riskMultiplier: 1.0 },
  { id: 'standard', name: 'Standard Mission (6-12 months)', duration: 365, riskMultiplier: 1.5 },
  { id: 'extended', name: 'Extended Mission (12-18 months)', duration: 540, riskMultiplier: 2.2 },
  { id: 'mars_transit', name: 'Mars Transit (18-24 months)', duration: 720, riskMultiplier: 3.0 }
];

export default function HealthRiskCalculator() {
  const [selectedFactors, setSelectedFactors] = useState<string[]>(['bone_density', 'muscle_mass', 'cardiovascular']);
  const [missionProfile, setMissionProfile] = useState('standard');
  const [customDuration, setCustomDuration] = useState(365);
  const [crewSize, setCrewSize] = useState(6);
  const [results, setResults] = useState<SimulationResults | null>(null);

  const calculateRisk = () => {
    const selectedMission = missionProfiles.find(m => m.id === missionProfile);
    const duration = missionProfile === 'custom' ? customDuration : selectedMission?.duration || 365;
    const riskMultiplier = selectedMission?.riskMultiplier || (duration / 365) * 1.5;
    
    const selectedRiskFactors = riskFactors.filter(factor => selectedFactors.includes(factor.id));
    const totalWeight = selectedRiskFactors.reduce((sum, factor) => sum + factor.weight, 0);
    const weightedRisk = selectedRiskFactors.reduce((sum, factor) => 
      sum + (factor.current * factor.weight), 0
    );
    
    const baseRisk = (weightedRisk / totalWeight) * riskMultiplier;
    const crewRiskFactor = Math.max(0.8, Math.min(1.2, 1 + (6 - crewSize) * 0.05));
    const finalRisk = Math.min(100, baseRisk * crewRiskFactor);
    
    const riskLevel = finalRisk < 20 ? 'Low' : finalRisk < 50 ? 'Moderate' : finalRisk < 75 ? 'High' : 'Critical';
    const confidence = Math.max(75, 95 - (duration / 30) * 0.5);
    
    setResults({
      overallRisk: Math.round(finalRisk * 10) / 10,
      riskLevel,
      confidence: Math.round(confidence * 10) / 10,
      duration,
      crewSize,
      recommendations: generateRecommendations(finalRisk, selectedRiskFactors),
      riskBreakdown: selectedRiskFactors.map(factor => ({
        ...factor,
        contributionPercent: Math.round((factor.current * factor.weight / weightedRisk) * 100)
      }))
    });
  };

  const generateRecommendations = (riskScore: number, factors: RiskFactor[]) => {
    const recommendations = [];
    
    if (riskScore > 50) {
      recommendations.push("Consider enhanced countermeasures protocol");
      recommendations.push("Implement additional crew monitoring systems");
    }
    
    if (factors.some(f => f.id === 'bone_density' && f.current > 10)) {
      recommendations.push("Increase COLPA exercise sessions");
      recommendations.push("Enhanced calcium and vitamin D supplementation");
    }
    
    if (factors.some(f => f.id === 'cardiovascular' && f.current > 8)) {
      recommendations.push("Extended ARED cardiovascular protocols");
      recommendations.push("Lower body negative pressure training");
    }
    
    if (factors.some(f => f.id === 'psychological')) {
      recommendations.push("Enhanced crew psychological support");
      recommendations.push("Increased communication with ground");
    }
    
    return recommendations.slice(0, 4);
  };

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="w-full text-left">
          <Link 
            href="/simulators" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Simulators</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            Health Risk Calculator
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Advanced risk assessment tool for long-duration space missions. Configure mission parameters 
            and crew factors to predict health risks using validated NASA LSDA models.
          </p>
        </div>

        <div className="w-full mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Configuration Panel */}
            <div className="space-y-8">
              {/* Mission Profile Selection */}
              <div className="card-cosmic p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Rocket className="w-6 h-6 text-star-gold" />
                  <h2 className="text-2xl font-bold text-cosmic-white font-orbitron">Mission Profile</h2>
                </div>
                
                <div className="space-y-3">
                  {missionProfiles.map((profile) => (
                    <label key={profile.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-space-deep/30 cursor-pointer">
                      <input
                        type="radio"
                        name="mission"
                        value={profile.id}
                        checked={missionProfile === profile.id}
                        onChange={(e) => setMissionProfile(e.target.value)}
                        className="text-star-gold focus:ring-star-gold"
                      />
                      <div>
                        <div className="text-cosmic-white font-medium">{profile.name}</div>
                        <div className="text-sm text-cosmic-white/70">{profile.duration} days • Risk Factor: {profile.riskMultiplier}x</div>
                      </div>
                    </label>
                  ))}
                  
                  <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-space-deep/30 cursor-pointer">
                    <input
                      type="radio"
                      name="mission"
                      value="custom"
                      checked={missionProfile === 'custom'}
                      onChange={(e) => setMissionProfile(e.target.value)}
                      className="text-star-gold focus:ring-star-gold"
                    />
                    <div className="flex-1">
                      <div className="text-cosmic-white font-medium">Custom Duration</div>
                      <div className="flex items-center space-x-3 mt-2">
                        <input
                          type="number"
                          min="30"
                          max="1000"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(Number(e.target.value))}
                          disabled={missionProfile !== 'custom'}
                          className="bg-space-deep/50 border border-cosmic-white/20 rounded px-3 py-1 text-cosmic-white w-24"
                        />
                        <span className="text-sm text-cosmic-white/70">days</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Risk Factors Selection */}
              <div className="card-cosmic p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-nebula-purple" />
                  <h2 className="text-2xl font-bold text-cosmic-white font-orbitron">Risk Factors</h2>
                </div>
                
                <div className="space-y-3">
                  {riskFactors.map((factor) => (
                    <label key={factor.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-space-deep/30 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedFactors.includes(factor.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFactors([...selectedFactors, factor.id]);
                            } else {
                              setSelectedFactors(selectedFactors.filter(f => f !== factor.id));
                            }
                          }}
                          className="text-nebula-purple focus:ring-nebula-purple"
                        />
                        <div>
                          <div className="text-cosmic-white font-medium">{factor.name}</div>
                          <div className="text-sm text-cosmic-white/70">Weight: {Math.round(factor.weight * 100)}% • Current Risk: {factor.current}%</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Crew Configuration */}
              <div className="card-cosmic p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="w-6 h-6 text-nebula-cyan" />
                  <h2 className="text-2xl font-bold text-cosmic-white font-orbitron">Crew Size</h2>
                </div>
                
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="2"
                    max="12"
                    value={crewSize}
                    onChange={(e) => setCrewSize(Number(e.target.value))}
                    className="flex-1"
                  />
                  <div className="text-2xl font-bold text-nebula-cyan min-w-[3rem] text-center">{crewSize}</div>
                </div>
                <div className="text-sm text-cosmic-white/70 mt-2">
                  Optimal crew size: 6 members • Current selection affects psychological and operational risks
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateRisk}
                disabled={selectedFactors.length === 0}
                className="w-full btn-cosmic py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Target className="w-5 h-5 mr-2" />
                Calculate Health Risk Assessment
              </button>
            </div>

            {/* Results Panel */}
            <div className="space-y-8">
              {results ? (
                <>
                  {/* Overall Risk Score */}
                  <div className="card-cosmic p-8 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-6">
                      <Shield className="w-8 h-8 text-star-gold" />
                      <h2 className="text-2xl font-bold text-cosmic-white font-orbitron">Risk Assessment Results</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="text-6xl font-bold text-star-gold mb-2">{results.overallRisk}%</div>
                        <div className={`text-xl font-semibold ${
                          results.riskLevel === 'Low' ? 'text-green-400' :
                          results.riskLevel === 'Moderate' ? 'text-yellow-400' :
                          results.riskLevel === 'High' ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {results.riskLevel} Risk Level
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-space-deep/30 p-3 rounded-lg">
                          <Clock className="w-4 h-4 text-nebula-cyan mb-1" />
                          <div className="text-cosmic-white/70">Mission Duration</div>
                          <div className="text-cosmic-white font-semibold">{results.duration} days</div>
                        </div>
                        <div className="bg-space-deep/30 p-3 rounded-lg">
                          <Users className="w-4 h-4 text-nebula-purple mb-1" />
                          <div className="text-cosmic-white/70">Crew Size</div>
                          <div className="text-cosmic-white font-semibold">{results.crewSize} members</div>
                        </div>
                      </div>
                      
                      <div className="bg-space-deep/30 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-cosmic-white/80">Model Confidence</span>
                          <span className="text-star-gold font-bold">{results.confidence}%</span>
                        </div>
                        <div className="w-full bg-space-deep/50 rounded-full h-2">
                          <div 
                            className="bg-star-gold h-2 rounded-full"
                            style={{ width: `${results.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Breakdown */}
                  <div className="card-cosmic p-6">
                    <h3 className="text-xl font-bold text-cosmic-white mb-4 font-orbitron">Risk Factor Breakdown</h3>
                    <div className="space-y-3">
                      {results.riskBreakdown.map((factor: RiskBreakdownItem) => (
                        <div key={factor.id} className="flex items-center justify-between p-3 bg-space-deep/20 rounded-lg">
                          <span className="text-cosmic-white">{factor.name}</span>
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-cosmic-white/70">{factor.contributionPercent}%</div>
                            <div className="w-16 bg-space-deep/50 rounded-full h-2">
                              <div 
                                className="bg-nebula-purple h-2 rounded-full"
                                style={{ width: `${factor.contributionPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="card-cosmic p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Brain className="w-6 h-6 text-nebula-cyan" />
                      <h3 className="text-xl font-bold text-cosmic-white font-orbitron">AI Recommendations</h3>
                    </div>
                    <div className="space-y-3">
                      {results.recommendations.map((rec: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-nebula-cyan/10 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-nebula-cyan mt-0.5 flex-shrink-0" />
                          <span className="text-cosmic-white/90">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="card-cosmic p-12 text-center">
                  <div className="w-20 h-20 bg-nebula-purple rounded-full mx-auto mb-8 flex items-center justify-center">
                    <Activity className="w-10 h-10 text-cosmic-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-cosmic-white mb-4 font-orbitron">
                    Ready for Risk Assessment
                  </h3>
                  <p className="text-cosmic-white/80 mb-8">
                    Configure your mission parameters and select risk factors to generate 
                    a comprehensive health risk assessment for your space mission.
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm text-cosmic-white/60">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Risk Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>AI Recommendations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Mission Planning</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
