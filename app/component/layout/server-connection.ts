"use strict";

import * as util from 'util';
import {Component, Input, OnInit, OnChanges} from 'angular2/core';
import {Tab} from './tabs';
import {Connection, ConnectionTab} from '../../data/connection'

@Component({
    selector: 'server-connection',
    //moduleId: module.id,
    templateUrl: 'component/layout/server-connection.html',
    styleUrls: ['component/layout/server-connection.css'],
})

export class ServerConnection implements OnInit {
    @Input() tab: ConnectionTab;
    response = "";
    uri: string;
    conn: Connection;
    output: any;
    history = ["db.collection('test').find({}).toArray()"];
    
    constructor() {
        console.log('ServerConnection constructor');
    }
    
    ngOnInit() {
        console.log('ServerConnection init');
        console.log("Tab is: " + util.inspect(this.tab));
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
    
    ngOnChange() {
        this.output.scrollTop = this.output.scrollHeight - this.output.clientHeight;
    }
    
    runCommand(command: string) {
        //console.log("Running command: " + command);
        return this.execCommand(command, /^\s*\{/.test(command))
            .catch(e => this.err(e));
    }
    
    execCommand(command: string, isCmdObj: boolean) {
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
