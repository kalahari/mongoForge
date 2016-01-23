"use strict";

import * as Debug from 'debug';
import {Component, Input, OnChanges, SimpleChange, ViewEncapsulation} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {Connection, ConnectionTab} from '../../data/connection';
import {Tabs, Tab, TabType} from './tabs';
import {ServerConnection} from './server-connection';

var debug = Debug('mf:component/layout/WorkArea');
var error = Debug('mf:component/layout/WorkArea:error');

@Component({
    selector: 'work-area',
    //moduleId: module.id,
    templateUrl: 'component/layout/work-area.html',
    //encapsulation: ViewEncapsulation.Native,
    directives: [ServerConnection],
})

export class WorkArea implements OnChanges {
    @Input() tab: Tab;
    hello: boolean = true;
  
    tabSelected() {
        debug('tabSelected()');
        if(this.tab && this.tab.type === TabType.connection) {
            this.hello = false;
        } else {
            this.hello = true;
        }
    }
    
    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        debug('ngOnChanges(chages: %s)', changes);
        if(changes["tab"]) {
            this.tabSelected();
        }
    }
}