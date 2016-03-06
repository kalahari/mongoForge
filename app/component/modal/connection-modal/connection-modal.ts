"use strict";

// import * as util from "util";
import "moment-duration-format";
import {Component, Input/*, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit*/} from "angular2/core";
import {ServerConnectionOptions} from "../../../model/server-connection";
import {SessionState} from "../../../model/session-state";

@Component({
    // directives: [ResizeBar, CollectionList],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "connection-modal",
    styleUrls: ["component/modal/connection-modal/connection-modal.css"],
    templateUrl: "component/modal/connection-modal/connection-modal.html",
})

export class ConnectionModal {
    public options = new ServerConnectionOptions();
    @Input() public sessionState: SessionState;

    public onSubmit() {
        this.sessionState.connectionOptions = this.options;
        this.sessionState.modal = null;
        this.sessionState.connect();
    }
}
