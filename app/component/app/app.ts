"use strict";

import * as Debug from "debug";
import * as util from "util";
import {Component, Input, ViewChild, ElementRef, AfterViewInit, Inject} from "angular2/core";
import {Tabs} from "../tabs/tabs";
import {Tab} from "../../model/tab";
import {TopNav} from "../top-nav/top-nav";
import {StatusBar} from "../status-bar/status-bar";
import {ConnectionModal} from "../modal/connection-modal/connection-modal";
import {ServerConnection} from "../server-connection/server-connection";
import {SessionState} from "../../model/session-state";
import {SessionService} from "../../service/session-service";

const debug = Debug("mf:component/app/App");

@Component({
    directives: [Tabs, TopNav, StatusBar, ConnectionModal, ServerConnection],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "app",
    styleUrls: ["component/app/app.css"],
    templateUrl: "component/app/app.html",
    providers:[SessionService],
})

export class App implements AfterViewInit {
    @ViewChild("topBar") public topBar: ElementRef;
    @ViewChild("tabs") public tabs: Tabs;
    public topBarHeight = "9em";
    public currentSession: SessionState;
    public get hello() {
        return !this.currentSession;
    }

    constructor(private sessionService: SessionService) { }

    public resize() {
        if (!this.topBar || !this.topBar.nativeElement) {
            // throw new Error("Nothig found for topBar: " + util.inspect(this.topBar));
            console.error("Nothig found for topBar: " + util.inspect(this.topBar));
            return;
        }
        let newHeight = this.topBar.nativeElement.clientHeight + "px";
        // debug("app.resize newHeight: %s, topBarHeight: %s",
        //     newHeight, this.topBarHeight);
        if (this.topBarHeight !== newHeight) {
            // setImmediate prevents mutate after check exception
            setImmediate(() => this.topBarHeight = newHeight);
        }
    }

    public ngAfterViewInit() {
        this.resize();
    }

    public connectToServer(uri: string, showOptions: boolean) {
        let tab = new Tab(uri);
        this.tabs.addTab(tab);
        this.tabs.selectTab(tab);
        this.currentSession = this.sessionService.getSession(tab.id);
        this.currentSession.uri = uri;
        if(showOptions) {
            this.currentSession.modal = "connection";
        } else {
            this.currentSession.connect();
        }
        setImmediate(() => this.resize());
    }
    
    public tabSelected(tab: Tab) {
        this.currentSession = this.sessionService.getSession(tab.id);
    }
}
