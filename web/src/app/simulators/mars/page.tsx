'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Rocket, Play, RotateCcw, TrendingDown, AlertTriangle, Users, Activity, Heart } from 'lucide-react';

interface SimulationInputs {
  mission_duration: number;
  initial_bone_density: number;
  initial_muscle_mass: number;
  age: number;
  exercise_hours_per_day: number;
  dietary_calcium_mg: number;
}

interface PredictionData {
  predictions: {
    bone_density: {
      initial: number;
      final: number;
      loss_percentage: number;
      recovery_months: number;
    };
    muscle_mass: {
      initial: number;
      final: number;
      loss_percentage: number;
      recovery_months: number;
    };
    cardiovascular_impact: string;
    psychological_risk: string;
    overall_risk_score: number;
    recommendations: string[];
  };
  mission_parameters: SimulationInputs;
}

export default function MarsSimulatorPage() {
  const [inputs, setInputs] = useState<SimulationInputs>({
    mission_duration: 687, // Earth days for Mars mission
    initial_bone_density: 1.0,
    initial_muscle_mass: 45.0,
    age: 35,
    exercise_hours_per_day: 2.5,
    dietary_calcium_mg: 1200
  });
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Simulation failed');
      }
    } catch (err) {
      setError('Failed to run simulation. Please try again.');
      console.error('Simulation error:', err);
    }
    
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setResults(null);
    setError(null);
    setInputs({
      mission_duration: 687,
      initial_bone_density: 1.0,
      initial_muscle_mass: 45.0,
      age: 35,
      exercise_hours_per_day: 2.5,
      dietary_calcium_mg: 1200
    });
  };

  const updateInput = (field: keyof SimulationInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <main className="min-h-screen py-8">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/simulators" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Simulators</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            Mars Mission Simulator
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Advanced predictive modeling for long-duration Mars missions. Configure mission parameters 
            and predict crew health outcomes using machine learning trained on NASA LSDA data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Configuration Panel */}
          <div className="space-y-8">
            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <Rocket className="w-8 h-8 text-blue-400" />
                <h2 className="text-2xl font-bold text-cosmic-white">Mission Configuration</h2>
              </div>
              
              <div className="space-y-6">
                {/* Mission Duration */}
                <div>
                  <label className="block text-cosmic-white font-medium mb-3">
                    Mission Duration: {inputs.mission_duration} days
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="900"
                    value={inputs.mission_duration}
                    onChange={(e) => updateInput('mission_duration', parseInt(e.target.value))}
                    className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-cosmic-white/60 mt-1">
                    <span>500 days (Short)</span>
                    <span>900 days (Extended)</span>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-cosmic-white font-medium mb-3">
                    Age: {inputs.age} years
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="55"
                    value={inputs.age}
                    onChange={(e) => updateInput('age', parseInt(e.target.value))}
                    className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-cosmic-white/60 mt-1">
                    <span>25 (Young)</span>
                    <span>55 (Experienced)</span>
                  </div>
                </div>

                {/* Initial Bone Density */}
                <div>
                  <label className="block text-cosmic-white font-medium mb-3">
                    Initial Bone Density: {inputs.initial_bone_density} g/cm³
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={inputs.initial_bone_density}
                    onChange={(e) => updateInput('initial_bone_density', parseFloat(e.target.value))}
                    className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-cosmic-white/60 mt-1">
                    <span>0.8 (Low)</span>
                    <span>1.2 (High)</span>
                  </div>
                </div>

                {/* Initial Muscle Mass */}
                <div>
                  <label className="block text-cosmic-white font-medium mb-3">
                    Initial Muscle Mass: {inputs.initial_muscle_mass} kg
                  </label>
                  <input
                    type="range"
                    min="35"
                    max="55"
                    step="0.5"
                    value={inputs.initial_muscle_mass}
                    onChange={(e) => updateInput('initial_muscle_mass', parseFloat(e.target.value))}
                    className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-cosmic-white/60 mt-1">
                    <span>35 kg (Low)</span>
                    <span>55 kg (High)</span>
                  </div>
                </div>

                {/* Exercise Hours */}
                <div>
                  <label className="block text-cosmic-white font-medium mb-3">
                    Daily Exercise: {inputs.exercise_hours_per_day} hours
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={inputs.exercise_hours_per_day}
                    onChange={(e) => updateInput('exercise_hours_per_day', parseFloat(e.target.value))}
                    className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-cosmic-white/60 mt-1">
                    <span>1 hour (Minimal)</span>
                    <span>4 hours (Maximum)</span>
                  </div>
                </div>

                {/* Dietary Calcium */}
                <div>
                  <label className="block text-cosmic-white font-medium mb-3">
                    Daily Calcium Intake: {inputs.dietary_calcium_mg} mg
                  </label>
                  <input
                    type="range"
                    min="800"
                    max="1800"
                    step="100"
                    value={inputs.dietary_calcium_mg}
                    onChange={(e) => updateInput('dietary_calcium_mg', parseInt(e.target.value))}
                    className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-cosmic-white/60 mt-1">
                    <span>800 mg (Low)</span>
                    <span>1800 mg (High)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="btn-cosmic flex-1 flex items-center justify-center space-x-2"
                >
                  {isSimulating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-cosmic-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Run Simulation</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="btn-outline-cosmic flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Mission Details */}
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-bold text-cosmic-white mb-4">Mission Overview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Total Mission Time:</span>
                  <span className="text-cosmic-white font-mono">{inputs.mission_duration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Astronaut Age:</span>
                  <span className="text-cosmic-white font-mono">{inputs.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Exercise Protocol:</span>
                  <span className="text-cosmic-white font-mono">{inputs.exercise_hours_per_day}h/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Calcium Intake:</span>
                  <span className="text-cosmic-white font-mono">{inputs.dietary_calcium_mg}mg/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Mission Type:</span>
                  <span className="text-cosmic-white font-mono">
                    {inputs.mission_duration > 700 ? 'Extended Mars' : 'Standard Mars'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div>
            {error && (
              <div className="card-cosmic p-6 bg-red-900/20 border border-red-500/30 mb-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <div>
                    <h3 className="text-lg font-bold text-red-400">Simulation Error</h3>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results ? (
              <div className="space-y-6">
                {/* Prediction Results */}
                <div className="card-cosmic p-8 interactive-glow">
                  <div className="flex items-center space-x-3 mb-6">
                    <TrendingDown className="w-8 h-8 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-cosmic-white">Prediction Results</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-nebula-purple/10 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        <span className="text-cosmic-white font-medium">Bone Density</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-cosmic-white/70">Initial:</span>
                          <span className="text-cosmic-white">{results.predictions.bone_density.initial} g/cm³</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cosmic-white/70">Final:</span>
                          <span className="text-cosmic-white">{results.predictions.bone_density.final} g/cm³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cosmic-white/70">Loss:</span>
                          <span className="text-xl font-bold text-yellow-400">
                            {results.predictions.bone_density.loss_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-nebula-cyan/10 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="w-5 h-5 text-blue-400" />
                        <span className="text-cosmic-white font-medium">Muscle Mass</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-cosmic-white/70">Initial:</span>
                          <span className="text-cosmic-white">{results.predictions.muscle_mass.initial} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cosmic-white/70">Final:</span>
                          <span className="text-cosmic-white">{results.predictions.muscle_mass.final} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cosmic-white/70">Loss:</span>
                          <span className="text-xl font-bold text-blue-400">
                            {results.predictions.muscle_mass.loss_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-star-gold/10 rounded-lg">
                      <span className="text-cosmic-white font-medium">Cardiovascular Impact</span>
                      <div className="mt-2">
                        <span className={`text-xl font-bold ${
                          results.predictions.cardiovascular_impact === 'High' ? 'text-red-400' : 
                          results.predictions.cardiovascular_impact === 'Moderate' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {results.predictions.cardiovascular_impact}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-nebula-pink/10 rounded-lg">
                      <span className="text-cosmic-white font-medium">Psychological Risk</span>
                      <div className="mt-2">
                        <span className={`text-xl font-bold ${
                          results.predictions.psychological_risk === 'High' ? 'text-red-400' : 
                          results.predictions.psychological_risk === 'Moderate' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {results.predictions.psychological_risk}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-space-deep/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-white font-medium">Overall Risk Score</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        {results.predictions.overall_risk_score}/10
                      </span>
                    </div>
                    <div className="w-full bg-space-deep/50 rounded-full h-3 mt-2">
                      <div 
                        className={`h-3 rounded-full ${
                          results.predictions.overall_risk_score >= 7 ? 'bg-red-500' :
                          results.predictions.overall_risk_score >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${results.predictions.overall_risk_score * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recovery Times */}
                <div className="card-cosmic p-6">
                  <h3 className="text-xl font-bold text-cosmic-white mb-4">Recovery Estimates</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-white/80">Bone Density Recovery</span>
                      <span className="text-purple-400 font-bold">
                        {results.predictions.bone_density.recovery_months} months
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-white/80">Muscle Mass Recovery</span>
                      <span className="text-blue-400 font-bold">
                        {results.predictions.muscle_mass.recovery_months} months
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="card-cosmic p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-cosmic-white">Recommendations</h3>
                  </div>
                  <div className="space-y-2 text-sm text-cosmic-white/80">
                    {results.predictions.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-cosmic p-12 text-center">
                <div className="w-20 h-20 bg-blue-400 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-cosmic-white" />
                </div>
                <h3 className="text-2xl font-bold text-cosmic-white mb-4">
                  Ready for Mars Mission Analysis
                </h3>
                <p className="text-cosmic-white/80 mb-8">
                  Configure your mission parameters and click &ldquo;Run Simulation&rdquo; to predict 
                  crew health outcomes for your Mars mission scenario.
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-cosmic-white/60">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Crew Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4" />
                    <span>Health Prediction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Risk Assessment</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
