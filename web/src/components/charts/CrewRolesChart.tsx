'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from '@/contexts/LocaleContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CrewRolesChartProps {
  data: {
    CDR?: number;
    PLT?: number;
    MS?: number;
    FE?: number;
  };
}

export default function CrewRolesChart({ data }: CrewRolesChartProps) {
  // Handle empty or undefined data
  const safeData = data || {};
  const { t } = useTranslation();
  
  const roleLabels = {
    CDR: 'Mission Commander',
    PLT: 'Pilot/Cosmonaut',
    MS: 'Mission Specialist',
    FE: 'Flight Engineer',
  };

  // Filter out zero values for cleaner chart
  const validRoles = Object.entries(roleLabels).filter(
    ([key]) => (safeData[key as keyof typeof safeData] || 0) > 0
  );

  if (validRoles.length === 0) {
    return (
      <div className="text-center text-cosmic-white/60">
        <p>{t('dashboard.noCrewRoleData')}</p>
      </div>
    );
  }

  const chartData = {
    labels: validRoles.map(([, label]) => label),
    datasets: [
      {
        data: validRoles.map(([key]) => safeData[key as keyof typeof safeData] || 0),
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',   // star-gold for Commander
          'rgba(34, 211, 238, 0.8)',   // nebula-cyan for Pilot
          'rgba(139, 92, 246, 0.8)',   // nebula-purple for MS
          'rgba(236, 72, 153, 0.8)',   // nebula-pink for FE
        ].slice(0, validRoles.length),
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(34, 211, 238, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ].slice(0, validRoles.length),
        borderWidth: 2,
        cutout: '50%', // Makes it a donut chart
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#F9FAFB',
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(11, 20, 38, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context: { label: string; parsed: number; dataset: { data: number[] } }) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((context.parsed / total) * 100);
            return `${context.label}: ${context.parsed} crew (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
