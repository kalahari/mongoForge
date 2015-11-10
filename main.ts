'use strict';
/// <reference path="typings/tsd.d.ts" />

import app = require('app');  // Module to control application life.
import BrowserWindow = require('browser-window');  // Module to create native browser window.
import Menu = require('menu');
import MenuItem = require('menu-item');

// entry point
function main() {
  // Report crashes to our server.
  require('crash-reporter').start();
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  var mainWindow: BrowserWindow = null;

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
      'title-bar-style': 'hidden'
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/../main.html');

    // Open the DevTools.
    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    // Build our new menu
    var menu = new Menu()
    menu.append(new MenuItem({
      label: 'Delete',
      click: function() {
        // Trigger an alert when menu item is clicked
        alert('Deleted')
      }
    }))
    menu.append(new MenuItem({
      label: 'More Info...',
      click: function() {
        // Trigger an alert when menu item is clicked
        alert('Here is more information')
      }
    }))
  });
}

main();