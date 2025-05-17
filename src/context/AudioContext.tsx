import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
  autoPlayEnabled: boolean;
  setAutoPlayEnabled: (enabled: boolean) => void;
}

const AudioContext = createContext<AudioContextType>({
  currentlyPlaying: null,
  setCurrentlyPlaying: () => {},
  autoPlayEnabled: true,
  setAutoPlayEnabled: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);

  return (
    <AudioContext.Provider value={{
      currentlyPlaying,
      setCurrentlyPlaying,
      autoPlayEnabled,
      setAutoPlayEnabled,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);