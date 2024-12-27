import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { DataPoint } from '../types';

interface DataInputProps {
  onDataSubmit: (data: DataPoint[]) => void;
}

export default function DataInput({ onDataSubmit }: DataInputProps) {
  const [points, setPoints] = useState<DataPoint[]>([
    { x: 0, y: 0, category: 'Hour' },
  ]);

  const addPoint = () => {
    setPoints([...points, { x: 0, y: 0, category: 'Hour' }]);
  };

  const updatePoint = (index: number, field: keyof DataPoint, value: string | number) => {
    const newPoints = [...points];
    newPoints[index] = {
      ...newPoints[index],
      [field]: field === 'category' ? value : parseFloat(value as string) || 0,
    };
    setPoints(newPoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDataSubmit(points);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        {points.map((point, index) => (
          <div key={index} className="flex gap-4">
            <input
              type="number"
              value={point.x}
              onChange={(e) => updatePoint(index, 'x', e.target.value)}
              placeholder="X value"
              className="w-24 px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              value={point.y}
              onChange={(e) => updatePoint(index, 'y', e.target.value)}
              placeholder="Y value"
              className="w-24 px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              value={point.category}
              onChange={(e) => updatePoint(index, 'category', e.target.value)}
              placeholder="Category"
              className="w-32 px-3 py-2 border rounded-md"
            />
          </div>
        ))}
      </div>
      
      <div className="flex gap-4">
        <button
          type="button"
          onClick={addPoint}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          <PlusCircle size={20} />
          Add Point
        </button>
        
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Generate Graph
        </button>
      </div>
    </form>
  );
}