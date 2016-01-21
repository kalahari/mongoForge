"use strict";

import * as Debug from 'debug';
import {Component, Input} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {Connection, ConnectionTab} from '../../data/connection';
import {Tabs} from './tabs';

var debug = Debug('mf:component/layout/StatusBar');
var error = Debug('mf:component/layout/StatusBar:error');

@Component({
    selector: 'top-nav',
    //moduleId: module.id,
    templateUrl: 'component/layout/status-bar.html'
})

export class StatusBar {
    uri = "mongodb://localhost";
    submitting = false;
    @Input() tabs: Tabs;

    onSubmit() {
        this.submitting = true;
        console.log("submitting: " + this.uri);
        let tab = new ConnectionTab();
        tab.uri = this.uri;
        this.tabs.addTab(tab);
        this.submitting = false;
    }
}