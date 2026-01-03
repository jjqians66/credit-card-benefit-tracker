import React from 'react';
import { CreditCard, Wallet, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentView: 'wallet' | 'library';
  setView: (view: 'wallet' | 'library') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 safe-top">
      <div className="max-w-3xl mx-auto px-4 safe-left safe-right h-14 sm:h-16 flex items-center justify-between">
        <div 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            onClick={() => setView('wallet')}
        >
          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          <h1 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">BenefitTracker</h1>
        </div>

        <nav className="flex gap-1.5 sm:gap-2">
           <button
            onClick={() => setView('wallet')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2 min-h-[44px] sm:min-h-0 ${
              currentView === 'wallet' 
                ? 'bg-zinc-100 text-zinc-900' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Wallet</span>
          </button>
          <button
            onClick={() => setView('library')}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2 min-h-[44px] sm:min-h-0 ${
              currentView === 'library' 
                ? 'bg-zinc-100 text-zinc-900' 
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Add Cards</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;