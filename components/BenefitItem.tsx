import React from 'react';
import { Benefit, Cycle } from '../types';
import { getPeriodKey } from '../utils/dateUtils';
import { Check, Info } from 'lucide-react';

interface BenefitItemProps {
  benefit: Benefit;
  isUsed: boolean;
  onToggle: (benefitId: string, periodKey: string) => void;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ benefit, isUsed, onToggle }) => {
  const periodKey = getPeriodKey(benefit.cycle);
  
  const handleToggle = () => {
    onToggle(benefit.id, periodKey);
  };

  return (
    <div 
        onClick={handleToggle}
        className={`group flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-all cursor-pointer select-none min-h-[60px] sm:min-h-0 ${
            isUsed 
                ? 'bg-emerald-50/50 border-emerald-100' 
                : 'bg-white border-zinc-100 hover:border-indigo-200 hover:shadow-sm'
        }`}
    >
      <div className="flex-1 pr-3 sm:pr-4">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isUsed ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
          }`}>
             {benefit.amount ? `$${benefit.amount}` : 'Benefit'}
          </span>
          <h3 className={`text-sm sm:text-base font-medium ${isUsed ? 'text-emerald-900 line-through opacity-60' : 'text-zinc-900'}`}>
            {benefit.title}
          </h3>
        </div>
        <p className={`text-xs sm:text-sm ${isUsed ? 'text-emerald-700/60' : 'text-zinc-500'}`}>
          {benefit.description}
        </p>
      </div>

      <div className="flex-shrink-0">
        <div className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
            isUsed 
                ? 'bg-emerald-500 text-white shadow-sm scale-110' 
                : 'bg-zinc-100 text-zinc-300 group-hover:bg-indigo-50 group-hover:text-indigo-400'
        }`}>
            <Check className="w-5 h-5 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};

export default BenefitItem;