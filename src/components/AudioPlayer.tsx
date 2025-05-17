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
  const [progress, setProgress] = useState(0);
  const soundRef = useRef<Howl | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const progressIntervalRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number; }>>([]);

  const startProgressUpdate = () => {
    if (!soundRef.current) return;
    progressIntervalRef.current = window.setInterval(() => {
      const seek = soundRef.current?.seek() || 0;
      const duration = soundRef.current?.duration() || 0;
      setProgress((seek / duration) * 100);
    }, 100);
  };

  const stopProgressUpdate = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  useEffect(() => {
    setLoadError(null);
    
    if (soundRef.current) {
      soundRef.current.unload();
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      soundRef.current = new Howl({
        src: [audioUrl],
        html5: true,
        format: ['mp3'],
        preload: true,
        onload: () => {
          setLoadError(null);
          
          if (audioContextRef.current && analyserRef.current) {
            const audio = (soundRef.current as any)._sounds[0]._node;
            if (!sourceNodeRef.current) {
              sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audio);
              sourceNodeRef.current.connect(analyserRef.current);
              analyserRef.current.connect(audioContextRef.current.destination);
            }
          }
        },
        onplay: () => {
          setIsPlaying(true);
          startProgressUpdate();
          if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
          }
        },
        onpause: () => {
          setIsPlaying(false);
          stopProgressUpdate();
        },
        onstop: () => {
          setIsPlaying(false);
          stopProgressUpdate();
        },
        onend: () => {
          setIsPlaying(false);
          setProgress(0);
          stopProgressUpdate();
        },
        onloaderror: () => {
          setLoadError('Failed to load audio');
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
      setLoadError('Failed to initialize audio');
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      stopProgressUpdate();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Initialize electric particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: Math.random(),
          size: Math.random() * 3 + 1
        });
      }
    }

    const drawLightning = (startX: number, startY: number, endX: number, endY: number, displace: number, detail: number = 0) => {
      if (displace < detail) {
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        return;
      }
      
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const offsetX = (Math.random() - 0.5) * displace * 2;
      const offsetY = (Math.random() - 0.5) * displace;
      
      drawLightning(startX, startY, midX + offsetX, midY + offsetY, displace / 2, detail);
      drawLightning(midX + offsetX, midY + offsetY, endX, endY, displace / 2, detail);
    };

    const drawEnergyRing = (x: number, y: number, radius: number, intensity: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(0, 246, 255, ${intensity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(0, 162, 255, ${intensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, rect.width, rect.height);
      const time = Date.now() / 1000;

      if (isPlaying && analyserRef.current) {
        // Spectrum visualization
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (rect.width / bufferLength) * 2.5;
        const barSpacing = 2;
        let x = 0;

        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0, 162, 255, 0.7)';

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * (rect.height * 0.8);
          
          const gradient = ctx.createLinearGradient(0, rect.height - barHeight, 0, rect.height);
          gradient.addColorStop(0, 'rgba(0, 246, 255, 0.95)');
          gradient.addColorStop(0.5, 'rgba(0, 162, 255, 0.8)');
          gradient.addColorStop(1, 'rgba(0, 102, 255, 0.6)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, rect.height - barHeight, barWidth - barSpacing, barHeight, 3);
          ctx.fill();
          
          x += barWidth;
        }
      } else {
        // Electric ambient animation
        ctx.globalCompositeOperation = 'source-over';
        
        // Draw energy core
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const pulseIntensity = (Math.sin(time * 2) + 1) / 2;
        
        drawEnergyRing(centerX, centerY, 60 + pulseIntensity * 20, 0.8);
        
        // Draw electric particles
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 162, 255, 0.5)';
        
        particlesRef.current.forEach((particle, i) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life = Math.sin(time * 2 + i) * 0.5 + 0.5;
          
          if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;
          
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, `rgba(0, 246, 255, ${particle.life * 0.8})`);
          gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw lightning bolts
        if (Math.random() < 0.05) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 246, 255, 0.8)';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 30;
          ctx.shadowColor = 'rgba(0, 162, 255, 0.8)';
          
          const startX = Math.random() * rect.width;
          const startY = 0;
          const endX = Math.random() * rect.width;
          const endY = rect.height;
          
          drawLightning(startX, startY, endX, endY, 50, 5);
          ctx.stroke();
        }

        // Draw energy waves
        const numWaves = 3;
        for (let i = 0; i < numWaves; i++) {
          const radius = (100 + i * 50) * (1 + Math.sin(time * 2 + i) * 0.2);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 162, 255, ${0.2 - (i * 0.05)})`;
          ctx.lineWidth = 2;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!soundRef.current || loadError) return;
    
    try {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
        soundRef.current.play();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      setLoadError('Playback error occurred');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-dark-700/50 hover:border-dark-600/50 transition-all duration-300"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: loadError ? 1 : 1.1 }}
            whileTap={{ scale: loadError ? 1 : 0.9 }}
            onClick={togglePlay}
            disabled={!!loadError}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
              loadError 
                ? 'bg-red-500 cursor-not-allowed' 
                : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30'
            }`}
          >
            {loadError ? <AlertCircle size={24} /> : isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="overflow-hidden">
                <motion.h3 
                  className="text-xl font-semibold text-white whitespace-nowrap"
                  animate={{
                    x: title.length > 20 ? [0, -(title.length * 8) + 200, 0] : 0
                  }}
                  transition={{
                    duration: title.length > 20 ? 8 : 0,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "linear"
                  }}
                >
                  {title}
                </motion.h3>
              </div>
              {isNew && (
                <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  New
                </span>
              )}
              {isFeatured && (
                <span className="bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-medium">
                {genre}
              </span>
              <span>{bpm} BPM</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary-400">${price.toFixed(2)}</span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-xl transition-colors duration-300 shadow-lg shadow-primary-500/20"
              >
                <ShoppingCart size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-dark-700 hover:bg-dark-600 text-white p-3 rounded-xl transition-colors duration-300"
              >
                <Download size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Expanded Section with Progress and Canvas */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="h-1 bg-dark-700 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Canvas Visualization */}
              <canvas 
                ref={canvasRef}
                className="w-full h-24 rounded-xl bg-dark-900/50 spectrum-canvas"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AudioPlayer;