"use strict";

import * as util from "util";
import {Component, Input, Output, /*ViewEncapsulation,*/ EventEmitter} from "angular2/core";

export interface IResizeDelta {
    x: number;
    y: number;
}

@Component({
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "resize-bar",
    styleUrls: ["component/resize-bar/resize-bar.css"],
    templateUrl: "component/resize-bar/resize-bar.html",
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
        if (!this.horizontal && !this.vertical) {
            // Nohting to do, both directions disabled
            return;
        }
        if (this.acting) {
            throw new Error("Got mouseDown when already active!: " + util.inspect(event));
        }
        this.acting = true;
        this.startX = this.lastX = event.screenX;
        this.startY = this.lastY = event.screenY;
        window.addEventListener("mousemove", this.mouseMoveListener);
        window.addEventListener("mouseup", this.mouseUpListener);
        event.preventDefault();
    }

    public mouseMove(event: MouseEvent) {
        if (!this.acting) {
            throw new Error("Got mouseMove when not active!: " + util.inspect(event));
        }
        this.dispatchDelta(event);
    }

    public mouseUp(event: MouseEvent) {
        if (!this.acting) {
            throw new Error("Got mouseUp when not active!: " + util.inspect(event));
        }
        this.dispatchDelta(event);
        window.removeEventListener("mousemove", this.mouseMoveListener);
        window.removeEventListener("mouseup", this.mouseUpListener);
        this.acting = false;
        this.complete.emit(undefined);
    }

    private dispatchDelta(event: MouseEvent) {
        let delta = {
            x: event.screenX - this.lastX,
            y: event.screenY - this.lastY,
        };

        this.lastX = event.screenX;
        this.lastY = event.screenY;

        if ((!this.horizontal || delta.x === 0) && (!this.vertical || delta.y === 0)) {
            return;
        }

        this.delta.emit(delta);
    }
}
