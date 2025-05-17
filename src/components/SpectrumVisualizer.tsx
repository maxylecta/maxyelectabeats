import React, { useEffect, useRef } from 'react';

type Props = {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
};

const SpectrumVisualizer: React.FC<Props> = ({ audioRef, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  const audioContextRef = useRef<AudioContext>();
  const sourceNodeRef = useRef<MediaElementAudioSourceNode>();

  useEffect(() => {
    if (!audioRef.current) return;

    // Create or reuse AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioCtx = audioContextRef.current;
    
    // Resume the audio context if it's suspended
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Create analyzer if it doesn't exist
    if (!analyserRef.current) {
      analyserRef.current = audioCtx.createAnalyser();
      analyserRef.current.fftSize = 64;
    }

    // Only create a new source if we haven't already
    if (!sourceNodeRef.current && audioRef.current) {
      sourceNodeRef.current = audioCtx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtx.destination);
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    dataArrayRef.current = dataArray;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      ctx.clearRect(0, 0, rect.width, rect.height);

      const barWidth = (rect.width / bufferLength) * 0.8;
      const barSpacing = 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArrayRef.current[i];
        const barHeight = (value / 255) * rect.height;

        const gradient = ctx.createLinearGradient(x, rect.height - barHeight, x, rect.height);
        gradient.addColorStop(0, '#00f0ff');
        gradient.addColorStop(1, '#0066ff');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, rect.height - barHeight, barWidth - barSpacing, barHeight);

        x += barWidth;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '50px',
        background: 'transparent',
        borderRadius: '10px',
        marginTop: '5px',
      }}
    />
  );
};

export default SpectrumVisualizer;