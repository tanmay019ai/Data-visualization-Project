export interface RegressionResult {
  slope: number;
  intercept: number;
  predictions: number[];
}

export function calculateRegressionLine(
  x: number[],
  y: number[]
): RegressionResult {
  const n = x.length;
  
  // Calculate means
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  
  // Calculate slope (m) and intercept (b)
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (y[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }
  
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  
  // Generate predictions for the regression line
  const predictions = x.map(xVal => slope * xVal + intercept);
  
  return {
    slope,
    intercept,
    predictions,
  };
}