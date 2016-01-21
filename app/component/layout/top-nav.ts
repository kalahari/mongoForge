"use strict";

import * as Debug from 'debug';
import {EventEmitter} from 'events';
import {Component, Output} from 'angular2/core';
import {NgForm} from 'angular2/common';
import {Connection, ConnectionTab} from '../../data/connection';
import {Tabs} from './tabs';

var debug = Debug('mf:component/layout/TopNav');
var error = Debug('mf:component/layout/TopNav:error');

@Component({
    selector: 'top-nav',
    //moduleId: module.id,
    templateUrl: 'component/layout/top-nav.html'
})

export class TopNav {
    uri = "mongodb://localhost";
    submitting = false;
    @Output() connect: EventEmitter;
    
    constructor() {
        this.connect = new EventEmitter();
    }

    onSubmit() {
        this.submitting = true;
        console.log("submitting: " + this.uri);
        this.connect.emit('connect', this.uri);
        this.submitting = false;
    }
}