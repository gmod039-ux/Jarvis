import React, { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Check,
  Terminal,
  Settings,
  Code2,
  Cpu,
  ShieldAlert,
  Play,
  CheckCircle2,
  FileText,
  KeyRound,
  Apple,
  ExternalLink,
} from "lucide-react";
import { NativeAgentConfig } from "../types";

export const NativeBuilderTab: React.FC = () => {
  const [config, setConfig] = useState<NativeAgentConfig>({
    agentName: "JARVIS",
    wakeWord: "hey jarvis",
    hotkey: "Option+Space",
    preferredMusicApp: "Spotify",
    preferredBrowser: "Safari",
    voiceSpeed: 175,
    voiceGender: "Daniel (British)",
    autoStartOnBoot: true,
    enableShortcutsBridge: true,
  });

  const [generatedData, setGeneratedData] = useState<{
    pythonScript: string;
    installSh: string;
    launchAgentPlist: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"python" | "install" | "plist">("python");

  const generateLocalAgentFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jarvis/generate-local-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: config.agentName,
          wakeWord: config.wakeWord,
          hotkey: config.hotkey,
          features: ["voice_control", "applescript", "hotkeys", "menu_bar", "shortcuts"],
        }),
      });
      const data = await res.json();
      setGeneratedData(data);
    } catch (err) {
      console.error("Failed to generate local agent:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateLocalAgentFiles();
  }, [config.agentName, config.wakeWord, config.hotkey]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner Bento Tile */}
      <div className="bg-[#121212] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 z-10 relative">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Apple className="w-5 h-5 text-white" />
              <h1 className="text-lg font-bold text-[#E0E0E0] font-mono tracking-wide">
                macOS NATIVE JARVIS DAEMON BUILDER
              </h1>
            </div>
            <p className="text-xs text-white/50 max-w-2xl leading-relaxed">
              Export and run a real background AI daemon on your Mac. Controls Spotify, Apple Music, Reminders, Finder, and Terminal with voice triggers and global hotkeys powered by Gemini 3.7.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => generateLocalAgentFiles()}
              disabled={loading}
              className="bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,209,255,0.3)] flex items-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" />
              <span>{loading ? "Compiling..." : "Recompile Daemon"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Settings Bento Tile */}
        <div className="lg:col-span-1 bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
            <Settings className="w-4 h-4 text-[#00D1FF]" />
            <h2 className="text-xs font-semibold text-[#E0E0E0] font-mono uppercase tracking-wider">DAEMON CONFIGURATION</h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Agent Name */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Agent Identity Name</label>
              <input
                type="text"
                value={config.agentName}
                onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              />
            </div>

            {/* Wake Word */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Microphone Wake Word</label>
              <input
                type="text"
                value={config.wakeWord}
                onChange={(e) => setConfig({ ...config, wakeWord: e.target.value })}
                placeholder="e.g. hey jarvis"
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              />
            </div>

            {/* Global Hotkey */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Global macOS Hotkey Trigger</label>
              <select
                aria-label="Global macOS Hotkey Trigger"
                value={config.hotkey}
                onChange={(e) => setConfig({ ...config, hotkey: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              >
                <option value="Option+Space">⌥ Option + Space</option>
                <option value="Command+Shift+J">⌘ Command + Shift + J</option>
                <option value="Control+Space">⌃ Control + Space</option>
                <option value="F13">Custom Function Key (F13)</option>
              </select>
            </div>

            {/* Voice Engine */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">macOS Voice Output Engine</label>
              <select
                aria-label="macOS Voice Output Engine"
                value={config.voiceGender}
                onChange={(e: any) => setConfig({ ...config, voiceGender: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              >
                <option value="Kyoko (Japanese Anime)">🌸 Kyoko / Aoi (Japanese Anime Tyan Voice)</option>
                <option value="Victoria (High Pitch Kawaii)">✨ Victoria (High-Pitch Cute English)</option>
                <option value="Daniel (British)">Daniel (British English - Tony Stark Authentic)</option>
                <option value="Samantha (US)">Samantha (macOS American Voice)</option>
                <option value="Karen (AU)">Karen (Australian English)</option>
                <option value="Alex (Classic)">Alex (Classic Natural Pitch)</option>
              </select>
            </div>

            {/* Preferred Media Player */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Preferred Media Player Target</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, preferredMusicApp: "Spotify" })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    config.preferredMusicApp === "Spotify"
                      ? "bg-[#34C759]/10 border-[#34C759]/40 text-[#34C759] font-bold"
                      : "bg-[#1A1A1A] border-white/10 text-white/50"
                  }`}
                >
                  Spotify
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, preferredMusicApp: "Music" })}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    config.preferredMusicApp === "Music"
                      ? "bg-pink-500/10 border-pink-500/40 text-pink-300 font-bold"
                      : "bg-[#1A1A1A] border-white/10 text-white/50"
                  }`}
                >
                  Apple Music
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center space-x-2 cursor-pointer text-white/70">
                <input
                  type="checkbox"
                  checked={config.autoStartOnBoot}
                  onChange={(e) => setConfig({ ...config, autoStartOnBoot: e.target.checked })}
                  className="rounded border-white/20 text-[#00D1FF] focus:ring-[#00D1FF] bg-[#1A1A1A]"
                />
                <span>Auto-launch on Mac Boot (LaunchAgent)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-white/70">
                <input
                  type="checkbox"
                  checked={config.enableShortcutsBridge}
                  onChange={(e) => setConfig({ ...config, enableShortcutsBridge: e.target.checked })}
                  className="rounded border-white/20 text-[#00D1FF] focus:ring-[#00D1FF] bg-[#1A1A1A]"
                />
                <span>Enable Apple Shortcuts CLI Bridge</span>
              </label>
            </div>
          </div>

          {/* Permissions Warning Checklist */}
          <div className="bg-[#050505] rounded-2xl p-3.5 border border-amber-500/20 text-amber-300 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>macOS Permissions Needed:</span>
            </div>
            <ul className="text-[11px] space-y-1 text-white/40 list-disc list-inside">
              <li>Accessibility (for hotkeys & window automation)</li>
              <li>Microphone (for voice speech input)</li>
              <li>Automation (System Events, Spotify, Reminders)</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Code Viewer & Setup Walkthrough Bento Tile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generated Code Viewer */}
          <div className="bg-[#121212] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="bg-[#1A1A1A] px-4 py-2.5 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-1 font-mono text-xs">
                <button
                  onClick={() => setActiveCodeTab("python")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeCodeTab === "python"
                      ? "bg-white/15 text-white border border-white/20 font-semibold"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  jarvis.py (Main Daemon)
                </button>
                <button
                  onClick={() => setActiveCodeTab("install")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeCodeTab === "install"
                      ? "bg-white/15 text-white border border-white/20 font-semibold"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  install.sh (Auto Setup)
                </button>
                <button
                  onClick={() => setActiveCodeTab("plist")}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeCodeTab === "plist"
                      ? "bg-white/15 text-white border border-white/20 font-semibold"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  LaunchAgent (.plist)
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 font-mono text-xs">
                <button
                  onClick={() => {
                    const text =
                      activeCodeTab === "python"
                        ? generatedData?.pythonScript
                        : activeCodeTab === "install"
                        ? generatedData?.installSh
                        : generatedData?.launchAgentPlist;
                    if (text) handleCopy(text, activeCodeTab);
                  }}
                  className="flex items-center space-x-1 bg-white/5 hover:bg-white/10 text-white/80 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                >
                  {copiedKey === activeCodeTab ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === activeCodeTab ? "Copied!" : "Copy Code"}</span>
                </button>

                <button
                  onClick={() => {
                    if (activeCodeTab === "python" && generatedData?.pythonScript) {
                      handleDownload("jarvis.py", generatedData.pythonScript);
                    } else if (activeCodeTab === "install" && generatedData?.installSh) {
                      handleDownload("install.sh", generatedData.installSh);
                    } else if (activeCodeTab === "plist" && generatedData?.launchAgentPlist) {
                      handleDownload("com.user.jarvisagent.plist", generatedData.launchAgentPlist);
                    }
                  }}
                  className="flex items-center space-x-1 bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm shadow-[#00D1FF]/30 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 bg-[#050505] max-h-[380px] overflow-y-auto font-mono text-xs text-[#00D1FF]/90">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {activeCodeTab === "python" && (generatedData?.pythonScript || "Generating jarvis.py...")}
                {activeCodeTab === "install" && (generatedData?.installSh || "Generating install.sh...")}
                {activeCodeTab === "plist" && (generatedData?.launchAgentPlist || "Generating com.user.jarvisagent.plist...")}
              </pre>
            </div>
          </div>

          {/* Step-by-Step 3-Minute macOS Installation Guide */}
          <div className="bg-[#121212] rounded-3xl border border-white/10 p-6 space-y-4 shadow-2xl font-sans">
            <h3 className="text-xs font-semibold text-[#E0E0E0] font-mono flex items-center space-x-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
              <span>3-STEP TERMINAL INSTALLATION ON YOUR MAC</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* Step 1 */}
              <div className="bg-[#050505] p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[#00D1FF] font-semibold">
                  <span>Step 1: Set Gemini API Key in your Mac Terminal</span>
                  <button
                    onClick={() => handleCopy('export GEMINI_API_KEY="your-api-key-here"', "step1")}
                    className="text-white/40 hover:text-white"
                  >
                    {copiedKey === "step1" ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="bg-[#121212] p-2.5 rounded-xl text-[#00D1FF] overflow-x-auto border border-white/5">
                  <code>export GEMINI_API_KEY=&quot;your-api-key-here&quot;</code>
                </div>
                <p className="text-[11px] text-white/40 font-sans">
                  Tip: Add this to your <code className="text-[#00D1FF]">~/.zshrc</code> file so it persists on reboot.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#050505] p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[#00D1FF] font-semibold">
                  <span>Step 2: Run Auto-Installer Script</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `curl -fsSL https://raw.githubusercontent.com/user/jarvis/main/install.sh | bash`,
                        "step2"
                      )
                    }
                    className="text-white/40 hover:text-white"
                  >
                    {copiedKey === "step2" ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="bg-[#121212] p-2.5 rounded-xl text-[#00D1FF] overflow-x-auto border border-white/5">
                  <code>bash install.sh</code>
                </div>
                <p className="text-[11px] text-white/40 font-sans">
                  This installs Homebrew, Python, pyttsx3, SpeechRecognition, PyObjC, and creates a standalone virtualenv.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#050505] p-3.5 rounded-2xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[#00D1FF] font-semibold">
                  <span>Step 3: Launch Jarvis in Background</span>
                  <button
                    onClick={() => handleCopy(`~/.jarvis_macos/run_jarvis.sh`, "step3")}
                    className="text-white/40 hover:text-white"
                  >
                    {copiedKey === "step3" ? <Check className="w-3 h-3 text-[#34C759]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="bg-[#121212] p-2.5 rounded-xl text-[#00D1FF] overflow-x-auto border border-white/5">
                  <code>~/.jarvis_macos/run_jarvis.sh</code>
                </div>
                <p className="text-[11px] text-white/40 font-sans">
                  Jarvis will speak: &quot;JARVIS online and standing by, Sir.&quot; Say &quot;{config.wakeWord}&quot; anytime!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

