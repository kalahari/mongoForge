"use strict";

import * as Debug from 'debug';
import {Component, Input, Output, ViewEncapsulation, EventEmitter} from 'angular2/core';

var debug = Debug('mf:component/layout/CollectionList');
var error = Debug('mf:component/layout/CollectionList:error');

@Component({
    selector: 'collection-list',
    //moduleId: module.id,
    templateUrl: 'component/layout/collection-list.html',
    styleUrls: ['component/layout/collection-list.css']
    //directives: [],
    //encapsulation: ViewEncapsulation.Native,
})

export class CollectionList {
    @Input() model: any;
}