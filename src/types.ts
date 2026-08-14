export type OSMode = "windows" | "macos";

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
  actions?: ExecutedAction[];
  isVoiceInput?: boolean;
}

export interface ExecutedAction {
  id: string;
  toolName: string;
  args: Record<string, any>;
  commandString: string;
  type: "powershell" | "terminal" | "applescript" | "shortcut" | "file_op" | "telemetry" | "batch";
  simulatedOutput: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: string;
}

export interface SystemTelemetry {
  osMode?: OSMode;
  cpu: {
    chip: string;
    load: number;
    temp: string;
    cores: number;
  };
  memory: {
    used: string;
    total: string;
    percentage: number;
    pressure: string;
  };
  battery: {
    level: number;
    isCharging: boolean;
    health: string;
    timeRemaining: string;
  };
  storage: {
    used: string;
    total: string;
    free: string;
    percentage: number;
  };
  network: {
    ssid: string;
    ip: string;
    downloadSpeed: string;
    uploadSpeed: string;
    status: string;
  };
  audio: {
    outputDevice: string;
    volume: number;
    muted: boolean;
  };
  macOS: {
    version: string;
    hostname: string;
    uptime: string;
    sipStatus: string;
  };
  windows?: {
    edition: string;
    build: string;
    hostname: string;
    powershellVersion: string;
    defenderStatus: string;
    uptime: string;
  };
  processes: {
    pid: number;
    name: string;
    cpu: string;
    memory: string;
    status: string;
  }[];
}

export interface WorkflowRoutine {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "productivity" | "system" | "media" | "developer";
  osTarget?: "all" | "windows" | "macos";
  steps: {
    stepNumber: number;
    title: string;
    type: "powershell" | "applescript" | "terminal" | "shortcut" | "notification" | "batch";
    command: string;
    expectedOutput: string;
  }[];
}

export interface NativeAgentConfig {
  osTarget: OSMode;
  agentName: string;
  wakeWord: string;
  hotkey: string;
  preferredMusicApp: "Spotify" | "Music" | "Windows Media Player";
  preferredBrowser: "Google Chrome" | "Microsoft Edge" | "Safari" | "Arc" | "Firefox";
  voiceSpeed: number;
  voiceGender:
    | "Daniel (British)"
    | "Samantha (US)"
    | "Karen (AU)"
    | "Alex (Classic)"
    | "Kyoko (Japanese Anime)"
    | "Victoria (High Pitch Kawaii)"
    | "Microsoft Irina (Russian Win11)"
    | "Microsoft David (English US Win11)"
    | "Microsoft Zira (English US Win11)";
  autoStartOnBoot: boolean;
  enableShortcutsBridge: boolean;
  packageAsExe: boolean;
}

export type ActiveTab = "console" | "builder" | "telemetry" | "workflows" | "library";
