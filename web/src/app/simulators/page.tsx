'use client';

import Link from 'next/link';
import { ArrowLeft, Rocket, Calculator, Brain, Target, TrendingDown, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';
import { useRealMetrics, useModelMetadata } from '@/hooks/useStaticData';

export default function SimulatorsPage() {
  const { t } = useTranslation();
  const realMetrics = useRealMetrics();
  const modelMetadata = useModelMetadata();
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
            <span>{t('simulators.backHome')}</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            {t('simulators.title')}
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            {t('simulators.subtitle')}
          </p>
        </div>

        {/* Model Information */}
        <section className="mb-16">
          <div className="card-cosmic p-8 interactive-glow">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-star-gold font-orbitron">{t('simulators.algorithmStatus')}</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-lg bg-cosmic-white/5">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                  1
                </div>
                <div className="text-sm sm:text-base text-cosmic-white/70">{t('simulators.mlModelActive')}</div>
                <div className="text-xs sm:text-sm text-cosmic-white/50 mt-1">
                  {t('simulators.productionReady')}
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-cosmic-white/5">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">
                  5
                </div>
                <div className="text-sm sm:text-base text-cosmic-white/70">{t('simulators.researchAlgorithms')}</div>
                <div className="text-xs sm:text-sm text-cosmic-white/50 mt-1">
                  {t('simulators.validatedActive')}
                </div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-cosmic-white/5">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-2">
                  {new Date(modelMetadata.model_info.training_date).toLocaleDateString()}
                </div>
                <div className="text-sm sm:text-base text-cosmic-white/70">{t('simulators.lastModelUpdate')}</div>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-cosmic-white/5">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                  {realMetrics?.simulators_page.ml_model_accuracy_percent || '84.0'}%
                </div>
                <div className="text-sm sm:text-base text-cosmic-white/70">{t('simulators.mlModelAccuracy')}</div>
                <div className="text-xs sm:text-sm text-cosmic-white/50 mt-1">
                  {t('simulators.r2Score')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ML Model + Research Algorithms Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cosmic-white mb-8 text-center font-orbitron">
            {t('simulators.activePredictionModels')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ML Model */}
            <div className="card-cosmic p-6 border-2 border-yellow-400/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cosmic-white font-orbitron">{t('simulators.mlModel')}</h3>
                  <div className="text-xs text-yellow-400">🎯 {t('simulators.active')}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90 text-sm">{t('simulators.boneDensityPrediction')}</span>
                  <span className="text-yellow-400 font-mono text-sm">{t('simulators.randomForest')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90 text-sm">{t('simulators.accuracy')} ({t('simulators.r2ScoreLabel')})</span>
                  <span className="text-yellow-400 font-mono text-sm">94.73%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90 text-sm">{t('simulators.trainingData')}</span>
                  <span className="text-yellow-400 font-mono text-sm">120 {t('simulators.samples')}</span>
                </div>
              </div>
            </div>

            {/* Research Algorithms */}
            <div className="card-cosmic p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cosmic-white font-orbitron">{t('simulators.researchAlgorithms')}</h3>
                  <div className="text-xs text-blue-400">📚 {t('simulators.validated')}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90 text-sm">{t('simulators.muscleMassDegradation')}</span>
                  <span className="text-blue-400 font-mono text-sm">{t('simulators.literatureBased')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90 text-sm">{t('simulators.cardiovascularRisk')}</span>
                  <span className="text-blue-400 font-mono text-sm">{t('simulators.issStudies')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90 text-sm">{t('simulators.psychologicalImpact')}</span>
                  <span className="text-blue-400 font-mono text-sm">{t('simulators.isolationResearch')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-400/10 to-blue-400/10 p-6 rounded-lg mt-8">
            <div className="text-center">
              <h4 className="text-xl font-bold text-cosmic-white mb-4 font-orbitron">
                {t('simulators.hybridPredictionSystem')}
              </h4>
              <p className="text-cosmic-white/80 text-sm mb-4">
                {t('simulators.hybridDescription')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">{t('simulators.mlModel')}</div>
                  <div className="text-cosmic-white/60">{t('simulators.boneDensityChanges')}</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">{t('simulators.researchAlgorithms')}</div>
                  <div className="text-cosmic-white/60">{t('simulators.muscleCardioxPsychology')}</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">{t('simulators.fallbackStrategy')}</div>
                  <div className="text-cosmic-white/60">{t('simulators.researchBasedFallback')}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Simulator Cards */}
        <section className="mb-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
            
            {/* Mars Mission Predictor */}
            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <Rocket className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-cosmic-white">{t('simulators.marsMissionPredictor')}</h3>
              </div>
              
              <p className="text-cosmic-white/80 mb-8">
                {t('simulators.marsPredictorDescription')}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">{t('simulators.missionDuration')}</span>
                  <span className="text-nebula-cyan font-mono">{t('simulators.missionDurationValue')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">{t('simulators.healthMetrics')}</span>
                  <span className="text-star-gold font-mono">{t('simulators.healthMetricsValue')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">{t('simulators.riskAnalysis')}</span>
                  <span className="text-nebula-purple font-mono">{t('simulators.riskAnalysisValue')}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-nebula-purple/10 to-star-gold/10 p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-cosmic-white">{t('simulators.keyPredictions')}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-cosmic-white/80">{t('simulators.boneDensityLossProjection')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-cosmic-white/80">{t('simulators.muscleMassDeterioration')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-cosmic-white/80">{t('simulators.cardiovascularRiskAssessment')}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/simulators/mars" 
                className="btn-cosmic w-full justify-center inline-flex items-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>{t('simulators.launchMarsSimulator')}</span>
              </Link>
            </div>

            {/* Health Risk Calculator */}
            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-cosmic-white">{t('simulators.healthRiskCalculator')}</h3>
              </div>
              
              <p className="text-cosmic-white/80 mb-8">
                {t('simulators.riskCalculatorDescription')}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">{t('simulators.riskFactors')}</span>
                  <span className="text-blue-400 font-mono">{t('simulators.riskFactorsValue')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">{t('simulators.accuracyRate')}</span>
                  <span className="text-yellow-400 font-mono">{t('simulators.accuracyRateValue')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">{t('simulators.scenarios')}</span>
                  <span className="text-blue-400 font-mono">{t('simulators.scenariosValue')}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-400/10 to-yellow-400/10 p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-cosmic-white">{t('simulators.assessmentAreas')}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nebula-cyan rounded-full"></div>
                    <span className="text-sm text-cosmic-white/80">{t('simulators.individualCrewRisk')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-star-gold rounded-full"></div>
                    <span className="text-sm text-cosmic-white/80">{t('simulators.missionSpecificAdaptations')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nebula-purple rounded-full"></div>
                    <span className="text-sm text-cosmic-white/80">{t('simulators.countermeasureEffectiveness')}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/simulators/risk" 
                className="btn-outline-cosmic w-full justify-center inline-flex items-center space-x-2"
              >
                <Calculator className="w-5 h-5" />
                <span>{t('simulators.openRiskCalculator')}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cosmic-white mb-8 text-center font-orbitron">
            {t('simulators.advancedSimulationFeatures')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-nebula-purple to-star-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-8 h-8 text-cosmic-white" />
              </div>
              <h3 className="text-xl font-bold text-cosmic-white mb-3">{t('simulators.researchBasedAlgorithms')}</h3>
              <p className="text-cosmic-white/70">
                {t('simulators.researchAlgorithmsDescription')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-nebula-cyan to-nebula-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-cosmic-white" />
              </div>
              <h3 className="text-xl font-bold text-cosmic-white mb-3">{t('simulators.scientificAccuracy')}</h3>
              <p className="text-cosmic-white/70">
                {t('simulators.scientificAccuracyDescription')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-star-gold to-nebula-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calculator className="w-8 h-8 text-cosmic-white" />
              </div>
              <h3 className="text-xl font-bold text-cosmic-white mb-3">{t('simulators.realtimeAnalysis')}</h3>
              <p className="text-cosmic-white/70">
                {t('simulators.realtimeAnalysisDescription')}
              </p>
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="text-center">
          <div className="card-cosmic p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-star-gold mb-4">
              {t('simulators.readyToExplore')}
            </h3>
            <p className="text-cosmic-white/80 mb-6">
              {t('simulators.readyToExploreDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-cosmic">
                {t('simulators.viewDataDashboard')}
              </Link>
              <Link href="/astronauts" className="btn-outline-cosmic">
                {t('simulators.exploreCrewProfiles')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
