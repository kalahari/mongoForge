"use strict";

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
