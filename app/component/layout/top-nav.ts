"use strict";

import * as Debug from 'debug';
import {Component, Output, ViewEncapsulation, EventEmitter} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Connection, ConnectionTab} from '../../data/connection';

var debug = Debug('mf:component/layout/TopNav');
var error = Debug('mf:component/layout/TopNav:error');

@Component({
    selector: 'top-nav',
    //moduleId: module.id,
    templateUrl: 'component/layout/top-nav.html',
    styleUrls: ['component/layout/top-nav.css'],
    //encapsulation: ViewEncapsulation.Native,
})

export class TopNav {
    uri = "mongodb://localhost";
    submitting = false;
    @Output() connect = new EventEmitter<string>();
    
    // constructor() {
    //         
    // }

    onSubmit() {
        debug('onSubmit()');
        this.submitting = true;
        debug("submitting: " + this.uri);
        this.connect.emit(this.uri);
        this.submitting = false;
    }
}