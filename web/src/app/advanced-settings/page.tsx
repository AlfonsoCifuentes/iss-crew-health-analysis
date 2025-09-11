'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Zap, Shield, Bell, Palette, Globe, Monitor, Save } from 'lucide-react';

export default function AdvancedSettingsPage() {
  const [settings, setSettings] = useState({
    dataRefreshInterval: 30,
    enableRealTimeUpdates: true,
    cacheSize: 100,
    dataRetentionDays: 90,
    enablePredictiveAnalysis: true,
    aiModelAccuracy: 'balanced',
    performanceMode: 'standard',
    enableGamification: true,
    achievementNotifications: true,
    progressTracking: true,
    enableAnalytics: true,
    shareUsageData: false,
    enableCookies: true,
    securityLevel: 'high',
    twoFactorAuth: false,
    sessionTimeout: 60,
    encryptionLevel: 'aes256',
    displayDensity: 'comfortable',
    animationSpeed: 'normal',
    colorBlindnessSupport: false,
    highContrastMode: false,
    reducedMotion: false,
    fontSize: 'medium',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    enableKeyboardShortcuts: true,
    autoSave: true,
    backupFrequency: 'daily',
    exportFormat: 'json',
    notificationSound: true,
    vibrationFeedback: false,
    desktopNotifications: true,
    emailDigests: 'weekly'
  });

  const [activeSection, setActiveSection] = useState('performance');
  const [isLoading, setIsLoading] = useState(false);

  const sections = [
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'data', name: 'Data Management', icon: Database },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'interface', name: 'Interface', icon: Monitor },
    { id: 'localization', name: 'Localization', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    localStorage.setItem('iss-advanced-settings', JSON.stringify(settings));
    setIsLoading(false);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      dataRefreshInterval: 30,
      enableRealTimeUpdates: true,
      cacheSize: 100,
      dataRetentionDays: 90,
      enablePredictiveAnalysis: true,
      aiModelAccuracy: 'balanced',
      performanceMode: 'standard'
    };
    setSettings(prev => ({ ...prev, ...defaultSettings }));
  };

  const renderPerformanceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Data Refresh Interval (seconds)
        </label>
        <input
          type="range"
          min="5"
          max="300"
          value={settings.dataRefreshInterval}
          onChange={(e) => updateSetting('dataRefreshInterval', parseInt(e.target.value))}
          className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-center text-sm text-cosmic-white/70 mt-1">
          {settings.dataRefreshInterval} seconds
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-cosmic-white font-medium">Real-time Updates</div>
          <div className="text-sm text-cosmic-white/60">Enable live data streaming</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableRealTimeUpdates}
            onChange={(e) => updateSetting('enableRealTimeUpdates', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Performance Mode
        </label>
        <select
          value={settings.performanceMode}
          onChange={(e) => updateSetting('performanceMode', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          <option value="eco">Eco Mode (Low CPU/Memory)</option>
          <option value="standard">Standard (Balanced)</option>
          <option value="performance">Performance (High CPU/Memory)</option>
          <option value="maximum">Maximum (All Resources)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Cache Size (MB)
        </label>
        <input
          type="range"
          min="50"
          max="500"
          step="25"
          value={settings.cacheSize}
          onChange={(e) => updateSetting('cacheSize', parseInt(e.target.value))}
          className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-center text-sm text-cosmic-white/70 mt-1">
          {settings.cacheSize} MB
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Data Retention (days)
        </label>
        <input
          type="range"
          min="7"
          max="365"
          value={settings.dataRetentionDays}
          onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
          className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-center text-sm text-cosmic-white/70 mt-1">
          {settings.dataRetentionDays} days
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-cosmic-white font-medium">Predictive Analysis</div>
          <div className="text-sm text-cosmic-white/60">Enable AI-powered predictions</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enablePredictiveAnalysis}
            onChange={(e) => updateSetting('enablePredictiveAnalysis', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          AI Model Accuracy
        </label>
        <select
          value={settings.aiModelAccuracy}
          onChange={(e) => updateSetting('aiModelAccuracy', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          <option value="fast">Fast (Lower accuracy, faster results)</option>
          <option value="balanced">Balanced (Good accuracy, moderate speed)</option>
          <option value="precise">Precise (High accuracy, slower results)</option>
          <option value="research">Research Grade (Maximum accuracy)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Backup Frequency
        </label>
        <select
          value={settings.backupFrequency}
          onChange={(e) => updateSetting('backupFrequency', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          <option value="never">Never</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Security Level
        </label>
        <select
          value={settings.securityLevel}
          onChange={(e) => updateSetting('securityLevel', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="high">High</option>
          <option value="maximum">Maximum</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-cosmic-white font-medium">Two-Factor Authentication</div>
          <div className="text-sm text-cosmic-white/60">Enhanced account security</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => updateSetting('twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="range"
          min="5"
          max="480"
          value={settings.sessionTimeout}
          onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
          className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="text-center text-sm text-cosmic-white/70 mt-1">
          {settings.sessionTimeout} minutes
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Encryption Level
        </label>
        <select
          value={settings.encryptionLevel}
          onChange={(e) => updateSetting('encryptionLevel', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          <option value="aes128">AES-128</option>
          <option value="aes256">AES-256 (Recommended)</option>
          <option value="rsa2048">RSA-2048</option>
          <option value="rsa4096">RSA-4096 (Maximum Security)</option>
        </select>
      </div>
    </div>
  );

  const renderInterfaceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Display Density
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['compact', 'comfortable', 'spacious'].map((density) => (
            <button
              key={density}
              onClick={() => updateSetting('displayDensity', density)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                settings.displayDensity === density
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                  : 'bg-space-deep/30 text-cosmic-white/70 hover:bg-yellow-400/10'
              }`}
            >
              {density.charAt(0).toUpperCase() + density.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Animation Speed
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['slow', 'normal', 'fast'].map((speed) => (
            <button
              key={speed}
              onClick={() => updateSetting('animationSpeed', speed)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                settings.animationSpeed === speed
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                  : 'bg-space-deep/30 text-cosmic-white/70 hover:bg-yellow-400/10'
              }`}
            >
              {speed.charAt(0).toUpperCase() + speed.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-cosmic-white font-medium">High Contrast Mode</div>
            <div className="text-sm text-cosmic-white/60">Better visibility for low vision</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.highContrastMode}
              onChange={(e) => updateSetting('highContrastMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-cosmic-white font-medium">Reduced Motion</div>
            <div className="text-sm text-cosmic-white/60">Minimize animations for accessibility</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Advanced Settings
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Configure advanced system parameters and optimize your ISS Health Analytics experience
          </p>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 pr-8">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-300 ${
                      activeSection === section.id
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'text-cosmic-white/70 hover:bg-space-deep/50 hover:text-cosmic-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 p-4 card-cosmic">
              <button
                onClick={saveSettings}
                disabled={isLoading}
                className="w-full btn-cosmic flex items-center justify-center space-x-2 mb-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cosmic-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save All</span>
                  </>
                )}
              </button>
              
              <button
                onClick={resetToDefaults}
                className="w-full p-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors text-sm"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="card-cosmic p-8">
              <h2 className="text-2xl font-bold text-cosmic-white mb-6 font-orbitron">
                {sections.find(s => s.id === activeSection)?.name}
              </h2>
              
              {activeSection === 'performance' && renderPerformanceSection()}
              {activeSection === 'data' && renderDataSection()}
              {activeSection === 'security' && renderSecuritySection()}
              {activeSection === 'interface' && renderInterfaceSection()}
              {/* Add other sections as needed */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
