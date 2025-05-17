import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const ElectricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    // Initialize electric particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 0.5,
          life: Math.random(),
          size: Math.random() * 1.5 + 0.5
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
      const offsetY = (Math.random() - 0.5) * displace * 0.5;
      
      drawLightning(startX, startY, midX + offsetX, midY + offsetY, displace / 2, detail);
      drawLightning(midX + offsetX, midY + offsetY, endX, endY, displace / 2, detail);
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Electric ambient animation
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw electric particles with enhanced glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0, 246, 255, 0.4)';
      
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;
        
        // Enhanced particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2.5
        );
        gradient.addColorStop(0, 'rgba(0, 246, 255, 0.9)');
        gradient.addColorStop(0.4, 'rgba(0, 162, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 102, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Bright center point
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw lightning bolts with enhanced glow
      if (Math.random() < 0.05) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 246, 255, 0.9)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 246, 255, 0.4)';
        
        const startX = Math.random() * rect.width;
        const startY = 0;
        const endX = Math.random() * rect.width;
        const endY = rect.height;
        
        drawLightning(startX, startY, endX, endY, 25, 2);
        ctx.stroke();

        // Add bright core to lightning
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16 rounded-xl bg-black/95 backdrop-blur-sm"
      style={{
        boxShadow: '0 0 15px rgba(0, 102, 255, 0.15), inset 0 0 20px rgba(0, 102, 255, 0.1)'
      }}
    />
  );
};

export default ElectricCanvas;