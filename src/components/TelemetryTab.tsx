import React, { useState } from "react";
import {
  Cpu,
  HardDrive,
  Battery,
  Wifi,
  Activity,
  Shield,
  RefreshCw,
  Zap,
  Gauge,
  Layers,
  Thermometer,
  Sparkles,
} from "lucide-react";
import { SystemTelemetry } from "../types";

interface TelemetryTabProps {
  telemetry: SystemTelemetry | null;
  onRefreshTelemetry: () => void;
  onRunDiagnostic: (type: string) => void;
}

export const TelemetryTab: React.FC<TelemetryTabProps> = ({
  telemetry,
  onRefreshTelemetry,
  onRunDiagnostic,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeDiagnostic, setActiveDiagnostic] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshTelemetry();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleDiagnosticClick = (type: string, label: string) => {
    setActiveDiagnostic(label);
    onRunDiagnostic(type);
    setTimeout(() => setActiveDiagnostic(null), 3000);
  };

  if (!telemetry) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-white/40 font-mono">
        <Cpu className="w-10 h-10 text-[#00D1FF] animate-spin mx-auto mb-3" />
        <p>Connecting to System Telemetry Bridge...</p>
      </div>
    );
  }

  const isWindows = telemetry.osMode === "windows";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner Bento Tile */}
      <div className="bg-[#121212] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />
        <div className="z-10">
          <div className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-[#00D1FF]" />
            <h1 className="text-lg font-bold text-[#E0E0E0] font-mono tracking-wide">
              {isWindows
                ? "WINDOWS 11 HARDWARE & SYSTEM TELEMETRY"
                : "macOS HARDWARE & SYSTEM TELEMETRY"}
            </h1>
          </div>
          <p className="text-xs text-white/50 max-w-xl mt-1">
            {isWindows && telemetry.windows
              ? `Real-time diagnostics for ${telemetry.windows.hostname} (${telemetry.windows.edition}) • ${telemetry.cpu.chip}`
              : `Real-time diagnostics for ${telemetry.macOS.hostname} (${telemetry.macOS.version}) • ${telemetry.cpu.chip}`}
          </p>
        </div>

        <div className="flex items-center space-x-2 z-10">
          <button
            onClick={handleRefresh}
            className="bg-[#1A1A1A] hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono px-3.5 py-2 rounded-xl border border-white/10 transition-all flex items-center space-x-1.5 shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00D1FF] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Обновить метрики</span>
          </button>
        </div>
      </div>

      {/* Main 4 Metric Cards - Bento Quad Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CPU & Thermal */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 space-y-3 shadow-xl font-mono relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#00D1FF]" />
              <span>{isWindows ? "CPU Load (x64)" : "Silicon Load (ARM64)"}</span>
            </span>
            <span className="text-[10px] text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded border border-[#34C759]/30">
              {telemetry.cpu.cores} Cores
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#E0E0E0]">{telemetry.cpu.load}%</span>
            <span className="text-xs text-[#00D1FF]">Utilization</span>
          </div>

          <div className="w-full bg-[#050505] rounded-full h-1.5 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-[#00D1FF] to-[#0047FF] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(telemetry.cpu.load, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
            <span className="flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Temp: {telemetry.cpu.temp}</span>
            </span>
            <span className="text-[#34C759]">Nominal</span>
          </div>
        </div>

        {/* Memory Pressure */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 space-y-3 shadow-xl font-mono relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>{isWindows ? "RAM (DDR5 / DDR4)" : "Unified Memory"}</span>
            </span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              {telemetry.memory.percentage}%
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#E0E0E0]">{telemetry.memory.used}</span>
            <span className="text-xs text-white/40">of {telemetry.memory.total}</span>
          </div>

          <div className="w-full bg-[#050505] rounded-full h-1.5 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${telemetry.memory.percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
            <span>Status: {telemetry.memory.pressure}</span>
            <span className="text-[#34C759]">{isWindows ? "Pagefile: OK" : "Swap: 0 MB"}</span>
          </div>
        </div>

        {/* Drive Storage */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 space-y-3 shadow-xl font-mono relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest flex items-center space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span>{isWindows ? "NVMe SSD (NTFS)" : "APFS SSD"}</span>
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {telemetry.storage.percentage}%
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#E0E0E0]">{telemetry.storage.free}</span>
            <span className="text-xs text-white/40">Free</span>
          </div>

          <div className="w-full bg-[#050505] rounded-full h-1.5 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${telemetry.storage.percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
            <span>Used: {telemetry.storage.used}</span>
            <span>Total: {telemetry.storage.total}</span>
          </div>
        </div>

        {/* Battery & Power */}
        <div className="bg-[#121212] rounded-2xl border border-white/10 p-5 space-y-3 shadow-xl font-mono relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/40 uppercase tracking-widest flex items-center space-x-1.5">
              <Battery className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Power Mode</span>
            </span>
            <span className="text-[10px] text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded border border-[#34C759]/30">
              {telemetry.battery.isCharging ? "AC Power" : "Discharging"}
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#E0E0E0]">{telemetry.battery.level}%</span>
            <span className="text-xs text-[#34C759]">⚡ High Performance</span>
          </div>

          <div className="w-full bg-[#050505] rounded-full h-1.5 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-[#34C759] to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${telemetry.battery.level}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
            <span>Health: {telemetry.battery.health}</span>
            <span>Mode: {telemetry.battery.timeRemaining}</span>
          </div>
        </div>
      </div>

      {/* Process Table & Diagnostic Actions Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Daemons & Processes Table */}
        <div className="lg:col-span-2 bg-[#121212] rounded-3xl border border-white/10 p-5 shadow-2xl font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#E0E0E0]">
              <Layers className="w-4 h-4 text-[#00D1FF]" />
              <span>
                {isWindows
                  ? "WINDOWS TASK MANAGER & RUNNING PROCESSES"
                  : "ACTIVE DAEMONS & macOS PROCESSES"}
              </span>
            </div>
            <span className="text-[10px] text-white/30">
              {isWindows ? "Get-Process | Select Id, Name, CPU, WS" : "ps -eo pid,pcpu,pmem,comm"}
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-white/40 border-b border-white/5 text-[10px] uppercase tracking-wider">
                  <th className="pb-2">PID</th>
                  <th className="pb-2">Process Name</th>
                  <th className="pb-2">CPU</th>
                  <th className="pb-2">Memory</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {telemetry.processes.map((p) => (
                  <tr key={p.pid} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 text-white/40">{p.pid}</td>
                    <td className="py-2.5 font-semibold text-[#E0E0E0]">{p.name}</td>
                    <td className="py-2.5 text-[#00D1FF]">{p.cpu}</td>
                    <td className="py-2.5 text-purple-300">{p.memory}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          p.status === "Running" || p.status === "Active"
                            ? "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/30"
                            : p.status === "System"
                            ? "bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/30"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Diagnostic Triggers */}
        <div className="lg:col-span-1 bg-[#121212] rounded-3xl border border-white/10 p-5 space-y-4 shadow-2xl font-mono text-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-[#E0E0E0]">OPTIMIZATION PROTOCOLS</h3>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() =>
                handleDiagnosticClick(
                  isWindows ? "powershell_cleanup" : "purge_memory",
                  isWindows ? "Windows RAM & Standby List Clean" : "Purging Inactive Memory Cache"
                )
              }
              className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 hover:border-white/15 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white/80 group-hover:text-[#00D1FF]">
                  {isWindows ? "Clear Standby RAM List" : "Purge Inactive RAM Cache"}
                </span>
                <span className="text-[10px] text-[#00D1FF]">
                  {isWindows ? "Clear-RecycleBin" : "sudo purge"}
                </span>
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-sans">
                {isWindows
                  ? "Освобождает рабочие наборы памяти и очищает временные буферы."
                  : "Frees dirty system cache pages and unreferenced RAM allocations."}
              </p>
            </button>

            <button
              onClick={() =>
                handleDiagnosticClick(
                  isWindows ? "disk_cleanup" : "check_disk_clutter",
                  isWindows ? "Windows Disk Cleanup (cleanmgr)" : "Scanning Storage Hogs"
                )
              }
              className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 hover:border-white/15 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white/80 group-hover:text-[#00D1FF]">
                  {isWindows ? "Run Windows Disk Cleanup" : "Scan Large Files (>500MB)"}
                </span>
                <span className="text-[10px] text-[#00D1FF]">
                  {isWindows ? "cleanmgr.exe" : "mdfind"}
                </span>
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-sans">
                {isWindows
                  ? "Удаляет старые кеши обновлений Windows и временные файлы."
                  : "Locates forgotten disk hogs in Downloads and Caches folders."}
              </p>
            </button>

            <button
              onClick={() =>
                handleDiagnosticClick(
                  isWindows ? "restart_audio_win" : "restart_coreaudio",
                  isWindows ? "Restart Windows Audio Service" : "Resetting CoreAudio Daemon"
                )
              }
              className="w-full bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/5 hover:border-white/15 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white/80 group-hover:text-[#00D1FF]">
                  {isWindows ? "Restart Windows Audio Service" : "Restart CoreAudio Engine"}
                </span>
                <span className="text-[10px] text-[#00D1FF]">
                  {isWindows ? "Restart-Service Audiosrv" : "killall coreaudiod"}
                </span>
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-sans">
                {isWindows
                  ? "Перезапускает аудио-драйвер Windows при задержках или сбоях звука."
                  : "Fixes crackling audio, AirPods latency, or microphone input stalls."}
              </p>
            </button>
          </div>

          {activeDiagnostic && (
            <div className="bg-[#34C759]/10 border border-[#34C759]/30 p-2.5 rounded-xl text-[#34C759] flex items-center space-x-2 text-[11px] animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Выполнено: {activeDiagnostic}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
