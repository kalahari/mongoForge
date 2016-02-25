"use strict";

import * as Debug from "debug";
import {Component, Input/*, ViewEncapsulation*/} from "angular2/core";
import {DatabaseList, Database} from "../../model/database-list";

let debug = Debug("mf:component/collection-list/CollectionList");
// let error = Debug("mf:component/collection-list/CollectionList:error");

@Component({
    // directives: [],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "collection-list",
    styleUrls: ["component/collection-list/collection-list.css"],
    templateUrl: "component/collection-list/collection-list.html",
})

export class CollectionList {
    @Input() public model: DatabaseList;

    public selectDb(db: Database) {
        debug("selected datbase: %s", db);
    }
}
