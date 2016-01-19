"use strict";

import {Component} from 'angular2/core';
import {ServerConnection} from './server-connection';

export interface Tab {
    active: boolean;
    title: string;
    type: string;
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

    constructor() {
        this.helloTab = { title: "Hello!", type: "hello", active: true };
        this.addTab(this.helloTab);
    }

    selectTab(tab: Tab) {
        this.tabs.forEach(t => {
            t.active = t === tab;
        });
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
    }

    removeTab(tab: Tab) {
        this.removeTabAt(this.tabs.indexOf(tab));
    }

    removeTabAt(index: number) {
        let [removed] = this.tabs.splice(index, 1);
        if (removed && removed.active && this.tabs.length > 0) {
            this.tabs[0].active = true;
        }
    }
}