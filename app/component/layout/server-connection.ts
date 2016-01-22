"use strict";

import * as Debug from 'debug';
import * as util from 'util';
import {Component, Input, OnInit, OnChanges, ViewChild,
    ElementRef, ViewEncapsulation, AfterViewInit} from 'angular2/core';
import {Tab} from './tabs';
import {ResizeBar, ResizeDelta} from './resize-bar';
import {Connection, ConnectionTab} from '../../data/connection'

var debug = Debug('mf:component/layout/ServerConnection');
var error = Debug('mf:component/layout/ServerConnection:error');

const MIN_LEFT_BAR_WIDTH = 25;
const MIN_INPUT_HEIGHT = 40;

@Component({
    selector: 'server-connection',
    //moduleId: module.id,
    templateUrl: 'component/layout/server-connection.html',
    styleUrls: ['component/layout/server-connection.css'],
    encapsulation: ViewEncapsulation.Native,
    directives: [ResizeBar],
})

export class ServerConnection implements OnInit, AfterViewInit {
    @Input() tab: ConnectionTab;
    @ViewChild('controls') controls: ElementRef;

    response = "";
    uri: string;
    conn: Connection;
    output: any;
    history = ["db.collection('test').find({}).toArray()"];
    
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
    
    resize() {
        debug("resize()");
        if(!this.controls || !this.controls.nativeElement) {
            error("Nothig found for controls: " + util.inspect(this.controls));
            return;
        }
        let newHeight = this.controls.nativeElement.clientHeight;
        debug("resize newHeight: %s, _controlsHeight: %s",
            newHeight, this._controlsHeight);
        if(this._controlsHeight !== newHeight) {
            // setImmediate prevents mutate after check exception
            setImmediate(() => this._controlsHeight = newHeight);
        }
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
            .then(() => this.response += "### CONNECTED: " + this.uri + "\n")
            .then(() => this.conn.ping())
            .catch(e => this.err(e));
    }
    
    ngAfterViewInit() {
        this.resize();
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
    
    ngOnChange() {
        debug('ngOnChange()');
        this.output.scrollTop = this.output.scrollHeight - this.output.clientHeight;
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
        this.history.push(command);
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
        this.response += "\n### IN:\n" + this.stringify(cmd) + "\n";
        return cmd;
    }
    
    out(val: any) {
        this.response += "\n### OUT:\n" + this.stringify(val) + "\n";
        return val;
    }
    
    err(val: any) {
        this.response += "\n### ERR:\n" + this.stringify(val) + "\n";
        return val;
    }
    
    stringify(val: any) {
        if(typeof val === "string") return val;
        return util.inspect(val);
    }
}
