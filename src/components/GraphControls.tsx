import React from 'react';
import { Download, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { GraphType } from '../types';

interface GraphControlsProps {
  onExport: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onTypeChange: (type: GraphType) => void;
  currentType: GraphType;
}

export default function GraphControls({
  onExport,
  onZoomIn,
  onZoomOut,
  onReset,
  onTypeChange,
  currentType,
}: GraphControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex gap-2">
        <select
          value={currentType}
          onChange={(e) => onTypeChange(e.target.value as GraphType)}
          className="px-3 py-2 border rounded-md bg-white text-gray-700"
        >
          <option value="line">Line Graph</option>
          <option value="bar">Bar Graph</option>
          <option value="scatter">Scatter Plot</option>
        </select>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onZoomIn}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={onReset}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          title="Reset Zoom"
        >
          <RefreshCw size={20} />
        </button>
        <button
          onClick={onExport}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
          title="Export Graph"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}