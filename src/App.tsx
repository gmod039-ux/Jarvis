import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
import { ConsoleTab } from "./components/ConsoleTab";
import { NativeBuilderTab } from "./components/NativeBuilderTab";
import { WorkflowsTab } from "./components/WorkflowsTab";
import { TelemetryTab } from "./components/TelemetryTab";
import { LibraryTab } from "./components/LibraryTab";
import { ActiveTab, ChatMessage, OSMode, SystemTelemetry } from "./types";
import { jarvisVoice } from "./utils/speech";
import { matchConsoleCommand, executeBuiltInCommand } from "./data/consoleCommands";
import { VoiceSettingsModal } from "./components/VoiceSettingsModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("console");
  const [osMode, setOsMode] = useState<OSMode>("windows");
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [persona, setPersona] = useState<string>("anime");
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Initial welcome message from J.A.R.V.I.S. / Aoi-chan
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "model",
      text: "Хай, Сэмпай! ✨ Aoi-chan готова помочь тебе управлять твоим компьютером! Доступны все функции Windows 11 (PowerShell/CMD/Winget) и macOS, экспорт в нативный .EXE, быстрые команды и голос аниме-тян! Напиши '/help' или нажми на микрофон!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Sync synthesizer persona
  useEffect(() => {
    jarvisVoice.setPersona(persona);
  }, [persona]);

  // Fetch telemetry from server based on active OS mode
  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await fetch(`/api/jarvis/telemetry?os=${osMode}`);
      if (res.ok) {
        const data: SystemTelemetry = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.log("Telemetry fetch notice:", e);
    }
  }, [osMode]);

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, [fetchTelemetry]);

  // Clear history handler
  const handleClearHistory = useCallback(() => {
    setMessages([]);
    jarvisVoice.stop();
  }, []);

  // Send message to Jarvis AI backend or execute built-in console command
  const handleSendMessage = useCallback(
    async (text: string, isVoiceInput: boolean = false) => {
      if (!text.trim() || isProcessing) return;

      const trimmedText = text.trim();

      // Check if this input matches a built-in console command
      const matched = matchConsoleCommand(trimmedText);
      if (matched.isCommand && (matched.definition || trimmedText.startsWith("/") || trimmedText.startsWith("!"))) {
        const userMsg: ChatMessage = {
          id: `user-${Date.now()}`,
          role: "user",
          text: trimmedText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isVoiceInput,
        };

        const cmdRes = executeBuiltInCommand(
          matched.commandName || trimmedText,
          matched.argsString,
          telemetry,
          persona
        );

        if (cmdRes.clearHistory) {
          handleClearHistory();
          return;
        }

        if (cmdRes.setPersona) {
          setPersona(cmdRes.setPersona);
        }

        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: "model",
          text: cmdRes.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actions: cmdRes.actions,
        };

        setMessages((prev) => [...prev, userMsg, modelMsg]);

        if (voiceEnabled && cmdRes.shouldSpeak) {
          jarvisVoice.speak(cmdRes.replyText, {
            personaId: cmdRes.setPersona || persona,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }
        return;
      }

      // Otherwise, dispatch to Gemini API
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: trimmedText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isVoiceInput,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsProcessing(true);

      try {
        const res = await fetch("/api/jarvis/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmedText,
            history: messages.slice(-6),
            persona,
            osMode,
            voiceOutput: voiceEnabled,
          }),
        });

        const data = await res.json();

        const modelReplyText =
          data.reply ||
          (persona === "anime"
            ? "Хай, Сэмпай! Команда выполнена! ✨"
            : "Command dispatched, Sir.");

        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: "model",
          text: modelReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actions: data.actions || [],
        };

        setMessages((prev) => [...prev, modelMsg]);

        if (voiceEnabled) {
          jarvisVoice.speak(modelReplyText, {
            personaId: persona,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
          });
        }
      } catch (err: any) {
        console.error("Jarvis API error:", err);
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "model",
          text:
            persona === "anime"
              ? "Ой, Сэмпай! Кажется, нейросеть сейчас перезагружается, проверь подключение к сети! ✨"
              : "I apologize, Sir, but a momentary disruption occurred in the neural bridge. Heuristic fallbacks activated.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsProcessing(false);
      }
    },
    [messages, persona, osMode, voiceEnabled, isProcessing, telemetry, handleClearHistory]
  );

  const handleExecuteScriptInConsole = (prompt: string) => {
    setActiveTab("console");
    handleSendMessage(prompt);
  };

  const handleRunDiagnostic = (type: string) => {
    handleSendMessage(`/telemetry`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-sans selection:bg-pink-500/30 selection:text-pink-300">
      {/* Voice & Persona Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentPersona={persona}
        onSelectPersona={(p) => setPersona(p)}
      />

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        isListening={false}
        isSpeaking={isSpeaking}
        telemetry={telemetry}
        persona={persona}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
        osMode={osMode}
        setOsMode={setOsMode}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === "console" && (
          <ConsoleTab
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            isProcessing={isProcessing}
            voiceEnabled={voiceEnabled}
            persona={persona}
            setPersona={setPersona}
            telemetry={telemetry}
            isVoiceModalOpen={isVoiceModalOpen}
            setIsVoiceModalOpen={setIsVoiceModalOpen}
          />
        )}

        {activeTab === "builder" && (
          <NativeBuilderTab osMode={osMode} setOsMode={setOsMode} />
        )}

        {activeTab === "workflows" && <WorkflowsTab />}

        {activeTab === "telemetry" && (
          <TelemetryTab
            telemetry={telemetry}
            onRefreshTelemetry={fetchTelemetry}
            onRunDiagnostic={handleRunDiagnostic}
          />
        )}

        {activeTab === "library" && (
          <LibraryTab onExecuteScriptInConsole={handleExecuteScriptInConsole} />
        )}
      </main>

      {/* Persistent Subtle Footer */}
      <footer className="bg-[#050505] border-t border-white/10 py-3.5 px-4 text-center text-xs font-mono text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            J.A.R.V.I.S. &amp; Aoi-chan AI Desktop Agent • Cross-Platform (Windows 11 EXE &amp; macOS Daemon)
          </span>
          <span className="text-pink-400/80">
            Powered by Google Gemini 3.7 &amp; Phonetic Speech Studio
          </span>
        </div>
      </footer>
    </div>
  );
}
