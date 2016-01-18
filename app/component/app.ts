import {Component, Input} from 'angular2/core';
import {Tab} from './layout/tab';
import {Tabs} from './layout/tabs';
import {TopNav} from './layout/top-nav';
import {Connection} from '../data/connection'

@Component({
    selector: 'app',
    //moduleId: module.id,
    templateUrl: 'component/app.html',
    directives: [Tabs,Tab,TopNav],
})

export class App {
    uri: string = "localhost";
    response = "nothing\nto\nsee\nhere";
    
    constructor() {
        let conn = new Connection({ uri: this.uri });
        conn.connect()
            .then(r => console.log("connection result: " + JSON.stringify(r)))
            .catch(e => console.error(e));
    }
}
