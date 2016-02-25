"use strict";
/// <reference="../../typings/tsd.d.ts" />
/// <reference="../../local_typings/mongodb.d.ts" />

// import * as util from "util";
import {EventEmitter} from "events";
import {MongoClient} from "mongodb";
import {ITab, TabType} from "../component/tabs/tabs";
import {DatabaseList, Database} from "../model/database-list";

export class ServerConnection extends EventEmitter {
    public client: MongoClient;
    public connectDb: MongoDb.Db;
    public currentDb: MongoDb.Db;

    constructor(public uri: string) {
        super();
        this.client = new MongoClient();
    }

    public connect() {
        // console.log("connecting to: " + this.uri);
        return this.client.connect(this.uri)
            .then(db => this.currentDb = this.connectDb = db)
            .catch(e => this.emit("rawError", e));
    }

    public getServerStatus() {
        return this.runCommand({ serverStatus: 1 });
    }

    public getCollections() {
        return this.connectDb.admin().listDatabases()
            .then(r => {
                let ret = Promise.all(r.databases.map((dbInfo: Database) => {
                    return this.connectDb
                        .db(dbInfo.name)
                        .listCollections()
                        .toArray()
                        // FIXME: need an interface for dbInfo
                        /* tslint:disable:no-string-literal */
                        .then(collInfo => dbInfo.collections = collInfo);
                        /* tslint:enable:no-string-literal */
                })).then(() => <DatabaseList>r);
                this.emit("rawOutput", ret);
                return ret;
            })
            .catch(e => this.emit("rawError", e));
    }

    public ping() {
        return this.runCommand({ ping: 1 });
    }

    public runCommand(cmd: Object) {
        this.emit("rawInput", cmd);
        return this.connectDb.command(cmd)
            .then(r => {
                this.emit("rawOutput", r);
                return r;
            });
    }
}

export interface IServerConnectionOptions {
    username: string;
    password: string;
    database: string;
}

export class ServerConnectionTab implements ITab {
    private static nextTabId = 0;

    public active = true;
    public uri = "";
    public options: IServerConnectionOptions = null;
    public modal: string = null;
    public id = ServerConnectionTab.nextTabId++;

    public get title() {
        return this.uri;
    }
    public get type() {
        return TabType.connection;
    }
}
