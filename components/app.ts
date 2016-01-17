import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';

@Component({
    selector: 'app',
    moduleId: module.id, // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    templateUrl: 'app.html',
})

export class App {

    constructor() { }

    handleDrop(e: any) {
        var files: File = e.dataTransfer.files;
        Object.keys(files).forEach((key) => {
            console.log((<any>files)[key]);
        });

        return false;
    }

}