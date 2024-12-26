export interface DataPoint {
  temperature: number;
  hours: number;
  stage: number;
  k: number;
  log: number;
  calvin: number;
}

export interface DataSeries {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  type?: 'line' | 'bar';
  yAxisID?: string;
}

export interface ChartData {
  labels: string[];
  datasets: DataSeries[];
}