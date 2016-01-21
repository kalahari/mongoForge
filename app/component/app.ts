"use strict";

import * as Debug from 'debug';
import * as util from 'util';
import {Component, Input, ViewEncapsulation, ViewChild,
    ElementRef, AfterViewInit} from 'angular2/core';
import {Tabs} from './layout/tabs';
import {TopNav} from './layout/top-nav';
import {WorkArea} from './layout/work-area';

var debug = Debug('mf:component/App');
var error = Debug('mf:component/App:error');

@Component({
    selector: 'app',
    //moduleId: module.id,
    templateUrl: 'component/app.html',
    styleUrls: ['component/app.css'],
    directives: [Tabs,TopNav],
    encapsulation: ViewEncapsulation.Native,
})

export class App implements AfterViewInit {
    @ViewChild('topBar') topBar: ElementRef;
    topBarHeight = "9em";
    
    // constructor() {
    //     debug("constructor()");
    // }
    
    resize() {
        debug("resize()");
        if(!this.topBar || !this.topBar.nativeElement) {
            error("Nothig found for topBar: " + util.inspect(this.topBar));
            return;
        }
        let newHeight = this.topBar.nativeElement.clientHeight + "px";
        debug("app.resize newHeight: %s, topBarHeight: %s",
            newHeight, this.topBarHeight);
        if(this.topBarHeight !== newHeight) {
            // setImmediate prevents mutate after check exception
            setImmediate(() => this.topBarHeight = newHeight);
        }
    }
    
    ngAfterViewInit() {
        debug("ngAfterViewInit()");
        this.resize();
    }
}
