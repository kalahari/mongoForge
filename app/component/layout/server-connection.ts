import * as util from 'util';
import {Component, Input, OnInit} from 'angular2/core';
import {Tab} from './tabs';
import {Connection, ConnectionTab} from '../../data/connection'

@Component({
    selector: 'server-connection',
    //moduleId: module.id,
    templateUrl: 'component/layout/server-connection.html',
    //styleUrls: ['component/layout/server-connection.css'],
})

export class ServerConnection implements OnInit {
    @Input() tab: ConnectionTab;
    response = "";
    uri: string;
    conn: Connection;
    
    constructor() {
        console.log('ServerConnection constructor');
    }
    
    ngOnInit() {
        console.log('ServerConnection init');
        console.log("Tab is: " + util.inspect(this.tab));
        this.uri = this.tab.uri;
        this.conn = new Connection(this.uri);
        this.conn.connect()
            .then(() => this.conn.getServerStatus())
            .then(r => this.response += "### SERVER STATUS ###\n" + util.inspect(r))
            .catch(e => console.error(e));
    }
}
