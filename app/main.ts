"use strict";

import "source-map-support/register";
import * as util from "util";
import { app, BrowserWindow, ipcMain } from "electron";
import { Persistence } from "./service/persistence";

interface IWindowState {
    width: number;
    height: number;
    maximized: boolean;
    x?: number;
    y?: number;
}

const persist = new Persistence();
let window: GitHubElectron.BrowserWindow = undefined;

let openWindow = (uri: string) => {
    let lastWindowState: IWindowState = persist.get("lastWindowState");
    if (lastWindowState == null) {
        lastWindowState = {
            height: 900,
            maximized: false,
            width: 1200,
        };
    }
    window = new BrowserWindow({
        height: lastWindowState.height,
        width: lastWindowState.width,
        x: lastWindowState.x,
        y: lastWindowState.y,
    });
    if (lastWindowState.maximized) {
        window.maximize();
    }
    window.loadURL("file://" + __dirname + uri);
    window.on("close", () => {
        let maximized = window.isMaximized();
        if (maximized) {
            window.unmaximize();
        }
        let bounds = window.getBounds();
        persist.set("lastWindowState", {
            height: bounds.height,
            maximized: maximized,
            width: bounds.width,
            x: bounds.x,
            y: bounds.y,
        });
        window = undefined;
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
