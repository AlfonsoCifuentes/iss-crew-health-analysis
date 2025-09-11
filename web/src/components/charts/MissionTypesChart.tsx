'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MissionTypesChartProps {
  data: {
    ISS_Expedition_standard: number;
    ISS_Expedition_short: number;
    ISS_Expedition_long: number;
  };
}

export default function MissionTypesChart({ data }: MissionTypesChartProps) {
  const chartData = {
    labels: ['Standard Expeditions', 'Short Duration', 'Long Duration'],
    datasets: [
      {
        data: [
          data.ISS_Expedition_standard,
          data.ISS_Expedition_short,
          data.ISS_Expedition_long,
        ],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',  // star-gold
          'rgba(34, 211, 238, 0.8)',  // nebula-cyan
          'rgba(139, 92, 246, 0.8)',  // nebula-purple
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(34, 211, 238, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
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
            return `${context.label}: ${context.parsed} missions (${percentage}%)`;
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
