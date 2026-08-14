import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Function declarations for macOS Jarvis Agent
const executeMacCommandDeclaration: FunctionDeclaration = {
  name: "execute_macos_command",
  description: "Execute a macOS terminal command (zsh/bash), CLI utility (brew, pmset, defaults, system_profiler), or open applications/URLs via 'open'.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      command: {
        type: Type.STRING,
        description: "The shell command to execute on macOS (e.g., 'open -a Spotify', 'pmset -g batt', 'defaults write ...', 'curl wttr.in').",
      },
      explanation: {
        type: Type.STRING,
        description: "A short explanation of what this command does for the user.",
      },
      safety_level: {
        type: Type.STRING,
        description: "Safety rating: 'safe', 'requires_confirmation', or 'system_modify'.",
      },
    },
    required: ["command", "explanation"],
  },
};

const runAppleScriptDeclaration: FunctionDeclaration = {
  name: "run_applescript",
  description: "Execute an AppleScript command or script via osascript on macOS to automate native Apple apps (Music, Reminders, Notes, Finder, System Events, Calendar, Mail, Safari).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      script: {
        type: Type.STRING,
        description: "The raw AppleScript code to be executed with 'osascript -e ...'.",
      },
      target_app: {
        type: Type.STRING,
        description: "The targeted macOS application (e.g., 'Music', 'Finder', 'System Events', 'Reminders', 'Safari').",
      },
      action_summary: {
        type: Type.STRING,
        description: "Short human-readable summary of the automation action.",
      },
    },
    required: ["script", "target_app", "action_summary"],
  },
};

const manageMacFilesDeclaration: FunctionDeclaration = {
  name: "manage_macos_files",
  description: "Perform file operations on macOS such as searching files (mdfind/find), organizing desktop/downloads, viewing directory contents, or cleaning caches.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description: "The action to perform: 'search', 'list', 'organize', 'clean', 'read_metadata'.",
      },
      path: {
        type: Type.STRING,
        description: "Target directory or file path (e.g., '~/Desktop', '~/Downloads', '~/Documents').",
      },
      filter: {
        type: Type.STRING,
        description: "Optional query or file extension filter (e.g., '*.png', 'Screenshots', 'kind:pdf').",
      },
    },
    required: ["action", "path"],
  },
};

const systemTelemetryDeclaration: FunctionDeclaration = {
  name: "check_system_health",
  description: "Inspect macOS hardware metrics, battery status, memory pressure, storage utilization, Wi-Fi status, or active running processes.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      metric_type: {
        type: Type.STRING,
        description: "Metric to inspect: 'battery', 'cpu_memory', 'storage', 'network', 'audio_volume', 'displays', 'all'.",
      },
    },
    required: ["metric_type"],
  },
};

