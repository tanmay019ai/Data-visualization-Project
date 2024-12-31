import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { DataPoint } from '../types';
import { celsiusToKelvin, calculateInverseKelvin } from '../utils/temperature';

interface DataInputProps {
  onDataSubmit: (data: DataPoint[]) => void;
}

export default function DataInput({ onDataSubmit }: DataInputProps) {
  const [points, setPoints] = useState<DataPoint[]>([
    { hours: 0, celsius: 0, category: 'Temperature' },
  ]);

  const addPoint = () => {
    setPoints([...points, { hours: 0, celsius: 0, category: 'Temperature' }]);
  };

  const removePoint = (index: number) => {
    if (points.length > 1) {
      const newPoints = points.filter((_, i) => i !== index);
      setPoints(newPoints);
    }
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
          <div key={index} className="flex gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Hours</label>
              <input
                type="number"
                value={point.hours}
                onChange={(e) => updatePoint(index, 'hours', e.target.value)}
                placeholder="Hours"
                className="w-24 px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600">Temperature (°C)</label>
              <input
                type="number"
                value={point.celsius}
                onChange={(e) => updatePoint(index, 'celsius', e.target.value)}
                placeholder="Celsius"
                className="w-24 px-3 py-2 border rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={() => removePoint(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              disabled={points.length === 1}
              title="Remove Point"
            >
              <Trash2 size={20} />
            </button>
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