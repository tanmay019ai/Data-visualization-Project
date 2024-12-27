export const generateColors = (count: number): string[] => {
  const colors = [
    '#2563eb', // blue-600
    '#dc2626', // red-600
    '#16a34a', // green-600
    '#9333ea', // purple-600
    '#ea580c', // orange-600
    '#0891b2', // cyan-600
    '#4f46e5', // indigo-600
    '#c026d3', // fuchsia-600
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};