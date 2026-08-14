import React, { useState } from "react";
import {
  Terminal,
  Cpu,
  Volume2,
  Moon,
  Music,
  Wifi,
  Activity,
  Flame,
  FolderOpen,
  CheckSquare,
  Mic,
  Code,
  Zap,
  Command,
  Sliders,
  Clock,
  CloudRain,
  XCircle,
  Info,
  HelpCircle,
  Trash2,
  BatteryCharging,
  Search,
  Copy,
  Check,
  Play,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CONSOLE_COMMANDS, ConsoleCommandDefinition } from "../data/consoleCommands";

interface ConsoleCommandsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCommand: (cmdString: string) => void;
}

export const ConsoleCommandsModal: React.FC<ConsoleCommandsModalProps> = ({
  isOpen,
  onClose,
  onRunCommand,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ["All", "System", "Media & Audio", "Automation", "Diagnostics", "Utilities"];

  const filteredCommands = CONSOLE_COMMANDS.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      search === "" ||
      item.command.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "System":
        return "text-[#00D1FF] bg-[#00D1FF]/10 border-[#00D1FF]/30";
      case "Media & Audio":
        return "text-pink-400 bg-pink-400/10 border-pink-400/30";
      case "Automation":
        return "text-[#34C759] bg-[#34C759]/10 border-[#34C759]/30";
      case "Diagnostics":
        return "text-amber-400 bg-amber-400/10 border-amber-400/30";
      default:
        return "text-purple-400 bg-purple-400/10 border-purple-400/30";
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Cpu":
        return <Cpu className="w-4 h-4" />;
      case "Volume2":
        return <Volume2 className="w-4 h-4" />;
      case "Moon":
        return <Moon className="w-4 h-4" />;
      case "Music":
        return <Music className="w-4 h-4" />;
      case "Wifi":
        return <Wifi className="w-4 h-4" />;
      case "Activity":
        return <Activity className="w-4 h-4" />;
      case "Flame":
        return <Flame className="w-4 h-4" />;
      case "FolderOpen":
        return <FolderOpen className="w-4 h-4" />;
      case "CheckSquare":
        return <CheckSquare className="w-4 h-4" />;
      case "Mic":
        return <Mic className="w-4 h-4" />;
      case "Code":
        return <Code className="w-4 h-4" />;
      case "Zap":
        return <Zap className="w-4 h-4" />;
      case "Command":
        return <Command className="w-4 h-4" />;
      case "Sliders":
        return <Sliders className="w-4 h-4" />;
      case "Clock":
        return <Clock className="w-4 h-4" />;
      case "CloudRain":
        return <CloudRain className="w-4 h-4" />;
      case "XCircle":
        return <XCircle className="w-4 h-4" />;
      case "Info":
        return <Info className="w-4 h-4" />;
      case "BatteryCharging":
        return <BatteryCharging className="w-4 h-4" />;
      case "Trash2":
        return <Trash2 className="w-4 h-4" />;
      default:
        return <Terminal className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121212] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative font-sans">
        <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between z-10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-[#00D1FF]/20 border border-[#00D1FF]/30 flex items-center justify-center text-[#00D1FF]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#E0E0E0] font-mono flex items-center space-x-2">
                <span>J.A.R.V.I.S. CONSOLE COMMAND VAULT</span>
                <span className="text-[10px] text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-0.5 rounded-full border border-[#00D1FF]/30">
                  {CONSOLE_COMMANDS.length} Built-in Commands
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Direct terminal commands &amp; AppleScript control triggers for macOS.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-white/10 space-y-3 z-10 bg-[#151515]">
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands by name, alias, or description (e.g. 'volume', 'wifi', 'darkmode', 'spotify')..."
              className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white/90 placeholder-white/30 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-[#00D1FF] text-[#050505] font-bold shadow-[0_0_10px_rgba(0,209,255,0.3)]"
                    : "bg-white/5 text-white/50 border border-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Commands List Grid */}
        <div className="flex-1 p-5 overflow-y-auto z-10 space-y-3">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-12 text-white/40 space-y-2">
              <Terminal className="w-8 h-8 mx-auto text-white/20" />
              <p className="text-xs font-mono">No matching console commands found for &quot;{search}&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredCommands.map((item: ConsoleCommandDefinition) => (
                <div
                  key={item.command}
                  className="bg-[#181818] border border-white/10 hover:border-white/20 rounded-2xl p-4 flex flex-col justify-between transition-all space-y-3 shadow-lg group"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-lg ${getCategoryColor(item.category)}`}>
                          {getIcon(item.icon)}
                        </div>
                        <span className="font-mono text-xs font-bold text-[#00D1FF]">
                          {item.command}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 mt-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Syntax Code Pill */}
                    <div className="mt-2.5 bg-[#0A0A0A] rounded-xl p-2 border border-white/5 font-mono text-[11px] text-[#00D1FF] flex items-center justify-between">
                      <code className="truncate">{item.usage}</code>
                      <button
                        onClick={() => handleCopy(item.example, item.command)}
                        title="Copy command example"
                        className="text-white/40 hover:text-white transition-colors ml-2 shrink-0"
                      >
                        {copiedCmd === item.command ? (
                          <Check className="w-3 h-3 text-[#34C759]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {/* Aliases */}
                    {item.aliases.length > 0 && (
                      <div className="mt-2 text-[10px] font-mono text-white/30 flex items-center space-x-1.5 flex-wrap">
                        <span>Aliases:</span>
                        {item.aliases.map((a) => (
                          <span
                            key={a}
                            className="bg-white/5 px-1.5 py-0.5 rounded text-white/50 border border-white/5"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions footer */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-white/40 font-mono truncate max-w-[170px]">
                      Ex: <code className="text-white/70">{item.example}</code>
                    </span>

                    <button
                      onClick={() => {
                        onRunCommand(item.example);
                        onClose();
                      }}
                      className="bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 shadow-sm shadow-[#00D1FF]/30 active:scale-95 shrink-0"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer info */}
        <div className="p-3.5 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 z-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00D1FF]" />
            <span>Type &apos;/&apos; in console input for live autocomplete &amp; suggestions</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
