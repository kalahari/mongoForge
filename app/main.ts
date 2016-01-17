import { app, BrowserWindow, ipcMain } from 'electron';

var mainWindow: GitHubElectron.BrowserWindow = null;

app.on('window-all-closed', () => {
    //if (process.platform != 'darwin') {
    app.quit();
    //}
});

app.on('ready', function () {
    ipcMain.on('console-log', (event, msg, ...args) => console.log('[Browser] ' + msg, ...args));
    ipcMain.on('console-error', (event, msg, ...args) => console.error('[Browser] ' + msg, ...args));
    
    // Initialize the window to our specified dimensions
    mainWindow = new BrowserWindow({ width: 1200, height: 900 });

    // Tell Electron where to load the entry point from
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Clear out the main window when the app is closed
    mainWindow.on('closed', () => { mainWindow = null; });
});
