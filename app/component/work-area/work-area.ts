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
}
