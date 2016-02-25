"use strict";

import * as Debug from "debug";
import {Component, Input, OnChanges, SimpleChange} from "angular2/core";
import {ITab, TabType} from "../tabs/tabs";
import {ServerConnection} from "../server-connection/server-connection";
import {WorkspaceState} from "../../model/workspace";

let debug = Debug("mf:component/work-area/WorkArea");
// let error = Debug("mf:component/work-area/WorkArea:error");

@Component({
    directives: [ServerConnection],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "work-area",
    templateUrl: "component/work-area/work-area.html",
})

export class WorkArea implements OnChanges {
    @Input() public tab: ITab;
    public modal: "connection" = null;
    public hello: boolean = true;

    public state = new WorkspaceState();

    public tabSelected() {
        debug("tabSelected()");
        if (this.tab && this.tab.type === TabType.connection) {
            this.hello = false;
        } else {
            this.hello = true;
        }
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        debug("ngOnChanges(chages: %s)", changes);
        // FIXME: need an interface for changes
        /* tslint:disable:no-string-literal */
        if (changes["tab"]) {
        /* tslint:enable:no-string-literal */
            this.tabSelected();
        }
    }
}
