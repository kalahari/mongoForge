"use strict";

import * as Debug from "debug";
import {Component, Input, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";

let debug = Debug("mf:component/tabs/Tabs");
// let error = Debug("mf:component/tabs/Tabs:error");

export enum TabType {
    hello = 1,
    connection,
}

export interface ITab {
    id: number;
    title: string;
    type: TabType;
}

export const HELLO_TAB_ID = 1;

@Component({
    // directives: [],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "tabs",
    styleUrls: ["component/tabs/tabs.css"],
    templateUrl: "component/tabs/tabs.html",
})

export class Tabs {
    public tabs: ITab[] = [];
    public helloTab: ITab;
    @Input() public activeTab = HELLO_TAB_ID;
    @Output() public tabSelected = new EventEmitter<ITab>();

    constructor() {
        debug("constructor()");
        this.helloTab = { id: HELLO_TAB_ID, title: "Hello!", type: TabType.hello };
        this.addTab(this.helloTab);
    }

    public selectTab(tab: ITab) {
        debug("selectTab(tab: %s)", tab);
        if(this.activeTab !== tab.id) {
            this.tabSelected.emit(tab);
        }
    }

    public addTab(tab: ITab) {
        debug("addTab(tab: %s)", tab);
        if (this.helloTab !== undefined && this.helloTab !== tab) {
            this.removeTab(this.helloTab);
            this.helloTab = undefined;
        }

        this.tabs.push(tab);
    }

    public removeTab(tab: ITab) {
        debug("removeTab(tab: %s)", tab);
        this.tabs.splice(this.tabs.indexOf(tab), 1);
    }
}
