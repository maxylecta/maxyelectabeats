import React, { createContext, useContext, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface AudioContextType {
  activePlayer: WaveSurfer | null;
  setActivePlayer: (player: WaveSurfer | null) => void;
}

const AudioContext = createContext<AudioContextType>({
  activePlayer: null,
  setActivePlayer: () => {},
});

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePlayer, setActivePlayer] = useState<WaveSurfer | null>(null);

  return (
    <AudioContext.Provider value={{ activePlayer, setActivePlayer }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);