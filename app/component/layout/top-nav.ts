"use strict";

import * as Debug from "debug";
import {Component, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";

let debug = Debug("mf:component/layout/TopNav");
// let error = Debug("mf:component/layout/TopNav:error");

@Component({
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "top-nav",
    styleUrls: ["component/layout/top-nav.css"],
    templateUrl: "component/layout/top-nav.html",
})

export class TopNav {
    public uri = "mongodb://localhost";
    public submitting = false;
    @Output() public connect = new EventEmitter<string>();

    // constructor() {
    //     
    // }

    public onSubmit() {
        debug("onSubmit()");
        this.submitting = true;
        debug("submitting: " + this.uri);
        this.connect.emit(this.uri);
        this.submitting = false;
    }
}
