import Papa from 'papaparse';
import { DataPoint } from '../types';

export const parseCSV = (file: File): Promise<DataPoint[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true, // Automatically convert numbers
      skipEmptyLines: true,
      transform: (value) => value.trim(),
      complete: (results) => {
        try {
          const data = results.data
            .filter((row: any) => row.X != null && row.Y != null && row.Category)
            .map((row: any) => ({
              x: Number(row.X),
              y: Number(row.Y),
              category: String(row.Category),
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
  const categories = [...new Set(data.map(point => point.category))];
  const xValues = [...new Set(data.map(point => point.x))].sort((a, b) => a - b);
  
  const datasets = categories.map(category => {
    const categoryData = data
      .filter(point => point.category === category)
      .sort((a, b) => a.x - b.x)
      .map(point => point.y);

    return {
      label: category,
      data: categoryData,
    };
  });

  return {
    labels: xValues,
    datasets,
  };
};