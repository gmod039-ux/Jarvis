import { WorkflowRoutine } from "../types";

export const PREBUILT_ROUTINES: WorkflowRoutine[] = [
  {
    id: "windows-morning-briefing",
    name: "Windows 11 Morning Briefing & Prep",
    description: "Проверяет заряд батареи, открывает Edge с новостями, запускает Spotify и настраивает громкость.",
    icon: "Sunrise",
    category: "productivity",
    steps: [
      {
        stepNumber: 1,
        title: "Adjust Audio Volume (PowerShell)",
        type: "terminal",
        command: `powershell -Command "$obj = New-Object -ComObject WScript.Shell; $obj.SendKeys([char]175)"`,
        expectedOutput: "Volume adjusted for morning audio.",
      },
      {
        stepNumber: 2,
        title: "Check Battery Status (Windows WMI)",
        type: "terminal",
        command: `powershell -Command "Get-CimInstance -ClassName Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus"`,
        expectedOutput: "Battery at 94%, AC Connected.",
      },
      {
        stepNumber: 3,
        title: "Launch Edge & Dashboard",
        type: "terminal",
        command: `start msedge "https://news.ycombinator.com"`,
        expectedOutput: "Morning web portal opened in Edge.",
      },
      {
        stepNumber: 4,
        title: "Check Windows Defender Realtime Status",
        type: "terminal",
        command: `powershell -Command "Get-MpComputerStatus | Select-Object RealTimeProtectionEnabled, AntivirusSignatureAge"`,
        expectedOutput: "Defender active and up to date.",
      },
    ],
  },
  {
    id: "windows-dev-launch",
    name: "Full-Stack Dev Environment (Win 11 / WSL2)",
    description: "Запускает VS Code, проверяет статус Docker Desktop, проверяет Git ветку и запускает терминал.",
    icon: "Code2",
    category: "developer",
    steps: [
      {
        stepNumber: 1,
        title: "Check Docker Engine Service",
        type: "terminal",
        command: `powershell -Command "Get-Service *docker* -ErrorAction SilentlyContinue | Select-Object Name, Status"`,
        expectedOutput: "Docker container service verified.",
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
        title: "Launch Visual Studio Code in current directory",
        type: "terminal",
        command: `code .`,
        expectedOutput: "VS Code instance launched.",
      },
    ],
  },
  {
    id: "deep-work-focus",
    name: "Deep Work Focus Protocol",
    description: "Включает темную тему, устанавливает комфортную громкость и запускает рабочий стек.",
    icon: "Zap",
    category: "productivity",
    steps: [
      {
        stepNumber: 1,
        title: "Set Windows Dark Mode",
        type: "terminal",
        command: `powershell -Command "Set-ItemProperty -Path HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize -Name AppsUseLightTheme -Value 0"`,
        expectedOutput: "Windows apps theme switched to Dark.",
      },
      {
        stepNumber: 2,
        title: "Launch VS Code & Windows Terminal",
        type: "terminal",
        command: `start wt || start cmd`,
        expectedOutput: "Terminal workspace ready.",
      },
    ],
  },
  {
    id: "battery-conservation",
    name: "Emergency Battery Saver (Windows)",
    description: "Включает профиль энергосбережения и закрывает ресурсоемкие фоновые процессы.",
    icon: "BatteryCharging",
    category: "system",
    steps: [
      {
        stepNumber: 1,
        title: "Apply Power Saver Scheme",
        type: "terminal",
        command: `powercfg /setactive a1841308-3541-4fab-bc81-f71556f20b4a`,
        expectedOutput: "Power Saver profile activated.",
      },
      {
        stepNumber: 2,
        title: "Check High CPU Processes",
        type: "terminal",
        command: `powershell -Command "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Id, ProcessName, CPU"`,
        expectedOutput: "Identified high-drain processes.",
      },
    ],
  },
];

export interface ScriptLibraryItem {
  id: string;
  title: string;
  category: "System" | "Windows" | "Apple Apps" | "Media & Audio" | "Files & Finder" | "Developer Tools";
  description: string;
  type: "powershell" | "cmd" | "applescript" | "zsh" | "cli";
  code: string;
  usageNotes: string;
}

