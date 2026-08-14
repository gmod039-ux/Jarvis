import { ChatMessage, ExecutedAction, SystemTelemetry } from "../types";
import { PREBUILT_ROUTINES } from "./workflowsAndLibrary";
import { jarvisVoice } from "../utils/speech";

export interface ConsoleCommandDefinition {
  command: string;
  aliases: string[];
  category: "System" | "Media & Audio" | "Automation" | "Diagnostics" | "Utilities";
  usage: string;
  description: string;
  example: string;
  icon: string;
}

export const CONSOLE_COMMANDS: ConsoleCommandDefinition[] = [
  {
    command: "/help",
    aliases: ["help", "?", "/commands", "commands"],
    category: "Utilities",
    usage: "/help [category|command]",
    description: "Display the interactive command manual, syntax guide, and available CLI tools.",
    example: "/help system",
    icon: "HelpCircle",
  },
  {
    command: "/clear",
    aliases: ["clear", "cls", "/cls"],
    category: "Utilities",
    usage: "/clear",
    description: "Clear the terminal console buffer and history feed.",
    example: "/clear",
    icon: "Trash2",
  },
  {
    command: "/telemetry",
    aliases: ["/stats", "stats", "top", "/top", "/status"],
    category: "Diagnostics",
    usage: "/telemetry",
    description: "Inspect real-time Apple Silicon CPU load, RAM pressure, APFS storage, and thermals.",
    example: "/telemetry",
    icon: "Cpu",
  },
  {
    command: "/battery",
    aliases: ["/batt", "batt", "/power", "pmset"],
    category: "Diagnostics",
    usage: "/battery",
    description: "Query battery percentage, charge status, cycle health, and time remaining (via pmset).",
    example: "/battery",
    icon: "BatteryCharging",
  },
  {
    command: "/darkmode",
    aliases: ["/dark", "darkmode", "/theme-dark", "/appearance"],
    category: "System",
    usage: "/darkmode [on|off|toggle]",
    description: "Toggle or set macOS system appearance (Dark / Light mode) via AppleScript System Events.",
    example: "/darkmode toggle",
    icon: "Moon",
  },
  {
    command: "/volume",
    aliases: ["/vol", "volume", "vol"],
    category: "Media & Audio",
    usage: "/volume <0-100 | mute | unmute | up | down>",
    description: "Set macOS master output audio volume level or toggle mute status.",
    example: "/volume 65",
    icon: "Volume2",
  },
  {
    command: "/music",
    aliases: ["/spotify", "spotify", "music", "/play", "/pause", "/next"],
    category: "Media & Audio",
    usage: "/music <play | pause | next | prev | status | track [name]>",
    description: "Dispatch Apple Events to Spotify or Apple Music to control playback & tracks.",
    example: "/music play Focus Chill",
    icon: "Music",
  },
  {
    command: "/wifi",
    aliases: ["/network", "wifi", "ip", "/ip", "/net"],
    category: "Diagnostics",
    usage: "/wifi",
    description: "Inspect active Wi-Fi SSID, local/public IP address, and interface throughput metrics.",
    example: "/wifi",
    icon: "Wifi",
  },
  {
    command: "/processes",
    aliases: ["/ps", "ps", "top-proc"],
    category: "Diagnostics",
    usage: "/processes [filter]",
    description: "List top active macOS daemons with PID, CPU %, memory footprint, and status.",
    example: "/processes Chrome",
    icon: "Activity",
  },
  {
    command: "/purge",
    aliases: ["/cleanmem", "purge", "/free-ram"],
    category: "System",
    usage: "/purge",
    description: "Execute RAM cache reclamation protocol (simulates macOS 'sudo purge').",
    example: "/purge",
    icon: "Flame",
  },
  {
    command: "/finder",
    aliases: ["/open", "finder", "/reveal"],
    category: "Automation",
    usage: "/finder <desktop | downloads | documents | clean-screenshots>",
    description: "Automate Finder actions, open key directories, or declutter desktop screenshots.",
    example: "/finder clean-screenshots",
    icon: "FolderOpen",
  },
  {
    command: "/reminder",
    aliases: ["/remind", "remind", "todo", "/todo"],
    category: "Automation",
    usage: "/reminder <task title> [due time]",
    description: "Create a new reminder item inside Apple Reminders database via AppleScript.",
    example: "/reminder Review pull request at 4 PM",
    icon: "CheckSquare",
  },
  {
    command: "/say",
    aliases: ["/speak", "say", "speak", "/tts"],
    category: "Media & Audio",
    usage: "/say <text to vocalize>",
    description: "Synthesize and speak text aloud using Jarvis' British speech synthesis engine.",
    example: "/say Systems operational and nominal, Sir.",
    icon: "Mic",
  },
  {
    command: "/eval",
    aliases: ["/applescript", "applescript", "osascript", "/osascript"],
    category: "Automation",
    usage: "/eval <raw AppleScript code>",
    description: "Execute arbitrary AppleScript code directly through the osascript bridge.",
    example: "/eval tell application \"Finder\" to set desktop picture to POSIX file \"/System/Library/Desktop Pictures/Ventura Graphic.heic\"",
    icon: "Code",
  },
  {
    command: "/zsh",
    aliases: ["/sh", "/exec", "!sh", "zsh", "bash"],
    category: "System",
    usage: "/zsh <terminal command> (or !<command>)",
    description: "Execute terminal shell commands directly in macOS Zsh environment.",
    example: "/zsh sw_vers -productVersion",
    icon: "Terminal",
  },
  {
    command: "/workflow",
    aliases: ["/run", "workflow", "/routine"],
    category: "Automation",
    usage: "/workflow <morning | focus | dev | clean | audio | list>",
    description: "Trigger pre-built multi-step automated macOS operational routines.",
    example: "/workflow morning",
    icon: "Zap",
  },
  {
    command: "/shortcuts",
    aliases: ["/shortcut", "shortcut", "shortcuts"],
    category: "Automation",
    usage: "/shortcuts run <shortcut name>",
    description: "Trigger native Apple Shortcuts workflows using the CLI 'shortcuts run' command.",
    example: "/shortcuts run \"Take Screenshot\"",
    icon: "Command",
  },
  {
    command: "/theme",
    aliases: ["/persona", "persona", "theme", "/voice"],
    category: "Utilities",
    usage: "/theme <jarvis | anime | tsundere | friday | cyberpunk | glados | minimalist>",
    description: "Switch active Jarvis neural persona & voice profile (e.g. Aoi-chan Anime Tyan, Asuka Tsundere, Friday, Jarvis).",
    example: "/theme anime",
    icon: "Sliders",
  },
  {
    command: "/uptime",
    aliases: ["uptime"],
    category: "Diagnostics",
    usage: "/uptime",
    description: "Display host macOS uptime, boot timestamp, and system load averages.",
    example: "/uptime",
    icon: "Clock",
  },
  {
    command: "/weather",
    aliases: ["weather", "/wttr"],
    category: "Utilities",
    usage: "/weather [location]",
    description: "Fetch real-time ASCII weather forecast via terminal wttr.in bridge.",
    example: "/weather Cupertino",
    icon: "CloudRain",
  },
  {
    command: "/kill",
    aliases: ["kill", "killall", "/killall"],
    category: "System",
    usage: "/kill <process_name | pid>",
    description: "Send kill/restart signals to target macOS processes (e.g. Finder, Dock, CoreAudio).",
    example: "/kill CoreAudio",
    icon: "XCircle",
  },
  {
    command: "/sysinfo",
    aliases: ["/version", "sysinfo", "version", "neofetch"],
    category: "Diagnostics",
    usage: "/sysinfo",
    description: "Display complete workstation architecture hardware identity, OS kernel, and memory stats.",
    example: "/sysinfo",
    icon: "Info",
  },
  {
    command: "/powershell",
    aliases: ["/ps", "/ps1", "powershell", "ps"],
    category: "System",
    usage: "/powershell <command>",
    description: "Execute native Windows PowerShell commands (Get-Process, Start-Process, Registry, etc.).",
    example: "/powershell Get-Process | Select-Object -First 5",
    icon: "Terminal",
  },
  {
    command: "/winget",
    aliases: ["winget", "/install"],
    category: "Automation",
    usage: "/winget <install|search|upgrade> <package>",
    description: "Execute Windows Package Manager commands to install or update Windows software.",
    example: "/winget install Spotify.Spotify",
    icon: "Download",
  },
  {
    command: "/os",
    aliases: ["/platform", "os", "platform"],
    category: "Utilities",
    usage: "/os <windows|macos|toggle>",
    description: "Switch active target operating system mode between Windows 11 and macOS.",
    example: "/os windows",
    icon: "Cpu",
  },
];

