import * as util from 'util';
import {Component, Input} from 'angular2/core';
import {Tabs} from './layout/tabs';
import {TopNav} from './layout/top-nav';

@Component({
    selector: 'app',
    //moduleId: module.id,
    templateUrl: 'component/app.html',
    directives: [Tabs,TopNav],
})

export class App {
    uri: string = "mongodb://localhost";
    response = "nothing\nto\nsee\nhere\n";
    
    constructor() {

    }
}
