export interface DataPoint {
  hours: number;
  celsius: number;
  category: string;
}

export interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  type?: string;
  borderDash?: number[];
}

export interface GraphData {
  labels: number[];
  datasets: Dataset[];
}

export type GraphType = 'line' | 'bar' | 'scatter';