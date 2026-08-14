const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    frame: true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#050505',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
    },
    title: 'JARVIS & Aoi-chan AI Desktop Agent (Windows & macOS)'
  });

  // Load from dev server or compiled production build
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev && process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Windows native PowerShell execution helper via IPC
ipcMain.handle('execute-powershell', async (event, command) => {
  return new Promise((resolve) => {
    const ps = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command]);
    let output = '';
    let error = '';

    ps.stdout.on('data', (data) => {
      output += data.toString();
    });

    ps.stderr.on('data', (data) => {
      error += data.toString();
    });

    ps.on('close', (code) => {
      resolve({
        success: code === 0,
        output: output.trim(),
        error: error.trim(),
        code
      });
    });
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
