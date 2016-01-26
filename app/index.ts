"use strict";
/// <reference="../typings/tsd.d.ts" />

import "source-map-support/register";
import {bootstrap} from "angular2/platform/browser";
import { App } from "./component/app";
import { ipcRenderer } from "electron";

// FXIME: setting
let captureBrowserConsole = true;
if (captureBrowserConsole) {
    let oldConsoleLog = console.log;
    let oldConsoleError = console.error;
    console.log = function(...params: any[]) {
        ipcRenderer.send("console-log", ...params);
        oldConsoleLog.apply(console, params);
    };
    console.error = function(...params: any[]) {
        ipcRenderer.send("console-error", ...params);
        oldConsoleError.apply(console, params);
    };
}

bootstrap(App).catch(e => console.error(e));
