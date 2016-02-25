"use strict";

// import * as Debug from "debug";
// import * as util from "util";

// let debug = Debug("mf:model/ConnectionState");
// let error = Debug("mf:model/ConnectionState:error");

export class Database implements MongoDb.IResultListedDatabase {
    public name: string;
    public sizeOnDisk: number;
    public empty: boolean;
    public collections: MongoDb.IResultListedCollection[];
}

export class DatabaseList implements MongoDb.IResultListDatabases {
    public databases: Database[];
    public totalSize: number;
    public ok: number;
}
