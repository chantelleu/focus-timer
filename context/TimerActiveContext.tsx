import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TimerActiveContextType {
  isTimerActive: boolean;
  setIsTimerActive: (isActive: boolean) => void;
  showRewardAnimation: boolean;
  setShowRewardAnimation: (show: boolean) => void;
}

const TimerActiveContext = createContext<TimerActiveContextType | undefined>(undefined);

export const TimerActiveProvider = ({ children }: { children: ReactNode }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);

  return (
    <TimerActiveContext.Provider value={{ isTimerActive, setIsTimerActive, showRewardAnimation, setShowRewardAnimation }}>
      {children}
    </TimerActiveContext.Provider>
  );
};

export const useTimerActive = () => {
  const context = useContext(TimerActiveContext);
  if (context === undefined) {
    throw new Error('useTimerActive must be used within a TimerActiveProvider');
  }
  return context;
};