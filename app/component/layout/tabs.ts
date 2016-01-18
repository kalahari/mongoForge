import {Component} from 'angular2/core';
import {Tab} from './tab';

@Component({
    selector: 'tabs',
    //moduleId: module.id,
    templateUrl: 'component/layout/tabs.html'
})

export class Tabs {
    tabs: Tab[] = [];
    helloTab: Tab;
    
    constructor() {
        this.helloTab = new Tab(this);
        this.helloTab.title = "Hello!";
        this.helloTab.type = "hello";
    }

    selectTab(tab: Tab) {
        this.tabs.forEach(t => {
            t.active = t === tab;
        });
    }

    addTab(tab: Tab, active: boolean = true) {
        if(this.helloTab !== null && this.helloTab !== tab) {
            this.removeTab(this.helloTab);
            this.helloTab = null;
        }
        if (active || this.tabs.length === 0) {
            tab.active = true;
            this.tabs.forEach(t => t.active = false);
        }

        this.tabs.push(tab);
    }
    
    removeTab(tab: Tab) {
        let [ removed ] = this.tabs.splice(this.tabs.indexOf(tab), 1);
        if(removed && removed.active && this.tabs.length > 0) {
            this.tabs[0].active = true;
        }
    }
    
    removeTabAt(index: number) {
        this.tabs.splice(index, 1);
    }
}