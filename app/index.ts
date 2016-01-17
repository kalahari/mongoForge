"use strict";
/// <reference="../typings/tsd.d.ts" />

import {bootstrap} from 'angular2/platform/browser';
import { App } from './component/app';
import { ipcRenderer } from 'electron';

if (true) { // setting
    let oldConsoleLog = console.log;
    let oldConsoleError = console.error;
    console.log = function(...params) {
        ipcRenderer.send('console-log', ...params)
        oldConsoleLog.apply(console, params);
    }
    console.error = function(...params) {
        ipcRenderer.send('console-error', ...params)
        oldConsoleError.apply(console, params);
    }
}

bootstrap(App);
