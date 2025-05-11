import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import WaveSurfer from 'wavesurfer.js';
import { useAudio } from '../context/AudioContext';

interface AudioPlayerProps {
  audioSrc: string;
  title: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const { activePlayer, setActivePlayer } = useAudio();
  const unmountingRef = useRef(false);

  useEffect(() => {
    const abortController = new AbortController();

    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#1d6fa5',
        progressColor: '#3498db',
        cursorColor: '#3498db',
        barWidth: 2,
        barGap: 3,
        barRadius: 3,
        height: 60,
        responsive: true,
        normalize: true,
        partialRender: true,
        pixelRatio: 1,
      });

      wavesurferRef.current.load(audioSrc, undefined, abortController.signal);

      wavesurferRef.current.on('ready', () => {
        if (!wavesurferRef.current || abortController.signal.aborted) return;
        setDuration(wavesurferRef.current.getDuration() || 0);
      });

      wavesurferRef.current.on('audioprocess', () => {
        if (!wavesurferRef.current || abortController.signal.aborted) return;
        setCurrentTime(wavesurferRef.current.getCurrentTime() || 0);
      });

      wavesurferRef.current.on('finish', () => {
        if (!wavesurferRef.current || abortController.signal.aborted) return;
        setIsPlaying(false);
        setActivePlayer(null);
      });

      wavesurferRef.current.on('play', () => {
        if (!wavesurferRef.current || abortController.signal.aborted) return;
        setIsPlaying(true);
      });

      wavesurferRef.current.on('pause', () => {
        if (!wavesurferRef.current || abortController.signal.aborted) return;
        setIsPlaying(false);
      });

      return () => {
        unmountingRef.current = true;
        if (!abortController.signal.aborted) {
          abortController.abort('Component unmounting');
        }
        if (wavesurferRef.current && wavesurferRef.current.destroy) {
          try {
            wavesurferRef.current.destroy();
            wavesurferRef.current = null;
          } catch (error) {
            console.warn('Error cleaning up WaveSurfer:', error);
          }
        }
      };
    }
  }, [audioSrc, setActivePlayer]);

  useEffect(() => {
    // If another player becomes active, pause this one
    if (activePlayer && activePlayer !== wavesurferRef.current && isPlaying) {
      setIsPlaying(false);
      wavesurferRef.current?.pause();
    }
  }, [activePlayer, isPlaying]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
        setActivePlayer(null);
      } else {
        // Pause the currently active player if it exists
        if (activePlayer && activePlayer !== wavesurferRef.current) {
          activePlayer.pause();
        }
        wavesurferRef.current.play();
        setActivePlayer(wavesurferRef.current);
      }
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-dark-800/90 backdrop-blur-sm rounded-xl p-4 my-2 w-full">
      <div className="flex items-center gap-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-[#3498db] hover:bg-[#1d6fa5] flex items-center justify-center text-white transition-colors duration-300 shadow-lg shadow-[#3498db]/20"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>
        <div>
          <div className="text-sm font-medium text-gray-200 truncate max-w-[200px]">
            {title}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      <div 
        ref={waveformRef} 
        className="w-full rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default AudioPlayer;