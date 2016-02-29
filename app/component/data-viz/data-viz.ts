"use strict";

import * as util from "util";
import {Component, Input} from "angular2/core";
import {ObjectID} from "mongodb";

@Component({
    directives: [DataViz],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "data-viz",
    styleUrls: ["component/data-viz/data-viz.css"],
    templateUrl: "component/data-viz/data-viz.html",
})

export class DataViz {
    @Input() public model: any;

    public get type() {
        let type = typeof this.model;
        if(type === "object") {
            if(this.model instanceof ObjectID) {
                return "ObjectID";
            } else if(this.model instanceof Date) {
                return "Date";
            } else if(Object.keys(this.model).length < 1) {
                return "empty object";
            }
        }
        return type;
    }

    public get keys() {
        return Object.keys(this.model);
    }
    
    public get rawText() {
        return util.inspect(this.model, false, 9);
    }
}
