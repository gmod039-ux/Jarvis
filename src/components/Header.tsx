import React, { useEffect, useState } from "react";
import {
  Terminal,
  Cpu,
  Workflow,
  BookOpen,
  Download,
  Volume2,
  VolumeX,
  Mic,
  Activity,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { ActiveTab, OSMode, SystemTelemetry } from "../types";

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  isListening: boolean;
  isSpeaking: boolean;
  telemetry: SystemTelemetry | null;
  persona: string;
  onOpenVoiceSettings: () => void;
  osMode: OSMode;
  setOsMode: (os: OSMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  voiceEnabled,
  setVoiceEnabled,
  isListening,
  isSpeaking,
  telemetry,
  persona,
  onOpenVoiceSettings,
  osMode,
  setOsMode,
}) => {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isWindows = osMode === "windows";

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "console", label: "AI Command Console", icon: <Terminal className="w-4 h-4" /> },
    {
      id: "builder",
      label: isWindows ? "Windows EXE / Agent Builder" : "macOS Native Builder",
      icon: <Download className="w-4 h-4" />,
      badge: isWindows ? ".EXE / PowerShell" : "Python / Daemon",
    },
    { id: "workflows", label: "Workflow Studio", icon: <Workflow className="w-4 h-4" /> },
    { id: "telemetry", label: "System Telemetry", icon: <Cpu className="w-4 h-4" /> },
    {
      id: "library",
      label: isWindows ? "PowerShell & Script Vault" : "AppleScript Vault",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <header className="bg-[#050505] border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      {/* Top Status Ticker / Bento Header Bar */}
      <div className="bg-[#0b0b0b] border-b border-white/5 px-4 sm:px-6 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar text-white/50">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#34C759] shadow-[0_0_8px_#34C759]" />
            <span className="text-[#34C759] font-semibold tracking-wider text-[11px]">
              {isWindows ? "WIN11 READY" : "MACOS NOMINAL"}
            </span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center space-x-1.5 text-[#E0E0E0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span className="text-[11px] text-white/70">
              {isWindows ? "Defender Realtime Protection" : "SIP Protected"}
            </span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center space-x-1.5 text-[#E0E0E0]">
            <Activity className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span className="text-[11px] text-white/70">
              CPU: <span className="text-[#00D1FF]">{telemetry ? `${telemetry.cpu.load}%` : "14%"}</span>
            </span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center space-x-1.5 text-white/70 text-[11px]">
            <span>
              RAM: <span className="text-[#00D1FF]">{telemetry ? `${telemetry.memory.percentage}%` : "38%"}</span>
            </span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center space-x-1.5 text-white/70 text-[11px]">
            <span>
              PWR: <span className="text-[#34C759]">{telemetry ? `${telemetry.battery.level}% ⚡` : "92% ⚡"}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 ml-3">
          {isSpeaking && (
            <span className="flex items-center space-x-1 text-[#00D1FF] bg-[#00D1FF]/10 px-2.5 py-0.5 rounded-full border border-[#00D1FF]/30 text-[11px] animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>Speaking...</span>
            </span>
          )}
          {isListening && (
            <span className="flex items-center space-x-1 text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[11px] animate-pulse">
              <Mic className="w-3 h-3" />
              <span>Listening...</span>
            </span>
          )}
          <span className="text-xs font-mono text-white/40">{timeStr}</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D1FF] via-[#0047FF] to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,209,255,0.4)]">
              <div className="w-4 h-4 bg-[#050505] rounded-full border border-white/20 shadow-[0_0_10px_rgba(0,209,255,0.8)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#00D1FF] rounded-full animate-ping" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-medium tracking-tight text-[#E0E0E0] flex items-center gap-2">
                <span className="font-bold tracking-wider">JARVIS</span>
                <span className="text-pink-400 text-xs font-mono">&amp; Aoi-chan</span>
                <span className="text-white/40 text-[11px] font-mono hidden sm:inline">
                  //{isWindows ? "Windows 11 / PowerShell" : "macOS Sequoia"}
                </span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#121212] p-1.5 rounded-2xl border border-white/10">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-white/10 text-white border border-white/15 shadow-inner"
                      : "text-white/50 hover:text-white/90 hover:bg-white/5"
                  }`}
                >
                  <span className={active ? "text-[#00D1FF]" : "text-white/40"}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        active ? "bg-[#00D1FF]/20 text-[#00D1FF]" : "bg-white/5 text-white/40"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: OS Mode Switcher + Voice + Persona */}
          <div className="flex items-center space-x-2">
            {/* OS Mode Toggle (Windows / macOS) */}
            <div className="flex items-center bg-[#121212] p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setOsMode("windows")}
                title="Switch Target Environment to Windows 11 / 10"
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                  isWindows
                    ? "bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/40 font-semibold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                <span>🪟</span>
                <span className="hidden sm:inline">Win 11</span>
              </button>
              <button
                onClick={() => setOsMode("macos")}
                title="Switch Target Environment to Apple macOS"
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center space-x-1.5 ${
                  !isWindows
                    ? "bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/40 font-semibold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                <span>🍎</span>
                <span className="hidden sm:inline">macOS</span>
              </button>
            </div>

            {/* Voice & Persona Customizer Button */}
            <button
              onClick={onOpenVoiceSettings}
              title="Configure Voice Synthesis & Persona"
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 border transition-all ${
                persona === "anime" || persona === "tsundere"
                  ? "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20 shadow-[0_0_15px_rgba(244,114,182,0.2)]"
                  : "bg-[#181818] border-white/10 text-white/80 hover:text-white hover:border-white/20"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-mono text-[11px] font-medium hidden sm:inline">
                {persona === "anime"
                  ? "🌸 Aoi-chan"
                  : persona === "tsundere"
                  ? "💢 Asuka"
                  : persona === "friday"
                  ? "🛡️ FRIDAY"
                  : persona === "cyberpunk"
                  ? "⚡ NEURAL"
                  : persona === "glados"
                  ? "🤖 GLaDOS"
                  : "🤵 JARVIS"}
              </span>
            </button>

            {/* Voice On/Off Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              title={voiceEnabled ? "Mute Voice Audio" : "Enable Voice Audio"}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center space-x-2 border transition-all ${
                voiceEnabled
                  ? "bg-[#00D1FF]/10 border-[#00D1FF]/30 text-[#00D1FF] hover:bg-[#00D1FF]/20 shadow-[0_0_15px_rgba(0,209,255,0.15)]"
                  : "bg-[#121212] border-white/10 text-white/40 hover:text-white/70"
              }`}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-[#00D1FF]" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline font-mono text-[11px] font-medium">{voiceEnabled ? "Voice ON" : "Voice OFF"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Scroller */}
        <div className="flex md:hidden overflow-x-auto space-x-1.5 pb-3 pt-1 no-scrollbar">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 border ${
                  active
                    ? "bg-white/10 text-white border-white/20"
                    : "bg-[#121212] text-white/50 border-white/10"
                }`}
              >
                <span className={active ? "text-[#00D1FF]" : ""}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
