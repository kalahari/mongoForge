"use strict";

import {Component, Input, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";
import {Tab} from "../../model/tab";

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
        this.addTab(Tab.HelloTab());
    }

    public selectTab(tab: Tab) {
        if(this.activeTabId !== tab.id) {
            this.tabSelected.emit(tab);
        }
    }

    public addTab(tab: Tab) {
        if (this.tabs.indexOf(Tab.HelloTab()) >= 0) {
            this.removeTab(Tab.HelloTab());
        }
        this.tabs.push(tab);
    }

    public removeTab(tab: Tab) {
        this.tabs.splice(this.tabs.indexOf(tab), 1);
    }
}
