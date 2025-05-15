import React, { createContext, useContext } from 'react';

interface AudioContextType {
  // Minimal context just for future extensibility
}

const AudioContext = createContext<AudioContextType>({});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AudioContext.Provider value={{}}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);