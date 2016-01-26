"use strict";

import * as Debug from "debug";
import {Component, Input, OnChanges, SimpleChange} from "angular2/core";
import {ITab, TabType} from "./tabs";
import {ServerConnection} from "./server-connection";

let debug = Debug("mf:component/layout/WorkArea");
// let error = Debug("mf:component/layout/WorkArea:error");

@Component({
    directives: [ServerConnection],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "work-area",
    templateUrl: "component/layout/work-area.html",
})

export class WorkArea implements OnChanges {
    @Input() public tab: ITab;
    public hello: boolean = true;

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
