import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioFile: File | null;
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioFile, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (audioFile) {
      const url = URL.createObjectURL(audioFile);
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
    }
  }, [audioFile]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
      if (!audioContextRef.current && audioRef.current) {
        initAudio();
      } else if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } else {
      audioRef.current?.pause();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const initAudio = () => {
    if (!audioRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyzerRef.current = analyser;

    const source = ctx.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    sourceRef.current = source;

    draw();
  };

  const draw = () => {
    if (!canvasRef.current || !analyzerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      requestRef.current = requestAnimationFrame(renderFrame);
      analyzerRef.current!.getByteFrequencyData(dataArray);

      // Clear with trail effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5; // Scale up

        // Cyberpunk gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#7000ff'); // Purple
        gradient.addColorStop(0.5, '#00f0ff'); // Cyan
        gradient.addColorStop(1, '#ff003c'); // Pink

        ctx.fillStyle = gradient;
        
        // Futuristic "blocky" look
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Add a "glitch" line on top
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, canvas.height - barHeight - 4, barWidth, 2);

        x += barWidth + 2;
      }
    };

    renderFrame();
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="relative w-full h-64 bg-cyber-dark/50 rounded-lg border border-cyber-primary/20 overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.1)]">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={300} 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay UI elements */}
      <div className="absolute top-2 left-2 text-[10px] text-cyber-primary font-mono opacity-70">
        AUDIO_VISUALIZER_V1.0 // SPECTRAL_ANALYSIS
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-cyber-accent font-mono opacity-70 animate-pulse">
        {isPlaying ? 'PROCESSING_STREAM...' : 'AWAITING_INPUT'}
      </div>
    </div>
  );
};

export default AudioVisualizer;
