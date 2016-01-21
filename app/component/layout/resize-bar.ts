"use strict";

import * as Debug from 'debug';
import * as util from 'util';
import {EventEmitter} from 'events';
import {Component, Input, Output} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {Connection, ConnectionTab} from '../../data/connection';
import {Tabs} from './tabs';

var debug = Debug('mf:component/layout/ResizeBar');
var error = Debug('mf:component/layout/ResizeBar:error');

@Component({
    selector: 'resize-bar',
    //moduleId: module.id,
    templateUrl: 'component/layout/resize-bar.html'
})

export class ResizeBar {
    @Input() horizontal = false;
    @Input() vertical = false;
    @Output() delta = new EventEmitter();
    acting = false;
    
    get resizeClass() {
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
    }
    
    mouseMove(event: MouseEvent) {
        if(!this.acting) return;
        debug("mouseMove(event: %s)", event);
    }
    
    mouseUp(event: MouseEvent) {
        
    }
}