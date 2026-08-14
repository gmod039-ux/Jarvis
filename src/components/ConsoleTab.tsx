import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Terminal,
  FileCode,
  Copy,
  Check,
  Play,
  RotateCcw,
  Volume2,
  Trash2,
  Shield,
  Layers,
  ChevronDown,
  ChevronRight,
  Monitor,
  Cpu,
  HardDrive,
  BookOpen,
  Code,
  Zap,
  Activity,
  Moon,
  BatteryCharging,
  Wifi,
  Flame,
  Info,
} from "lucide-react";
import { ChatMessage, ExecutedAction, SystemTelemetry } from "../types";
import { ArcReactorHUD } from "./ArcReactorHUD";
import { jarvisVoice } from "../utils/speech";
import { CONSOLE_COMMANDS, ConsoleCommandDefinition } from "../data/consoleCommands";
import { ConsoleCommandsModal } from "./ConsoleCommandsModal";
import { VoiceSettingsModal } from "./VoiceSettingsModal";

interface ConsoleTabProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, isVoice?: boolean) => Promise<void>;
  onClearHistory: () => void;
  isProcessing: boolean;
  voiceEnabled: boolean;
  persona: string;
  setPersona: (p: string) => void;
  telemetry?: SystemTelemetry | null;
  isVoiceModalOpen?: boolean;
  setIsVoiceModalOpen?: (open: boolean) => void;
}

