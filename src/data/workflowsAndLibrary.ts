import { WorkflowRoutine } from "../types";

export const PREBUILT_ROUTINES: WorkflowRoutine[] = [
  {
    id: "morning-briefing",
    name: "Morning Briefing & System Prep",
    description: "Unmutes volume, opens Calendar & Safari dashboard, checks battery & weather, sets warm display.",
    icon: "Sunrise",
    category: "productivity",
    steps: [
      {
        stepNumber: 1,
        title: "Adjust Audio & Brightness",
        type: "applescript",
        command: `osascript -e 'set volume output volume 50'`,
        expectedOutput: "Volume set to 50% for auditory status confirmation.",
      },
      {
        stepNumber: 2,
        title: "Fetch macOS Power & Battery Health",
        type: "terminal",
        command: `pmset -g batt`,
        expectedOutput: "Battery at 89%; AC Power attached.",
      },
      {
        stepNumber: 3,
        title: "Launch Daily Apps (Calendar & Safari)",
        type: "terminal",
        command: `open -a "Calendar" && open -a "Safari" "https://news.ycombinator.com"`,
        expectedOutput: "Calendar and morning briefing portals launched.",
      },
      {
        stepNumber: 4,
        title: "Create Today's Focus Note",
        type: "applescript",
        command: `osascript -e 'tell application "Notes" to make new note with properties {name:"Daily Focus - " & (current date), body:"- Morning Standup\\n- Top Priority Items\\n- Evening Wrap-up"}'`,
        expectedOutput: "Created fresh daily focus note in Apple Notes.",
      },
    ],
  },
  {
    id: "deep-work-focus",
    name: "Deep Work Focus Protocol",
    description: "Enables Dark Mode, mutes notifications, starts Lo-Fi focus playlist, closes distracting browser tabs.",
    icon: "Zap",
    category: "productivity",
    steps: [
      {
        stepNumber: 1,
        title: "Enable macOS Dark Mode",
        type: "applescript",
        command: `osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to true'`,
        expectedOutput: "macOS UI transformed to Dark Mode.",
      },
      {
        stepNumber: 2,
        title: "Set Volume to Optimal Concentration (35%)",
        type: "applescript",
        command: `osascript -e 'set volume output volume 35'`,
        expectedOutput: "Output volume attenuated to 35%.",
      },
      {
        stepNumber: 3,
        title: "Play Focus Beats on Spotify / Apple Music",
        type: "applescript",
        command: `osascript -e 'tell application "Music" to play track "Focus Beats"'`,
        expectedOutput: "Streaming ambient soundtrack.",
      },
      {
        stepNumber: 4,
        title: "Launch Visual Studio Code & Terminal",
        type: "terminal",
        command: `open -a "Visual Studio Code" && open -a "Terminal"`,
        expectedOutput: "Workspace IDE & terminal emulator active.",
      },
    ],
  },
  {
    id: "dev-workspace-launch",
    name: "Full-Stack Dev Environment",
    description: "Checks Docker daemon, navigates to project repo, launches VS Code, checks git branch status.",
    icon: "Code2",
    category: "developer",
    steps: [
      {
        stepNumber: 1,
        title: "Verify Docker / Colima Daemon Status",
        type: "terminal",
        command: `docker info > /dev/null 2>&1 && echo "Docker Running" || echo "Docker Standby"`,
        expectedOutput: "Container runtime verified.",
      },
      {
        stepNumber: 2,
        title: "Check Git Status & Local Changes",
        type: "terminal",
        command: `git status --short`,
        expectedOutput: "Clean working tree on branch 'main'.",
      },
      {
        stepNumber: 3,
        title: "Open Code Editor",
        type: "terminal",
        command: `open -a "Visual Studio Code" .`,
        expectedOutput: "VS Code instance launched in current directory.",
      },
    ],
  },
  {
    id: "battery-conservation",
    name: "Emergency Battery Saver",
    description: "Dims display brightness, throttles background indexing, turns off keyboard backlight, mutes audio.",
    icon: "BatteryCharging",
    category: "system",
    steps: [
      {
        stepNumber: 1,
        title: "Mute System Audio",
        type: "applescript",
        command: `osascript -e 'set volume with output muted'`,
        expectedOutput: "Audio hardware powered down.",
      },
      {
        stepNumber: 2,
        title: "Quit Heavy Non-Essential Background Apps",
        type: "applescript",
        command: `osascript -e 'tell application "Spotify" to quit' && osascript -e 'tell application "Slack" to quit'`,
        expectedOutput: "Background processes suspended.",
      },
      {
        stepNumber: 3,
        title: "Set Low Power Battery Profiles",
        type: "terminal",
        command: `sudo pmset -b displaysleep 2 disksleep 5`,
        expectedOutput: "Aggressive sleep timers applied to preserve battery.",
      },
    ],
  },
  {
    id: "meeting-mode",
    name: "Meeting & Screen Share Prep",
    description: "Cleans desktop icons, pauses music, disables notifications, prepares camera & microphone checks.",
    icon: "Video",
    category: "productivity",
    steps: [
      {
        stepNumber: 1,
        title: "Pause Background Audio Playback",
        type: "applescript",
        command: `osascript -e 'tell application "Music" to pause' 2>/dev/null || osascript -e 'tell application "Spotify" to pause'`,
        expectedOutput: "All media playback halted.",
      },
      {
        stepNumber: 2,
        title: "Hide Desktop Icons (Clean Screen Share)",
        type: "terminal",
        command: `defaults write com.apple.finder CreateDesktop false && killall Finder`,
        expectedOutput: "Desktop clutter hidden from screen share viewers.",
      },
      {
        stepNumber: 3,
        title: "Launch Zoom / Google Meet",
        type: "terminal",
        command: `open "https://meet.google.com"`,
        expectedOutput: "Conferencing portal ready.",
      },
    ],
  },
];

