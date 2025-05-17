import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Download, ShoppingCart, AlertCircle } from 'lucide-react';
import AudioWaveform from './AudioWaveform';

interface InstrumentalCardProps {
  title: string;
  genre: string;
  bpm: number;
  price: number;
  audioUrl: string;
  duration: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const InstrumentalCard: React.FC<InstrumentalCardProps> = ({
  title,
  genre,
  bpm,
  price,
  audioUrl,
  duration,
  isNew,
  isFeatured,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        if (!audioRef.current) {
          audioRef.current = new Audio();
          audioRef.current.preload = 'metadata';
          audioRef.current.volume = 1;
        }

        // Reset audio element
        const audio = audioRef.current;
        audio.src = audioUrl;
        
        // Wait for metadata to load
        await new Promise((resolve, reject) => {
          audio.addEventListener('loadedmetadata', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
        });

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing audio:', error);
        setLoadError('Failed to load audio');
        setIsLoading(false);
      }
    };

    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(formatTime(audio.currentTime));
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime('00:00');
      setProgress(0);
      audio.currentTime = 0;
    };

    const handleError = () => {
      console.error('Audio playback error');
      setLoadError('Playback error occurred');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current || loadError || isLoading) return;

    try {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Stop all other audio elements
        document.querySelectorAll('audio').forEach(audio => {
          if (audio !== audioRef.current) {
            audio.pause();
            audio.currentTime = 0;
          }
        });

        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setLoadError('Playback error occurred');
    }
  };

  const handleSeek = (percentage: number) => {
    if (!audioRef.current || isLoading) return;
    
    const newTime = (percentage / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(percentage);
    
    if (!isPlaying) {
      togglePlay();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={false}
        animate={isPlaying ? {
          boxShadow: [
            '0 0 0 rgba(0, 102, 255, 0)',
            '0 0 20px rgba(0, 102, 255, 0.2)',
            '0 0 30px rgba(0, 102, 255, 0.1)'
          ],
          scale: 1.01
        } : {
          boxShadow: '0 0 0 rgba(0, 102, 255, 0)',
          scale: 1
        }}
        transition={{ duration: 0.3 }}
        className="bg-dark-900/90 backdrop-blur-sm rounded-xl overflow-hidden border border-dark-800/50 relative"
      >
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.03) 0%, rgba(0, 102, 255, 0) 100%)',
              border: '1px solid rgba(0, 102, 255, 0.1)',
              boxShadow: 'inset 0 0 30px rgba(0, 102, 255, 0.05)'
            }}
          />
        )}
        
        <div className="p-6 relative">
          {/* Header with tags and price */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2">
              {isNew && (
                <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  New
                </span>
              )}
              {isFeatured && (
                <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>
            <span className="text-2xl font-bold text-primary-400">${price.toFixed(2)}</span>
          </div>

          {/* Title and Info */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full font-medium">
                {genre}
              </span>
              <span className="text-gray-400">{bpm} BPM</span>
              <span className="text-gray-400">{currentTime} / {duration}</span>
            </div>
          </div>

          {/* Waveform */}
          <div className="mb-4">
            <AudioWaveform 
              audioUrl={audioUrl}
              width={550}
              height={64}
              progress={progress}
              onSeek={handleSeek}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: loadError || isLoading ? 1 : 1.05 }}
              whileTap={{ scale: loadError || isLoading ? 1 : 0.95 }}
              onClick={togglePlay}
              disabled={!!loadError || isLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                loadError 
                  ? 'bg-red-500 cursor-not-allowed'
                  : isLoading
                  ? 'bg-gray-500 cursor-wait'
                  : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30'
              }`}
            >
              {loadError ? (
                <AlertCircle size={20} />
              ) : isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
            >
              <ShoppingCart size={20} />
              Buy Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-dark-800 hover:bg-dark-700 text-white p-3 rounded-xl transition-all duration-300"
            >
              <Download size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstrumentalCard;