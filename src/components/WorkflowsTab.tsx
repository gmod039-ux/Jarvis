import React, { useState } from "react";
import {
  Workflow,
  Play,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Sunrise,
  Code2,
  BatteryCharging,
  Video,
  ChevronRight,
  Terminal,
} from "lucide-react";
import { WorkflowRoutine } from "../types";
import { PREBUILT_ROUTINES } from "../data/workflowsAndLibrary";

export const WorkflowsTab: React.FC = () => {
  const [routines, setRoutines] = useState<WorkflowRoutine[]>(PREBUILT_ROUTINES);
  const [selectedRoutine, setSelectedRoutine] = useState<WorkflowRoutine>(PREBUILT_ROUTINES[0]);
  const [runningRoutineId, setRunningRoutineId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Custom Routine Modal state
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customSteps, setCustomSteps] = useState([
    { title: "Set Volume to 60%", type: "applescript" as const, command: "osascript -e 'set volume output volume 60'", expectedOutput: "Volume updated." },
    { title: "Open Workspace App", type: "terminal" as const, command: "open -a 'Visual Studio Code'", expectedOutput: "App launched." },
  ]);

  const getRoutineIcon = (iconName: string) => {
    switch (iconName) {
      case "Sunrise":
        return <Sunrise className="w-5 h-5 text-amber-400" />;
      case "Zap":
        return <Zap className="w-5 h-5 text-[#00D1FF]" />;
      case "Code2":
        return <Code2 className="w-5 h-5 text-[#34C759]" />;
      case "BatteryCharging":
        return <BatteryCharging className="w-5 h-5 text-lime-400" />;
      case "Video":
        return <Video className="w-5 h-5 text-purple-400" />;
      default:
        return <Workflow className="w-5 h-5 text-[#00D1FF]" />;
    }
  };

  const runRoutineSimulation = async (routine: WorkflowRoutine) => {
    if (runningRoutineId) return;
    setRunningRoutineId(routine.id);
    setExecutionLogs([]);
    setActiveStepIndex(0);

    for (let i = 0; i < routine.steps.length; i++) {
      setActiveStepIndex(i);
      const step = routine.steps[i];
      setExecutionLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ▶ Step ${i + 1}: ${step.title}...`,
      ]);

      // Simulate execution time
      await new Promise((res) => setTimeout(res, 850));

      setExecutionLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}]   ↳ Command: ${step.command}`,
        `[${new Date().toLocaleTimeString()}]   ✔ Output: ${step.expectedOutput}`,
      ]);
    }

    setActiveStepIndex(-1);
    setRunningRoutineId(null);
    setExecutionLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ✨ Routine "${routine.name}" completed with 0 errors.`,
    ]);
  };

  const handleCopyScript = (routine: WorkflowRoutine) => {
    const scriptContent = `#!/usr/bin/env bash
# =========================================================
#  JARVIS Routine: ${routine.name}
# =========================================================
set -e
echo "🚀 Executing ${routine.name}..."

${routine.steps.map((s) => `# ${s.title}\n${s.command}\n`).join("\n")}

echo "✨ ${routine.name} finished successfully."
`;
    navigator.clipboard.writeText(scriptContent);
    setCopiedId(routine.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCommandFile = (routine: WorkflowRoutine) => {
    const scriptContent = `#!/usr/bin/env bash
# =========================================================
#  JARVIS Executable Routine: ${routine.name}
# =========================================================
set -e
echo "🚀 Running ${routine.name}..."

${routine.steps.map((s) => `# Step: ${s.title}\n${s.command}\n`).join("\n")}

echo "✨ Completed!"
`;
    const blob = new Blob([scriptContent], { type: "application/x-sh" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${routine.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.command`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveCustomRoutine = () => {
    if (!customName.trim()) return;
    const newRoutine: WorkflowRoutine = {
      id: `custom-${Date.now()}`,
      name: customName,
      description: customDesc || "Custom automated macOS routine created in Jarvis Studio.",
      icon: "Zap",
      category: "productivity",
      steps: customSteps.map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title,
        type: s.type,
        command: s.command,
        expectedOutput: s.expectedOutput,
      })),
    };
    setRoutines([newRoutine, ...routines]);
    setSelectedRoutine(newRoutine);
    setIsCreatingCustom(false);
    setCustomName("");
    setCustomDesc("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner Bento Tile */}
      <div className="bg-[#121212] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />
        <div className="z-10">
          <div className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-[#00D1FF]" />
            <h1 className="text-lg font-bold text-[#E0E0E0] font-mono tracking-wide">
              macOS AUTONOMOUS WORKFLOW MATRIX
            </h1>
          </div>
          <p className="text-xs text-white/50 max-w-2xl mt-1 leading-relaxed">
            Multi-stage autonomous routines chaining AppleScript, Terminal commands, and Apple Shortcuts. Run live or export as double-clickable macOS <code className="text-[#00D1FF]">.command</code> files.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingCustom(true)}
          className="bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] text-xs font-mono font-bold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(0,209,255,0.3)] flex items-center space-x-2 shrink-0 active:scale-95 z-10"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Routine</span>
        </button>
      </div>

      {/* Routine Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Routine List Bento Card */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">
            Active macOS Routines ({routines.length})
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1 no-scrollbar">
            {routines.map((routine) => {
              const isSelected = selectedRoutine.id === routine.id;
              const isRunning = runningRoutineId === routine.id;

              return (
                <div
                  key={routine.id}
                  onClick={() => setSelectedRoutine(routine)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white/10 border-white/20 shadow-xl ring-1 ring-[#00D1FF]/30"
                      : "bg-[#121212] border-white/10 hover:border-white/20 text-white/50 hover:text-white/80"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-[#1A1A1A] border border-white/10">
                        {getRoutineIcon(routine.icon)}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#E0E0E0] font-mono">{routine.name}</h4>
                        <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">
                          {routine.category} • {routine.steps.length} Steps
                        </span>
                      </div>
                    </div>

                    {isRunning && (
                      <span className="flex items-center space-x-1 text-[#34C759] text-[10px] font-mono animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                        <span>RUNNING</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {routine.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Routine Pipeline Bento Tile */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-[#121212] rounded-3xl border border-white/10 p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bento-dot-grid opacity-5 pointer-events-none" />

            {/* Header of selected routine */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3 z-10 relative">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-xl bg-[#1A1A1A] border border-white/10">
                    {getRoutineIcon(selectedRoutine.icon)}
                  </div>
                  <h3 className="text-sm font-bold text-[#E0E0E0] font-mono">{selectedRoutine.name}</h3>
                </div>
                <p className="text-xs text-white/50">{selectedRoutine.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
                <button
                  onClick={() => runRoutineSimulation(selectedRoutine)}
                  disabled={runningRoutineId !== null}
                  className="bg-[#34C759] hover:bg-[#34C759]/80 disabled:opacity-50 text-[#050505] font-bold px-3.5 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-[0_0_12px_rgba(52,199,89,0.3)] transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{runningRoutineId === selectedRoutine.id ? "Running..." : "Test Run"}</span>
                </button>

                <button
                  onClick={() => handleCopyScript(selectedRoutine)}
                  className="bg-[#1A1A1A] hover:bg-white/10 text-white/80 px-3 py-1.5 rounded-xl border border-white/10 transition-colors flex items-center space-x-1"
                >
                  {copiedId === selectedRoutine.id ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === selectedRoutine.id ? "Copied" : "Copy Bash"}</span>
                </button>

                <button
                  onClick={() => handleDownloadCommandFile(selectedRoutine)}
                  className="bg-[#00D1FF] hover:bg-[#00D1FF]/80 text-[#050505] font-bold px-3 py-1.5 rounded-xl transition-colors shadow-sm shadow-[#00D1FF]/30 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.command</span>
                </button>
              </div>
            </div>

            {/* Step-by-Step Pipeline View */}
            <div className="space-y-3 z-10 relative">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Execution Pipeline ({selectedRoutine.steps.length} Steps)
              </div>

              <div className="space-y-2.5">
                {selectedRoutine.steps.map((step, idx) => {
                  const isActive = activeStepIndex === idx;
                  const isCompleted = activeStepIndex > idx || (activeStepIndex === -1 && executionLogs.length > 0);

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all font-mono text-xs ${
                        isActive
                          ? "bg-[#00D1FF]/10 border-[#00D1FF]/50 ring-2 ring-[#00D1FF]/20 shadow-md"
                          : isCompleted
                          ? "bg-[#34C759]/5 border-[#34C759]/30 text-white/80"
                          : "bg-white/5 border-white/5 text-white/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isActive
                                ? "bg-[#00D1FF] text-black animate-spin-slow"
                                : isCompleted
                                ? "bg-[#34C759] text-black"
                                : "bg-white/10 text-white/70"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </span>
                          <span className="font-semibold text-[#E0E0E0]">{step.title}</span>
                        </div>
                        <span className="text-[10px] text-[#00D1FF] bg-[#00D1FF]/10 px-2 py-0.5 rounded border border-[#00D1FF]/20">
                          {step.type}
                        </span>
                      </div>

                      <div className="bg-[#050505] p-2 rounded-lg text-[#00D1FF] text-[11px] overflow-x-auto my-1 border border-white/5">
                        <code>{step.command}</code>
                      </div>

                      <div className="text-[10px] text-white/40 flex items-center space-x-1">
                        <span>Expected Result:</span>
                        <span className="text-white/70">{step.expectedOutput}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Execution Simulation Logs */}
            {executionLogs.length > 0 && (
              <div className="bg-[#050505] rounded-2xl p-4 border border-white/10 space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto z-10 relative">
                <div className="text-[10px] text-white/40 uppercase tracking-widest pb-1 border-b border-white/5 flex items-center space-x-1">
                  <Terminal className="w-3 h-3 text-[#00D1FF]" />
                  <span>Real-Time Simulation Terminal</span>
                </div>
                {executionLogs.map((log, i) => (
                  <div key={i} className="text-white/70 text-[11px] leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Creating Custom Routine */}
      {isCreatingCustom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/15 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#E0E0E0] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#00D1FF]" />
                <span>Create Custom macOS Routine</span>
              </h3>
              <button onClick={() => setIsCreatingCustom(false)} className="text-white/40 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-white/40 block mb-1 text-[11px]">Routine Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Video Recording Studio Prep"
                  className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl p-2.5 text-white/90 outline-none"
                />
              </div>

              <div>
                <label className="text-white/40 block mb-1 text-[11px]">Description</label>
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="e.g. Closes notifications, launches OBS, sets screen resolution"
                  className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#00D1FF]/50 rounded-xl p-2.5 text-white/90 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/40 block text-[11px]">Steps</label>
                {customSteps.map((step, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#00D1FF] font-bold">Step {i + 1}</span>
                      {customSteps.length > 1 && (
                        <button
                          onClick={() => setCustomSteps(customSteps.filter((_, idx) => idx !== i))}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const copy = [...customSteps];
                        copy[i].title = e.target.value;
                        setCustomSteps(copy);
                      }}
                      placeholder="Step Title (e.g. Set Volume)"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg p-2 text-white/90"
                    />
                    <input
                      type="text"
                      value={step.command}
                      onChange={(e) => {
                        const copy = [...customSteps];
                        copy[i].command = e.target.value;
                        setCustomSteps(copy);
                      }}
                      placeholder="Command (e.g. osascript -e 'set volume output volume 50')"
                      className="w-full bg-[#050505] border border-white/10 rounded-lg p-2 text-[#00D1FF]"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCustomSteps([
                      ...customSteps,
                      { title: "New Step", type: "applescript", command: "echo 'Action'", expectedOutput: "Done." },
                    ])
                  }
                  className="w-full py-2 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-[#00D1FF] hover:border-[#00D1FF]/50 flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Next Step</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsCreatingCustom(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomRoutine}
                disabled={!customName.trim()}
                className="px-4 py-2 rounded-xl bg-[#00D1FF] hover:bg-[#00D1FF]/80 disabled:opacity-50 text-[#050505] font-bold"
              >
                Save & Add Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

