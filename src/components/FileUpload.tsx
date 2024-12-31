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
    if (file.size > 5 * 1024 * 1024) {
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

      onDataUpload(data);
      setSuccess(`Loaded ${data.length} points`);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      setError('Error parsing file. Please ensure it follows the format: Hours, Celsius');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Upload size={24} className="text-gray-400 mb-2" />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          Upload CSV
        </button>
        
        <div className="mt-2 text-xs text-gray-500">
          <code className="block p-1 bg-gray-50 rounded">
            Hours,Celsius
          </code>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-1 p-2 text-sm text-red-700 bg-red-50 rounded-md">
          <AlertCircle size={16} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-1 p-2 text-sm text-green-700 bg-green-50 rounded-md">
          <FileCheck size={16} />
          <p>{success}</p>
        </div>
      )}
    </div>
  );
}