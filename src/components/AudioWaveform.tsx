import React, { useEffect, useRef, useState } from 'react';

interface AudioWaveformProps {
  audioUrl: string;
  width?: number;
  height?: number;
  color?: string;
  progress?: number;
  onSeek?: (progress: number) => void;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  width = 280,
  height = 48,
  color = '#0066ff',
  progress = 0,
  onSeek
}) => {
  const [svgPath, setSvgPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const waveformDataRef = useRef<number[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onSeek || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, percentage)));
  };

  // Generate SVG path from waveform data
  const generateSVGPath = (normalizedWaveform: number[]) => {
    const maxBarHeight = height - 8;
    let svg = '';
    
    // Background (non-played) waveform
    normalizedWaveform.forEach((v, i) => {
      const barHeight = Math.max(4, v * maxBarHeight);
      const x = i;
      const y = (height - barHeight) / 2;
      svg += `<rect x="${x}" y="${y}" width="1" height="${barHeight}" rx="0.5" fill="rgba(255,255,255,0.1)" />`;
    });

    // Foreground (played) waveform with gradient
    svg += `<defs>
      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#0066ff" />
        <stop offset="100%" style="stop-color:#00b8ff" />
      </linearGradient>
    </defs>`;

    normalizedWaveform.forEach((v, i) => {
      if (i <= (width * (progress / 100))) {
        const barHeight = Math.max(4, v * maxBarHeight);
        const x = i;
        const y = (height - barHeight) / 2;
        svg += `<rect x="${x}" y="${y}" width="1" height="${barHeight}" rx="0.5" fill="url(#progressGradient)" />`;
      }
    });

    return svg;
  };

  // Generate placeholder waveform when audio can't be loaded
  const generatePlaceholderWaveform = () => {
    const samples = width;
    const waveform = Array.from({ length: samples }, () => Math.random() * 0.5 + 0.25);
    return generateSVGPath(waveform);
  };

  // Load and process audio data
  useEffect(() => {
    const processAudio = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cancel any previous fetch request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const res = await fetch(audioUrl, {
          signal: abortControllerRef.current.signal,
          mode: 'cors', // Explicitly request CORS
          credentials: 'omit', // Don't send credentials
          headers: {
            'Accept': 'audio/*' // Explicitly request audio content
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const rawData = audioBuffer.getChannelData(0);
        const samples = width;
        const blockSize = Math.floor(rawData.length / samples);
        const waveform: number[] = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[(i * blockSize) + j]);
          }
          waveform.push(sum / blockSize);
        }

        // Normalize waveform data
        const multiplier = Math.pow(Math.max(...waveform), -1);
        const normalizedWaveform = waveform.map(n => n * multiplier);
        
        // Store waveform data for reuse
        waveformDataRef.current = normalizedWaveform;
        
        // Generate initial SVG
        const svg = generateSVGPath(normalizedWaveform);
        setSvgPath(svg);
        setIsLoading(false);
        retryCountRef.current = 0; // Reset retry count on success
        
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            return;
          }
          
          console.warn('Error loading audio:', error.message);
          
          // Implement retry logic
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            setTimeout(processAudio, 1000 * retryCountRef.current); // Exponential backoff
            return;
          }

          // If all retries failed, show placeholder waveform
          setError('Audio preview unavailable');
          setSvgPath(generatePlaceholderWaveform());
        }
        setIsLoading(false);
      }
    };

    processAudio();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [audioUrl, width, height]);

  // Update SVG when progress changes
  useEffect(() => {
    if (waveformDataRef.current.length > 0) {
      const svg = generateSVGPath(waveformDataRef.current);
      setSvgPath(svg);
    }
  }, [progress, height]);

  if (isLoading) {
    return (
      <div className="w-full h-12 bg-dark-800/50 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="w-full flex items-center justify-center relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={`rounded-lg overflow-hidden ${onSeek ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: svgPath }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-red-500/75">{error}</span>
        </div>
      )}
    </div>
  );
};

export default AudioWaveform;