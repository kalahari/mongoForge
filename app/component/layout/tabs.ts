import {Component} from 'angular2/core';
import {Tab} from './tab';

@Component({
    selector: 'tabs',
    //moduleId: module.id,
    templateUrl: 'component/layout/tabs.html'
})

export class Tabs {
    tabs: Tab[] = [];

    selectTab(tab: Tab) {
        this.tabs.forEach(t => {
            t.active = t === tab;
        });
    }

    addTab(tab: Tab) {
        if (this.tabs.length === 0) {
            tab.active = true;
        }

        this.tabs.push(tab);
    }
}