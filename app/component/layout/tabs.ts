"use strict";

import * as Debug from "debug";
import {Component, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";

let debug = Debug("mf:component/layout/Tabs");
// let error = Debug("mf:component/layout/Tabs:error");

export enum TabType {
    hello = 1,
    connection,
}

export interface ITab {
    active: boolean;
    title: string;
    type: TabType;
}

@Component({
    // directives: [],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "tabs",
    styleUrls: ["component/layout/tabs.css"],
    templateUrl: "component/layout/tabs.html",
})

export class Tabs {
    public tabs: ITab[] = [];
    public helloTab: ITab;
    @Output() public tabSelected = new EventEmitter<ITab>();

    constructor() {
        debug("constructor()");
        this.helloTab = { active: true, title: "Hello!", type: TabType.hello };
        this.addTab(this.helloTab);
    }

    public selectTab(tab: ITab) {
        debug("selectTab(tab: %s)", tab);
        this.tabs.forEach(t => {
            t.active = t === tab;
        });
        this.tabSelected.emit(tab);
    }

    public addTab(tab: ITab) {
        debug("addTab(tab: %s)", tab);
        if (this.helloTab !== undefined && this.helloTab !== tab) {
            this.removeTab(this.helloTab);
            this.helloTab = undefined;
        }

        if (tab.active || this.tabs.length === 0) {
            tab.active = true;
            this.tabs.forEach(t => t.active = false);
        }

        this.tabs.push(tab);

        if (tab.active) {
            this.tabSelected.emit(tab);
        }
    }

    public removeTab(tab: ITab) {
        debug("removeTab(tab: %s)", tab);
        this.removeTabAt(this.tabs.indexOf(tab));
    }

    public removeTabAt(index: number) {
        debug("removeTabAt(index: %s)", index);
        let [removed] = this.tabs.splice(index, 1);
        if (removed && removed.active && this.tabs.length > 0) {
            let activeTab = this.tabs[0];
            activeTab.active = true;
            this.tabSelected.emit(activeTab);
        }
    }
}
