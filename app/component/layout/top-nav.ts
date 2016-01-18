import {Component, Input} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {Connection, ConnectionData} from '../../data/connection';
import {Tabs} from './tabs';
import {Tab} from './tab';
import * as pmongo from 'promised-mongo';

@Component({
    selector: 'top-nav',
    //moduleId: module.id,
    templateUrl: 'component/layout/top-nav.html'
})

export class TopNav {
    uri: string;
    submitting = false;
    model = new ConnectionData();
    @Input() tabs: Tabs;
    
    // TODO: Remove this when we're done
    get diagnostic() { return JSON.stringify(this.model); }
    
    connect() {

    }

    onSubmit() {
        this.submitting = true;
        console.log("submitting: " + this.diagnostic);
        let tab = new Tab(this.tabs);
        tab.title = this.model.uri;
        tab.type = "connection";
    }
}