import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import WalletView from './components/WalletView';
import LibraryView from './components/LibraryView';
import { Cycle, UserData } from './types';
import { loadUserData, saveUserData } from './services/storageService';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'wallet' | 'library'>('wallet');
  
  // Data State
  const [userData, setUserData] = useState<UserData>({ myCardIds: [], usage: {} });
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filter, setFilter] = useState<Cycle>(Cycle.MONTHLY);

  // Load Data on Mount
  useEffect(() => {
    const data = loadUserData();
    setUserData(data);
    setLoading(false);
    
    // Default to library if new user
    if (data.myCardIds.length === 0) {
      setCurrentView('library');
    }
  }, []);

  // Persistence Effect
  useEffect(() => {
    if (!loading) {
      saveUserData(userData);
    }
  }, [userData, loading]);

  // Handlers
  const toggleCard = (cardId: string) => {
    setUserData(prev => {
      const exists = prev.myCardIds.includes(cardId);
      const newIds = exists 
        ? prev.myCardIds.filter(id => id !== cardId)
        : [...prev.myCardIds, cardId];
      return { ...prev, myCardIds: newIds };
    });
  };

  const toggleBenefit = (benefitId: string, periodKey: string) => {
    setUserData(prev => {
      const key = `${benefitId}_${periodKey}`;
      const currentVal = !!prev.usage[key];
      return {
        ...prev,
        usage: {
          ...prev.usage,
          [key]: !currentVal
        }
      };
    });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      <Header currentView={currentView} setView={setCurrentView} />

      {currentView === 'wallet' && (
        <>
          <FilterBar selectedCycle={filter} onSelect={setFilter} />
          <WalletView 
            myCardIds={userData.myCardIds} 
            usage={userData.usage} 
            filter={filter}
            onToggleBenefit={toggleBenefit}
            onNavigateToLibrary={() => setCurrentView('library')}
          />
        </>
      )}

      {currentView === 'library' && (
        <LibraryView 
          myCardIds={userData.myCardIds} 
          onToggleCard={toggleCard} 
        />
      )}
    </div>
  );
};

export default App;