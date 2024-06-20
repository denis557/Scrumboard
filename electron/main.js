const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const { exec } = require('child_process');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const startServer = () => {
  exec('npm run node-start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при запуске сервера: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Ошибка сервера: ${stderr}`);
      return;
    }
    console.log(`Вывод сервера: ${stdout}`);
  });
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // autoHideMenuBar: true,
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
