import React from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { DataPoint } from '../types/data';

interface FileUploadProps {
  onDataLoaded: (data: DataPoint[]) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data.slice(1).map((row: any) => ({
          temperature: parseFloat(row[0]),
          hours: parseFloat(row[1]),
          stage: parseFloat(row[2]),
          k: parseFloat(row[3]),
          log: parseFloat(row[4]),
          calvin: parseFloat(row[5]),
        }));
        onDataLoaded(parsedData);
      },
      header: true,
    });
  };

  return (
    <div className="w-full max-w-md">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <Upload className="w-8 h-8 text-blue-500 mb-2" />
        <span className="text-sm font-medium text-gray-600">Upload CSV File</span>
        <input
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}