export const ConsoleTab: React.FC<ConsoleTabProps> = ({
  messages,
  onSendMessage,
  onClearHistory,
  isProcessing,
  voiceEnabled,
  persona,
  setPersona,
  telemetry,
  isVoiceModalOpen: externalIsVoiceModalOpen,
  setIsVoiceModalOpen: externalSetIsVoiceModalOpen,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);
  const [isCommandsModalOpen, setIsCommandsModalOpen] = useState(false);
  const [internalIsVoiceModalOpen, setInternalIsVoiceModalOpen] = useState(false);

  const isVoiceModalOpen = externalIsVoiceModalOpen !== undefined ? externalIsVoiceModalOpen : internalIsVoiceModalOpen;
  const setIsVoiceModalOpen = externalSetIsVoiceModalOpen || setInternalIsVoiceModalOpen;

  // Command History State
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Autocomplete State
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Autocomplete filtering
  const matchingCommands = React.useMemo(() => {
    if (!inputText.startsWith("/")) return [];
    const query = inputText.substring(1).toLowerCase().trim();
    if (!query) return CONSOLE_COMMANDS.slice(0, 7);
    return CONSOLE_COMMANDS.filter(
      (c) =>
        c.command.toLowerCase().includes(query) ||
        c.aliases.some((a) => a.toLowerCase().includes(query)) ||
        c.description.toLowerCase().includes(query)
    ).slice(0, 7);
  }, [inputText]);

  useEffect(() => {
    if (inputText.startsWith("/") && matchingCommands.length > 0) {
      setShowAutocomplete(true);
      setSelectedSuggestionIndex(0);
    } else {
      setShowAutocomplete(false);
    }
  }, [inputText, matchingCommands.length]);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript.trim()) {
            setInputText(transcript);
            onSendMessage(transcript, true);
          }
        };

        recognition.onerror = (e: any) => {
          console.log("Speech recognition error:", e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onSendMessage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("Mic start err:", e);
        }
      } else {
        alert("Speech Recognition is not supported by your current browser. Please type your command below.");
      }
    }
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const text = inputText;
    
    // Append to command history
    setCommandHistory((prev) => [text, ...prev.filter((c) => c !== text)].slice(0, 50));
    setHistoryIndex(-1);

    setInputText("");
    setShowAutocomplete(false);
    await onSendMessage(text, false);
  };

  // Keyboard navigation for history and autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showAutocomplete && matchingCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev + 1) % matchingCommands.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev - 1 + matchingCommands.length) % matchingCommands.length);
        return;
      }
      if (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey)) {
        e.preventDefault();
        const chosen = matchingCommands[selectedSuggestionIndex];
        if (chosen) {
          setInputText(chosen.example);
          setShowAutocomplete(false);
        }
        return;
      }
      if (e.key === "Escape") {
        setShowAutocomplete(false);
        return;
      }
    }

    // Terminal History Navigation with Up / Down Arrow
    if (!showAutocomplete) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(nextIndex);
        setInputText(commandHistory[nextIndex]);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const nextIndex = historyIndex - 1;
          setHistoryIndex(nextIndex);
          setInputText(commandHistory[nextIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInputText("");
        }
        return;
      }
    }
  };

  const handleSelectAutocomplete = (item: ConsoleCommandDefinition) => {
    setInputText(item.example);
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakMessage = (text: string) => {
    jarvisVoice.speak(text, {
      personaId: persona,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Quick Action triggers
  const quickActions = [
    { label: "⚡ /help", cmd: "/help" },
    { label: "🌸 /theme anime", cmd: "/theme anime" },
    { label: "📊 /telemetry", cmd: "/telemetry" },
    { label: "🌙 /darkmode", cmd: "/darkmode toggle" },
    { label: "🔋 /battery", cmd: "/battery" },
    { label: "🔊 /volume 65", cmd: "/volume 65" },
    { label: "📶 /wifi", cmd: "/wifi" },
    { label: "🔥 /purge", cmd: "/purge" },
    { label: "🎵 /music", cmd: "/music play Focus Chill" },
    { label: "📋 /processes", cmd: "/processes" },
    { label: "💻 /sysinfo", cmd: "/sysinfo" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Console Commands Modal */}
      <ConsoleCommandsModal
        isOpen={isCommandsModalOpen}
        onClose={() => setIsCommandsModalOpen(false)}
        onRunCommand={(cmd) => {
          onSendMessage(cmd);
          setCommandHistory((prev) => [cmd, ...prev.filter((c) => c !== cmd)]);
        }}
      />

      {/* Voice & Persona Customizer Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentPersona={persona}
        onSelectPersona={(p) => setPersona(p)}
      />

      {/* Bento Grid Layout Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Bento Column (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5 flex flex-col">
          {/* Bento Tile 1: Arc Reactor Core */}
          <div className="h-[280px]">
            <ArcReactorHUD
              isListening={isListening}
              isSpeaking={isSpeaking}
              isProcessing={isProcessing}
              onToggleMic={toggleListening}
              personaName={
                persona === "anime"
                  ? "AOI-CHAN (ANIME TYAN)"
                  : persona === "tsundere"
                  ? "ASUKA-AI (TSUNDERE)"
                  : persona.toUpperCase()
              }
            />
          </div>

          {/* Bento Tile 2: System Pulse & Directive */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-2xl flex-1 space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-1.5">
                  <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    NEURAL DIRECTIVE
                  </h2>
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    title="Open Voice Synthesis & Pitch Studio"
                    className="p-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 transition-all text-[10px] flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Voice Studio</span>
                  </button>
                </div>
                <select
                  aria-label="Persona Profile"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className={`border rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:ring-1 ${
                    persona === "anime" || persona === "tsundere"
                      ? "bg-pink-500/10 border-pink-500/30 text-pink-300 focus:ring-pink-400"
                      : "bg-[#1A1A1A] border-white/10 text-[#00D1FF] focus:ring-[#00D1FF]"
                  }`}
                >
                  <option value="anime">🌸 Aoi-chan (Anime Tyan)</option>
                  <option value="tsundere">💢 Asuka-AI (Tsundere)</option>
                  <option value="jarvis">🤵 J.A.R.V.I.S. (British)</option>
                  <option value="friday">🛡️ F.R.I.D.A.Y. (Tactical)</option>
                  <option value="cyberpunk">⚡ NEURAL-01</option>
                  <option value="glados">🤖 GLaDOS (Sarcastic)</option>
                  <option value="minimalist">⌨️ CLI Mode</option>
                </select>
              </div>

              <div className="mt-3 bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-[10px] text-white/30 uppercase mb-1 font-mono">Autonomous Execution Engine</div>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  Native AppleScript, Zsh shell, Spotlight, and console commands engine. Type <code className="text-[#00D1FF]">/help</code> for manual.
                </p>
              </div>

              {/* Console Commands Button & Fast Triggers */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center space-x-1.5">
                    <Terminal className="w-3 h-3 text-[#00D1FF]" />
                    <span>Console Commands</span>
                  </span>
                  <button
                    onClick={() => setIsCommandsModalOpen(true)}
                    className="text-[10px] font-mono text-[#00D1FF] hover:text-white bg-[#00D1FF]/10 hover:bg-[#00D1FF]/20 px-2 py-0.5 rounded-lg border border-[#00D1FF]/30 transition-all flex items-center space-x-1"
                  >
                    <BookOpen className="w-2.5 h-2.5" />
                    <span>Command Vault</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(action.cmd)}
                      disabled={isProcessing}
                      className="text-xs bg-white/5 hover:bg-white/10 text-white/70 hover:text-[#00D1FF] border border-white/5 hover:border-[#00D1FF]/30 px-2 py-1 rounded-xl transition-all font-mono active:scale-95 disabled:opacity-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Status strip */}
            <div className="flex items-center justify-between text-[10px] font-mono text-white/30 pt-3 border-t border-white/5">
              <span className="flex items-center space-x-1.5 text-[#34C759]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                <span>ARM64 Silicon Native</span>
              </span>
              <button
                onClick={onClearHistory}
                className="text-white/40 hover:text-red-400 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Bento Column: Main Terminal Feed & Input (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#121212] border border-white/10 rounded-3xl relative flex flex-col overflow-hidden shadow-2xl min-h-[620px]">
          {/* Subtle Bento Grid Matrix Watermark */}
          <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />

          {/* Terminal Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]" />
              </div>
              <span className="text-xs font-mono text-white/40 ml-2">jarvis@macbook-pro ~ % console</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCommandsModalOpen(true)}
                className="text-xs font-mono text-white/60 hover:text-[#00D1FF] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 transition-all flex items-center space-x-1.5"
              >
                <Code className="w-3 h-3 text-[#00D1FF]" />
                <span>CLI Vault</span>
              </button>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-[#00D1FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse" />
                <span>Gemini 3.7 Pro</span>
              </div>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 font-sans text-sm z-10">
            {messages.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-white/40 space-y-2">
                <Terminal className="w-10 h-10 text-[#00D1FF]/40 mb-1" />
                <p className="font-mono text-[#00D1FF] text-sm font-semibold">J.A.R.V.I.S. Core Ready for Instructions</p>
                <p className="text-xs text-white/40 max-w-md font-sans leading-relaxed">
                  Type <code className="text-[#00D1FF]">/help</code> for console command catalog, <code className="text-[#00D1FF]">/telemetry</code> for M3 Max metrics, or give voice/text commands.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 justify-center">
                  <button
                    onClick={() => onSendMessage("/help")}
                    className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1 rounded-xl border border-white/10 font-mono"
                  >
                    /help
                  </button>
                  <button
                    onClick={() => onSendMessage("/telemetry")}
                    className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1 rounded-xl border border-white/10 font-mono"
                  >
                    /telemetry
                  </button>
                  <button
                    onClick={() => onSendMessage("/darkmode toggle")}
                    className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1 rounded-xl border border-white/10 font-mono"
                  >
                    /darkmode toggle
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isCommand = isUser && (msg.text.startsWith("/") || msg.text.startsWith("!"));
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${isUser ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-[10px] font-bold font-mono border ${
                      isUser
                        ? isCommand
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : "bg-white/10 text-white/80 border-white/10"
                        : "bg-[#00D1FF]/20 text-[#00D1FF] border-[#00D1FF]/30 shadow-[0_0_10px_rgba(0,209,255,0.2)]"
                    }`}
                  >
                    {isUser ? (isCommand ? "CLI" : "USER") : "JARVIS"}
                  </div>

                  {/* Message Bubble Bento Tile */}
                  <div
                    className={`max-w-[82%] p-4 text-sm leading-relaxed rounded-2xl border ${
                      isUser
                        ? isCommand
                          ? "bg-purple-500/10 rounded-tl-none border-purple-500/30 text-purple-100 font-mono text-xs"
                          : "bg-white/5 rounded-tl-none border-white/5 text-[#E0E0E0]"
                        : "bg-[#00D1FF]/5 rounded-tr-none border-[#00D1FF]/20 text-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/30 mb-1.5">
                      <span>{msg.timestamp}</span>
                      {isCommand && (
                        <span className="text-purple-300 bg-purple-500/20 px-1.5 py-0.2 rounded border border-purple-500/30">
                          Console Command
                        </span>
                      )}
                      {msg.isVoiceInput && (
                        <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                          Voice In
                        </span>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap font-sans">{msg.text}</p>

                    {/* Executed Tools / macOS Action Cards */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3.5 space-y-2 border-t border-white/10 pt-3">
                        <div className="text-[10px] font-bold text-[#00D1FF] uppercase tracking-widest flex items-center space-x-1.5">
                          <Monitor className="w-3.5 h-3.5" />
                          <span>Dispatched macOS Actions ({msg.actions.length})</span>
                        </div>

                        {msg.actions.map((act: ExecutedAction) => {
                          const isExpanded = expandedActionId === act.id;
                          return (
                            <div
                              key={act.id}
                              className="bg-[#121212] rounded-xl border border-white/10 overflow-hidden font-mono text-xs shadow-inner"
                            >
                              <div
                                onClick={() => setExpandedActionId(isExpanded ? null : act.id)}
                                className="px-3 py-2 bg-white/5 hover:bg-white/10 flex items-center justify-between cursor-pointer border-b border-white/5"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="w-2 h-2 rounded-full bg-[#34C759] shadow-[0_0_6px_#34C759]" />
                                  <span className="text-[#00D1FF] font-semibold">{act.toolName}</span>
                                  <span className="text-white/40 text-[10px]">[{act.type}]</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded border border-[#34C759]/30">
                                    {act.status}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                                  )}
                                </div>
                              </div>

                              {/* Action Code & Output Display */}
                              <div className="p-3 space-y-2">
                                {act.commandString && (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-white/40">
                                      <span>macOS Payload:</span>
                                      <button
                                        onClick={() => handleCopy(act.commandString, act.id)}
                                        className="flex items-center space-x-1 text-[#00D1FF] hover:text-white transition-colors"
                                      >
                                        {copiedId === act.id ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                                        <span>{copiedId === act.id ? "Copied" : "Copy Payload"}</span>
                                      </button>
                                    </div>
                                    <div className="bg-[#050505] p-2.5 rounded-lg border border-white/5 text-[#00D1FF] text-xs overflow-x-auto">
                                      <code>{act.commandString}</code>
                                    </div>
                                  </div>
                                )}

                                {/* Output */}
                                <div className="space-y-1">
                                  <div className="text-[10px] text-white/40">Execution Result:</div>
                                  <div className="bg-white/5 p-2 rounded text-white/80 text-[11px] border border-white/5 font-mono whitespace-pre-wrap overflow-x-auto max-h-56">
                                    {act.simulatedOutput}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Audio & Copy Controls */}
                    {!isUser && (
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                        <button
                          onClick={() => handleSpeakMessage(msg.text)}
                          className="text-[11px] font-mono text-[#00D1FF] hover:text-white flex items-center space-x-1 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Voice Vocalize</span>
                        </button>
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="text-[11px] font-mono text-white/40 hover:text-white/80 flex items-center space-x-1 transition-colors"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-start gap-4 flex-row-reverse animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/30 flex items-center justify-center text-[10px] font-bold font-mono">
                  JARVIS
                </div>
                <div className="bg-[#00D1FF]/5 border border-[#00D1FF]/20 rounded-2xl rounded-tr-none p-4 text-xs font-mono text-[#00D1FF] flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#00D1FF] border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing macOS action payload and dispatching to AppleScript daemon...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Autocomplete Popup */}
          {showAutocomplete && matchingCommands.length > 0 && (
            <div className="absolute bottom-20 left-4 right-4 z-30 bg-[#161616] border border-white/20 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-fadeIn backdrop-blur-xl">
              <div className="p-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-[10px] text-white/40">
                <span className="flex items-center space-x-1">
                  <Terminal className="w-3 h-3 text-[#00D1FF]" />
                  <span>Matching Console Commands</span>
                </span>
                <span>Use ↑ / ↓ to navigate • Tab or Enter to select</span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-white/5">
                {matchingCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedSuggestionIndex;
                  return (
                    <div
                      key={cmd.command}
                      onClick={() => handleSelectAutocomplete(cmd)}
                      onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected ? "bg-[#00D1FF]/15 text-white" : "hover:bg-white/5 text-white/70"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-[#00D1FF] font-bold">{cmd.command}</span>
                        <span className="text-white/40 text-[11px] truncate font-sans">
                          {cmd.description}
                        </span>
                      </div>
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 shrink-0 ml-2">
                        {cmd.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bento Input Dock */}
          <div className="p-4 bg-white/5 border-t border-white/10 z-10">
            <form
              onSubmit={handleFormSubmit}
              className="flex gap-3 items-center bg-[#1A1A1A] rounded-2xl p-2 pl-4 border border-white/10 focus-within:border-[#00D1FF]/50 transition-all shadow-lg"
            >
              <div className="w-2 h-2 rounded-full bg-[#00D1FF] animate-pulse shadow-[0_0_8px_#00D1FF]" />

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Jarvis or type / (e.g. /help, /telemetry, /darkmode, /volume 70, /purge)..."
                className="bg-transparent border-none outline-none text-sm flex-1 py-2 placeholder:text-white/20 text-[#E0E0E0] font-sans"
                disabled={isProcessing}
              />

              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Voice input"}
                className={`p-2 rounded-xl border transition-all ${
                  isListening
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-[#00D1FF]"
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] disabled:opacity-30 h-10 px-4 flex items-center justify-center gap-2 rounded-xl transition-all font-bold text-xs shadow-[0_0_20px_rgba(0,209,255,0.3)] active:scale-95 shrink-0"
              >
                <span>Execute</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
