/// <reference="../../typings/tsd.d.ts" />
/// <reference="../../local_typings/promised-mongo.d.ts" />

import * as pmongo from 'promised-mongo';

export class Connection {
    public db: PromisedMongo.Database;

    constructor(public data: ConnectionData) { }

    public connect() {
        console.log("connecting to: " + this.data.uri);
        this.db = pmongo(this.data.uri, ['test']);
        return this.db.runCommand({ serverStatus: 1 });
    }
}

export class ConnectionData {
    constructor(
        public uri?: string
    ) { }
}