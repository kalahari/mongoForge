import {Component, Input} from 'angular2/core';
import {Tabs} from './tabs';

@Component({
    selector: 'tab',
    //moduleId: module.id,
    templateUrl: 'component/layout/tab.html',
    styleUrls: ['component/layout/tab.css'],
})

export class Tab {
    @Input('tab-title') title = "Tab Title";
    @Input() active = this.active || false;

    constructor(tabs: Tabs) {
        tabs.addTab(this);
    }
}
