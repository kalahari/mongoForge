"use strict";

import * as Debug from "debug";
import * as util from "util";
import {EventEmitter} from "events";
import {MongoClient} from "mongodb";

import {DatabaseList, Database} from "../model/database-list";

const debug = Debug("mf:model/ServerConnection");

export class ServerConnection extends EventEmitter {
    public client = new MongoClient();
    public connectDb: MongoDb.Db;
    public currentDb: MongoDb.Db;
    private connected = false;

    constructor(public uri: string, public options: ServerConnectionOptions = null) {
        super();
    }

    public connect() {
        debug("connecting to: %o with options: %o", this.uri, this.options);
        return this.client.connect(this.uri)
            .then(db => this.currentDb = this.connectDb = db)
            .then(db => {
                this.connected = true;
                if(this.options && this.options.username != null && this.options.password != null) {
                    return Promise.resolve(this.options.admin ? db.admin() : db)
                        .then(auth => auth.authenticate(this.options.username, this.options.password))
                        .then(() => this.runCommand({ connectionStatus : 1 }))
                        .then(() => db)
                }
                return db;
            })
            .catch(e => this.emit("rawError", e));
    }

    public getServerStatus() {
        return this.runCommand({ serverStatus: 1 });
    }

    public getCollections() {
        return this.checkConnection()
            .then(() => this.connectDb.admin().listDatabases())
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
        debug("running command: %o", cmd);
        this.emit("rawInput", cmd);
        return this.checkConnection()
            .then(() => this.connectDb.command(cmd))
            .then(r => {
                this.emit("rawOutput", r);
                return r;
            });
    }
    
    private checkConnection() {
        if(!this.connected) {
            return Promise.reject(new Error("Connecion not established"));
        }
        return Promise.resolve();
    }
}

export class ServerConnectionOptions {
    username: string;
    password: string;
    admin: boolean = false;
    database: string;
}
