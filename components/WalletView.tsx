import React, { useMemo } from 'react';
import { Card, Cycle } from '../types';
import { SEED_CARDS } from '../constants';
import CardContainer from './CardContainer';
import ValueDashboard from './ValueDashboard';
import { getPeriodLabel } from '../utils/dateUtils';
import { LayoutDashboard } from 'lucide-react';

interface WalletViewProps {
  myCardIds: string[];
  usage: Record<string, boolean>;
  filter: Cycle;
  onToggleBenefit: (benefitId: string, periodKey: string) => void;
  onNavigateToLibrary: () => void;
}

const WalletView: React.FC<WalletViewProps> = ({ 
  myCardIds, 
  usage, 
  filter, 
  onToggleBenefit,
  onNavigateToLibrary
}) => {
  
  const userCards = useMemo(() => {
    return SEED_CARDS.filter(c => myCardIds.includes(c.id));
  }, [myCardIds]);

  // If no cards, show empty state
  if (userCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <LayoutDashboard className="w-8 h-8 text-zinc-400" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Your wallet is empty</h2>
        <p className="text-zinc-500 max-w-sm mb-8">
          Add the credit cards you own to start tracking your recurring benefits.
        </p>
        <button 
          onClick={onNavigateToLibrary}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
        >
          Add Cards
        </button>
      </div>
    );
  }

  // Get all benefits for the current filter
  const visibleBenefits = useMemo(() => {
    return userCards.flatMap(card => 
      card.benefits.filter(b => b.cycle === filter)
    );
  }, [userCards, filter]);

  // Check if there are any benefits at all for this filter across all cards
  const hasBenefitsForFilter = visibleBenefits.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
            <h2 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Period Status
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-zinc-900">
                {getPeriodLabel(filter)}
            </p>
        </div>

      {/* Value Dashboard */}
      {hasBenefitsForFilter && (
        <ValueDashboard 
          cards={userCards}
          benefits={visibleBenefits}
          usage={usage}
          cycle={filter}
        />
      )}

      {!hasBenefitsForFilter ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-zinc-200 border-dashed p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-zinc-500">
                No benefits match the <strong>{filter}</strong> cycle for your selected cards.
            </p>
        </div>
      ) : (
        userCards.map(card => {
            // Filter benefits for this specific card and filter
            const cardBenefits = card.benefits.filter(b => b.cycle === filter);
            
            if (cardBenefits.length === 0) return null;
            
            return (
                <CardContainer 
                    key={card.id}
                    card={card}
                    benefits={cardBenefits}
                    usage={usage}
                    onToggleBenefit={onToggleBenefit}
                />
            );
        })
      )}
    </div>
  );
};

export default WalletView;