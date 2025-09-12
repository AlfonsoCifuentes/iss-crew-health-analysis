'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Rocket, Users, Activity, Brain, Zap, ArrowRight } from 'lucide-react';
import RealStatsSection from '@/components/RealStatsSection';
import { useTranslation } from '@/contexts/LocaleContext';

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Full-width ISS Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/iss_hero.jpg" 
            alt="International Space Station" 
            fill
            className="hero-image"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 md:mb-8 tracking-tight leading-tight font-orbitron"
          >
            <span className="block text-cosmic-white drop-shadow-2xl">ISS CREW</span>
            <span className="block text-yellow-400 drop-shadow-2xl">HEALTH</span>
            <span className="block text-cosmic-white drop-shadow-2xl">ANALYSIS</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
            {t('home.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
            <Link 
              href="/dashboard" 
              className="btn-cosmic text-base md:text-lg px-6 md:px-10 py-3 md:py-4 inline-flex items-center justify-center space-x-2 md:space-x-3 shadow-2xl w-full sm:w-auto"
            >
              <Activity className="w-5 h-5 md:w-6 md:h-6" />
              <span>{t('home.getStarted')}</span>
            </Link>
            <Link 
              href="/simulators" 
              className="btn-outline-cosmic text-base md:text-lg px-6 md:px-10 py-3 md:py-4 inline-flex items-center justify-center space-x-2 md:space-x-3 shadow-2xl w-full sm:w-auto"
            >
              <Brain className="w-5 h-5 md:w-6 md:h-6" />
              <span>{t('home.runSimulations')}</span>
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <ArrowRight className="w-6 h-6 text-white/70 rotate-90" />
          </div>
        </div>
      </section>

      {/* Key Stats Section - Real NASA Data */}
      <RealStatsSection />
      
      {/* Features Grid */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 relative">
        <div className="w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-6 font-orbitron">
              {t('home.advancedAnalytics')}
            </h2>
            <p className="text-xl text-cosmic-white/80 max-w-3xl mx-auto">
              {t('home.advancedAnalyticsDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Interactive Dashboard */}
            <div className="card-cosmic p-8 interactive-glow text-center">
              <Activity className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">{t('home.interactiveDashboard')}</h3>
              <p className="text-cosmic-white/70 mb-6">
                {t('home.interactiveDashboardDescription')}
              </p>
              <Link href="/dashboard" className="btn-outline-cosmic">
                {t('home.exploreNow')}
              </Link>
            </div>
            
            {/* Mars Mission Predictor */}
            <div className="card-cosmic p-8 interactive-glow text-center">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">{t('home.marsSimulator')}</h3>
              <p className="text-cosmic-white/70 mb-6">
                {t('home.marsSimulatorDescription')}
              </p>
              <Link href="/simulators/mars" className="btn-outline-cosmic">
                {t('home.trySimulator')}
              </Link>
            </div>
            
            {/* Crew Health Analyzer */}
            <div className="card-cosmic p-8 interactive-glow text-center">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-cosmic-white mb-4">{t('home.crewAnalyzer')}</h3>
              <p className="text-cosmic-white/70 mb-6">
                {t('home.crewAnalyzerDescription')}
              </p>
              <Link href="/astronauts" className="btn-outline-cosmic">
                {t('home.viewProfiles')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dashboard Preview Section */}
      <section id="dashboard" className="py-20 px-6 sm:px-8 lg:px-12 relative">
        <div className="w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cosmic-white mb-6 font-orbitron">
              {t('home.realNasaData')}
            </h2>
            <p className="text-xl text-cosmic-white/80 max-w-3xl mx-auto">
              {t('home.realNasaDataDescription')}
            </p>
          </div>
          
          {/* Ornamental gradient background */}
          <div className="absolute left-0 top-1/4 opacity-5 -z-10">
            <div className="w-80 h-80 bg-gradient-to-r from-star-gold/30 to-nebula-pink/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Health Metrics Card */}
            <div className="card-cosmic p-6 interactive-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cosmic-white">{t('home.healthImpact')}</h3>
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.boneDensityLoss')}</span>
                  <span className="text-red-400 font-mono">-8.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.muscleMassLoss')}</span>
                  <span className="text-red-400 font-mono">-12.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.cardiovascularChange')}</span>
                  <span className="text-yellow-400 font-mono">-5.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.recoveryTime')}</span>
                  <span className="text-cyan-400 font-mono">90 {t('home.days')}</span>
                </div>
              </div>
            </div>
            
            {/* Mission Analytics Card */}
            <div className="card-cosmic p-6 interactive-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cosmic-white">{t('home.missionStats')}</h3>
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.totalMissions')}</span>
                  <span className="text-green-400 font-mono">120</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.avgDuration')}</span>
                  <span className="text-cyan-400 font-mono">186 {t('home.days')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.successRate')}</span>
                  <span className="text-green-400 font-mono">98.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.dataQuality')}</span>
                  <span className="text-green-400 font-mono">95.8%</span>
                </div>
              </div>
            </div>
            
            {/* Crew Insights Card */}
            <div className="card-cosmic p-6 interactive-glow lg:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-cosmic-white">{t('home.crewAnalysis')}</h3>
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.activeCrew')}</span>
                  <span className="text-cyan-400 font-mono">120</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.averageAge')}</span>
                  <span className="text-cosmic-white font-mono">42.3 {t('home.years')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.riskLevel')}</span>
                  <span className="text-yellow-400 font-mono">{t('home.medium')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-white/70">{t('home.outliersDetected')}</span>
                  <span className="text-yellow-400 font-mono">8.3%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/dashboard" 
              className="btn-cosmic inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>{t('home.openFullDashboard')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-nebula-purple/10 to-nebula-pink/10 relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6 font-orbitron">
            {t('home.readyToExplore')}
          </h2>
          <p className="text-xl text-cosmic-white/80 mb-8">
            {t('home.readyToExploreDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-cosmic text-lg px-8 py-4">
              {t('home.startExploring')}
            </Link>
            <Link href="/simulators" className="btn-outline-cosmic text-lg px-8 py-4">
              {t('home.trySimulators')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 sm:px-8 lg:px-12 border-t border-nebula-purple/20">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold text-cosmic-white">{t('home.issHealthShort')}</span>
              </div>
              <p className="text-cosmic-white/70">
                {t('home.issHealthDescription')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-cosmic-white mb-4">{t('home.features')}</h3>
              <ul className="space-y-2 text-cosmic-white/70">
                <li>{t('home.interactiveDashboard')}</li>
                <li>{t('home.marsSimulator')}</li>
                <li>{t('home.crewAnalyzer')}</li>
                <li>{t('home.predictiveModeling')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-cosmic-white mb-4">{t('home.dataSources')}</h3>
              <ul className="space-y-2 text-cosmic-white/70">
                <li>{t('home.nasaLsda')}</li>
                <li>{t('home.issMedicalData')}</li>
                <li>{t('home.spaceMedicineResearch')}</li>
                <li>{t('home.publishedStudies')}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-cosmic-white mb-4">{t('home.about')}</h3>
              <ul className="space-y-2 text-cosmic-white/70">
                <li>{t('home.methodology')}</li>
                <li>{t('home.dataQuality')}</li>
                <li>{t('home.privacyPolicy')}</li>
                <li>{t('home.contact')}</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-nebula-purple/20 text-center">
            <p className="text-cosmic-white/70">
              {t('home.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
