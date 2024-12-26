import React, { useState } from 'react';
import { LineChart } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataChart from './components/DataChart';
import SeriesToggle from './components/SeriesToggle';
import { DataPoint } from './types/data';

function App() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [visibleSeries, setVisibleSeries] = useState({
    hours: true,
    stage: true,
    k: true,
    log: true,
    calvin: true,
  });

  const handleDataLoaded = (newData: DataPoint[]) => {
    setData(newData);
  };

  const handleSeriesToggle = (series: string) => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Data Visualization Tool
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <FileUpload onDataLoaded={handleDataLoaded} />
          
          {data.length > 0 && (
            <>
              <SeriesToggle
                series={visibleSeries}
                onToggle={handleSeriesToggle}
              />
              <DataChart
                data={data}
                visibleSeries={visibleSeries}
              />
            </>
          )}

          {data.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              Upload a CSV file to visualize your data
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;