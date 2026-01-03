import React from 'react';
import { Cycle } from '../types';

interface FilterBarProps {
  selectedCycle: Cycle;
  onSelect: (cycle: Cycle) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedCycle, onSelect }) => {
  const filters = [
    { label: 'This Month', value: Cycle.MONTHLY },
    { label: 'This Quarter', value: Cycle.QUARTERLY },
    { label: 'This Half', value: Cycle.SEMI_ANNUAL },
    { label: 'This Year', value: Cycle.ANNUAL },
  ];

  return (
    <div className="sticky top-14 sm:top-16 z-40 bg-zinc-50/95 py-3 sm:py-4 px-4 border-b border-zinc-200/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto">
        <div className="flex p-0.5 sm:p-1 bg-zinc-200 rounded-lg overflow-x-auto no-scrollbar sm:overflow-visible">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onSelect(filter.value)}
              className={`flex-1 min-w-[90px] text-xs sm:text-sm font-medium py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-md transition-all whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                selectedCycle === filter.value
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;