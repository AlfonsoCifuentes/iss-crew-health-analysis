'use client';

import { useState, useEffect } from 'react';
import { Activity, Heart, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

interface MetricData {
  current: string;
  trend: string;
  change_24h: string;
}

interface RealTimeData {
  timestamp: string;
  crew_status: {
    total_crew: number;
    active_missions: number;
    health_alerts: number;
    overall_status: string;
  };
  health_metrics: {
    bone_density: MetricData;
    muscle_mass: MetricData;
    cardiovascular: MetricData;
    psychological: MetricData;
  };
  alerts: Array<{
    id: number;
    type: string;
    message: string;
    timestamp: string;
  }>;
  system_status: {
    data_quality: string;
    last_update: string;
    connection_status: string;
    processing_time: string;
  };
}

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="card-cosmic p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-space-deep rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-space-deep rounded"></div>
            <div className="h-4 bg-space-deep rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="card-cosmic p-6">
        <h3 className="text-xl font-bold text-cosmic-white mb-4">Real-Time Metrics</h3>
        <p className="text-cosmic-white/70">Failed to load metrics</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'nominal': return 'text-green-400';
      case 'caution': return 'text-yellow-400'; 
      case 'warning': return 'text-red-400';
      default: return 'text-cosmic-white';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Activity className="w-4 h-4 text-cosmic-white" />;
  };

  return (
    <div className="card-cosmic p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-cosmic-white">{t('dashboard.realtimeHealthMetrics')}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-cosmic-white/70">{t('dashboard.live')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-space-deep/50">
          <div className="text-2xl font-bold text-yellow-400">{metrics.crew_status.total_crew}</div>
          <div className="text-sm text-cosmic-white/70">{t('dashboard.totalCrew')}</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-space-deep/50">
          <div className="text-2xl font-bold text-blue-400">{metrics.crew_status.active_missions}</div>
          <div className="text-sm text-cosmic-white/70">{t('dashboard.activeMissions')}</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-space-deep/50">
          <div className="text-2xl font-bold text-red-400">{metrics.crew_status.health_alerts}</div>
          <div className="text-sm text-cosmic-white/70">{t('dashboard.healthAlerts')}</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-space-deep/50">
          <div className={`text-lg font-bold ${getStatusColor(metrics.crew_status.overall_status)} break-words leading-tight`}>
            {metrics.crew_status.overall_status === 'Nominal' ? t('dashboard.nominal') : metrics.crew_status.overall_status}
          </div>
          <div className="text-sm text-cosmic-white/70 mt-1">{t('dashboard.overallStatus')}</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-semibold text-cosmic-white flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-400" />
          <span>{t('dashboard.healthParameters')}</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(metrics.health_metrics).map(([key, metric]) => (
            <div key={key} className="p-4 rounded-lg bg-space-deep/30 border border-space-deep/50">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-cosmic-white capitalize">
                  {key === 'bone_density' ? t('dashboard.boneDensity') :
                   key === 'muscle_mass' ? t('dashboard.muscleMass') :
                   key === 'cardiovascular' ? t('dashboard.cardiovascularLower') :
                   key === 'psychological' ? t('dashboard.psychologicalLower') :
                   key.replace('_', ' ')}
                </h5>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-lg font-bold text-yellow-400">{metric.current}%</div>
                  <div className="text-xs text-cosmic-white/60">{metric.change_24h} (24h)</div>
                </div>
                <div className={`text-sm font-medium ${
                  metric.trend === 'improving' ? 'text-green-400' : 
                  metric.trend === 'declining' ? 'text-red-400' : 'text-cosmic-white'
                }`}>
                  {metric.trend === 'declining' ? t('dashboard.declining') : 
                   metric.trend === 'stable' ? t('dashboard.stable') : metric.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {metrics.alerts && metrics.alerts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-cosmic-white flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span>{t('dashboard.activeAlerts')}</span>
          </h4>
          <div className="space-y-2">
            {metrics.alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-cosmic-white text-sm">{alert.message}</p>
                    <p className="text-cosmic-white/60 text-xs mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-space-deep/50 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-cosmic-white/70">{t('dashboard.dataQuality')}: {metrics.system_status.data_quality}</span>
          <span className="text-cosmic-white/70">
            {t('dashboard.lastUpdate')}: {new Date(metrics.system_status.last_update).toLocaleTimeString()}
          </span>
          <span className="text-green-400">{metrics.system_status.connection_status === 'Connected' ? t('dashboard.connected') : metrics.system_status.connection_status}</span>
        </div>
      </div>
    </div>
  );
}
