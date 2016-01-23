"use strict";

import * as Debug from 'debug';
import * as util from 'util';
import {Component, Input, OnInit, OnChanges, ViewChild,
    ElementRef, ViewEncapsulation, AfterViewInit} from 'angular2/core';
import {Tab} from './tabs';
import {ResizeBar, ResizeDelta} from './resize-bar';
import {Connection, ConnectionTab} from '../../data/connection';
//import 'ace-builds/src-noconflict/ace';

var debug = Debug('mf:component/layout/ServerConnection');
var error = Debug('mf:component/layout/ServerConnection:error');

const MIN_LEFT_BAR_WIDTH = 25;
const MIN_INPUT_HEIGHT = 40;

@Component({
    selector: 'server-connection',
    //moduleId: module.id,
    templateUrl: 'component/layout/server-connection.html',
    styleUrls: ['component/layout/server-connection.css'],
    //encapsulation: ViewEncapsulation.Native,
    directives: [ResizeBar],
})

export class ServerConnection implements OnInit, AfterViewInit {
    @Input() tab: ConnectionTab;
    @ViewChild('controls') controls: ElementRef;
    @ViewChild('inputEditor') inputEditorElement: ElementRef;
    @ViewChild('outputEditor') outputEditorElement: ElementRef;

    uri: string;
    conn: Connection;
    inputEditor: AceAjax.Editor;
    outputEditor: AceAjax.Editor;
        
    private _leftBarWidth = 50;
    private _resizeLeftBarWidth = 5;
    private _inputPaneHeight = 100;
    private _resizeInputPaneHeight = 5;
    private _controlsHeight = 20;

    get leftBarWidth() {
        debug('leftBarWidth()');
        return this._leftBarWidth + "px";
    }
    get rightPanelLeft() {
        debug('rightPanelLeft()');
        return (this._leftBarWidth + this._resizeLeftBarWidth) + "px";
    }
    get inputPaneHeight() {
        debug('inputPaneHeight()');
        return this._inputPaneHeight + "px";
    }
    get controlsTop() {
        debug('controlsTop()');
        return (this._inputPaneHeight + this._resizeInputPaneHeight) + "px";
    }
    get outputPaneTop() {
        debug('outputPaneTop()');
        return (this._inputPaneHeight + this._resizeInputPaneHeight + this._controlsHeight) + "px";
    }
    
    // constructor() {
    //     debug('constructor');
    // }
    
    editorsResized() {
        this.inputEditor.resize();
        this.outputEditor.resize();
    }
    
    resize() {
        debug("resize()");
        if(!this.controls || !this.controls.nativeElement) {
            let message = "Nothig found for controls: " + util.inspect(this.controls);
            error(message);
            return Promise.reject(new Error(message));
        }
        let newHeight = this.controls.nativeElement.clientHeight;
        debug("resize newHeight: %s, _controlsHeight: %s",
            newHeight, this._controlsHeight);
        if(this._controlsHeight !== newHeight) {
            return new Promise<void>((resolve, reject) => {
                // setImmediate prevents mutate after check exception
                setImmediate(() => {
                    this._controlsHeight = newHeight;
                    resolve();
                });
            });
        }
        return Promise.resolve();
    }
    
    ngOnInit() {
        debug('ngOnInit()');
        this.uri = this.tab.uri;
        this.conn = new Connection(this.uri);
        this.conn.on('rawInput', input => this.in(input));
        this.conn.on('rawOutput', output => this.out(output));
        this.conn.on('rawError', error => this.err(error));
        this.conn.connect()
            //.then(() => this.conn.getServerStatus())
            .then(() => this.appendOutput("// CONNECTED: " + this.uri + "\n"))
            .then(() => this.conn.ping())
            .catch(e => this.err(e));
    }
    
    ngAfterViewInit() {
        this.resize()
            .then(() => {
                //console.log(util.inspect(ace));
                this.inputEditor = ace.edit(this.inputEditorElement.nativeElement);
                this.inputEditor.setTheme('ace/theme/cobalt');
                this.inputEditor.getSession().setMode("ace/mode/javascript");
                this.outputEditor = ace.edit(this.outputEditorElement.nativeElement);
                this.outputEditor.setTheme('ace/theme/cobalt');
                this.outputEditor.setReadOnly(true);
                this.inputEditor.getSession().setMode("ace/mode/javascript");
            });
    }
    
    resizeLeftBar(delta: ResizeDelta) {
        debug('resizeLeftBar(delta: %s)', delta);
        this._leftBarWidth += delta.x;
        if(this._leftBarWidth < MIN_LEFT_BAR_WIDTH) {
            this._leftBarWidth = MIN_LEFT_BAR_WIDTH;
        }
    }

    
    resizeInput(delta: ResizeDelta) {
        debug('resizeInput(delta: %s)', delta);
        this._inputPaneHeight += delta.y;
        if(this._inputPaneHeight < MIN_INPUT_HEIGHT) {
            this._inputPaneHeight = MIN_INPUT_HEIGHT;
        }
    }
    
    runInput() {
        debug('runInput()');
        this.runCommand(this.inputEditor.getSession().getValue());
    }
    
    runCommand(command: string) {
        debug('runCommand(command: %s)', command);
        //console.log("Running command: " + command);
        return this.execCommand(command, /^\s*\{/.test(command))
            .catch(e => this.err(e));
    }
    
    execCommand(command: string, isCmdObj: boolean) {
        debug('ngOnChanges(command: %s, isCmdObj: %s)', command, isCmdObj);
        if(!isCmdObj) this.in(command);
        let result = null;
        try {
            let ctx = { db: this.conn.db };
            let cmd = "\"use strict\";\nlet db = this.db;\n";
            if(isCmdObj) cmd += "let ret = ";
            cmd += command;
            if(isCmdObj) cmd += ";\nret;\n";
            console.log('Evaling: ' + cmd);
            let env = () => eval(cmd)
            result = env.call(ctx);
        } catch(err) {
            return Promise.reject(err);
        }
        if(isCmdObj) {
            return this.conn.runCommand(result);
        }
        return Promise.resolve(result)
            .then(r => this.out(r))
    }
    
    in(cmd: any) {
        this.appendOutput("\n// IN:\n// " + this.stringify(cmd, true) + "\n");
        return cmd;
    }
    
    out(val: any) {
        this.appendOutput("\n// OUT:\n" + this.stringify(val) + "\n");
        return val;
    }
    
    err(val: any) {
        this.appendOutput("\n// ERR:\n" + this.stringify(val) + "\n");
        return val;
    }
    
    stringify(val: any, comment: boolean = false) {
        let strVal = "";
        if(typeof val === "string") {
            strVal = val;
        } else {
            strVal = util.inspect(val);
        }
        if(comment) {
            //strVal.trim();
            strVal = strVal.replace("\n", "\n// ")
        }
        return strVal;
    }
    
    appendOutput(text: string) {
        let session = this.outputEditor.getSession();
        session.insert({
            row: session.getLength(),
            column: 0,
        }, text);
        this.outputEditor.scrollToLine(session.getLength() - 1, false, false, null);
    }
}
