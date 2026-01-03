import React from 'react';
import { Card, Cycle, Benefit } from '../types';
import { getPeriodKey, getDaysRemaining } from '../utils/dateUtils';
import { DollarSign } from 'lucide-react';

interface ValueDashboardProps {
  cards: Card[];
  benefits: Benefit[];
  usage: Record<string, boolean>;
  cycle: Cycle;
}

const ValueDashboard: React.FC<ValueDashboardProps> = ({ cards, benefits, usage, cycle }) => {
  // Calculate total available value and used value
  const { totalValue, usedValue } = React.useMemo(() => {
    let total = 0;
    let used = 0;
    
    // Use the cycle parameter since all benefits are already filtered to match it
    const periodKey = getPeriodKey(cycle);
    
    benefits.forEach(benefit => {
      const amount = benefit.amount || 0;
      total += amount;
      
      const usageKey = `${benefit.id}_${periodKey}`;
      if (usage[usageKey]) {
        used += amount;
      }
    });
    
    return { totalValue: total, usedValue: used };
  }, [benefits, usage, cycle]);

  const daysRemaining = getDaysRemaining(cycle);
  const remainingValue = totalValue - usedValue;
  const usagePercentage = totalValue > 0 ? Math.round((usedValue / totalValue) * 100) : 0;

  // Determine urgency background based on days remaining
  const getUrgencyBg = () => {
    if (daysRemaining <= 7) return 'bg-red-500/10 border-red-500/20';
    if (daysRemaining <= 14) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  const benefitCount = benefits.length;
  const usedBenefitCount = benefits.filter(benefit => {
    const periodKey = getPeriodKey(cycle);
    const usageKey = `${benefit.id}_${periodKey}`;
    return usage[usageKey];
  }).length;

  return (
    <div className={`mb-4 sm:mb-6 rounded-lg sm:rounded-xl border p-4 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white shadow-lg ${getUrgencyBg()}`}>
      {/* Period Value Label */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Period Value
          </h3>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
          <div className="text-2xl sm:text-3xl font-bold">
            ${usedValue.toLocaleString()}
          </div>
          <div className="text-lg sm:text-xl text-zinc-400">
            / ${totalValue.toLocaleString()}
          </div>
        </div>
        {remainingValue > 0 && (
          <p className="text-xs sm:text-sm text-zinc-400">
            ${remainingValue.toLocaleString()} remaining
          </p>
        )}
      </div>

      {/* Benefits Used and Progress Bar */}
      <div className="flex items-center gap-3">
        <p className="text-xs sm:text-sm text-zinc-400 whitespace-nowrap">
          {usedBenefitCount} of {benefitCount} benefits used
        </p>
        <div className="flex-1 h-1.5 sm:h-2 bg-zinc-700/50 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              usagePercentage >= 100 ? 'bg-emerald-500' : 
              usagePercentage >= 75 ? 'bg-yellow-500' : 
              'bg-indigo-500'
            }`}
            style={{ width: `${Math.min(100, usagePercentage)}%` }}
          />
        </div>
        <span className="text-xs sm:text-sm text-zinc-400 font-medium whitespace-nowrap">
          {usagePercentage}%
        </span>
      </div>
    </div>
  );
};

export default ValueDashboard;

