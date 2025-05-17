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
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onSeek || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    let isMounted = true;

    const generateWaveform = async () => {
      try {
        const res = await fetch(audioUrl);
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

        if (isMounted) {
          setSvgPath(svg);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error generating waveform:', error);
        setIsLoading(false);
      }
    };

    generateWaveform();

    return () => { isMounted = false; };
  }, [audioUrl, width, height, color, progress]);

  if (isLoading) {
    return (
      <div className="w-full h-12 bg-dark-800/50 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="rounded-lg overflow-hidden cursor-pointer"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: svgPath }}
      />
    </div>
  );
};

export default AudioWaveform;