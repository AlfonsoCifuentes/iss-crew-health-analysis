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

interface CrewRolesChartProps {
  data: {
    CDR: number;
    FE1: number;
    FE2: number;
    FE3: number;
  };
}

export default function CrewRolesChart({ data }: CrewRolesChartProps) {
  const roleLabels = {
    CDR: 'Mission Commander',
    FE1: 'Flight Engineer 1',
    FE2: 'Flight Engineer 2',
    FE3: 'Flight Engineer 3',
  };

  const chartData = {
    labels: Object.entries(roleLabels).map(([, label]) => label),
    datasets: [
      {
        data: [data.CDR, data.FE1, data.FE2, data.FE3],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',   // star-gold for Commander
          'rgba(34, 211, 238, 0.8)',   // nebula-cyan for FE1
          'rgba(139, 92, 246, 0.8)',   // nebula-purple for FE2
          'rgba(236, 72, 153, 0.8)',   // nebula-pink for FE3
        ],
        borderColor: [
          'rgba(251, 191, 36, 1)',
          'rgba(34, 211, 238, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
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
