"use strict";

import * as Debug from "debug";
import * as util from "util";
import {Component, Input, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";

let debug = Debug("mf:component/layout/ResizeBar");
let error = Debug("mf:component/layout/ResizeBar:error");

export interface IResizeDelta {
    x: number;
    y: number;
}

@Component({
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "resize-bar",
    styleUrls: ["component/layout/resize-bar.css"],
    templateUrl: "component/layout/resize-bar.html",
})

export class ResizeBar {
    @Input() public horizontal = false;
    @Input() public vertical = false;
    @Output() public delta = new EventEmitter<IResizeDelta>();
    @Output() public complete = new EventEmitter<void>();
    public acting = false;
    public startX: number;
    public startY: number;
    public lastX: number;
    public lastY: number;
    public mouseMoveListener: EventListener = evt => this.mouseMove(<MouseEvent>evt);
    public mouseUpListener: EventListener = evt => this.mouseUp(<MouseEvent>evt);

    get resizeClass() {
        debug("get resizeClass()");
        if (this.horizontal && this.vertical) {
            return "resize-both";
        } else if (this.horizontal) {
            return "resize-horizontal";
        } else if (this.vertical) {
            return "resize-vertical";
        } else {
            return "";
        }
    }

    public mouseDown(event: MouseEvent) {
        debug("mouseDown(event: %s)", event);
        if (!this.horizontal && !this.vertical) {
            debug("Nohting to do, both directions disabled");
        }
        if (this.acting) {
            error("Got mouseDown when already active!: " + util.inspect(event));
            return;
        }
        this.acting = true;
        this.startX = this.lastX = event.screenX;
        this.startY = this.lastY = event.screenY;
        window.addEventListener("mousemove", this.mouseMoveListener);
        window.addEventListener("mouseup", this.mouseUpListener);
        event.preventDefault();
    }

    public mouseMove(event: MouseEvent) {
        debug("mouseMove(event: %s)", event);
        if (!this.acting) {
            error("Got mouseMove when not active!: " + util.inspect(event));
            return;
        }
        this.dispatchDelta(event);
    }

    public mouseUp(event: MouseEvent) {
        debug("mouseUp(event: %s)", event);
        if (!this.acting) {
            error("Got mouseUp when not active!: " + util.inspect(event));
            return;
        }
        this.dispatchDelta(event);
        window.removeEventListener("mousemove", this.mouseMoveListener);
        window.removeEventListener("mouseup", this.mouseUpListener);
        this.acting = false;
        this.complete.emit(undefined);
    }

    private dispatchDelta(event: MouseEvent) {
        debug("dispatchDelta(event: %s)", event);
        let delta = {
            x: event.screenX - this.lastX,
            y: event.screenY - this.lastY,
        };

        this.lastX = event.screenX;
        this.lastY = event.screenY;

        if (delta.x === 0 && delta.y === 0) {
            return;
        }

        this.delta.emit(delta);
    }
}
