import Papa from 'papaparse';
import { DataPoint } from '../types';
import { celsiusToKelvin, calculateInverseKelvin } from './temperature';

export const parseCSV = (file: File): Promise<DataPoint[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transform: (value) => value.trim(),
      complete: (results) => {
        try {
          const data = results.data
            .filter((row: any) => row.Hours != null && row.Celsius != null)
            .map((row: any) => ({
              hours: Number(row.Hours),
              celsius: Number(row.Celsius),
              category: 'Temperature',
            }));
          resolve(data);
        } catch (error) {
          reject(new Error('Failed to process CSV data'));
        }
      },
      error: (error) => reject(error),
    });
  });
};

export const processData = (data: DataPoint[]) => {
  const xValues = [...new Set(data.map(point => point.hours))].sort((a, b) => a - b);
  
  const datasets = [{
    label: '1/Temperature (K⁻¹)',
    data: data
      .sort((a, b) => a.hours - b.hours)
      .map(point => calculateInverseKelvin(celsiusToKelvin(point.celsius))),
  }];

  return {
    labels: xValues,
    datasets,
  };
};