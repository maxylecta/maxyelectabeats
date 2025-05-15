import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { Play, Pause, Download, ShoppingCart, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  title: string;
  genre: string;
  bpm: number;
  price: number;
  audioUrl: string;
  duration: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const frequencyDataRef = useRef<Uint8Array | null>(null);

  const getDirectDownloadUrl = async (url: string): Promise<string | null> => {
    try {
      const fileId = url.match(/\/d\/(.+?)\/view/)?.[1];
      if (!fileId) {
        console.error('Invalid Google Drive URL format');
        return null;
      }
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    } catch (error) {
      console.error('Error accessing Google Drive file:', error);
      return null;
    }
  };

  useEffect(() => {
    setLoadError(null);
    
    if (soundRef.current) {
      soundRef.current.unload();
    }

    if (!audioUrl) {
      setLoadError('No audio URL provided');
      return;
    }

    const initializeAudio = async () => {
      try {
        const directUrl = audioUrl.includes('drive.google.com') 
          ? await getDirectDownloadUrl(audioUrl) 
          : audioUrl;

        if (!directUrl) {
          setLoadError('Unable to access audio file');
          return;
        }

        soundRef.current = new Howl({
          src: [directUrl],
          html5: true,
          format: ['mp3'],
          preload: true,
          onload: () => {
            setLoadError(null);
            // Only call setupAudioAnalyser when both references are available
            if (soundRef.current?.audioNode && canvasRef.current) {
              setupAudioAnalyser();
            }
          },
          onplay: () => {
            setIsPlaying(true);
            if (analyserRef.current && canvasRef.current) {
              draw();
            }
          },
          onpause: () => {
            setIsPlaying(false);
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
          },
          onstop: () => {
            setIsPlaying(false);
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
          },
          onloaderror: () => {
            setLoadError('Failed to load audio');
            setIsPlaying(false);
          },
          onplayerror: () => {
            if (soundRef.current) {
              soundRef.current.once('unlock', () => {
                soundRef.current?.play();
              });
            }
          }
        });
      } catch (error) {
        console.error('Error initializing audio:', error);
        setLoadError('Failed to initialize audio player');
      }
    };

    initializeAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
    };
  }, [audioUrl]);

  const setupAudioAnalyser = () => {
    if (!soundRef.current?.audioNode || !canvasRef.current) {
      console.error('Missing sound or canvas reference');
      return;
    }

    try {
      // Clean up existing audio context and nodes
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }

      // Create new audio context and nodes
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(soundRef.current.audioNode);

      // Configure analyser
      analyserRef.current.fftSize = 128;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Connect nodes
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      // Initialize frequency data array
      frequencyDataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

      // Set up canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions with high DPI support
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Draw test bars to verify canvas is working
      ctx.fillStyle = '#00f6ff';
      const barWidth = 4;
      const barSpacing = 2;
      const totalBars = 20;
      
      for (let i = 0; i < totalBars; i++) {
        const barHeight = 50;
        ctx.fillRect(
          i * (barWidth + barSpacing),
          canvas.height / dpr - barHeight,
          barWidth,
          barHeight
        );
      }
    } catch (error) {
      console.error('Error setting up audio analyser:', error);
    }
  };

  const draw = () => {
    if (!analyserRef.current || !canvasRef.current || !frequencyDataRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Clear canvas
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, width, height);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#00f6ff');
    gradient.addColorStop(1, '#0066ff');

    // Set up shadow for glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f6ff';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Get frequency data
    analyserRef.current.getByteFrequencyData(frequencyDataRef.current);

    // Calculate bar dimensions
    const barWidth = 4;
    const barSpacing = 2;
    const totalBars = Math.min(64, Math.floor(width / (barWidth + barSpacing)));
    const scaleFactor = 2.5;

    // Draw bars
    for (let i = 0; i < totalBars; i++) {
      const index = Math.floor(i * frequencyDataRef.current.length / totalBars);
      const value = frequencyDataRef.current[index];
      const barHeight = (value / 255) * height * scaleFactor;

      ctx.fillStyle = gradient;
      ctx.fillRect(
        i * (barWidth + barSpacing),
        height - barHeight,
        barWidth,
        barHeight
      );
    }

    animationFrameRef.current = requestAnimationFrame(draw);
  };

  const togglePlay = () => {
    if (!soundRef.current || loadError) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const genreColors: Record<string, string> = {
    'DRILL': 'bg-primary-500',
    'DRILL MIX TRAP': 'bg-secondary-500',
    'TRAP': 'bg-accent-500',
    'R&B': 'bg-purple-500',
  };

  return (
    <div className="bg-dark-800/90 backdrop-blur-sm rounded-lg p-2 hover:bg-dark-800 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: loadError ? 1 : 1.1 }}
          whileTap={{ scale: loadError ? 1 : 0.9 }}
          onClick={togglePlay}
          disabled={!!loadError}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors duration-300 flex-shrink-0 ${
            loadError 
              ? 'bg-red-500 cursor-not-allowed' 
              : 'bg-primary-500 hover:bg-primary-600'
          }`}
        >
          {loadError ? <AlertCircle size={14} /> : isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm text-white font-medium truncate">{title}</h3>
            {isNew && (
              <span className="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full flex-shrink-0">
                New
              </span>
            )}
            {isFeatured && (
              <span className="bg-accent-500 text-white text-xs px-1.5 py-0.5 rounded-full flex-shrink-0">
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`${genreColors[genre]} px-1.5 py-0.5 rounded-full text-white`}>
              {genre}
            </span>
            <span className="text-gray-400">{bpm} BPM</span>
            <span className="text-gray-400">{duration}</span>
            {loadError && (
              <span className="text-red-400 truncate" title={loadError}>
                {loadError}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-base font-bold text-primary-400">${price.toFixed(2)}</div>

          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-lg transition-colors duration-300"
            >
              <ShoppingCart size={14} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-dark-700 hover:bg-dark-600 text-white p-1.5 rounded-lg transition-colors duration-300"
            >
              <Download size={14} />
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 overflow-hidden"
          >
            <canvas 
              ref={canvasRef}
              className="w-full h-12 rounded-lg"
              style={{ 
                imageRendering: 'pixelated',
                background: '#111111'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioPlayer;