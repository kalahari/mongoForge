"use strict";

import * as Debug from 'debug';
import {Component, Input, ViewEncapsulation} from 'angular2/core';

var debug = Debug('mf:component/layout/StatusBar');
var error = Debug('mf:component/layout/StatusBar:error');

@Component({
    selector: 'status-bar',
    //moduleId: module.id,
    templateUrl: 'component/layout/status-bar.html',
    encapsulation: ViewEncapsulation.Native,
})

export class StatusBar {

}