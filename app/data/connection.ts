/// <reference="../../typings/tsd.d.ts" />
/// <reference="../../local_typings/mongodb.d.ts" />

import * as util from 'util';
import {MongoClient} from 'mongodb';
import {Tab} from '../component/layout/tabs';

export class Connection {
    public client: MongoClient;
    public db: MongoDb.Db;

    constructor(public uri: string) {
        this.client = new MongoClient();
    }

    public connect() {
        console.log("connecting to: " + this.uri);
        return this.client.connect(this.uri)
            .then(db => this.db = db)
            .then(() => this.db.command({ ping: 1 }))
            .then(r => console.log("ping results: " + JSON.stringify(r)))
            .then(() => this.db);
    }
    
    public getServerStatus() {
        return this.db.command({ serverStatus: 1 })
            .then(r => {
                console.log("serverStatus: " + JSON.stringify(r));
                return r;
            })
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
