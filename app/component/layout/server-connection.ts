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
    
    constructor() {
        console.log('ServerConnection constructor');
    }
    
    ngOnInit() {
        console.log('ServerConnection init');
        console.log("Tab is: " + util.inspect(this.tab));
        this.uri = this.tab.uri;
        this.conn = new Connection(this.uri);
        this.conn.connect()
            //.then(() => this.conn.getServerStatus())
            .then(() => this.response += "### CONNECTED: " + this.uri + "\n")
            .catch(e => console.error(e));
    }
    
    ngOnChange() {
        this.output.scrollTop = this.output.scrollHeight - this.output.clientHeight;
    }
    
    runCommand(command: string) {
        console.log("Running command: " + command);
        this.execCommand(command)
            .then(r => this.out(r))
            .catch(e => this.err(e));
    }
    
    execCommand(command: string) {
        this.response += "\n### IN:\n" + command + "\n";
        try {
            let ctx = { db: this.conn.db };
            let env = () => eval("\"use strict\";\nlet db = this.db;\n" + command)
            let result = env.call(ctx);
            return Promise.resolve(result)
        } catch(err) {
            return Promise.reject(err);
        }
    }
    
    out(val: any) {
        this.response += "\n### OUT:\n" + util.inspect(val) + "\n";
    }
    
    err(val: any) {
        this.response += "\n### ERR:\n" + util.inspect(val) + "\n";
    }
}
