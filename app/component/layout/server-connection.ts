import {Component, Input} from 'angular2/core';
import {Tab} from './tab';
import {Connection} from '../../data/connection'

@Component({
    selector: 'server-connection',
    //moduleId: module.id,
    templateUrl: 'component/layout/server-connection.html',
    //styleUrls: ['component/layout/server-connection.css'],
})

export class ServerConnection {
    @Input() uri: string = "localhost";
    response = "";
    
    constructor(tab: Tab) {
        let conn = new Connection({ uri: this.uri });
        conn.connect()
            .then(r => console.log("connection result: " + JSON.stringify(r)))
            .catch(e => console.error(e));
    }
}
