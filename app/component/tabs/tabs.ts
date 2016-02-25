"use strict";

import * as Debug from "debug";
import {Component, Input, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";
import {Tab} from "../../model/tab";

let debug = Debug("mf:component/tabs/Tabs");
// let error = Debug("mf:component/tabs/Tabs:error");

@Component({
    // directives: [],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "tabs",
    styleUrls: ["component/tabs/tabs.css"],
    templateUrl: "component/tabs/tabs.html",
})

export class Tabs {
    public tabs: Tab[] = [];
    @Input() public activeTabId = Tab.HelloTab().id;
    @Output() public tabSelected = new EventEmitter<Tab>();

    constructor() {
        debug("constructor()");
        this.addTab(Tab.HelloTab());
    }

    public selectTab(tab: Tab) {
        debug("selectTab(tab: %s)", tab);
        if(this.activeTabId !== tab.id) {
            this.tabSelected.emit(tab);
        }
    }

    public addTab(tab: Tab) {
        debug("addTab(tab: %s)", tab);
        if (this.tabs.indexOf(Tab.HelloTab()) >= 0) {
            this.removeTab(Tab.HelloTab());
        }
        this.tabs.push(tab);
    }

    public removeTab(tab: Tab) {
        debug("removeTab(tab: %s)", tab);
        this.tabs.splice(this.tabs.indexOf(tab), 1);
    }
}
