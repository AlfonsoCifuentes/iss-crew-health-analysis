'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Database, Save, X } from 'lucide-react';

interface UserSettings {
  profile: {
    name: string;
    role: string;
    organization: string;
    email: string;
  };
  preferences: {
    theme: 'dark' | 'light' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
    units: 'metric' | 'imperial';
  };
  notifications: {
    realTimeAlerts: boolean;
    dailyReports: boolean;
    weeklyDigest: boolean;
    emergencyAlerts: boolean;
    emailNotifications: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analyticsTracking: boolean;
    cookieConsent: boolean;
  };
  dashboard: {
    defaultView: string;
    autoRefresh: boolean;
    refreshInterval: number;
    visibleMetrics: string[];
  };
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: 'Dr. Sarah Chen',
      role: 'Flight Surgeon',
      organization: 'NASA Johnson Space Center',
      email: 'sarah.chen@nasa.gov'
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      units: 'metric'
    },
    notifications: {
      realTimeAlerts: true,
      dailyReports: true,
      weeklyDigest: false,
      emergencyAlerts: true,
      emailNotifications: true
    },
    privacy: {
      dataSharing: false,
      analyticsTracking: true,
      cookieConsent: true
    },
    dashboard: {
      defaultView: 'overview',
      autoRefresh: true,
      refreshInterval: 30,
      visibleMetrics: ['bone_density', 'muscle_mass', 'cardiovascular', 'psychological']
    }
  });

  const [activeSection, setActiveSection] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'dashboard', name: 'Dashboard', icon: Database }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ru', name: 'Русский' }
  ];

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const availableMetrics = [
    { id: 'bone_density', name: 'Bone Density' },
    { id: 'muscle_mass', name: 'Muscle Mass' },
    { id: 'cardiovascular', name: 'Cardiovascular' },
    { id: 'psychological', name: 'Psychological' },
    { id: 'sleep_quality', name: 'Sleep Quality' },
    { id: 'exercise', name: 'Exercise Performance' },
    { id: 'nutrition', name: 'Nutrition Status' },
    { id: 'radiation', name: 'Radiation Exposure' }
  ];

  useEffect(() => {
    // Load settings from localStorage on component mount
    const savedSettings = localStorage.getItem('iss-crew-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const updateSettings = (section: keyof UserSettings, key: string, value: string | boolean | number | string[]) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage
    localStorage.setItem('iss-crew-settings', JSON.stringify(settings));
    
    setHasChanges(false);
    setIsSaving(false);
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={settings.profile.name}
          onChange={(e) => updateSettings('profile', 'name', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Role
        </label>
        <select
          value={settings.profile.role}
          onChange={(e) => updateSettings('profile', 'role', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          <option value="Flight Surgeon">Flight Surgeon</option>
          <option value="Mission Specialist">Mission Specialist</option>
          <option value="Research Scientist">Research Scientist</option>
          <option value="Engineer">Engineer</option>
          <option value="Administrator">Administrator</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Organization
        </label>
        <input
          type="text"
          value={settings.profile.organization}
          onChange={(e) => updateSettings('profile', 'organization', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Email
        </label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => updateSettings('profile', 'email', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        />
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['dark', 'light', 'auto'].map((theme) => (
            <button
              key={theme}
              onClick={() => updateSettings('preferences', 'theme', theme)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                settings.preferences.theme === theme
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                  : 'bg-space-deep/30 text-cosmic-white/70 hover:bg-yellow-400/10'
              }`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Language
        </label>
        <select
          value={settings.preferences.language}
          onChange={(e) => updateSettings('preferences', 'language', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Timezone
        </label>
        <select
          value={settings.preferences.timezone}
          onChange={(e) => updateSettings('preferences', 'timezone', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Units
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['metric', 'imperial'].map((unit) => (
            <button
              key={unit}
              onClick={() => updateSettings('preferences', 'units', unit)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                settings.preferences.units === unit
                  ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                  : 'bg-space-deep/30 text-cosmic-white/70 hover:bg-yellow-400/10'
              }`}
            >
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <label key={key} className="flex items-center justify-between">
          <div>
            <div className="text-cosmic-white font-medium">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </div>
            <div className="text-sm text-cosmic-white/60">
              {key === 'realTimeAlerts' && 'Immediate notifications for critical changes'}
              {key === 'dailyReports' && 'Daily summary of crew health metrics'}
              {key === 'weeklyDigest' && 'Weekly comprehensive health analysis'}
              {key === 'emergencyAlerts' && 'Critical health emergency notifications'}
              {key === 'emailNotifications' && 'Send notifications to your email'}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateSettings('notifications', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </label>
      ))}
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      {Object.entries(settings.privacy).map(([key, value]) => (
        <label key={key} className="flex items-center justify-between">
          <div>
            <div className="text-cosmic-white font-medium">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </div>
            <div className="text-sm text-cosmic-white/60">
              {key === 'dataSharing' && 'Share anonymized data for research purposes'}
              {key === 'analyticsTracking' && 'Allow usage analytics to improve the platform'}
              {key === 'cookieConsent' && 'Accept cookies for enhanced functionality'}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateSettings('privacy', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </label>
      ))}
    </div>
  );

  const renderDashboardSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-2">
          Default View
        </label>
        <select
          value={settings.dashboard.defaultView}
          onChange={(e) => updateSettings('dashboard', 'defaultView', e.target.value)}
          className="w-full p-3 bg-space-deep/50 border border-space-deep rounded-lg text-cosmic-white focus:border-yellow-400 focus:outline-none"
        >
          <option value="overview">Overview</option>
          <option value="detailed">Detailed Metrics</option>
          <option value="analytics">Analytics</option>
          <option value="reports">Reports</option>
        </select>
      </div>
      
      <div>
        <label className="flex items-center justify-between mb-4">
          <div>
            <div className="text-cosmic-white font-medium">Auto Refresh</div>
            <div className="text-sm text-cosmic-white/60">Automatically update dashboard data</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.dashboard.autoRefresh}
              onChange={(e) => updateSettings('dashboard', 'autoRefresh', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-space-deep peer-focus:ring-2 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </label>
        
        {settings.dashboard.autoRefresh && (
          <div>
            <label className="block text-sm font-medium text-cosmic-white mb-2">
              Refresh Interval (seconds)
            </label>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={settings.dashboard.refreshInterval}
              onChange={(e) => updateSettings('dashboard', 'refreshInterval', parseInt(e.target.value))}
              className="w-full h-2 bg-space-deep rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-center text-sm text-cosmic-white/70 mt-1">
              {settings.dashboard.refreshInterval} seconds
            </div>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-cosmic-white mb-4">
          Visible Metrics
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableMetrics.map((metric) => (
            <label
              key={metric.id}
              className="flex items-center space-x-3 p-3 rounded-lg bg-space-deep/30 hover:bg-space-deep/50 cursor-pointer transition-all duration-300"
            >
              <input
                type="checkbox"
                checked={settings.dashboard.visibleMetrics.includes(metric.id)}
                onChange={(e) => {
                  const currentMetrics = settings.dashboard.visibleMetrics;
                  if (e.target.checked) {
                    updateSettings('dashboard', 'visibleMetrics', [...currentMetrics, metric.id]);
                  } else {
                    updateSettings('dashboard', 'visibleMetrics', currentMetrics.filter(m => m !== metric.id));
                  }
                }}
                className="w-4 h-4 text-yellow-400 bg-space-deep border-space-deep focus:ring-yellow-400 focus:ring-2 rounded"
              />
              <span className="text-cosmic-white">{metric.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-space-deep/95 backdrop-blur-md rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-space-deep/50">
        {/* Header */}
        <div className="p-6 border-b border-space-deep/50 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-cosmic-white font-orbitron">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-cosmic-white/70 hover:text-cosmic-white hover:bg-space-deep/50 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 p-6 border-r border-space-deep/50">
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
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'preferences' && renderPreferencesSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'privacy' && renderPrivacySection()}
            {activeSection === 'dashboard' && renderDashboardSection()}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-space-deep/50 flex items-center justify-between">
          <div className="text-sm text-cosmic-white/60">
            {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              disabled={!hasChanges || isSaving}
              className="btn-cosmic flex items-center space-x-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-cosmic-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
