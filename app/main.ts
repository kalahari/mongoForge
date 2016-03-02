"use strict";

import "source-map-support/register";
import * as util from "util";
import { app, BrowserWindow, ipcMain } from "electron";
import { ObjectID } from "mongodb";
import { Persistence } from "./service/persistence";

interface IWindowState {
    width: number,
    height: number,
    maximized: boolean,
    x?: number,
    y?: number,
}

const persist = new Persistence();
let window: GitHubElectron.BrowserWindow = null;

let openWindow = (uri: string) => {
    let lastWindowState: IWindowState = persist.get("lastWindowState");
    if (lastWindowState === null) {
        lastWindowState = {
            width: 1200,
            height: 900,
            maximized: false 
        };
    }
    window = new BrowserWindow({
        x: lastWindowState.x,
        y: lastWindowState.y,
        width: lastWindowState.width, 
        height: lastWindowState.height,
    });
    if (lastWindowState.maximized) {
        window.maximize();
    }
    window.loadURL("file://" + __dirname + uri);
    window.on('close', () => {
        let maximized = window.isMaximized();
        if(maximized) {
            window.unmaximize();
        }
        let bounds = window.getBounds(); 
        persist.set("lastWindowState", {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
            maximized: maximized,
        });
        window = null;
    });
};

app.on("window-all-closed", () => {
    // FIXME: quit on close should be a setting
    // if (process.platform != "darwin") {
    app.quit();
    // }
});

app.on("ready", () => {
    ipcMain.on("console-log", (event, msg, ...args) => {
        if (typeof msg !== "string") {
            msg = util.inspect(msg);
        }
        console.log("[Browser] " + msg, ...args);
    });
    ipcMain.on("console-error", (event, msg, ...args) => {
        if (typeof msg !== "string") {
            msg = util.inspect(msg);
        }
        console.error("[Browser ERROR] " + msg, ...args);
    });

    openWindow("/index.html");
});
