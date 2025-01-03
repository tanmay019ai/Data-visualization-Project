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
import { Download } from 'lucide-react';
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
  const [activeTab, setActiveTab] = React.useState<'chart' | 'table'>('chart');

  const downloadCSV = () => {
    const headers = ['Hours', '1/Temperature (K⁻¹)'];
    const rows = data.labels.map((hour, index) => [
      hour,
      data.datasets[0].data[index]
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'temperature_data.csv';
    link.click();
  };

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
          title: (tooltipItems: any[]) => {
            return `${tooltipItems[0].parsed.x} hours`;
          }
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
      <div className="mb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex">
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'chart'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('chart')}
            >
              Graph
            </button>
            <button
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'table'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('table')}
            >
              Data Table
            </button>
          </div>
          {activeTab === 'table' && (
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Download CSV"
            >
              <Download size={18} />
              <span>Download CSV</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'chart' ? (
        <div className="h-[calc(100%-3rem)]">
          <ChartComponent ref={chartRef} data={chartData} options={options} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time (hours)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  1/Temperature (K⁻¹)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.labels.map((hour, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hour}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.datasets[0].data[index].toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}