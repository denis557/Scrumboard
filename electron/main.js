const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const server = require('../server/server');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let serverProcess;

const startServer = () => {
  serverProcess = server.listen(8000);
};

const stopServer = () => {
  serverProcess.close();
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../src/assets/128x128.png'),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(`${MAIN_WINDOW_WEBPACK_ENTRY}#/scrumboard`);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize();
};

app.whenReady().then(() => {
  startServer();
  createWindow();

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
