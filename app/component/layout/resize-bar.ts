"use strict";

import * as Debug from 'debug';
import * as util from 'util';
import {Component, Input, Output, ViewEncapsulation, EventEmitter} from 'angular2/core';

var debug = Debug('mf:component/layout/ResizeBar');
var error = Debug('mf:component/layout/ResizeBar:error');

export interface ResizeDelta {
    x: number;
    y: number;
}

@Component({
    selector: 'resize-bar',
    //moduleId: module.id,
    templateUrl: 'component/layout/resize-bar.html',
    styleUrls: ['component/layout/resize-bar.css'],
    encapsulation: ViewEncapsulation.Native,
})

export class ResizeBar {
    @Input() horizontal = false;
    @Input() vertical = false;
    @Output() delta = new EventEmitter<ResizeDelta>();
    acting = false;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    mouseMoveListener: EventListener = evt => this.mouseMove(<MouseEvent>evt);
    mouseUpListener: EventListener = evt => this.mouseUp(<MouseEvent>evt)
    
    get resizeClass() {
        debug('get resizeClass()');
        if(this.horizontal && this.vertical) {
            return "resize-both";
        } else if(this.horizontal) {
            return "resize-horizontal";
        } else if(this.vertical) {
            return "resize-vertical";
        } else {
            return "";
        }
    }
    
    mouseDown(event: MouseEvent) {
        debug("mouseDown(event: %s)", event);
        if(!this.horizontal && !this.vertical) {
            debug("Nohting to do, both directions disabled");
        }
        if(this.acting) {
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
    
    mouseMove(event: MouseEvent) {
        debug("mouseMove(event: %s)", event);
        if(!this.acting) {
            error("Got mouseMove when not active!: " + util.inspect(event));
            return;
        }
        this.dispatchDelta(event);
    }
    
    mouseUp(event: MouseEvent) {
        debug("mouseUp(event: %s)", event);
        if(!this.acting) {
            error("Got mouseUp when not active!: " + util.inspect(event));
            return;
        }
        this.dispatchDelta(event);
        window.removeEventListener("mousemove", this.mouseMoveListener);
        window.removeEventListener("mouseup", this.mouseUpListener);
        this.acting = false;
    }
    
    private dispatchDelta(event: MouseEvent) {
        debug('dispatchDelta(event: %s)', event);
        let delta = {
            x: event.screenX - this.lastX,
            y: event.screenY - this.lastY,
        };
        
        this.lastX = event.screenX;
        this.lastY = event.screenY;
        
        if(delta.x === 0 && delta.y === 0) return;
        
        this.delta.emit(delta);
    }
}