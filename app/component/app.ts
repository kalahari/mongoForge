import {Component} from 'angular2/core';
import {Tab} from './layout/tab';
import {Tabs} from './layout/tabs';

@Component({
    selector: 'app',
    //moduleId: module.id,
    templateUrl: 'component/app.html',
    directives: [Tabs,Tab],
})

export class App {
    constructor() { }
}
