'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HealthMetricsChartProps {
  data: {
    bone_density_change_avg: number;
    muscle_mass_change_avg: number;
  };
}

export default function HealthMetricsChart({ data }: HealthMetricsChartProps) {
  const chartData = {
    labels: ['Bone Density', 'Muscle Mass'],
    datasets: [
      {
        label: 'Health Impact (%)',
        data: [
          Math.round(data.bone_density_change_avg * 100 * 10) / 10,
          Math.round(data.muscle_mass_change_avg * 100 * 10) / 10,
        ],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)', // nebula-purple
          'rgba(34, 211, 238, 0.8)',  // nebula-cyan
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(34, 211, 238, 1)',
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
        position: 'top' as const,
        labels: {
          color: '#F9FAFB',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Average Health Impact in Microgravity',
        color: '#F9FAFB',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(11, 20, 38, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
        },
        ticks: {
          color: '#F9FAFB',
          callback: function(value: string | number) {
            return value + '%';
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
        },
        ticks: {
          color: '#F9FAFB',
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
