import React from 'react';

interface SeriesToggleProps {
  series: Record<string, boolean>;
  onToggle: (series: string) => void;
}

export default function SeriesToggle({ series, onToggle }: SeriesToggleProps) {
  const colors: Record<string, string> = {
    hours: 'bg-red-500',
    stage: 'bg-sky-300',
    k: 'bg-blue-500',
    log: 'bg-green-500',
    calvin: 'bg-amber-500',
  };

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {Object.entries(series).map(([name, isVisible]) => (
        <button
          key={name}
          onClick={() => onToggle(name)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${isVisible ? colors[name] + ' text-white' : 'bg-gray-200 text-gray-700'}
            hover:opacity-90`}
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </button>
      ))}
    </div>
  );
}