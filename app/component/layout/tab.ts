import {Component, Input} from 'angular2/core';
import {Tabs} from './tabs';
import {ServerConnection} from './server-connection';

@Component({
    selector: 'tab',
    //moduleId: module.id,
    templateUrl: 'component/layout/tab.html',
    styleUrls: ['component/layout/tab.css'],
    directives: [ServerConnection],
})

export class Tab {
    @Input('tab-title') title = "Tab Title";
    @Input() active = this.active || false;
    @Input('tab-type') type = "hello";
    uri = "";

    constructor(private tabs: Tabs) {
        this.tabs.addTab(this);
    }
    
    remove() {
        this.tabs.removeTab(this);
    }
}
