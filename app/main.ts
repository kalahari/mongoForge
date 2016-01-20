"use strict";

import 'source-map-support/register';
import * as util from 'util';
import { app, BrowserWindow, ipcMain } from 'electron';

var windows: GitHubElectron.BrowserWindow[] = [];

var openWindow = (uri: string, options: GitHubElectron.BrowserWindowOptions) => {
    let window = new BrowserWindow(options);
    windows.push(window);
    window.loadURL('file://' + __dirname + uri);
    window.on('closed', () => windows.splice(windows.indexOf(window)));
}

app.on('window-all-closed', () => {
    //if (process.platform != 'darwin') {
    app.quit();
    //}
});

app.on('ready', function () {
    ipcMain.on('console-log', (event, msg, ...args) => {
        if(typeof msg !== "string") {
            msg = util.inspect(msg);
        }
        console.log('[Browser] ' + msg, ...args);
    });
    ipcMain.on('console-error', (event, msg, ...args) => {
        if(typeof msg !== "string") {
            msg = util.inspect(msg);
        }
        console.error('[Browser ERROR] ' + msg, ...args);
    });
    
    openWindow('/index.html', { width: 1200, height: 900 });

    //openWindow('/test.html', { width: 1200, height: 900 });
});
