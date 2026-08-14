import React, { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Check,
  Terminal,
  Settings,
  Cpu,
  ShieldCheck,
  FileText,
  Play,
  Layers,
  Sparkles,
  Zap,
  Package,
} from "lucide-react";
import { NativeAgentConfig, OSMode } from "../types";

interface NativeBuilderTabProps {
  osMode?: OSMode;
  setOsMode?: (os: OSMode) => void;
}

export const NativeBuilderTab: React.FC<NativeBuilderTabProps> = ({
  osMode = "windows",
  setOsMode,
}) => {
  const [currentOs, setCurrentOs] = useState<OSMode>(osMode);

  useEffect(() => {
    setCurrentOs(osMode);
  }, [osMode]);

  const handleSelectOs = (os: OSMode) => {
    setCurrentOs(os);
    if (setOsMode) setOsMode(os);
  };

  const isWindows = currentOs === "windows";

  const [config, setConfig] = useState<NativeAgentConfig>({
    osTarget: currentOs,
    agentName: "JARVIS",
    wakeWord: "hey jarvis",
    hotkey: isWindows ? "Ctrl+Shift+J" : "Option+Space",
    preferredMusicApp: "Spotify",
    preferredBrowser: isWindows ? "Microsoft Edge" : "Safari",
    voiceSpeed: 180,
    voiceGender: isWindows ? "Microsoft Irina (Russian Win11)" : "Daniel (British)",
    autoStartOnBoot: true,
    enableShortcutsBridge: true,
    packageAsExe: true,
  });

  const [generatedData, setGeneratedData] = useState<{
    pythonScript: string;
    startBat?: string;
    installPs1?: string;
    installSh?: string;
    launchAgentPlist?: string;
    exeBuildCommands?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<string>(isWindows ? "bat" : "python");

  const generateLocalAgentFiles = async () => {
    setLoading(true);
    try {
      const endpoint = isWindows
        ? "/api/jarvis/generate-windows-agent"
        : "/api/jarvis/generate-local-agent";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: config.agentName,
          wakeWord: config.wakeWord,
          hotkey: config.hotkey,
          osTarget: currentOs,
          persona: "anime",
        }),
      });
      const data = await res.json();
      setGeneratedData(data);
      if (isWindows && activeCodeTab === "plist") {
        setActiveCodeTab("bat");
      }
    } catch (err) {
      console.error("Failed to generate local agent:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateLocalAgentFiles();
  }, [config.agentName, config.wakeWord, config.hotkey, currentOs]);

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
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">{isWindows ? "🪟" : "🍎"}</span>
              <h1 className="text-lg font-bold text-[#E0E0E0] font-mono tracking-wide">
                {isWindows
                  ? "WINDOWS 11 / 10 NATIVE AI AGENT & .EXE BUILDER"
                  : "macOS NATIVE JARVIS DAEMON BUILDER"}
              </h1>
            </div>
            <p className="text-xs text-white/60 max-w-3xl leading-relaxed">
              {isWindows
                ? "Упакуйте проект в полноценный нативный Windows EXE файл, настройте голосовой запуск через PowerShell/Batch или запустите фоновую службу Windows с интеграцией Gemini 3.7."
                : "Экспортируйте и запустите реальный фоновый демон на Mac. Управляйте Spotify, Apple Music, Reminders, Finder и терминалом с голосовым триггером и горячими клавишами."}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* OS Picker in Builder */}
            <div className="flex bg-[#181818] p-1 rounded-2xl border border-white/15">
              <button
                onClick={() => handleSelectOs("windows")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                  isWindows
                    ? "bg-[#00D1FF] text-[#050505] font-bold shadow-[0_0_12px_rgba(0,209,255,0.4)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <span>🪟 Windows (.EXE)</span>
              </button>
              <button
                onClick={() => handleSelectOs("macos")}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                  !isWindows
                    ? "bg-[#00D1FF] text-[#050505] font-bold shadow-[0_0_12px_rgba(0,209,255,0.4)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <span>🍎 macOS (Daemon)</span>
              </button>
            </div>

            <button
              onClick={() => generateLocalAgentFiles()}
              disabled={loading}
              className="bg-[#00D1FF]/20 hover:bg-[#00D1FF]/30 text-[#00D1FF] border border-[#00D1FF]/40 text-xs font-mono font-semibold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{loading ? "Генерация..." : "Обновить скрипты"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Settings */}
        <div className="lg:col-span-1 bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
            <Settings className="w-4 h-4 text-[#00D1FF]" />
            <h2 className="text-xs font-semibold text-[#E0E0E0] font-mono uppercase tracking-wider">
              {isWindows ? "ПАРАМЕТРЫ WINDOWS СБОРКИ" : "ПАРАМЕТРЫ macOS СБОРКИ"}
            </h2>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Agent Name */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Имя ассистента</label>
              <input
                type="text"
                value={config.agentName}
                onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              />
            </div>

            {/* Wake Word */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Голосовая фраза активации (Wake Word)</label>
              <input
                type="text"
                value={config.wakeWord}
                onChange={(e) => setConfig({ ...config, wakeWord: e.target.value })}
                placeholder={isWindows ? "аой тян / hey jarvis" : "hey jarvis"}
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              />
            </div>

            {/* Global Hotkey */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Горячая клавиша вызова</label>
              <input
                type="text"
                value={config.hotkey}
                onChange={(e) => setConfig({ ...config, hotkey: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              />
            </div>

            {/* Voice Engine */}
            <div>
              <label className="text-white/40 block mb-1 text-[11px]">Движок речи (Speech Engine)</label>
              <select
                value={config.voiceGender}
                onChange={(e: any) => setConfig({ ...config, voiceGender: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl px-3 py-2 text-white/90 outline-none"
              >
                {isWindows ? (
                  <>
                    <option value="Microsoft Irina (Russian Win11)">Microsoft Irina (Русский Win 11)</option>
                    <option value="Microsoft David (English US Win11)">Microsoft David (English US)</option>
                    <option value="Microsoft Zira (English US Win11)">Microsoft Zira (English US)</option>
                  </>
                ) : (
                  <>
                    <option value="Daniel (British)">Daniel (Британский JARVIS)</option>
                    <option value="Samantha (US)">Samantha (macOS Standard)</option>
                    <option value="Kyoko (Japanese Anime)">Kyoko (Аниме голос)</option>
                  </>
                )}
              </select>
            </div>

            {/* Windows 1-Click Quick Build Steps */}
            {isWindows ? (
              <div className="bg-[#181818] rounded-2xl p-3.5 border border-[#00D1FF]/20 space-y-2">
                <div className="flex items-center space-x-2 text-[#00D1FF] font-semibold text-[11px]">
                  <Package className="w-3.5 h-3.5" />
                  <span>КАК СОБРАТЬ .EXE В РЕПОЗИТОРИИ:</span>
                </div>
                <div className="text-[11px] text-white/70 space-y-1.5">
                  <p className="font-sans text-white/60">
                    В репозитории уже настроен <strong>Electron</strong> и <strong>GitHub Actions</strong>.
                  </p>
                  <code className="block bg-[#0A0A0A] p-2 rounded-lg text-[#00D1FF] select-all">
                    npm run electron:build
                  </code>
                  <p className="text-[10px] text-white/40">
                    Готовый установщик появится в папке <span className="text-white/70 font-mono">dist/</span> или <span className="text-white/70 font-mono">release/</span>!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#181818] rounded-2xl p-3.5 border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-white/80 font-semibold text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-[#00D1FF]" />
                  <span>БЫСТРЫЙ СТАРТ НА MAC:</span>
                </div>
                <code className="block bg-[#0A0A0A] p-2 rounded-lg text-[#00D1FF] text-[11px] select-all">
                  bash ~/.jarvis_macos/run_jarvis.sh
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code & Script Exporter Bento Tile */}
        <div className="lg:col-span-2 bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            {/* Tab Header & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center space-x-1.5 bg-[#181818] p-1 rounded-2xl border border-white/10">
                {isWindows ? (
                  <>
                    <button
                      onClick={() => setActiveCodeTab("bat")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCodeTab === "bat"
                          ? "bg-white/15 text-white font-semibold shadow-inner"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      start_jarvis.bat
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("python")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCodeTab === "python"
                          ? "bg-white/15 text-white font-semibold shadow-inner"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      jarvis_windows.py
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("ps1")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCodeTab === "ps1"
                          ? "bg-white/15 text-white font-semibold shadow-inner"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      install_jarvis.ps1
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("exe_guide")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCodeTab === "exe_guide"
                          ? "bg-white/15 text-[#00D1FF] font-semibold shadow-inner"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      📦 Electron .EXE
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setActiveCodeTab("python")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCodeTab === "python"
                          ? "bg-white/15 text-white font-semibold shadow-inner"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      jarvis.py
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("install")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCodeTab === "install"
                          ? "bg-white/15 text-white font-semibold shadow-inner"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      install.sh
                    </button>
                    <button
                      onClick={() => setActiveCodeTab("plist")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        activeCodeTab === "plist"
                          ? "bg-white/15 text-white font-semibold shadow-inner"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      LaunchAgent.plist
                    </button>
                  </>
                )}
              </div>

              {/* Copy & Download Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    let content = "";
                    if (isWindows) {
                      if (activeCodeTab === "bat") content = generatedData?.startBat || "";
                      else if (activeCodeTab === "ps1") content = generatedData?.installPs1 || "";
                      else if (activeCodeTab === "exe_guide") content = generatedData?.exeBuildCommands || "";
                      else content = generatedData?.pythonScript || "";
                    } else {
                      if (activeCodeTab === "install") content = generatedData?.installSh || "";
                      else if (activeCodeTab === "plist") content = generatedData?.launchAgentPlist || "";
                      else content = generatedData?.pythonScript || "";
                    }
                    handleCopy(content, activeCodeTab);
                  }}
                  className="px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#252525] border border-white/10 rounded-xl text-xs font-mono text-white/80 flex items-center space-x-1.5 transition-all"
                >
                  {copiedKey === activeCodeTab ? (
                    <Check className="w-3.5 h-3.5 text-[#34C759]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/50" />
                  )}
                  <span>{copiedKey === activeCodeTab ? "Скопировано" : "Копировать"}</span>
                </button>

                <button
                  onClick={() => {
                    if (isWindows) {
                      if (activeCodeTab === "bat") handleDownload("start_jarvis.bat", generatedData?.startBat || "");
                      else if (activeCodeTab === "ps1") handleDownload("install_jarvis.ps1", generatedData?.installPs1 || "");
                      else if (activeCodeTab === "exe_guide") handleDownload("build_exe.txt", generatedData?.exeBuildCommands || "");
                      else handleDownload("jarvis_windows.py", generatedData?.pythonScript || "");
                    } else {
                      if (activeCodeTab === "install") handleDownload("install.sh", generatedData?.installSh || "");
                      else if (activeCodeTab === "plist") handleDownload("com.user.jarvisagent.plist", generatedData?.launchAgentPlist || "");
                      else handleDownload("jarvis.py", generatedData?.pythonScript || "");
                    }
                  }}
                  className="px-3 py-1.5 bg-[#00D1FF]/20 hover:bg-[#00D1FF]/30 border border-[#00D1FF]/40 rounded-xl text-xs font-mono text-[#00D1FF] flex items-center space-x-1.5 transition-all font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Скачать</span>
                </button>
              </div>
            </div>

            {/* Code Display Window */}
            <div className="relative rounded-2xl bg-[#080808] border border-white/10 p-4 font-mono text-xs overflow-x-auto max-h-[440px] text-white/80 leading-relaxed no-scrollbar">
              <pre className="whitespace-pre">
                {isWindows
                  ? activeCodeTab === "bat"
                    ? generatedData?.startBat || "Генерация start_jarvis.bat..."
                    : activeCodeTab === "ps1"
                    ? generatedData?.installPs1 || "Генерация install_jarvis.ps1..."
                    : activeCodeTab === "exe_guide"
                    ? generatedData?.exeBuildCommands || "Загрузка инструкций по сборке .EXE..."
                    : generatedData?.pythonScript || "Генерация jarvis_windows.py..."
                  : activeCodeTab === "install"
                  ? generatedData?.installSh || "Генерация install.sh..."
                  : activeCodeTab === "plist"
                  ? generatedData?.launchAgentPlist || "Генерация plist..."
                  : generatedData?.pythonScript || "Генерация jarvis.py..."}
              </pre>
            </div>
          </div>

          {/* Bottom Security / Tip Bar */}
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-white/40">
            <div className="flex items-center space-x-1.5 text-white/60">
              <ShieldCheck className="w-3.5 h-3.5 text-[#34C759]" />
              <span>
                {isWindows
                  ? "Совместимо с Windows 11 (23H2/24H2), Windows 10, PowerShell 7 и SAPI5."
                  : "Совместимо с macOS Sequoia, Sonoma и Apple Silicon M-Series."}
              </span>
            </div>
            <span>v4.2 Cross-Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};
