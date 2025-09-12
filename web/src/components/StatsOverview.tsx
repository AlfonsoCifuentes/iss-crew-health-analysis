'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/contexts/LocaleContext';

interface StatsOverviewProps {
  stats: {
    total_crew_members: number;
    avg_mission_duration: number;
    avg_age: number;
    outlier_percentage: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const { t } = useTranslation();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const formatDuration = (duration: number) => {
    const days = Math.round(duration * 365);
    return `${days} days`;
  };

  const formatAge = (age: number) => {
    const years = Math.round(age * 100);
    return `${years} years`;
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="card-cosmic p-6 text-center interactive-glow"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
        <div className="text-3xl font-bold text-cosmic-white mb-2">
          {stats.total_crew_members}
        </div>
        <div className="text-cosmic-white/70 text-sm">{t('dashboard.totalCrewMembers')}</div>
        <div className="text-xs text-blue-400 mt-2">{t('dashboard.activeInAnalysis')}</div>
      </motion.div>

      <motion.div
        className="card-cosmic p-6 text-center interactive-glow"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <div className="text-3xl font-bold text-cosmic-white mb-2">
          {formatDuration(stats.avg_mission_duration)}
        </div>
        <div className="text-cosmic-white/70 text-sm">{t('dashboard.averageMissionDuration')}</div>
        <div className="text-xs text-yellow-400 mt-2">{t('dashboard.normalizedData')}</div>
      </motion.div>

      <motion.div
        className="card-cosmic p-6 text-center interactive-glow"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
        <div className="text-3xl font-bold text-cosmic-white mb-2">
          {formatAge(stats.avg_age)}
        </div>
        <div className="text-cosmic-white/70 text-sm">{t('dashboard.averageCrewAge')}</div>
        <div className="text-xs text-blue-400 mt-2">{t('dashboard.atMissionStart')}</div>
      </motion.div>

      <motion.div
        className="card-cosmic p-6 text-center interactive-glow"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <div className="text-3xl font-bold text-cosmic-white mb-2">
          {Math.round(stats.outlier_percentage)}%
        </div>
        <div className="text-cosmic-white/70 text-sm">{t('dashboard.outlierDetection')}</div>
        <div className="text-xs text-yellow-400 mt-2">{t('dashboard.statisticalAnalysis')}</div>
      </motion.div>
    </motion.div>
  );
}
