import React, { useRef, useEffect } from 'react';
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
  ScatterController,
} from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { GraphData, GraphType } from '../types';
import { generateColors } from '../utils/colors';
import { calculateRegressionLine } from '../utils/regression';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ScatterController,
  Title,
  Tooltip,
  Legend
);

interface GraphProps {
  data: GraphData;
  type: GraphType;
  showTrendLine?: boolean;
  zoom: number;
}

export default function Graph({ data, type, showTrendLine = true, zoom }: GraphProps) {
  const chartRef = useRef<ChartJS>(null);
  const colors = generateColors(data.datasets.length);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const originalMin = Math.min(...data.labels);
      const originalMax = Math.max(...data.labels);
      const range = originalMax - originalMin;
      const center = (originalMax + originalMin) / 2;
      const newRange = range / zoom;
      
      chart.options.scales = {
        ...chart.options.scales,
        x: {
          ...chart.options.scales?.x,
          min: center - (newRange / 2),
          max: center + (newRange / 2)
        }
      };
      
      chart.update();
    }
  }, [zoom, data.labels]);

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const baseDataset = {
        ...dataset,
        borderColor: colors[index],
        backgroundColor: type === 'line' ? 'transparent' : colors[index],
      };

      if (showTrendLine && type === 'scatter') {
        const regressionData = calculateRegressionLine(
          data.labels,
          dataset.data
        );
        
        return [
          {
            ...baseDataset,
            type: 'scatter',
          },
          {
            ...baseDataset,
            type: 'line',
            data: regressionData.predictions,
            label: `${dataset.label} (Trend: y = ${regressionData.slope.toFixed(2)}x + ${regressionData.intercept.toFixed(2)})`,
            borderDash: [5, 5],
          },
        ];
      }

      return baseDataset;
    }).flat(),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Visualization',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '1/Temperature (K⁻¹)',
        }
      },
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Time (hours)',
        }
      }
    },
  };

  const ChartComponent = type === 'line' ? Line : type === 'bar' ? Bar : Scatter;

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
      <ChartComponent ref={chartRef} data={chartData} options={options} />
    </div>
  );
}