/**
 * Parses user input to check if it matches a console command.
 */
export function matchConsoleCommand(input: string): {
  isCommand: boolean;
  definition?: ConsoleCommandDefinition;
  commandName?: string;
  argsString: string;
} {
  const trimmed = input.trim();
  if (!trimmed) return { isCommand: false, argsString: "" };

  // Direct exclamation mark prefix (e.g. `!uname -a`, `!sw_vers`)
  if (trimmed.startsWith("!")) {
    const rawCmd = trimmed.substring(1).trim();
    const zshDef = CONSOLE_COMMANDS.find((c) => c.command === "/zsh");
    return {
      isCommand: true,
      definition: zshDef,
      commandName: "/zsh",
      argsString: rawCmd,
    };
  }

  const parts = trimmed.split(/\s+/);
  const firstWord = parts[0].toLowerCase();
  const argsString = parts.slice(1).join(" ").trim();

  // Look for exact command match or alias match
  const foundDef = CONSOLE_COMMANDS.find(
    (c) =>
      c.command.toLowerCase() === firstWord ||
      c.aliases.map((a) => a.toLowerCase()).includes(firstWord)
  );

  if (foundDef) {
    return {
      isCommand: true,
      definition: foundDef,
      commandName: foundDef.command,
      argsString,
    };
  }

  // If starts with `/` but no exact match, still treat as unknown command
  if (trimmed.startsWith("/")) {
    return {
      isCommand: true,
      commandName: firstWord,
      argsString,
    };
  }

  return { isCommand: false, argsString: "" };
}

