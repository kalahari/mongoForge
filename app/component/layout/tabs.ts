"use strict";

import * as Debug from 'debug';
import {Component, Output, ViewEncapsulation, EventEmitter} from 'angular2/core';

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
    //directives: [],
    encapsulation: ViewEncapsulation.Native,
})

export class Tabs {
    tabs: Tab[] = [];
    helloTab: Tab;
    @Output() tabSelected = new EventEmitter<Tab>();

    constructor() {
        debug('constructor()');
        this.helloTab = { title: "Hello!", type: TabType.hello, active: true };
        this.addTab(this.helloTab);
    }

    selectTab(tab: Tab) {
        debug('selectTab(tab: %s)', tab);
        this.tabs.forEach(t => {
            t.active = t === tab;
        });
        this.tabSelected.emit(tab);
    }

    addTab(tab: Tab) {
        debug('addTab(tab: %s)', tab);
        if (this.helloTab !== null && this.helloTab !== tab) {
            this.removeTab(this.helloTab);
            this.helloTab = null;
        }

        if (tab.active || this.tabs.length === 0) {
            tab.active = true;
            this.tabs.forEach(t => t.active = false);
        }

        this.tabs.push(tab);
        
        if(tab.active) this.tabSelected.emit(tab);
    }

    removeTab(tab: Tab) {
        debug('removeTab(tab: %s)', tab);
        this.removeTabAt(this.tabs.indexOf(tab));
    }

    removeTabAt(index: number) {
        debug('removeTabAt(index: %s)', index);
        let [removed] = this.tabs.splice(index, 1);
        if (removed && removed.active && this.tabs.length > 0) {
            let activeTab = this.tabs[0]
            activeTab.active = true;
            this.tabSelected.emit(activeTab);
        }
    }
}