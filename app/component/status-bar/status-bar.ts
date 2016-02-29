"use strict";

import {Component, Input} from "angular2/core";
import {SessionState} from "../../model/session-state";

@Component({
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "status-bar",
    templateUrl: "component/status-bar/status-bar.html",
})

export class StatusBar {
    @Input() public sessionState: SessionState;
}
