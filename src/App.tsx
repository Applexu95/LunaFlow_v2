/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import OnboardingFlow from './components/OnboardingFlow';
import PeriodDashboard from './components/PeriodDashboard';
import { UserProfile, CycleEntry, AppState } from './types';

const STORAGE_KEY = 'flowcycle_app_state';

const initialState: AppState = {
  profile: null,
  entries: []
};

export default function App() {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const handleAddEntry = (date: Date) => {
    const newEntry: CycleEntry = {
      startDate: date.toISOString()
    };
    
    setState(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry].sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
    }));
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all your data? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setState(initialState);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {!state.profile ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <PeriodDashboard 
          profile={state.profile} 
          entries={state.entries} 
          onAddEntry={handleAddEntry}
          onReset={handleReset}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}

