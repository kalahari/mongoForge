"use strict";

// import * as Debug from "debug";
import {Component, Input/*, ViewEncapsulation*/} from "angular2/core";

// let debug = Debug("mf:component/layout/CollectionList");
// let error = Debug("mf:component/layout/CollectionList:error");

@Component({
    // directives: [],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "collection-list",
    styleUrls: ["component/layout/collection-list.css"],
    templateUrl: "component/layout/collection-list.html",
})

export class CollectionList {
    @Input() public model: any;
}