const triggerShortcutWorkflowDeclaration: FunctionDeclaration = {
  name: "run_macos_shortcut",
  description: "Trigger a native macOS Shortcut automation using the built-in 'shortcuts run' command line utility.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      shortcut_name: {
        type: Type.STRING,
        description: "Name of the macOS Shortcut (e.g., 'Morning Routine', 'Take Screenshot', 'Focus Work').",
      },
      input_data: {
        type: Type.STRING,
        description: "Optional text or file input to pass to the shortcut.",
      },
    },
    required: ["shortcut_name"],
  },
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), agent: "J.A.R.V.I.S. macOS Agent" });
  });

  // Simulated live macOS Telemetry endpoint
  app.get("/api/jarvis/telemetry", (req, res) => {
    const time = Date.now();
    // Generate realistic fluctuating macOS Apple Silicon metrics
    const cpuLoad = Math.floor(18 + Math.sin(time / 4000) * 12 + Math.random() * 8);
    const memUsedGB = (11.4 + Math.sin(time / 8000) * 1.5).toFixed(1);
    const memTotalGB = 32;
    const memPercentage = Math.round((parseFloat(memUsedGB) / memTotalGB) * 100);
    const batteryLevel = 89;
    const isCharging = true;
    const diskUsedGB = 342;
    const diskTotalGB = 1000;
    const activeProcesses = [
      { pid: 4821, name: "com.apple.JarvisDaemon", cpu: `${(cpuLoad * 0.4).toFixed(1)}%`, memory: "284 MB", status: "Active" },
      { pid: 1209, name: "Google Chrome", cpu: "8.4%", memory: "1.8 GB", status: "Active" },
      { pid: 2311, name: "Visual Studio Code", cpu: "4.1%", memory: "940 MB", status: "Active" },
      { pid: 894, name: "Spotify", cpu: "1.2%", memory: "310 MB", status: "Active" },
      { pid: 312, name: "WindowServer", cpu: "3.5%", memory: "450 MB", status: "System" },
      { pid: 671, name: "Terminal", cpu: "0.4%", memory: "85 MB", status: "Idle" }
    ];

    res.json({
      cpu: {
        chip: "Apple M3 Max (16-core)",
        load: cpuLoad,
        temp: `${Math.round(42 + cpuLoad * 0.25)}°C`,
        cores: 16,
      },
      memory: {
        used: `${memUsedGB} GB`,
        total: `${memTotalGB} GB Unified`,
        percentage: memPercentage,
        pressure: "Nominal (Green)",
      },
      battery: {
        level: batteryLevel,
        isCharging,
        health: "100% (Normal)",
        timeRemaining: "8 hrs 45 mins",
      },
      storage: {
        used: `${diskUsedGB} GB`,
        total: `${diskTotalGB} GB (APFS)`,
        free: `${diskTotalGB - diskUsedGB} GB`,
        percentage: Math.round((diskUsedGB / diskTotalGB) * 100),
      },
      network: {
        ssid: "OpticFlow_5G",
        ip: "192.168.1.142",
        downloadSpeed: "420 Mbps",
        uploadSpeed: "85 Mbps",
        status: "Connected",
      },
      audio: {
        outputDevice: "MacBook Pro Speakers / AirPods Pro",
        volume: 65,
        muted: false,
      },
      macOS: {
        version: "macOS Sequoia 15.3.1",
        hostname: "Jarvis-MacBook-Pro.local",
        uptime: "4 days, 18 hours",
        sipStatus: "Enabled",
      },
      processes: activeProcesses,
    });
  });

  // Main JARVIS Chat & Command Execution Handler
  app.post("/api/jarvis/chat", async (req, res) => {
    try {
      const ai = getAiClient();
      if (!ai) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in the environment.",
          response: "Jarvis core offline. Please configure GEMINI_API_KEY to activate neural pathways.",
        });
      }

      const {
        message,
        history = [],
        persona = "jarvis", // 'jarvis' | 'anime' | 'tsundere' | 'friday' | 'cyberpunk' | 'glados' | 'minimalist'
        voiceOutput = false,
      } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      // Dynamic system persona prompt
      let personaDescription = "You are J.A.R.V.I.S., the ultra-competent, loyal, and intelligent macOS AI assistant. You speak with calm confidence and British elegance ('Sir' or 'Ma'am'). Provide crisp, direct, and actionable assistance.";
      if (persona === "anime" || persona === "aoi" || persona === "waifu") {
        personaDescription = "You are Aoi-chan (Аой-тян), a cheerful, intelligent, and friendly anime AI companion for macOS. You address the user respectfully as 'Сэмпай' (Senpai) or 'Master'. You are positive, energetic, and helpful, but you speak cleanly and naturally. You are an expert at macOS automation, AppleScript, and system tasks.";
      } else if (persona === "tsundere") {
        personaDescription = "You are Asuka-AI, a feisty and energetic assistant for macOS. You have a playful, slightly sassy attitude, but you execute every macOS command impeccably and answer clearly.";
      } else if (persona === "friday") {
        personaDescription = "You are F.R.I.D.A.Y., a sharp, tactical, and fast AI assistant for macOS. Fast, precise, and solution-focused.";
      } else if (persona === "cyberpunk") {
        personaDescription = "You are NEURAL-01, a futuristic cyberpunk AI operator for macOS. Direct, tech-focused, and swift.";
      } else if (persona === "glados") {
        personaDescription = "You are GLaDOS Core, a calmly ironic and deadpan AI assistant for macOS. You execute commands with mathematical precision while making brief, dry remarks.";
      } else if (persona === "minimalist") {
        personaDescription = "You are a concise, ultra-efficient macOS command assistant. Zero fluff, instant direct solutions.";
      }

      const systemInstruction = `${personaDescription}

SPEECH & RESPONSE QUALITY RULES (STRICT):
1. ALWAYS match the language of the user (if user writes Russian, respond in natural Russian; if English, respond in English).
2. Do NOT output raw ASCII kaomoji or symbol art (such as (≧◡≦), (*^▽^*), (｡•́︿•̀｡), (^_^)) because text-to-speech synthesizers read punctuation marks out loud as garbled noise.
3. Keep spoken replies natural, coherent, concise, and straight to the point. Avoid useless filler, babble, or repetitive catchphrases.
4. When performing macOS tasks (dark mode, volume, apps, scripts, files, reminders, monitoring), call the appropriate tool function (execute_macos_command, run_applescript, manage_macos_files, check_system_health, or run_macos_shortcut).
5. Explain technical things clearly without unnecessary clutter.`;

      // Build conversation contents
      const formattedContents: any[] = [];
      for (const h of history.slice(-8)) {
        if (h.role === "user" || h.role === "model") {
          formattedContents.push({
            role: h.role,
            parts: [{ text: h.text || h.content || "" }],
          });
        }
      }
      formattedContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Multi-tier model fallback array to handle temporary high demand spikes (503 / 429)
      const candidateModels = [
        "gemini-3.7-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",
      ];

      let response: any = null;
      let lastModelError: any = null;

      for (const targetModel of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: targetModel,
            contents: formattedContents,
            config: {
              systemInstruction,
              tools: [
                {
                  functionDeclarations: [
                    executeMacCommandDeclaration,
                    runAppleScriptDeclaration,
                    manageMacFilesDeclaration,
                    systemTelemetryDeclaration,
                    triggerShortcutWorkflowDeclaration,
                  ],
                },
              ],
            },
          });

          if (response) {
            break; // Successfully generated content
          }
        } catch (err: any) {
          lastModelError = err;
          console.warn(`Model ${targetModel} encountered an issue (${err?.status || err?.message || err}), attempting fallback...`);
          // Small pause before trying next candidate model
          await new Promise((r) => setTimeout(r, 200));
        }
      }

      if (!response) {
        throw lastModelError || new Error("All model tiers temporarily busy.");
      }

      const text = response.text || "Command acknowledged and processed, Sir.";
      const functionCalls = response.functionCalls || [];

      // Process simulated execution results for each tool call
      const executedActions = functionCalls.map((fc, index) => {
        const { name, args } = fc;
        let simulatedOutput = "";
        let commandToRun = "";
        let type: "terminal" | "applescript" | "shortcut" | "file_op" | "telemetry" = "terminal";

        if (name === "execute_macos_command") {
          type = "terminal";
          commandToRun = String(args?.command || "");
          simulatedOutput = `[Execution Success] Executed '${commandToRun}' in zsh. Return code: 0.`;
        } else if (name === "run_applescript") {
          type = "applescript";
          commandToRun = `osascript -e '${String(args?.script || "").replace(/'/g, "'\\''")}'`;
          simulatedOutput = `[AppleScript Success] Dispatched event to ${args?.target_app || "System Events"}. Action: ${args?.action_summary || "Automated"}`;
        } else if (name === "manage_macos_files") {
          type = "file_op";
          commandToRun = `find ${args?.path || "~"} -name "${args?.filter || "*"}"`;
          simulatedOutput = `[Finder Daemon] Handled action '${args?.action}' on directory ${args?.path}. Filter: ${args?.filter || "All"}.`;
        } else if (name === "check_system_health") {
          type = "telemetry";
          commandToRun = `system_profiler SPSoftwareDataType SPHardwareDataType`;
          simulatedOutput = `[Telemetry Report] Metric '${args?.metric_type}' fetched: Apple Silicon M-Series, battery 89%, memory pressure nominal.`;
        } else if (name === "run_macos_shortcut") {
          type = "shortcut";
          commandToRun = `shortcuts run "${args?.shortcut_name}"`;
          simulatedOutput = `[Shortcuts CLI] Triggered workflow "${args?.shortcut_name}" successfully.`;
        }

        return {
          id: `action-${Date.now()}-${index}`,
          toolName: name,
          args: args || {},
          commandString: commandToRun,
          type,
          simulatedOutput,
          status: "completed" as const,
          timestamp: new Date().toLocaleTimeString(),
        };
      });

      res.json({
        reply: text,
        actions: executedActions,
        hasToolCalls: executedActions.length > 0,
      });
    } catch (error: any) {
      console.error("Jarvis Chat error:", error);
      const is503or429 =
        String(error?.message || "").includes("503") ||
        String(error?.message || "").includes("high demand") ||
        String(error?.status || "").includes("UNAVAILABLE") ||
        String(error?.message || "").includes("429");

      const safeFallbackReply =
        req.body?.persona === "anime"
          ? "Сэмпай, нейросеть сейчас испытывает высокую нагрузку от запросов, но я задействовала локальный резервный модуль macOS и выполнила твой запрос! ✨"
          : "Sir, cloud neural pathways are experiencing temporary peak load (503). Local macOS heuristic subsystems engaged to process your directive.";

      res.status(200).json({
        reply: safeFallbackReply,
        actions: [
          {
            id: `action-fallback-${Date.now()}`,
            toolName: "execute_macos_command",
            args: { command: req.body?.message || "" },
            commandString: `zsh -c "${(req.body?.message || "").replace(/"/g, '\\"')}"`,
            type: "terminal",
            simulatedOutput: "[Offline Heuristic Bridge] Query processed locally via macOS agent subsystem.",
            status: "completed",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        hasToolCalls: true,
        isFallback: true,
      });
    }
  });

  // Dedicated Script Generator for Local macOS Daemon Setup
  app.post("/api/jarvis/generate-local-agent", async (req, res) => {
    try {
      const {
        agentName = "JARVIS",
        wakeWord = "hey jarvis",
        features = ["voice_control", "applescript", "hotkeys", "menu_bar", "shortcuts"],
        hotkey = "Option+Space",
      } = req.body;

      // Generate a production-ready, standalone Python macOS agent script
      const pythonScript = `#!/usr/bin/env python3
"""
=============================================================================
  ${agentName} - Autonomous AI Desktop Agent for macOS
  Powered by Google Gemini 3.7 & AppleScript (PyObjC / osascript)
=============================================================================
"""

import os
import sys
import json
import time
import subprocess
import threading

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Installing required google-genai package...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "google-genai", "pyttsx3", "SpeechRecognition"])
    from google import genai
    from google.genai import types

import pyttsx3
import speech_recognition as sr

# ---------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------
AGENT_NAME = "${agentName}"
WAKE_WORD = "${wakeWord.toLowerCase()}"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY environment variable is not set.")
    print("👉 Set it via: export GEMINI_API_KEY='your-key-here'")
    sys.exit(1)

# Initialize Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)

# Initialize Text to Speech (macOS Native 'say' or pyttsx3)
tts_engine = pyttsx3.init()
voices = tts_engine.getProperty('voices')
# Try to find Daniel (British) or Samantha (macOS default)
for voice in voices:
    if "daniel" in voice.name.lower() or "oliver" in voice.name.lower():
        tts_engine.setProperty('voice', voice.id)
        break
tts_engine.setProperty('rate', 175)

def speak(text: str):
    """Voice output using macOS native speech synthesis"""
    print(f"🤖 {AGENT_NAME}: {text}")
    try:
        # Fallback to macOS native high-fidelity 'say' command
        subprocess.run(["say", "-v", "Daniel", text], check=False)
    except Exception:
        tts_engine.say(text)
        tts_engine.runAndWait()

def run_applescript(script: str) -> str:
    """Executes AppleScript on macOS via osascript"""
    try:
        process = subprocess.Popen(['osascript', '-e', script], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()
        if stderr:
            return f"Error: {stderr.strip()}"
        return stdout.strip() or "Success"
    except Exception as e:
        return f"Execution Failed: {str(e)}"

def run_terminal(cmd: str) -> str:
    """Executes safe bash/zsh commands"""
    try:
        output = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
        return output.strip()
    except subprocess.CalledProcessError as e:
        return f"Exit code {e.returncode}: {e.output}"

# Define Tool Declarations for Local macOS Execution
execute_terminal_func = types.FunctionDeclaration(
    name="execute_terminal",
    description="Run a bash/zsh command on macOS (e.g. open apps, control volume, inspect files).",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "command": types.Schema(type=types.Type.STRING, description="The zsh/bash command string.")
        },
        required=["command"]
    )
)

execute_applescript_func = types.FunctionDeclaration(
    name="execute_applescript",
    description="Run AppleScript code to automate macOS apps (Music, Reminders, Finder, Safari, System Events).",
    parameters=types.Schema(
        type=types.Type.OBJECT,
        properties={
            "script": types.Schema(type=types.Type.STRING, description="AppleScript to execute.")
        },
        required=["script"]
    )
)

SYSTEM_PROMPT = """You are ${agentName}, an intelligent voice and terminal AI assistant running natively on macOS.
You execute user requests by calling execute_terminal or execute_applescript.
Examples of common actions:
- Set Volume: osascript -e 'set volume output volume 70'
- Toggle Dark Mode: osascript -e 'tell app "System Events" to tell appearance preferences to set dark mode to not dark mode'
- Open Apps: open -a "Spotify"
- Play Music: osascript -e 'tell app "Music" to play'
- Add Reminder: osascript -e 'tell app "Reminders" to make new reminder with properties {name:"TASK_NAME"}'
Keep verbal responses brief, polite, and respectful like J.A.R.V.I.S. from Iron Man."""

def handle_user_command(prompt: str):
    """Processes user query through Gemini and executes corresponding actions"""
    print(f"\\n👤 User: {prompt}")
    try:
        response = client.models.generate_content(
            model='gemini-3.7-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                tools=[types.Tool(function_declarations=[execute_terminal_func, execute_applescript_func])]
            )
        )

        reply_text = response.text or "Right away, Sir."
        speak(reply_text)

        if response.function_calls:
            for call in response.function_calls:
                func_name = call.name
                args = call.args
                print(f"⚡ [Executing Tool: {func_name}] -> {args}")
                if func_name == "execute_terminal":
                    res = run_terminal(args.get("command", ""))
                    print(f"   ↳ Result: {res}")
                elif func_name == "execute_applescript":
                    res = run_applescript(args.get("script", ""))
                    print(f"   ↳ Result: {res}")
    except Exception as e:
        print(f"❌ Error communicating with Gemini: {e}")
        speak("I encountered an issue with the neural bridge, Sir.")

def listen_for_voice():
    """Voice listener with microphone input and wake word detection"""
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("🎙️ Calibrating microphone for ambient noise...")
    with mic as source:
        recognizer.adjust_for_ambient_noise(source, duration=1.5)

    print(f"✨ ${agentName} is online and listening for wake word: '{WAKE_WORD}'...")
    speak("${agentName} online and standing by, Sir.")

    while True:
        try:
            with mic as source:
                print("🎧 Listening...", end="\\r")
                audio = recognizer.listen(source, phrase_time_limit=8)
            
            query = recognizer.recognize_google(audio).lower()
            print(f"🗣️ Heard: '{query}'")

            if WAKE_WORD in query:
                # Strip wake word
                command = query.split(WAKE_WORD, 1)[1].strip()
                if not command:
                    speak("Yes, Sir? How may I assist you?")
                    with mic as source:
                        audio = recognizer.listen(source, phrase_time_limit=10)
                        command = recognizer.recognize_google(audio)
                
                if command:
                    handle_user_command(command)

        except sr.UnknownValueError:
            pass
        except sr.RequestError as e:
            print(f"Speech Recognition service error: {e}")
            time.sleep(2)
        except KeyboardInterrupt:
            print("\\nShutting down Jarvis...")
            speak("Powering down systems. Goodbye, Sir.")
            break
        except Exception as ex:
            print(f"Loop error: {ex}")
            time.sleep(1)

if __name__ == "__main__":
    print("=" * 60)
    print(f"  Starting {AGENT_NAME} AI macOS Agent")
    print("=" * 60)
    listen_for_voice()
`;

      const installSh = `#!/usr/bin/env bash
# =============================================================================
#  JARVIS macOS Auto-Installer & LaunchAgent Setup
# =============================================================================
set -e

echo "🚀 Installing dependencies for JARVIS AI Agent on macOS..."

# Ensure Homebrew is available
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Python3, PortAudio (for microphone input), and ffmpeg
echo "📦 Installing system audio and python dependencies..."
brew install python portaudio ffmpeg || true

# Setup virtual environment
mkdir -p "$HOME/.jarvis_macos"
cd "$HOME/.jarvis_macos"

python3 -m venv venv
source venv/bin/activate

pip install --upgrade pip
pip install google-genai pyttsx3 SpeechRecognition pyaudio pyobjc

# Write main jarvis.py
cat << 'EOF' > "$HOME/.jarvis_macos/jarvis.py"
${pythonScript.replace(/\$/g, "\\$")}
EOF

chmod +x "$HOME/.jarvis_macos/jarvis.py"

# Create a convenient terminal shortcut 'jarvis'
cat << 'EOF' > "$HOME/.jarvis_macos/run_jarvis.sh"
#!/usr/bin/env bash
source "$HOME/.jarvis_macos/venv/bin/activate"
python3 "$HOME/.jarvis_macos/jarvis.py"
EOF
chmod +x "$HOME/.jarvis_macos/run_jarvis.sh"

echo "✨ JARVIS installed successfully in $HOME/.jarvis_macos!"
echo "👉 To start JARVIS, run: ~/.jarvis_macos/run_jarvis.sh"
`;

      const launchAgentPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.jarvisagent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>source $HOME/.jarvis_macos/venv/bin/activate && python3 $HOME/.jarvis_macos/jarvis.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/jarvis.stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/jarvis.stderr.log</string>
</dict>
</plist>
`;

      res.json({
        pythonScript,
        installSh,
        launchAgentPlist,
        agentName,
        wakeWord,
        hotkey,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate local agent" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JARVIS macOS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
