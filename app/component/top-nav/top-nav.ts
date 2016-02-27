"use strict";

import {Component, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";

@Component({
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "top-nav",
    styleUrls: ["component/top-nav/top-nav.css"],
    templateUrl: "component/top-nav/top-nav.html",
})

export class TopNav {
    public uri = "mongodb://localhost";
    public submitting = false;
    @Output() public connect = new EventEmitter<string>();
    @Output() public connectOptions = new EventEmitter<string>();
    private opts = false;

    public showOptions() {
        this.opts = true;
    }

    public onSubmit() {
        this.submitting = true;
        if (this.opts) {
            this.connectOptions.emit(this.uri);
            this.opts = false;
        } else {
            this.connect.emit(this.uri);
        }
        this.submitting = false;
    }
}