export const SCRIPT_LIBRARY: ScriptLibraryItem[] = [
  // Windows PowerShell Scripts
  {
    id: "win-toggle-dark-mode",
    title: "Toggle Windows 11 Dark Mode (PowerShell)",
    category: "Windows",
    description: "Мгновенно переключает Windows 11 / 10 между светлой и темной темой через реестр.",
    type: "powershell",
    code: `$regPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize"
$current = (Get-ItemProperty -Path $regPath).AppsUseLightTheme
$newVal = if ($current -eq 1) { 0 } else { 1 }
Set-ItemProperty -Path $regPath -Name AppsUseLightTheme -Value $newVal
Set-ItemProperty -Path $regPath -Name SystemUsesLightTheme -Value $newVal
Write-Host "Windows Theme Switched to: $(if ($newVal -eq 0) {'Dark'} else {'Light'})"`,
    usageNotes: "Не требует перезагрузки; применяется к проводнику и окнам Windows мгновенно.",
  },
  {
    id: "win-winget-upgrade",
    title: "Upgrade All Installed Apps (Winget CLI)",
    category: "Windows",
    description: "Автоматически обновляет все программы на компьютере через официальный пакетный менеджер Windows.",
    type: "powershell",
    code: `winget upgrade --all --include-unknown --accept-source-agreements --accept-package-agreements`,
    usageNotes: "Работает в Windows 11 и Windows 10 с установленным App Installer.",
  },
  {
    id: "win-flush-ram-cache",
    title: "Flush Standby RAM & Clean Memory (PowerShell)",
    category: "System",
    description: "Освобождает рабочие наборы памяти и очищает временные буферы.",
    type: "powershell",
    code: `[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
Clear-RecycleBin -Force -ErrorAction SilentlyContinue
Write-Host "RAM and Recycle Bin Purged Successfully."`,
    usageNotes: "Быстрая оптимизация памяти без сторонних утилит.",
  },
  {
    id: "win-battery-report",
    title: "Generate Windows Battery Health Report",
    category: "System",
    description: "Создает полный HTML-отчет о состоянии батареи, емкости и циклах зарядки.",
    type: "powershell",
    code: `powercfg /batteryreport /output "$env:USERPROFILE\\Desktop\\battery_report.html"
Invoke-Item "$env:USERPROFILE\\Desktop\\battery_report.html"`,
    usageNotes: "Откроет красивый интерактивный отчет в браузере.",
  },
  {
    id: "win-kill-heavy-proc",
    title: "Find & Kill Lagging Processes (PowerShell)",
    category: "Developer Tools",
    description: "Находит топ-5 процессов по потреблению памяти и процессора.",
    type: "powershell",
    code: `Get-Process | Sort-Object -Descending WS | Select-Object -First 10 Id, ProcessName, @{Name="RAM (MB)"; Expression={[math]::Round($_.WS / 1MB, 2)}}, CPU | Format-Table -AutoSize`,
    usageNotes: "Позволяет быстро найти зависшую программу.",
  },
  {
    id: "win-build-exe-electron",
    title: "Build Native Windows .EXE Installer (Electron)",
    category: "Developer Tools",
    description: "Собирает автономный Windows .EXE файл установщика или portable-версию.",
    type: "cmd",
    code: `npm install
npm run electron:build`,
    usageNotes: "Создает готовый установочный файл .exe в папке release/ или dist/.",
  },
  // macOS Scripts
  {
    id: "toggle-dark-mode-mac",
    title: "Toggle macOS Dark Mode (AppleScript)",
    category: "System",
    description: "Переключает macOS между светлым и темным режимами.",
    type: "applescript",
    code: `tell application "System Events"
    tell appearance preferences
        set dark mode to not dark mode
    end tell
end tell`,
    usageNotes: "Работает на macOS Mojave (10.14) до macOS Sequoia (15.x).",
  },
  {
    id: "set-system-volume",
    title: "Set Output Volume to Precise Percentage",
    category: "System",
    description: "Устанавливает уровень громкости от 0 до 100.",
    type: "applescript",
    code: `set volume output volume 65`,
    usageNotes: "Любое число от 0 (без звука) до 100.",
  },
  {
    id: "control-spotify-playback",
    title: "Control Spotify (Play/Pause/Next)",
    category: "Media & Audio",
    description: "Отправляет команды воспроизведения в Spotify.",
    type: "applescript",
    code: `tell application "Spotify"
    if player state is playing then
        pause
    else
        play
    end if
end tell`,
    usageNotes: "Поддерживает 'next track', 'previous track' и 'set sound volume'.",
  },
];
