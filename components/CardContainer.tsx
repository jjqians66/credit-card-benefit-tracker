import React, { useState } from 'react';
import { Card, Benefit, Cycle } from '../types';
import BenefitItem from './BenefitItem';
import { getPeriodKey } from '../utils/dateUtils';

interface CardContainerProps {
  card: Card;
  benefits: Benefit[];
  usage: Record<string, boolean>;
  onToggleBenefit: (benefitId: string, periodKey: string) => void;
}

const CardContainer: React.FC<CardContainerProps> = ({ card, benefits, usage, onToggleBenefit }) => {
  const [imageError, setImageError] = useState(false);
  
  if (benefits.length === 0) return null;

  // Calculate progress for this card in this view
  const total = benefits.length;
  const usedCount = benefits.filter(b => {
    const key = `${b.id}_${getPeriodKey(b.cycle)}`;
    return usage[key];
  }).length;
  const progress = Math.round((usedCount / total) * 100);

  return (
    <div className="mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Card Header */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2 sm:gap-3">
            {/* Card Image or Color Fallback */}
            {card.image && !imageError ? (
              <img 
                src={card.image} 
                alt={card.name}
                className="w-9 h-6 sm:w-10 sm:h-7 rounded object-cover shadow-sm border border-black/10"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-9 h-6 sm:w-10 sm:h-7 rounded ${card.color} shadow-sm border border-black/10`} />
            )}
            <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 leading-tight">{card.name}</h2>
                <span className="text-xs text-zinc-500">{card.issuer}</span>
            </div>
        </div>
        
        {/* Simple Progress Indicator */}
        <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-zinc-500 mb-1">{usedCount} / {total} Used</span>
            <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {benefits.map(benefit => {
            const periodKey = getPeriodKey(benefit.cycle);
            const usageKey = `${benefit.id}_${periodKey}`;
            return (
                <BenefitItem 
                    key={benefit.id} 
                    benefit={benefit} 
                    isUsed={!!usage[usageKey]} 
                    onToggle={onToggleBenefit} 
                />
            );
        })}
      </div>
    </div>
  );
};

export default CardContainer;