export interface CommandExecutionResult {
  replyText: string;
  actions: ExecutedAction[];
  shouldSpeak?: boolean;
  setPersona?: string;
  clearHistory?: boolean;
}

/**
 * Executes a console command locally with instant feedback and accurate AppleScript/Terminal simulation
 */
export function executeBuiltInCommand(
  cmdName: string,
  args: string,
  currentTelemetry: SystemTelemetry | null,
  currentPersona: string
): CommandExecutionResult {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const actionId = `cmd-${Date.now()}`;

  switch (cmdName.toLowerCase()) {
    case "/help":
    case "help":
    case "?":
    case "/commands":
    case "commands": {
      const filter = args.toLowerCase();
      let filtered = CONSOLE_COMMANDS;
      if (filter) {
        filtered = CONSOLE_COMMANDS.filter(
          (c) =>
            c.category.toLowerCase().includes(filter) ||
            c.command.toLowerCase().includes(filter) ||
            c.description.toLowerCase().includes(filter)
        );
      }

      const categorized: Record<string, ConsoleCommandDefinition[]> = {};
      filtered.forEach((c) => {
        if (!categorized[c.category]) categorized[c.category] = [];
        categorized[c.category].push(c);
      });

      let helpMsg = "⚡ J.A.R.V.I.S. CONSOLE COMMAND MANUAL\n";
      helpMsg += "Type commands directly into the terminal or click any command below.\n\n";

      Object.entries(categorized).forEach(([cat, list]) => {
        helpMsg += `📁 [${cat.toUpperCase()}]\n`;
        list.forEach((item) => {
          helpMsg += `  • ${item.usage.padEnd(28)} - ${item.description}\n`;
        });
        helpMsg += "\n";
      });

      helpMsg += "💡 Tip: You can also prefix any bash command with '!' (e.g. '!uptime', '!df -h') or use Tab to auto-complete.";

      return {
        replyText: helpMsg,
        actions: [
          {
            id: actionId,
            toolName: "cli_manual",
            args: { filter: args || "all" },
            commandString: `man jarvis-commands ${args ? `--filter=${args}` : ""}`,
            type: "terminal",
            simulatedOutput: `Generated CLI manual index (${filtered.length} commands matched).`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: false,
      };
    }

    case "/clear":
    case "clear":
    case "cls":
    case "/cls": {
      return {
        replyText: "Console cleared, Sir.",
        actions: [],
        clearHistory: true,
        shouldSpeak: false,
      };
    }

    case "/telemetry":
    case "/stats":
    case "stats":
    case "top":
    case "/top":
    case "/status": {
      const cpu = currentTelemetry?.cpu.load ?? 24;
      const mem = currentTelemetry?.memory.used ?? "12.4 GB";
      const totalMem = currentTelemetry?.memory.total ?? "32 GB";
      const disk = currentTelemetry?.storage.free ?? "658 GB";
      const batt = currentTelemetry?.battery.level ?? 89;
      const chip = currentTelemetry?.cpu.chip ?? "Apple M3 Max (16-core)";
      const temp = currentTelemetry?.cpu.temp ?? "44°C";

      const output = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
J.A.R.V.I.S. APPLE SILICON TELEMETRY MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hardware:       ${chip}
Thermals:       ${temp} (Nominal Fan Profile)
CPU Load:       ${cpu}% [${"█".repeat(Math.round(cpu / 10))}${"░".repeat(10 - Math.round(cpu / 10))}]
Unified Memory: ${mem} / ${totalMem} (${currentTelemetry?.memory.percentage ?? 38}%)
Memory Pressure: Nominal (Green, Zero Swapping)
APFS Storage:   ${disk} Available (${currentTelemetry?.storage.used ?? "342 GB"} used)
Battery:        ${batt}% [${currentTelemetry?.battery.isCharging ? "⚡ Charging (AC Attached)" : "Battery Power"}]
Uptime:         ${currentTelemetry?.macOS.uptime ?? "4 days, 18 hours"}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      return {
        replyText: `System status update, Sir: CPU load is at ${cpu}%, Unified Memory is operating under nominal pressure with ${mem} utilized, and thermal dissipation is stable at ${temp}.`,
        actions: [
          {
            id: actionId,
            toolName: "system_telemetry",
            args: { target: "all" },
            commandString: "system_profiler SPHardwareDataType && pmset -g batt && vm_stat",
            type: "telemetry",
            simulatedOutput: output,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/battery":
    case "/batt":
    case "batt":
    case "/power":
    case "pmset": {
      const battLevel = currentTelemetry?.battery.level ?? 89;
      const isCharging = currentTelemetry?.battery.isCharging ?? true;
      const health = currentTelemetry?.battery.health ?? "100% (Normal)";
      const remaining = currentTelemetry?.battery.timeRemaining ?? "8 hrs 45 mins";

      return {
        replyText: `Battery diagnostic complete, Sir: Internal cell is at ${battLevel}%, currently ${isCharging ? "connected to 140W USB-C MagSafe" : "discharging"}, health condition is ${health}, estimated run time is ${remaining}.`,
        actions: [
          {
            id: actionId,
            toolName: "pmset_battery",
            args: { flag: "-g batt" },
            commandString: "pmset -g batt && pmset -g ps",
            type: "terminal",
            simulatedOutput: `Now drawing from '${isCharging ? "AC Power" : "Battery Power"}'\n -InternalBattery-0 (id=4821) ${battLevel}%; ${isCharging ? "charging" : "discharging"}; ${remaining} present: true\nBattery Health: ${health}\nCycle Count: 42 (Condition: Normal)`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/darkmode":
    case "/dark":
    case "darkmode":
    case "/appearance": {
      const mode = args.toLowerCase();
      let setTo = "not dark mode";
      let statusDesc = "toggled";
      if (mode === "on" || mode === "true" || mode === "enable") {
        setTo = "true";
        statusDesc = "enabled (Dark Mode)";
      } else if (mode === "off" || mode === "false" || mode === "disable") {
        setTo = "false";
        statusDesc = "disabled (Light Mode)";
      }

      const script = `tell application "System Events" to tell appearance preferences to set dark mode to ${setTo}`;

      return {
        replyText: `macOS system appearance successfully ${statusDesc}, Sir.`,
        actions: [
          {
            id: actionId,
            toolName: "set_appearance",
            args: { mode: setTo },
            commandString: `osascript -e '${script}'`,
            type: "applescript",
            simulatedOutput: `[System Events] Dark mode appearance set to: ${setTo}. UI transition completed.`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/volume":
    case "/vol":
    case "volume":
    case "vol": {
      const arg = args.toLowerCase().trim();
      let vol = 50;
      let script = "";
      let desc = "";

      if (arg === "mute") {
        script = 'set volume output muted true';
        desc = "Master audio output has been muted, Sir.";
      } else if (arg === "unmute") {
        script = 'set volume output muted false';
        desc = "Master audio output unmuted, Sir.";
      } else if (arg === "up") {
        script = 'set volume output volume ((output volume of (get volume settings)) + 10)';
        desc = "Volume increased by 10%, Sir.";
      } else if (arg === "down") {
        script = 'set volume output volume ((output volume of (get volume settings)) - 10)';
        desc = "Volume decreased by 10%, Sir.";
      } else {
        const num = parseInt(arg, 10);
        vol = isNaN(num) ? 50 : Math.max(0, Math.min(100, num));
        script = `set volume output volume ${vol}`;
        desc = `Master audio output calibrated to ${vol}%, Sir.`;
      }

      return {
        replyText: desc,
        actions: [
          {
            id: actionId,
            toolName: "adjust_volume",
            args: { level: vol, command: arg },
            commandString: `osascript -e '${script}'`,
            type: "applescript",
            simulatedOutput: `[CoreAudio] Dispatched audio level adjustment. Return: 0 (OK).`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/music":
    case "/spotify":
    case "spotify":
    case "music":
    case "/play":
    case "/pause":
    case "/next": {
      const action = (cmdName.startsWith("/p") || cmdName.startsWith("/n") ? cmdName.substring(1) : args || "play").toLowerCase();
      let script = "";
      let reply = "";

      if (action.includes("pause") || action.includes("stop")) {
        script = 'tell application "Spotify" to pause\ntell application "Music" to pause';
        reply = "Playback paused on all media engines, Sir.";
      } else if (action.includes("next") || action.includes("skip")) {
        script = 'tell application "Spotify" to next track\ntell application "Music" to next track';
        reply = "Advancing to next track, Sir.";
      } else if (action.includes("prev") || action.includes("back")) {
        script = 'tell application "Spotify" to previous track\ntell application "Music" to previous track';
        reply = "Returning to previous track, Sir.";
      } else if (action.startsWith("track ") || action.startsWith("play ")) {
        const trackName = action.replace(/^(track|play)\s+/, "");
        script = `tell application "Spotify" to play track "${trackName}"`;
        reply = `Queuing track "${trackName}" on media subsystem, Sir.`;
      } else {
        script = 'tell application "Spotify" to play';
        reply = "Resuming media playback, Sir.";
      }

      return {
        replyText: reply,
        actions: [
          {
            id: actionId,
            toolName: "media_control",
            args: { action },
            commandString: `osascript -e '${script.replace(/\n/g, " -e ")}'`,
            type: "applescript",
            simulatedOutput: `[Apple Events] Sent media playback dispatch '${action}' to Spotify/Music. State: Active.`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/wifi":
    case "/network":
    case "wifi":
    case "ip":
    case "/ip":
    case "/net": {
      const ssid = currentTelemetry?.network.ssid ?? "OpticFlow_5G";
      const ip = currentTelemetry?.network.ip ?? "192.168.1.142";
      const dl = currentTelemetry?.network.downloadSpeed ?? "420 Mbps";
      const ul = currentTelemetry?.network.uploadSpeed ?? "85 Mbps";

      return {
        replyText: `Network diagnostics: Connected to SSID '${ssid}' on interface en0. Local IPv4 address is ${ip}, current throughput is ${dl} downlink and ${ul} uplink.`,
        actions: [
          {
            id: actionId,
            toolName: "network_interface_check",
            args: { interface: "en0" },
            commandString: "ipconfig getifaddr en0 && /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I",
            type: "terminal",
            simulatedOutput: `en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500\n  inet ${ip} netmask 0xffffff00 broadcast 192.168.1.255\n  SSID: ${ssid}\n  BSSID: 3c:84:6a:1b:2f:90\n  RSSI: -48 dBm (Strong)\n  Tx Rate: 1200 Mbps (Wi-Fi 6 802.11ax)\n  Downlink: ${dl} | Uplink: ${ul}`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/processes":
    case "/ps":
    case "ps": {
      const procs = currentTelemetry?.processes || [
        { pid: 4821, name: "com.apple.JarvisDaemon", cpu: "1.2%", memory: "284 MB", status: "Active" },
        { pid: 1209, name: "Google Chrome", cpu: "8.4%", memory: "1.8 GB", status: "Active" },
        { pid: 2311, name: "Visual Studio Code", cpu: "4.1%", memory: "940 MB", status: "Active" },
        { pid: 894, name: "Spotify", cpu: "1.2%", memory: "310 MB", status: "Active" },
        { pid: 312, name: "WindowServer", cpu: "3.5%", memory: "450 MB", status: "System" },
        { pid: 671, name: "Terminal", cpu: "0.4%", memory: "85 MB", status: "Idle" }
      ];

      let procTable = "PID    NAME                    CPU%    MEMORY    STATUS\n";
      procTable += "───────────────────────────────────────────────────────\n";
      procs.forEach((p) => {
        procTable += `${String(p.pid).padEnd(6)} ${p.name.padEnd(23)} ${p.cpu.padEnd(7)} ${p.memory.padEnd(9)} ${p.status}\n`;
      });

      return {
        replyText: `Active process telemetry fetched, Sir. ${procs.length} priority daemons monitored. System resource allocation is balanced.`,
        actions: [
          {
            id: actionId,
            toolName: "process_list",
            args: { filter: args || "top" },
            commandString: `ps -eo pid,pcpu,pmem,comm -r | head -n 12`,
            type: "terminal",
            simulatedOutput: procTable,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: false,
      };
    }

    case "/purge":
    case "/cleanmem":
    case "purge": {
      return {
        replyText: "RAM cache reclamation protocol executed, Sir. Inactive disk caches flushed and unified memory pressure neutralized.",
        actions: [
          {
            id: actionId,
            toolName: "memory_purge",
            args: {},
            commandString: "sudo purge && vm_stat",
            type: "terminal",
            simulatedOutput: "Purged 3.4 GB of inactive file-backed pages.\nMach Virtual Memory Statistics: Free: 18.2 GB, Active: 9.8 GB, Inactive: 1.1 GB, Wired: 2.9 GB.",
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/finder":
    case "finder":
    case "/reveal": {
      const sub = args.toLowerCase().trim();
      let targetPath = "~/Desktop";
      let cmd = "";
      let reply = "";

      if (sub.includes("download")) {
        targetPath = "~/Downloads";
        cmd = `open ~/Downloads`;
        reply = "Opening Downloads folder in Finder, Sir.";
      } else if (sub.includes("doc")) {
        targetPath = "~/Documents";
        cmd = `open ~/Documents`;
        reply = "Opening Documents directory in Finder, Sir.";
      } else if (sub.includes("clean") || sub.includes("screenshot")) {
        cmd = `mkdir -p ~/Pictures/Screenshots && mv ~/Desktop/Screen\\ Shot* ~/Pictures/Screenshots/ 2>/dev/null || true`;
        reply = "Archived and decluttered Desktop screenshots into ~/Pictures/Screenshots, Sir.";
      } else {
        cmd = `open ~/Desktop`;
        reply = "Opening Desktop in Finder, Sir.";
      }

      return {
        replyText: reply,
        actions: [
          {
            id: actionId,
            toolName: "finder_daemon",
            args: { target: targetPath },
            commandString: cmd,
            type: "file_op",
            simulatedOutput: `[Finder Automation] Dispatched file management command for '${targetPath}'. Exit Code: 0.`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/reminder":
    case "/remind":
    case "remind":
    case "todo": {
      const taskText = args || "Review architectural blueprint";
      const script = `tell application "Reminders"
  set targetList to default list
  tell targetList
    make new reminder with properties {name:"${taskText.replace(/"/g, '\\"')}"}
  end tell
end tell`;

      return {
        replyText: `Reminder "${taskText}" created in Apple Reminders, Sir.`,
        actions: [
          {
            id: actionId,
            toolName: "create_reminder",
            args: { title: taskText },
            commandString: `osascript -e '${script.replace(/\n/g, " -e ")}'`,
            type: "applescript",
            simulatedOutput: `[Apple Reminders] Created new entry in Default List: "${taskText}". Sync ID: rem_${Date.now()}`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/say":
    case "/speak":
    case "say":
    case "speak": {
      const textToSpeak = args || "Jarvis auditory subsystem calibrated and online.";
      jarvisVoice.speak(textToSpeak);

      return {
        replyText: textToSpeak,
        actions: [
          {
            id: actionId,
            toolName: "say_tts",
            args: { text: textToSpeak },
            commandString: `say -v Daniel "${textToSpeak.replace(/"/g, '\\"')}"`,
            type: "terminal",
            simulatedOutput: `[macOS Speech Synthesis Engine] Dispatched voice vocalization: "${textToSpeak}".`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: false, // already spoken directly
      };
    }

    case "/eval":
    case "/applescript":
    case "applescript":
    case "osascript": {
      const script = args || 'tell application "Finder" to get name of startup disk';
      return {
        replyText: `AppleScript code executed via osascript bridge, Sir.`,
        actions: [
          {
            id: actionId,
            toolName: "raw_applescript_eval",
            args: { script },
            commandString: `osascript -e '${script.replace(/'/g, "'\\''")}'`,
            type: "applescript",
            simulatedOutput: `[Apple Events Dispatcher]\nPayload: ${script}\nResult: "Macintosh HD"\nReturn Code: 0 (Execution Successful)`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: false,
      };
    }

    case "/zsh":
    case "/sh":
    case "/exec":
    case "zsh":
    case "bash": {
      const shellCmd = args || "sw_vers";
      let simOut = `[Zsh Shell Runner]\nExecuted: ${shellCmd}\n`;
      if (shellCmd.includes("sw_vers")) {
        simOut += "ProductName:\t\tmacOS\nProductVersion:\t\t15.3.1\nBuildVersion:\t\t24D70";
      } else if (shellCmd.includes("uname")) {
        simOut += "Darwin Jarvis-MacBook-Pro.local 24.3.0 Darwin Kernel Version 24.3.0 arm64";
      } else if (shellCmd.includes("df")) {
        simOut += "Filesystem     512-blocks      Used Available Capacity iused      ifree %iused  Mounted on\n/dev/disk3s1s1 1944883200 668241920 1276641280    35%  524288 9724416000    0%   /";
      } else {
        simOut += `Command '${shellCmd}' executed with exit code 0.`;
      }

      return {
        replyText: `Zsh command executed, Sir: \`${shellCmd}\``,
        actions: [
          {
            id: actionId,
            toolName: "zsh_terminal_exec",
            args: { command: shellCmd },
            commandString: shellCmd,
            type: "terminal",
            simulatedOutput: simOut,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: false,
      };
    }

    case "/workflow":
    case "/run":
    case "workflow": {
      const targetId = args.toLowerCase().trim();
      const routine = PREBUILT_ROUTINES.find(
        (r) => r.id.toLowerCase().includes(targetId) || r.name.toLowerCase().includes(targetId)
      ) || PREBUILT_ROUTINES[0];

      const actions: ExecutedAction[] = routine.steps.map((s, idx) => ({
        id: `${actionId}-${idx}`,
        toolName: s.type === "applescript" ? "run_applescript" : "execute_macos_command",
        args: { step: s.stepNumber, title: s.title },
        commandString: s.command,
        type: s.type === "applescript" ? "applescript" : "terminal",
        simulatedOutput: `Step ${s.stepNumber} (${s.title}): ${s.expectedOutput}`,
        status: "completed",
        timestamp,
      }));

      return {
        replyText: `Initiating ${routine.name} routine, Sir. Executing ${routine.steps.length} coordinated automation stages.`,
        actions,
        shouldSpeak: true,
      };
    }

    case "/shortcuts":
    case "/shortcut":
    case "shortcut":
    case "shortcuts": {
      const shortcutName = args.replace(/^run\s+/i, "") || "Morning Routine";
      return {
        replyText: `Dispatched macOS Shortcut "${shortcutName}" via command-line runner, Sir.`,
        actions: [
          {
            id: actionId,
            toolName: "run_macos_shortcut",
            args: { shortcut: shortcutName },
            commandString: `shortcuts run "${shortcutName}"`,
            type: "shortcut",
            simulatedOutput: `[Shortcuts CLI] Successfully executed shortcut "${shortcutName}".`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/theme":
    case "/persona":
    case "persona":
    case "theme":
    case "/voice":
    case "voice": {
      const valid = ["jarvis", "anime", "tsundere", "friday", "cyberpunk", "glados", "minimalist"];
      const chosen = args.toLowerCase().trim();
      let targetPersona = valid.includes(chosen) ? chosen : "jarvis";
      if (chosen.includes("anime") || chosen.includes("tyan") || chosen.includes("waifu") || chosen.includes("aoi")) {
        targetPersona = "anime";
      } else if (chosen.includes("tsun") || chosen.includes("asuka")) {
        targetPersona = "tsundere";
      }

      let reply = `Neural persona updated to ${targetPersona.toUpperCase()}, Sir. Cognitive modules synchronized.`;
      if (targetPersona === "anime") {
        reply = `Хай, Сэмпай! Голосовой модуль Aoi-chan активирован! (≧◡≦) ✨ All macOS automation pathways ready!`;
      } else if (targetPersona === "tsundere") {
        reply = `Б-Бака! Режим Tsundere активен! Не зазнавайся, Сэмпай, я просто выполняю команды! 💢`;
      }

      return {
        replyText: reply,
        actions: [
          {
            id: actionId,
            toolName: "set_neural_persona",
            args: { persona: targetPersona },
            commandString: `defaults write com.jarvis.agent Persona "${targetPersona}"`,
            type: "terminal",
            simulatedOutput: `Applied personality matrix configuration: ${targetPersona}`,
            status: "completed",
            timestamp,
          },
        ],
        setPersona: targetPersona,
        shouldSpeak: true,
      };
    }

    case "/uptime":
    case "uptime": {
      const uptimeStr = currentTelemetry?.macOS.uptime ?? "4 days, 18 hours, 32 minutes";
      return {
        replyText: `Host macOS workstation uptime is ${uptimeStr}, Sir. Load averages: 1.84, 1.62, 1.45 (16 cores online).`,
        actions: [
          {
            id: actionId,
            toolName: "sys_uptime",
            args: {},
            commandString: "uptime",
            type: "terminal",
            simulatedOutput: ` 4:05PM  up ${uptimeStr}, 3 users, load averages: 1.84 1.62 1.45`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/weather":
    case "weather":
    case "/wttr": {
      const city = args || "Cupertino";
      return {
        replyText: `Current meteorological report for ${city}: 68°F (20°C), Clear skies with 10 mi visibility and 45% relative humidity.`,
        actions: [
          {
            id: actionId,
            toolName: "weather_curl",
            args: { city },
            commandString: `curl -s "wttr.in/${encodeURIComponent(city)}?format=3"`,
            type: "terminal",
            simulatedOutput: `${city}: ☀️ +68°F (20°C) ↗ 8mph 10mi 0.0in 45%`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/kill":
    case "kill":
    case "killall":
    case "/killall": {
      const proc = args || "CoreAudio";
      return {
        replyText: `Dispatched termination/restart signal to process "${proc}", Sir.`,
        actions: [
          {
            id: actionId,
            toolName: "kill_process",
            args: { process: proc },
            commandString: `sudo killall ${proc}`,
            type: "terminal",
            simulatedOutput: `Signal SIGTERM sent to '${proc}'. macOS launchd will restart the daemon automatically.`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/powershell":
    case "/ps":
    case "/ps1":
    case "powershell":
    case "ps": {
      const psCmd = args || "Get-Process | Select-Object -First 5";
      return {
        replyText: `Executed Windows PowerShell directive: "${psCmd}", Sir.`,
        actions: [
          {
            id: actionId,
            toolName: "execute_windows_powershell",
            args: { command: psCmd },
            commandString: `powershell.exe -NoProfile -Command "${psCmd.replace(/"/g, '\\"')}"`,
            type: "powershell",
            simulatedOutput: `[PowerShell Host 7.4.5] Command executed successfully on Windows 11.\nHandles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName\n-------  ------    -----      -----     ------     --  -- -----------\n    420      24    34280      58120       1.24   4120   1 JarvisAgent\n   1204      82   184200     240900       8.45   1420   1 msedge\n    890      45    98400     142000       4.12   5892   1 Code`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/winget":
    case "winget": {
      const wingetCmd = args || "install Spotify.Spotify";
      return {
        replyText: `Dispatched Windows Package Manager command: "winget ${wingetCmd}", Sir.`,
        actions: [
          {
            id: actionId,
            toolName: "execute_windows_powershell",
            args: { command: `winget ${wingetCmd}` },
            commandString: `winget ${wingetCmd}`,
            type: "powershell",
            simulatedOutput: `Found package: ${wingetCmd}\nVersion: Latest\nPublisher: Microsoft Store / Winget Repository\nDownloading package...\n[██████████████████████████████] 100%\nSuccessfully installed and registered on Windows!`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/os":
    case "/platform":
    case "os":
    case "platform": {
      const chosen = args.toLowerCase();
      const target = chosen.includes("mac") ? "macOS Sequoia (Apple Silicon)" : "Windows 11 Pro (PowerShell)";
      return {
        replyText: `Target operating system profile configured to: ${target}. Automation engine calibrated.`,
        actions: [
          {
            id: actionId,
            toolName: "switch_target_os",
            args: { targetOS: target },
            commandString: `# OS Context Set: ${target}`,
            type: "telemetry",
            simulatedOutput: `[OS Mode Active]: ${target}\nDirect PowerShell / AppleScript dispatch channels mapped.`,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: true,
      };
    }

    case "/sysinfo":
    case "/version":
    case "sysinfo":
    case "version":
    case "neofetch": {
      const sysOut = `                'c.          jarvis@macbook-pro
                 ,xNMM.        -------------------
               .OMMMMo         OS: macOS Sequoia 15.3.1 24D70 arm64
               OMMM0,          Host: MacBookPro18,1 (16-inch, 2023)
     .;loddo:' loolloddol;.    Kernel: Darwin 24.3.0
   cKMMMMMMMMMMNWMMMMMMMMMM0:  Uptime: 4 days, 18 hours
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.  Shell: zsh 5.9
 XMMMMMMMMMMMMMMMMMMMMMMMX.    Resolution: 3456x2234 @ 120Hz ProMotion
;MMMMMMMMMMMMMMMMMMMMMMMM:     CPU: Apple M3 Max (16 cores: 12P + 4E)
:MMMMMMMMMMMMMMMMMMMMMMMM:     GPU: Apple M3 Max 40-core GPU
.MMMMMMMMMMMMMMMMMMMMMMMMX.    Memory: 12420MB / 32768MB (Unified)
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.  Disk: 342GB / 1000GB (APFS)
 .XMMMMMMMMMMMMMMMMMMMMMMMMMMk JARVIS Agent Core: v3.7.4 (Neural ARM64)`;

      return {
        replyText: "System hardware diagnostics and Apple Silicon profile rendered, Sir.",
        actions: [
          {
            id: actionId,
            toolName: "neofetch_sysinfo",
            args: {},
            commandString: "system_profiler SPHardwareDataType && sw_vers",
            type: "terminal",
            simulatedOutput: sysOut,
            status: "completed",
            timestamp,
          },
        ],
        shouldSpeak: false,
      };
    }

    default: {
      return {
        replyText: `Unknown console command "${cmdName}". Type \`/help\` to inspect available commands, or speak your instruction in natural language.`,
        actions: [],
        shouldSpeak: false,
      };
    }
  }
}
