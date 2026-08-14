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
  type: "terminal" | "applescript" | "shortcut" | "file_op" | "telemetry";
  simulatedOutput: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: string;
}

export interface SystemTelemetry {
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
  steps: {
    stepNumber: number;
    title: string;
    type: "applescript" | "terminal" | "shortcut" | "notification";
    command: string;
    expectedOutput: string;
  }[];
}

export interface NativeAgentConfig {
  agentName: string;
  wakeWord: string;
  hotkey: string;
  preferredMusicApp: "Music" | "Spotify";
  preferredBrowser: "Safari" | "Google Chrome" | "Arc";
  voiceSpeed: number;
  voiceGender:
    | "Daniel (British)"
    | "Samantha (US)"
    | "Karen (AU)"
    | "Alex (Classic)"
    | "Kyoko (Japanese Anime)"
    | "Victoria (High Pitch Kawaii)";
  autoStartOnBoot: boolean;
  enableShortcutsBridge: boolean;
}

export type ActiveTab = "console" | "builder" | "telemetry" | "workflows" | "library";
