import React, { useRef, useState } from 'react';
import { Upload, AlertCircle, FileCheck } from 'lucide-react';
import { parseCSV } from '../utils/data';
import { DataPoint } from '../types';

interface FileUploadProps {
  onDataUpload: (data: DataPoint[]) => void;
}

export default function FileUpload({ onDataUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateCSV = (file: File): boolean => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid CSV file');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size should be less than 5MB');
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    setSuccess(null);

    if (!file) return;

    if (!validateCSV(file)) return;

    try {
      const data = await parseCSV(file);
      
      if (data.length === 0) {
        setError('The CSV file appears to be empty');
        return;
      }

      if (!data.every(point => 
        typeof point.x === 'number' && 
        typeof point.y === 'number' && 
        typeof point.category === 'string'
      )) {
        setError('Invalid data format. CSV must have X, Y, and Category columns with proper values');
        return;
      }

      onDataUpload(data);
      setSuccess(`Successfully loaded ${data.length} data points`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      setError('Error parsing file. Please ensure it follows the correct format: X, Y, Category');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Upload size={48} className="text-gray-400 mb-4" />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Upload CSV File
        </button>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Upload a CSV file with columns:</p>
          <code className="block mt-1 p-2 bg-gray-50 rounded">
            X,Y,Category
            <br />
            120,5000,Hour
            <br />
            140,4500,Hour
          </code>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 rounded-md">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 text-green-700 bg-green-50 rounded-md">
          <FileCheck size={20} />
          <p>{success}</p>
        </div>
      )}
    </div>
  );
}