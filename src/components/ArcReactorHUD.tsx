import React, { useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";

interface ArcReactorHUDProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onToggleMic: () => void;
  personaName: string;
}

export const ArcReactorHUD: React.FC<ArcReactorHUDProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onToggleMic,
  personaName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Outer glowing ring
      const radius = 64;
      const pulseSpeed = isSpeaking ? 0.08 : isListening ? 0.05 : 0.02;
      const intensity = isSpeaking ? 1.5 : isListening ? 1.3 : isProcessing ? 1.8 : 0.7;

      angle += pulseSpeed;

      // Radial background glow
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius + 25);
      if (isSpeaking) {
        grad.addColorStop(0, "rgba(0, 209, 255, 0.45)");
        grad.addColorStop(0.6, "rgba(0, 71, 255, 0.15)");
        grad.addColorStop(1, "rgba(0, 209, 255, 0)");
      } else if (isListening) {
        grad.addColorStop(0, "rgba(245, 158, 11, 0.45)");
        grad.addColorStop(0.6, "rgba(217, 119, 6, 0.15)");
        grad.addColorStop(1, "rgba(180, 83, 9, 0)");
      } else if (isProcessing) {
        grad.addColorStop(0, "rgba(168, 85, 247, 0.5)");
        grad.addColorStop(0.6, "rgba(147, 51, 234, 0.2)");
        grad.addColorStop(1, "rgba(126, 34, 206, 0)");
      } else {
        grad.addColorStop(0, "rgba(0, 209, 255, 0.25)");
        grad.addColorStop(0.6, "rgba(0, 71, 255, 0.08)");
        grad.addColorStop(1, "rgba(0, 209, 255, 0)");
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 25, 0, Math.PI * 2);
      ctx.fill();

      // Outer rotating segmented dashed track
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.4);
      ctx.beginPath();
      ctx.arc(0, 0, radius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = isSpeaking ? "rgba(0, 209, 255, 0.8)" : isListening ? "rgba(251, 191, 36, 0.8)" : "rgba(0, 209, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 14]);
      ctx.stroke();
      ctx.restore();

      // Counter-rotating inner ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 0.7);
      ctx.beginPath();
      ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
      ctx.strokeStyle = isProcessing ? "rgba(192, 132, 252, 0.8)" : "rgba(0, 209, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8, 12, 6]);
      ctx.stroke();
      ctx.restore();

      // Audio waveform bars around core
      const bars = 32;
      for (let i = 0; i < bars; i++) {
        const barAngle = (i / bars) * Math.PI * 2 + angle * 0.2;
        let barHeight = 6;
        if (isSpeaking || isListening) {
          barHeight = 6 + Math.sin(angle * 3 + i * 0.8) * 14 * intensity;
        } else if (isProcessing) {
          barHeight = 8 + Math.cos(angle * 4 + i) * 10;
        } else {
          barHeight = 4 + Math.sin(angle + i * 0.4) * 3;
        }

        const x1 = centerX + Math.cos(barAngle) * (radius - 12);
        const y1 = centerY + Math.sin(barAngle) * (radius - 12);
        const x2 = centerX + Math.cos(barAngle) * (radius - 12 + barHeight);
        const y2 = centerY + Math.sin(barAngle) * (radius - 12 + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isSpeaking
          ? "rgba(0, 209, 255, 0.95)"
          : isListening
          ? "rgba(252, 211, 77, 0.9)"
          : isProcessing
          ? "rgba(216, 180, 254, 0.9)"
          : "rgba(0, 209, 255, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking, isProcessing]);

  return (
    <div className="flex flex-col items-center justify-between h-full p-5 bg-[#121212] rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
      {/* Background Bento Matrix grid */}
      <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />

      {/* Top Header Label */}
      <div className="w-full flex items-center justify-between z-10 pb-2">
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
          NEURAL ARC CORE
        </h2>
        <span className="text-[10px] font-mono text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-0.5 rounded-full border border-[#00D1FF]/20">
          {personaName}
        </span>
      </div>

      {/* Holographic Arc Reactor Canvas */}
      <div className="relative w-44 h-44 my-2 flex items-center justify-center">
        <canvas ref={canvasRef} width={176} height={176} className="absolute inset-0 pointer-events-none" />

        {/* Center Interactive Button */}
        <button
          onClick={onToggleMic}
          aria-label={isListening ? "Mute Microphone" : "Activate Voice Control"}
          className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-xl border ${
            isListening
              ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-4 ring-amber-400/20 animate-pulse"
              : isSpeaking
              ? "bg-[#00D1FF]/20 border-[#00D1FF] text-[#00D1FF] shadow-[0_0_25px_rgba(0,209,255,0.5)] ring-4 ring-[#00D1FF]/20"
              : isProcessing
              ? "bg-purple-500/20 border-purple-400 text-purple-200 shadow-purple-500/30 ring-4 ring-purple-400/20"
              : "bg-[#1A1A1A] border-white/15 text-[#00D1FF] hover:border-[#00D1FF]/60 hover:text-white shadow-[0_0_15px_rgba(0,209,255,0.2)]"
          }`}
        >
          {isListening ? (
            <>
              <Mic className="w-6 h-6 text-amber-300 animate-bounce" />
              <span className="text-[9px] font-mono tracking-tight font-semibold mt-1">LISTENING</span>
            </>
          ) : isSpeaking ? (
            <>
              <Sparkles className="w-6 h-6 text-[#00D1FF] animate-spin-slow" />
              <span className="text-[9px] font-mono tracking-tight font-semibold mt-1">SPEAKING</span>
            </>
          ) : isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-1" />
              <span className="text-[9px] font-mono tracking-tight text-purple-300">CALCULATING</span>
            </>
          ) : (
            <>
              <MicOff className="w-6 h-6 text-[#00D1FF] mb-0.5" />
              <span className="text-[9px] font-mono tracking-tight text-white/70">PUSH MIC</span>
            </>
          )}
        </button>
      </div>

      {/* Status Pill Bento Container */}
      <div className="w-full bg-white/5 rounded-xl p-2.5 border border-white/5 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isListening
                ? "bg-amber-400 animate-ping"
                : isSpeaking
                ? "bg-[#00D1FF] animate-pulse"
                : isProcessing
                ? "bg-purple-400 animate-ping"
                : "bg-[#34C759] shadow-[0_0_6px_#34C759]"
            }`}
          />
          <span className="text-xs font-mono text-white/80">
            {isListening
              ? "Listening..."
              : isSpeaking
              ? `${personaName} Speaking`
              : isProcessing
              ? "Synthesizing Payload"
              : "Standing By"}
          </span>
        </div>
        <span className="text-[10px] text-white/30 font-mono">100% Core</span>
      </div>
    </div>
  );
};

