"use strict";

import * as Debug from "debug";
import * as util from "util";
import {Component, ViewChild, ElementRef, AfterViewInit} from "angular2/core";
import {Tabs, ITab} from "../tabs/tabs";
import {TopNav} from "../top-nav/top-nav";
import {WorkArea} from "../work-area/work-area";
import {StatusBar} from "../status-bar/status-bar";
import {ConnectionTab} from "../../data/connection";

let debug = Debug("mf:component/app/App");
let error = Debug("mf:component/app/App:error");

@Component({
    directives: [Tabs, TopNav, WorkArea, StatusBar],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "app",
    styleUrls: ["component/app/app.css"],
    templateUrl: "component/app/app.html",
})

export class App implements AfterViewInit {
    @ViewChild("topBar") public topBar: ElementRef;
    @ViewChild("tabs") public tabs: Tabs;
    public topBarHeight = "9em";
    public currentTab: ITab;

    // constructor() {
    //     debug("constructor()");
    // }

    public resize() {
        debug("resize()");
        if (!this.topBar || !this.topBar.nativeElement) {
            error("Nothig found for topBar: " + util.inspect(this.topBar));
            return;
        }
        let newHeight = this.topBar.nativeElement.clientHeight + "px";
        debug("app.resize newHeight: %s, topBarHeight: %s",
            newHeight, this.topBarHeight);
        if (this.topBarHeight !== newHeight) {
            // setImmediate prevents mutate after check exception
            setImmediate(() => this.topBarHeight = newHeight);
        }
    }

    public ngAfterViewInit() {
        debug("ngAfterViewInit()");
        this.resize();
    }

    public setCurrentTab(tab: ITab) {
        debug("setCurrentTab(tab: %s)", tab);
        this.currentTab = tab;
    }

    public connectToServer(uri: string, showOptions: boolean) {
        debug("connectToServer(uri: %s)", uri);
        let tab = new ConnectionTab();
        tab.uri = uri;
        this.tabs.addTab(tab, showOptions);
        setImmediate(() => this.resize());
    }
}
