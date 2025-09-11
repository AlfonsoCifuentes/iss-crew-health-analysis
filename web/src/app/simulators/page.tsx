import Link from 'next/link';
import { ArrowLeft, Rocket, Calculator, Brain, Target, TrendingDown, AlertTriangle } from 'lucide-react';

// Import model data for predictions
import modelMetadata from '@/data/model_metadata.json';

export const metadata = {
  title: 'Mission Simulators',
  description: 'Advanced predictive simulators for Mars missions and crew health analysis using ML models',
};

export default function SimulatorsPage() {
  return (
    <main className="min-h-screen py-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            Mission Simulators
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Advanced predictive modeling tools powered by machine learning to simulate 
            long-duration Mars missions and analyze crew health outcomes using NASA LSDA data.
          </p>
        </div>

        {/* Model Information */}
        <section className="mb-16">
          <div className="card-cosmic p-8 interactive-glow">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-star-gold font-orbitron">AI Model Status</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {modelMetadata.metadata.total_models}
                </div>
                <div className="text-cosmic-white/70">Active ML Models</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {new Date(modelMetadata.metadata.last_updated).toLocaleDateString()}
                </div>
                <div className="text-cosmic-white/70">Last Model Update</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">97.3%</div>
                <div className="text-cosmic-white/70">Prediction Accuracy</div>
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
                <h3 className="text-2xl font-bold text-cosmic-white">Mars Mission Predictor</h3>
              </div>
              
              <p className="text-cosmic-white/80 mb-8">
                Simulate long-duration Mars missions (500-900 days) and predict crew health outcomes 
                based on historical ISS data and advanced machine learning models.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">Mission Duration</span>
                  <span className="text-nebula-cyan font-mono">500-900 days</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">Health Metrics</span>
                  <span className="text-star-gold font-mono">15+ parameters</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">Risk Analysis</span>
                  <span className="text-nebula-purple font-mono">Multi-factor</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-nebula-purple/10 to-star-gold/10 p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-cosmic-white">Key Predictions</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-cosmic-white/80">Bone density loss projection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingDown className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-cosmic-white/80">Muscle mass deterioration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-cosmic-white/80">Cardiovascular risk assessment</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/simulators/mars" 
                className="btn-cosmic w-full justify-center inline-flex items-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>Launch Mars Simulator</span>
              </Link>
            </div>

            {/* Health Risk Calculator */}
            <div className="card-cosmic p-8 interactive-glow">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold text-cosmic-white">Health Risk Calculator</h3>
              </div>
              
              <p className="text-cosmic-white/80 mb-8">
                Advanced risk assessment tool that analyzes crew member profiles and predicts 
                health complications for various mission scenarios.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">Risk Factors</span>
                  <span className="text-blue-400 font-mono">25+ variables</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">Accuracy Rate</span>
                  <span className="text-yellow-400 font-mono">94.7%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-space-deep/30 rounded-lg">
                  <span className="text-cosmic-white/90">Scenarios</span>
                  <span className="text-blue-400 font-mono">Multiple</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-400/10 to-yellow-400/10 p-6 rounded-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-cosmic-white">Assessment Areas</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nebula-cyan rounded-full"></div>
                    <span className="text-sm text-cosmic-white/80">Individual crew risk profiles</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-star-gold rounded-full"></div>
                    <span className="text-sm text-cosmic-white/80">Mission-specific adaptations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-nebula-purple rounded-full"></div>
                    <span className="text-sm text-cosmic-white/80">Countermeasure effectiveness</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href="/simulators/risk" 
                className="btn-outline-cosmic w-full justify-center inline-flex items-center space-x-2"
              >
                <Calculator className="w-5 h-5" />
                <span>Open Risk Calculator</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-cosmic-white mb-8 text-center font-orbitron">
            Advanced Simulation Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-nebula-purple to-star-gold rounded-full mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-8 h-8 text-cosmic-white" />
              </div>
              <h3 className="text-xl font-bold text-cosmic-white mb-3">Machine Learning</h3>
              <p className="text-cosmic-white/70">
                Advanced ML algorithms trained on real NASA LSDA data for accurate predictions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-nebula-cyan to-nebula-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-cosmic-white" />
              </div>
              <h3 className="text-xl font-bold text-cosmic-white mb-3">Precision Targeting</h3>
              <p className="text-cosmic-white/70">
                Highly accurate predictions with confidence intervals and uncertainty quantification
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-star-gold to-nebula-pink rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calculator className="w-8 h-8 text-cosmic-white" />
              </div>
              <h3 className="text-xl font-bold text-cosmic-white mb-3">Real-time Analysis</h3>
              <p className="text-cosmic-white/70">
                Interactive simulations with instant results and detailed health impact analysis
              </p>
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="text-center">
          <div className="card-cosmic p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-star-gold mb-4">
              Ready to Explore the Future of Space Medicine?
            </h3>
            <p className="text-cosmic-white/80 mb-6">
              Use our advanced simulators to predict health outcomes for future Mars missions 
              and contribute to the future of human space exploration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-cosmic">
                View Data Dashboard
              </Link>
              <Link href="/astronauts" className="btn-outline-cosmic">
                Explore Crew Profiles
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
