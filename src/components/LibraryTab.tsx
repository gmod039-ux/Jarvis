import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Send,
  Terminal,
  FileCode,
  Tag,
  Sparkles,
} from "lucide-react";
import { SCRIPT_LIBRARY, ScriptLibraryItem } from "../data/workflowsAndLibrary";

interface LibraryTabProps {
  onExecuteScriptInConsole: (prompt: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({ onExecuteScriptInConsole }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Windows", "System", "Media & Audio", "Files & Finder", "Developer Tools"];

  const filteredScripts = SCRIPT_LIBRARY.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner Bento Tile */}
      <div className="bg-[#121212] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />
        <div className="z-10">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#00D1FF]" />
            <h1 className="text-lg font-bold text-[#E0E0E0] font-mono tracking-wide">
              POWERSHELL &amp; CROSS-PLATFORM SCRIPT VAULT
            </h1>
          </div>
          <p className="text-xs text-white/50 max-w-2xl mt-1 leading-relaxed">
            Проверенные нативные сценарии автоматизации для Windows 11 (PowerShell/CMD/Winget) и Apple Silicon macOS. Скопируйте прямо в терминал или выполните через J.A.R.V.I.S.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#1A1A1A] px-3.5 py-2 rounded-xl border border-white/10 text-xs font-mono text-[#00D1FF] shrink-0 z-10">
          <span>⚡ {SCRIPT_LIBRARY.length} Automation Recipes</span>
        </div>
      </div>

      {/* Search & Filter Bar Bento Tile */}
      <div className="bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-3.5 shadow-2xl relative overflow-hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск скриптов (например: 'PowerShell', 'winget', 'dark mode', 'ram', 'electron')..."
            className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono text-white/90 placeholder-white/30 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
          <span className="text-white/40 text-[11px] shrink-0">Категория:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-white/15 text-white border border-white/20 font-semibold"
                  : "bg-white/5 text-white/50 border border-white/5 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Script Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScripts.map((item: ScriptLibraryItem) => (
          <div
            key={item.id}
            className="bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-3 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all font-mono relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.type === "powershell"
                        ? "bg-[#00D1FF]"
                        : item.type === "cmd"
                        ? "bg-amber-400"
                        : "bg-pink-400"
                    }`}
                  />
                  <h3 className="text-xs font-bold text-[#E0E0E0] font-mono">{item.title}</h3>
                </div>
                <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded border border-white/5">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-white/50 font-sans mt-2 leading-relaxed">
                {item.description}
              </p>

              {/* Code Snippet Box */}
              <div className="mt-3 bg-[#050505] rounded-2xl p-3 border border-white/5 text-xs overflow-x-auto text-[#00D1FF]">
                <pre className="font-mono text-[11px] whitespace-pre-wrap">{item.code}</pre>
              </div>

              <div className="text-[11px] text-white/40 font-sans mt-2">
                💡 <span className="text-white/70">{item.usageNotes}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <span className="text-[10px] text-[#00D1FF]">Тип: {item.type.toUpperCase()}</span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopy(item.code, item.id)}
                  className="bg-[#1A1A1A] hover:bg-white/10 text-white/80 px-3 py-1.5 rounded-xl border border-white/10 transition-colors flex items-center space-x-1"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? "Скопировано" : "Копировать"}</span>
                </button>

                <button
                  onClick={() => onExecuteScriptInConsole(`Выполни действие: ${item.title}`)}
                  className="bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1 shadow-sm shadow-[#00D1FF]/30 active:scale-95"
                >
                  <Send className="w-3 h-3 fill-current" />
                  <span>Выполнить</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
