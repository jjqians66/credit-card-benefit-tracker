import React, { useState } from 'react';
import { SEED_CARDS } from '../constants';
import { Check, Plus } from 'lucide-react';

interface LibraryViewProps {
  myCardIds: string[];
  onToggleCard: (cardId: string) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ myCardIds, onToggleCard }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">Card Library</h2>
        <p className="text-sm sm:text-base text-zinc-500">Select the cards you own to add them to your wallet.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {SEED_CARDS.map(card => {
          const isSelected = myCardIds.includes(card.id);
          
          return (
            <div 
              key={card.id}
              onClick={() => onToggleCard(card.id)}
              className={`relative p-4 sm:p-5 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-200 min-h-[120px] sm:min-h-0 ${
                isSelected 
                  ? 'bg-white border-indigo-600 ring-1 ring-indigo-600 shadow-md' 
                  : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                 {/* Card Image or Color Fallback */}
                 {card.image && !imageErrors[card.id] ? (
                   <img 
                     src={card.image} 
                     alt={card.name}
                     className="w-12 h-8 rounded object-cover shadow-sm border border-black/10"
                     onError={() => setImageErrors(prev => ({ ...prev, [card.id]: true }))}
                   />
                 ) : (
                   <div className={`w-12 h-8 rounded ${card.color} shadow-sm border border-black/10`} />
                 )}
                 <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-300'
                 }`}>
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                 </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900">{card.name}</h3>
                <p className="text-xs sm:text-sm text-zinc-500">{card.issuer}</p>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-100">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    {card.benefits.length} Benefits tracked
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryView;