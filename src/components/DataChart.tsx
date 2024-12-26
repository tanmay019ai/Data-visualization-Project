import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { DataPoint, ChartData } from '../types/data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DataChartProps {
  data: DataPoint[];
  visibleSeries: Record<string, boolean>;
}

export default function DataChart({ data, visibleSeries }: DataChartProps) {
  const chartData: ChartData = {
    labels: data.map(d => `${d.temperature}°C`),
    datasets: [
      {
        label: 'Hours',
        data: data.map(d => d.hours),
        borderColor: '#ef4444',
        type: 'line',
        yAxisID: 'hours',
        hidden: !visibleSeries.hours,
      },
      {
        label: 'Stage',
        data: data.map(d => d.stage),
        backgroundColor: '#7dd3fc',
        type: 'bar',
        yAxisID: 'stage',
        hidden: !visibleSeries.stage,
      },
      {
        label: '1/K',
        data: data.map(d => d.k),
        borderColor: '#3b82f6',
        type: 'line',
        hidden: !visibleSeries.k,
      },
      {
        label: 'Log',
        data: data.map(d => d.log),
        borderColor: '#22c55e',
        type: 'line',
        hidden: !visibleSeries.log,
      },
      {
        label: 'Calvin',
        data: data.map(d => d.calvin),
        borderColor: '#f59e0b',
        type: 'line',
        hidden: !visibleSeries.calvin,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      hours: {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Hours',
        },
      },
      stage: {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Stage',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-lg">
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}