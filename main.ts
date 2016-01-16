'use strict';
/// <reference path="typings/tsd.d.ts" />

import { app, BrowserWindow } from 'electron';

// import Menu = require('menu');
// import MenuItem = require('menu-item');
// import dialog = require('dialog');
// import ipc = require('ipc');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow: BrowserWindow = null;

// entry point
function main() {
  // Report crashes to our server.
  //require('crash-reporter').start();

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
      app.quit();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', () => {

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 600,
      height: 300,
      'min-width': 500,
      'min-height': 200,
      'accept-first-mouse': true,
      //'title-bar-style': 'hidden',
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/window.html');

    // Open the DevTools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    // // Build our new menu
    // var menu = new Menu();
    // menu.append(new MenuItem({
    //   label: 'Delete',
    //   click: () => {
    //     // Trigger an alert when menu item is clicked
    //     dialog.showMessageBox(mainWindow, {
    //       type: 'info',
    //       title: 'Deleted',
    //       message: 'Deleted',
    //       buttons: ['OK'],
    //     });
    //     //alert('Deleted')
    //   }
    // }));
    // menu.append(new MenuItem({
    //   label: 'More Info...',
    //   click: () => {
    //     // Trigger an alert when menu item is clicked
    //     dialog.showMessageBox(mainWindow, {
    //       type: 'info',
    //       title: 'More Info',
    //       message: 'Here is more information',
    //       buttons: ['OK'],
    //     });
    //     //alert('Here is more information')
    //   }
    // }));
    
    
  });
}

main();
