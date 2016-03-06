"use strict";

// import * as Debug from "debug";
import { app } from "electron";
import * as fs from "fs";
import * as path from "path";
// import {Injectable} from "angular2/core";

// const debug = Debug("mf:service/Persistence");
const dataFilePath = path.join(app.getPath("userData"), "data.json");

// @Injectable()
export class Persistence {
    private static data: { [key: string]: any } = null;

    public set(key: string, value: any) {
        this.load();
        Persistence.data[key] = value;
        this.save();
    }

    public get(key: string) {
        this.load();
        let value: any = null;
        if (key in Persistence.data) {
            value = Persistence.data[key];
        }
        return value;
    }

    public unset(key: string) {
        this.load();
        if (key in Persistence.data) {
            delete Persistence.data[key];
            this.save();
        }
    }

    private load() {
        if (Persistence.data !== null) {
            return;
        }

        if (!fs.existsSync(dataFilePath)) {
            Persistence.data = {};
            return;
        }

        Persistence.data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
    }

    private save() {
        fs.writeFileSync(dataFilePath, JSON.stringify(Persistence.data));
    }
}
