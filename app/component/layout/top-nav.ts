import {Component, Input} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {Connection, ConnectionTab} from '../../data/connection';
import {Tabs} from './tabs';

@Component({
    selector: 'top-nav',
    //moduleId: module.id,
    templateUrl: 'component/layout/top-nav.html'
})

export class TopNav {
    uri: string;
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