'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Calendar, Users, BarChart3, TrendingUp } from 'lucide-react';

interface ReportConfig {
  type: 'health' | 'mission' | 'comparison' | 'predictive';
  timeframe: 'week' | 'month' | 'quarter' | 'year' | 'custom';
  metrics: string[];
  crew: string[];
  format: 'pdf' | 'csv' | 'json';
}

interface ReportData {
  title: string;
  type: string;
  generated_at: string;
  timeframe: string;
  summary: {
    total_subjects: number;
    key_findings: string[];
    [key: string]: unknown;
  };
  metadata: {
    recommendations: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export default function ReportsPage() {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'health',
    timeframe: 'month',
    metrics: ['bone_density', 'muscle_mass'],
    crew: ['all'],
    format: 'pdf'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'health',
      name: 'Health Impact Report',
      description: 'Comprehensive analysis of health changes during missions',
      icon: TrendingUp
    },
    {
      id: 'mission',
      name: 'Mission Summary',
      description: 'Complete mission overview with key metrics',
      icon: BarChart3
    },
    {
      id: 'comparison',
      name: 'Comparative Analysis',
      description: 'Compare metrics across different missions and crew members',
      icon: Users
    },
    {
      id: 'predictive',
      name: 'Predictive Report',
      description: 'Future health projections and risk assessments',
      icon: Calendar
    }
  ];

  const availableMetrics = [
    { id: 'bone_density', name: 'Bone Density', category: 'Physical' },
    { id: 'muscle_mass', name: 'Muscle Mass', category: 'Physical' },
    { id: 'cardiovascular', name: 'Cardiovascular Health', category: 'Physical' },
    { id: 'psychological', name: 'Psychological Wellness', category: 'Mental' },
    { id: 'sleep_quality', name: 'Sleep Quality', category: 'Mental' },
    { id: 'exercise_compliance', name: 'Exercise Compliance', category: 'Behavioral' },
    { id: 'nutrition_status', name: 'Nutrition Status', category: 'Behavioral' }
  ];