export interface ScriptLibraryItem {
  id: string;
  title: string;
  category: "System" | "Apple Apps" | "Media & Audio" | "Files & Finder" | "Developer Tools";
  description: string;
  type: "applescript" | "zsh" | "cli";
  code: string;
  usageNotes: string;
}

export const SCRIPT_LIBRARY: ScriptLibraryItem[] = [
  {
    id: "toggle-dark-mode",
    title: "Toggle macOS Dark Mode",
    category: "System",
    description: "Instantly switches macOS between Light and Dark mode without opening System Settings.",
    type: "applescript",
    code: `tell application "System Events"
    tell appearance preferences
        set dark mode to not dark mode
    end tell
end tell`,
    usageNotes: "Works on macOS Mojave (10.14) up to macOS Sequoia (15.x).",
  },
  {
    id: "set-system-volume",
    title: "Set Output Volume to Precise Percentage",
    category: "System",
    description: "Sets the master speaker/headphone volume between 0 and 100.",
    type: "applescript",
    code: `set volume output volume 65`,
    usageNotes: "Pass any integer from 0 (silent) to 100 (maximum).",
  },
  {
    id: "mute-unmute",
    title: "Toggle Mute on System Audio",
    category: "System",
    description: "Toggles speaker mute state instantly.",
    type: "applescript",
    code: `set volume output muted (not (output muted of (get volume settings)))`,
    usageNotes: "No app prompts required; operates via CoreAudio System Events.",
  },
  {
    id: "create-apple-reminder",
    title: "Create Task in Apple Reminders",
    category: "Apple Apps",
    description: "Adds a new reminder with due date and priority to the default Reminders list.",
    type: "applescript",
    code: `tell application "Reminders"
    set myList to default list
    tell myList
        make new reminder with properties {name:"Review JARVIS Architecture", due date:(current date + 3600), body:"Created automatically by JARVIS AI"}
    end tell
end tell`,
    usageNotes: "Requires Reminders permission in macOS Privacy & Security.",
  },
  {
    id: "create-calendar-event",
    title: "Schedule Event in Apple Calendar",
    category: "Apple Apps",
    description: "Schedules a 1-hour event on the primary calendar.",
    type: "applescript",
    code: `tell application "Calendar"
    tell calendar "Home"
        set startTime to (current date) + (1 * hours)
        set endTime to startTime + (1 * hours)
        make new event at end of events with properties {summary:"Sync with Engineering", start date:startTime, end date:endTime, description:"Scheduled by JARVIS AI"}
    end tell
end tell`,
    usageNotes: "Change 'Home' to match your preferred calendar name.",
  },
  {
    id: "control-spotify-playback",
    title: "Control Spotify (Play/Pause/Next)",
    category: "Media & Audio",
    description: "Sends play/pause or track skipping commands to Spotify.",
    type: "applescript",
    code: `tell application "Spotify"
    if player state is playing then
        pause
    else
        play
    end if
end tell`,
    usageNotes: "Supports 'next track', 'previous track', 'set sound volume 80', and 'play track \"spotify:track:...\"'.",
  },
  {
    id: "control-apple-music",
    title: "Play Specific Playlist on Apple Music",
    category: "Media & Audio",
    description: "Finds and plays a designated playlist or album in Apple Music.",
    type: "applescript",
    code: `tell application "Music"
    play playlist "Top Hits"
end tell`,
    usageNotes: "Apple Music must be installed. Requires Automation permission in System Settings.",
  },
  {
    id: "clean-desktop-screenshots",
    title: "Archive Desktop Screenshots to Folder",
    category: "Files & Finder",
    description: "Finds all PNG screenshots on your Desktop and moves them into ~/Pictures/Screenshots.",
    type: "zsh",
    code: `mkdir -p "$HOME/Pictures/Screenshots"
mv "$HOME/Desktop"/Screenshot* "$HOME/Pictures/Screenshots/" 2>/dev/null || true
echo "Screenshots organized into ~/Pictures/Screenshots"`,
    usageNotes: "Keeps your macOS desktop clean and minimal automatically.",
  },
  {
    id: "spotlight-mdfind",
    title: "Search Files Instantly with Spotlight Metadata (mdfind)",
    category: "Files & Finder",
    description: "Queries the macOS native Spotlight index for files by name, type, or content.",
    type: "zsh",
    code: `mdfind "kMDItemDisplayName == '*.pdf'c && kMDItemTextContent == 'invoice'c"`,
    usageNotes: "100x faster than traditional find; leverages Apple CoreSpotlight indexes.",
  },
  {
    id: "inspect-mac-hardware",
    title: "Inspect Apple Silicon Chip & Power Telemetry",
    category: "Developer Tools",
    description: "Returns chip model, RAM layout, battery cycle count, and thermal state.",
    type: "zsh",
    code: `echo "=== CPU & CHIP ==="
sysctl -n machdep.cpu.brand_string 2>/dev/null || system_profiler SPHardwareDataType | grep "Chip:"
echo "=== BATTERY CYCLE & HEALTH ==="
system_profiler SPPowerDataType | grep -E "(Cycle Count|Condition|State of Charge)"`,
    usageNotes: "Native macOS binary, requires no third-party package installations.",
  },
  {
    id: "find-heavy-processes",
    title: "Find Top 5 CPU & RAM Consuming Apps",
    category: "Developer Tools",
    description: "Identifies running applications causing memory pressure or thermal throttling.",
    type: "zsh",
    code: `ps -eo pid,pcpu,pmem,comm -r | head -n 6`,
    usageNotes: "Great for diagnosing why your Mac fan or temperature is spiking.",
  },
  {
    id: "run-shortcuts-cli",
    title: "Trigger Apple Shortcuts via CLI",
    category: "Apple Apps",
    description: "Executes any Apple Shortcut configured in the macOS Shortcuts app.",
    type: "cli",
    code: `shortcuts run "Morning Routine" --input "High Priority"`,
    usageNotes: "macOS Monterey and newer have native 'shortcuts' command line utility.",
  },
];
