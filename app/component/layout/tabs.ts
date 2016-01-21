"use strict";

import * as Debug from 'debug';
import {EventEmitter} from 'events';
import {Component, Output} from 'angular2/core';
import {ServerConnection} from './server-connection';

var debug = Debug('mf:component/layout/Tabs');
var error = Debug('mf:component/layout/Tabs:error');

export enum TabType {
    hello = 1,
    connection,
}

export interface Tab {
    active: boolean;
    title: string;
    type: TabType;
}

@Component({
    selector: 'tabs',
    //moduleId: module.id,
    templateUrl: 'component/layout/tabs.html',
    directives: [ServerConnection],
})

export class Tabs {
    tabs: Tab[] = [];
    helloTab: Tab;
    @Output() tabSelected: EventEmitter;

    constructor() {
        this.helloTab = { title: "Hello!", type: TabType.hello, active: true };
        this.tabSelected = new EventEmitter();
        this.addTab(this.helloTab);
    }

    selectTab(tab: Tab) {
        this.tabs.forEach(t => {
            t.active = t === tab;
        });
        this.tabSelected.emit("tab", tab);
    }

    addTab(tab: Tab) {
        if (this.helloTab !== null && this.helloTab !== tab) {
            this.removeTab(this.helloTab);
            this.helloTab = null;
        }

        if (tab.active || this.tabs.length === 0) {
            tab.active = true;
            this.tabs.forEach(t => t.active = false);
        }

        this.tabs.push(tab);
        
        if(tab.active) this.tabSelected.emit("tab", tab);
    }

    removeTab(tab: Tab) {
        this.removeTabAt(this.tabs.indexOf(tab));
    }

    removeTabAt(index: number) {
        let [removed] = this.tabs.splice(index, 1);
        if (removed && removed.active && this.tabs.length > 0) {
            let activeTab = this.tabs[0]
            activeTab.active = true;
            this.tabSelected.emit('tab', activeTab);
        }
    }
}