  const crewMembers = [
    { id: 'all', name: 'All Crew Members' },
    { id: 'iss-045', name: 'ISS-045 (Current Expedition)' },
    { id: 'iss-044', name: 'ISS-044 (Previous Expedition)' },
    { id: 'iss-043', name: 'ISS-043 (Historical Data)' }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Call the API to generate the report
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const reportData = await response.json();
      
      // Create download based on format
      let blob: Blob;
      let filename: string;
      
      switch (config.format) {
        case 'pdf':
          // For now, we'll download as JSON since we don't have PDF generation
          blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
          filename = `ISS_Health_Report_${reportData.id}.json`;
          break;
        case 'csv':
          const csvData = convertToCSV(reportData);
          blob = new Blob([csvData], { type: 'text/csv' });
          filename = `ISS_Health_Report_${reportData.id}.csv`;
          break;
        case 'json':
        default:
          blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
          filename = `ISS_Health_Report_${reportData.id}.json`;
      }

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Show success message (you could add a toast notification here)
      console.log('Report generated successfully:', reportData.title);
      
    } catch (error) {
      console.error('Error generating report:', error);
      // You could add error handling here (toast notification, etc.)
    } finally {
      setIsGenerating(false);
    }
  };

  const convertToCSV = (reportData: ReportData): string => {
    const csvRows = [];
    
    // Headers
    csvRows.push('Report Information,Value');
    csvRows.push(`Title,"${reportData.title}"`);
    csvRows.push(`Type,"${reportData.type}"`);
    csvRows.push(`Generated,"${reportData.generated_at}"`);
    csvRows.push(`Timeframe,"${reportData.timeframe}"`);
    csvRows.push('');
    
    // Summary data
    if (reportData.summary) {
      csvRows.push('Summary,Value');
      Object.entries(reportData.summary).forEach(([key, value]) => {
        if (typeof value === 'object') {
          csvRows.push(`${key},"${JSON.stringify(value)}"`);
        } else {
          csvRows.push(`${key},"${value}"`);
        }
      });
    }
    
    return csvRows.join('\n');
  };

  return (
    <main className="min-h-screen py-8">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/analytics" 
            className="inline-flex items-center space-x-2 text-cosmic-white/70 hover:text-cosmic-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analytics</span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-cosmic-white mb-4 font-orbitron">
            Report Generator
          </h1>
          <p className="text-xl text-cosmic-white/80 max-w-4xl">
            Generate custom reports and analysis based on ISS crew health data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Report Type Selection */}
            <div className="card-cosmic p-8">
              <h2 className="text-2xl font-bold text-cosmic-white mb-6 font-orbitron">
                Report Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        config.type === type.id
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-space-deep/50 hover:border-yellow-400/50 hover:bg-yellow-400/5'
                      }`}
                      onClick={() => setConfig(prev => ({ ...prev, type: type.id as 'health' | 'mission' | 'comparison' | 'predictive' }))}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-lg font-bold text-cosmic-white">{type.name}</h3>
                      </div>
                      <p className="text-sm text-cosmic-white/70">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeframe Selection */}
            <div className="card-cosmic p-8">
              <h2 className="text-2xl font-bold text-cosmic-white mb-6 font-orbitron">
                Timeframe
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['week', 'month', 'quarter', 'year', 'custom'].map((period) => (
                  <button
                    key={period}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      config.timeframe === period
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
                        : 'bg-space-deep/30 text-cosmic-white/70 hover:bg-yellow-400/10 hover:text-yellow-400'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, timeframe: period as 'week' | 'month' | 'quarter' | 'year' | 'custom' }))}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics Selection */}
            <div className="card-cosmic p-8">
              <h2 className="text-2xl font-bold text-cosmic-white mb-6 font-orbitron">
                Health Metrics
              </h2>
              <div className="space-y-4">
                {['Physical', 'Mental', 'Behavioral'].map((category) => (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-cosmic-white mb-3">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableMetrics
                        .filter(metric => metric.category === category)
                        .map((metric) => (
                          <label
                            key={metric.id}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-space-deep/30 hover:bg-space-deep/50 cursor-pointer transition-all duration-300"
                          >
                            <input
                              type="checkbox"
                              checked={config.metrics.includes(metric.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setConfig(prev => ({
                                    ...prev,
                                    metrics: [...prev.metrics, metric.id]
                                  }));
                                } else {
                                  setConfig(prev => ({
                                    ...prev,
                                    metrics: prev.metrics.filter(m => m !== metric.id)
                                  }));
                                }
                              }}
                              className="w-4 h-4 text-yellow-400 bg-space-deep border-space-deep focus:ring-yellow-400 focus:ring-2 rounded"
                            />
                            <span className="text-cosmic-white">{metric.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crew Selection */}
            <div className="card-cosmic p-8">
              <h2 className="text-2xl font-bold text-cosmic-white mb-6 font-orbitron">
                Crew Selection
              </h2>
              <div className="space-y-3">
                {crewMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-space-deep/30 hover:bg-space-deep/50 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={config.crew.includes(member.id)}
                      onChange={(e) => {
                        if (member.id === 'all') {
                          setConfig(prev => ({
                            ...prev,
                            crew: e.target.checked ? ['all'] : []
                          }));
                        } else {
                          if (e.target.checked) {
                            setConfig(prev => ({
                              ...prev,
                              crew: prev.crew.includes('all') 
                                ? [member.id] 
                                : [...prev.crew.filter(c => c !== 'all'), member.id]
                            }));
                          } else {
                            setConfig(prev => ({
                              ...prev,
                              crew: prev.crew.filter(c => c !== member.id)
                            }));
                          }
                        }
                      }}
                      className="w-4 h-4 text-yellow-400 bg-space-deep border-space-deep focus:ring-yellow-400 focus:ring-2 rounded"
                    />
                    <span className="text-cosmic-white">{member.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generation Panel */}
          <div className="space-y-8">
            {/* Format Selection */}
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-bold text-cosmic-white mb-4 font-orbitron">
                Export Format
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'pdf', name: 'PDF Report', desc: 'Formatted document' },
                  { id: 'csv', name: 'CSV Data', desc: 'Spreadsheet format' },
                  { id: 'json', name: 'JSON Data', desc: 'Raw data format' }
                ].map((format) => (
                  <label
                    key={format.id}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-space-deep/30 hover:bg-space-deep/50 cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={config.format === format.id}
                      onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as 'json' | 'csv' | 'pdf' }))}
                      className="w-4 h-4 text-yellow-400 bg-space-deep border-space-deep focus:ring-yellow-400 focus:ring-2"
                    />
                    <div>
                      <div className="text-cosmic-white font-medium">{format.name}</div>
                      <div className="text-cosmic-white/60 text-sm">{format.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Report Preview */}
            <div className="card-cosmic p-6">
              <h3 className="text-xl font-bold text-cosmic-white mb-4 font-orbitron">
                Report Preview
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Type:</span>
                  <span className="text-cosmic-white">
                    {reportTypes.find(r => r.id === config.type)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Timeframe:</span>
                  <span className="text-cosmic-white">{config.timeframe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Metrics:</span>
                  <span className="text-cosmic-white">{config.metrics.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Crew:</span>
                  <span className="text-cosmic-white">
                    {config.crew.includes('all') ? 'All members' : `${config.crew.length} selected`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cosmic-white/70">Format:</span>
                  <span className="text-cosmic-white uppercase">{config.format}</span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="card-cosmic p-6">
              <button
                onClick={generateReport}
                disabled={isGenerating || config.metrics.length === 0 || config.crew.length === 0}
                className="w-full btn-cosmic flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cosmic-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Generate Report</span>
                  </>
                )}
              </button>
              
              {(config.metrics.length === 0 || config.crew.length === 0) && (
                <p className="text-sm text-red-400 mt-2 text-center">
                  Please select at least one metric and crew member
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
