const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { spawn } = require('child_process');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let serverProcess;

const startServer = () => {
  serverProcess = spawn('npm', ['run', 'node-start'], { shell: true });
};

const stopServer = () => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/scrumboard`);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize();
};

app.whenReady().then(() => {
  createWindow();
  startServer();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => {
  stopServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
