import React, { useState } from 'react';
import { LineChart } from 'lucide-react';
import DataInput from './components/DataInput';
import FileUpload from './components/FileUpload';
import Graph from './components/Graph';
import GraphControls from './components/GraphControls';
import Footer from './components/Footer';
import { DataPoint, GraphData, GraphType } from './types';
import { processData } from './utils/data';

function App() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphType, setGraphType] = useState<GraphType>('line');
  const [zoom, setZoom] = useState(1);

  const handleData = (data: DataPoint[]) => {
    const processed = processData(data);
    setGraphData(processed);
  };

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'graph.jpg';
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LineChart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Data Visualization</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="grid grid-cols-12 gap-8">
          {/* Left column - Input sections */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Manual Data Input</h2>
              <DataInput onDataSubmit={handleData} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-2">File Upload</h2>
              <FileUpload onDataUpload={handleData} />
            </div>
          </div>

          {/* Right column - Graph section */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            {graphData && (
              <>
                <GraphControls
                  onExport={handleExport}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onReset={handleReset}
                  onTypeChange={setGraphType}
                  currentType={graphType}
                />
                <div className="h-[600px]">
                  <Graph 
                    data={graphData} 
                    type={graphType}
                    showTrendLine={true}
                    zoom={zoom}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;