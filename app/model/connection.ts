"use strict";

import * as Debug from 'debug';
import * as util from 'util';
import * as moment from 'moment';
import {EventEmitter} from 'events'
import {Connection, ConnectionTab} from '../data/connection';

var debug = Debug('mf:model/ConnectionState');
var error = Debug('mf:model/ConnectionState:error');

export class ConnectionState extends EventEmitter {
    connection: Connection;
    input: AceAjax.IEditSession;
    output: AceAjax.IEditSession;
    leftBarWidth: number;
    inputHeight: number;
    tab: ConnectionTab;
    newOutput = false;
    collectionList: any = null;
    
    connect() {
        this.connection = new Connection(this.tab.uri);
        this.connection.on('rawInput', input => this.in(input));
        this.connection.on('rawOutput', output => this.out(output));
        this.connection.on('rawError', error => this.err(error));
        this.connection.connect()
            //.then(() => this.conn.getServerStatus())
            .then(() => this.appendOutput("// CONNECTED: " + this.tab.uri + "\n"))
            .then(() => this.connection.ping())
            .then(() => this.connection.getCollections())
            .then(collList => this.collectionList = collList)
            .catch(e => this.err(e));
    }
    
    appendOutput(text: string) {
        this.output.insert({
            row: this.output.getLength(),
            column: 0,
        }, text);
        this.newOutput = true;
        this.emit("newOutput");
    }
    
    runInput() {
        debug('runInput()');
        let inputSelection = this.input.getSelection();
        if(inputSelection.isEmpty()) {
            return this.runCommand(this.input.getValue());
        }
        this.runCommand(this.input.getTextRange(inputSelection.getRange()));
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
            let ctx = { db: this.connection.db };
            let cmd = '"use strict"\n';
            Object.keys(ctx).forEach(cv => cmd += util.format('let %s = this.%s;\n', cv, cv));
            if(isCmdObj) cmd += "let _return_value = ";
            cmd += command;
            if(isCmdObj) cmd += ";\n_return_value;\n";
            console.log('Evaling: ' + cmd);
            let env = () => eval(cmd)
            result = env.call(ctx);
        } catch(err) {
            return Promise.reject(err);
        }
        if(isCmdObj) {
            return this.connection.runCommand(result);
        }
        return Promise.resolve(result)
            .then(r => this.out(r))
    }
    
    private _start: moment.Moment;
    
    in(cmd: any) {
        this.appendOutput("\n// " + this.stringify(cmd, true));
        this._start = moment();
        return cmd;
    }
    
    out(val: any) {
        return Promise.resolve(val)
            .then(v => {
                this.appendOutput(this.stringify(v) +
                    "// " + moment.duration(moment().diff(this._start)).format("hh:mm:ss", 3) + "\n");
                return v;
            });
    }
    
    err(val: any) {
        this.appendOutput("\n// ERROR:\n" + this.stringify(val));
        return val;
    }
    
    stringify(val: any, comment: boolean = false) {
        let strVal = "";
        if(typeof val === "string") {
            strVal = val;
        } else {
            strVal = util.inspect(val, { depth: 9 });
        }
        if(comment) {
            strVal = strVal.split("\n").join("\n// ");
        }
        if(!/\n\s*$/.test(strVal)) {
            strVal += "\n";
        }
        return strVal;
    }

}