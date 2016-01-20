"use strict";
/// <reference="../../typings/tsd.d.ts" />
/// <reference="../../local_typings/mongodb.d.ts" />

import * as util from 'util';
import {EventEmitter} from 'events';
import {MongoClient} from 'mongodb';
import {Tab} from '../component/layout/tabs';

export class Connection extends EventEmitter {
    public client: MongoClient;
    public db: MongoDb.Db;

    constructor(public uri: string) {
        super();
        this.client = new MongoClient();
    }

    public connect() {
        //console.log("connecting to: " + this.uri);
        return this.client.connect(this.uri)
            .then(db => this.db = db)
            //.then(r => console.log("ping results: " + JSON.stringify(r)))
            .catch(e => this.emit('rawError', e));
    }
    
    public getServerStatus() {
        return this.runCommand({ serverStatus: 1 });
    }
    
    public ping() {
        return this.runCommand({ ping: 1 });
    }
    
    public runCommand(cmd: Object) {
        this.emit("rawInput", cmd);
        return this.db.command(cmd)
            .then(r => {
                this.emit("rawOutput", r);
                return r;
            });
    }
}

export class ConnectionTab implements Tab {
    active = true;
    uri = "";

    get title() {
        return this.uri;
    }
    get type() {
        return "connection";
    }
}
