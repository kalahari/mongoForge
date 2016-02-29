"use strict";

import * as Debug from "debug";
import * as util from "util";
import * as moment from "moment";
import * as url from "url";
import {EventEmitter} from "events";
import {Cursor} from "mongodb";
import {ServerConnection, ServerConnectionOptions} from "./server-connection";

const debug = Debug("mf:model/SessionState");

const DEFAULT_LEFT_BAR_WIDTH = 150;
const DEFAULT_INPUT_PANEL_HEIGHT = 350;

export class SessionState extends EventEmitter {
    public get id() { return this._id; }
    public uri: string;
    public connectionOptions: ServerConnectionOptions;
    public connection: ServerConnection;
    public input: AceAjax.IEditSession;
    public output: AceAjax.IEditSession;
    public leftBarWidth: number = DEFAULT_LEFT_BAR_WIDTH;
    public inputPanelHeight: number = DEFAULT_INPUT_PANEL_HEIGHT;
    public newOutput = false;
    public collectionList: any;
    public modal: "connection" = null;
    public viz = false;

    public get hostName() {
        if (!this.uri) {
            return null;
        }
        return url.parse(this.uri, false, true).host;
    }
    public get result() {
        return this._result;
    }

    private _id: number;
    private _start: moment.Moment;
    private _result: any = null;

    constructor(id: number) {
        super();
        this._id = id;
        this.input = ace.createEditSession(`// insert and find some documents
var test = db.collection("test");

test.insert({ a: 1 });
test.insert({ a: 2 });
test.insert({ a: 3, b: "one" });
test.insert({ a: 4, b: "two" });
test.insert({ a: 5, c: new Date() });
test.insert({ a: 1 });

test.find({})
    .sort({ a: 1, b: 1 });`, "ace/mode/javascript");
        this.input.setUseWorker(false);
        this.output = ace.createEditSession("", "ace/mode/javascript");
        this.output.setUseWorker(false);
    }

    public connect() {
        this.connection = new ServerConnection(this.uri, this.connectionOptions);
        this.connection.on("rawInput", (input: any) => this.in(input));
        this.connection.on("rawOutput", (output: any) => this.out(output));
        this.connection.on("rawError", (err: any) => this.err(err));
        this.connection.connect()
            .then(() => this.appendOutput("// CONNECTED: " + this.uri + "\n"))
            .then(() => this.connection.ping())
            .then(() => this.connection.getCollections())
            .then(collList => this.collectionList = collList)
            .catch(e => this.err(e));
    }

    private outputBuffer = "";

    public bufferOutput(text: string) {
        if (text != null) {
            this.outputBuffer += text;
        }
    }

    public appendOutput(text: string = null) {
        this.bufferOutput(text);
        this.output.insert({
            column: 0,
            row: this.output.getLength(),
        }, this.outputBuffer);
        this.outputBuffer = "";
        this.newOutput = true;
        this.emit("newOutput");
    }

    public runInput() {
        let inputSelection = this.input.getSelection();
        if (inputSelection.isEmpty()) {
            return this.runCommand(this.input.getValue());
        }
        this.runCommand(this.input.getTextRange(inputSelection.getRange()));
    }

    public runCommand(command: string) {
        // console.log("Running command: " + command);
        return this.execCommand(command, /^\s*\{/.test(command))
            .catch(e => this.err(e));
    }

    public execCommand(command: string, isCmdObj: boolean) {
        debug("execCommand(command: %o, isCmdObj: %o)", command, isCmdObj);
        if (!isCmdObj) {
            this.in(command);
        }
        let result: any;
        try {
            let ctx = { db: this.connection.currentDb };
            let cmd = "\"use strict\"\n";
            Object.keys(ctx).forEach(cv => cmd += util.format("let %s = this.%s;\n", cv, cv));
            if (isCmdObj) {
                cmd += "let _return_value = ";
            }
            cmd += command;
            if (isCmdObj) {
                cmd += ";\n_return_value;\n";
            }
            console.log("Evaling: " + cmd);
            /* tslint:disable:no-eval */
            let env = () => eval(cmd);
            /* tslint:enable:no-eval */
            result = env.call(ctx);
        } catch (err) {
            return Promise.reject(err);
        }
        if (isCmdObj) {
            return this.connection.runCommand(result);
        }
        return Promise.resolve(result)
            .then(r => this.out(r));
    }

    public in(cmd: any) {
        this.bufferOutput("\n// ");
        this.stringify(cmd, true)
            .then(v => this.bufferOutput(v))
            .then(() => this.appendOutput())
            .then(() => this._start = moment())
            .then(() => cmd);
    }

    public out(val: any) {
        return this.resolve(val)
            .then(v => this._result = v)
            .then(v => this.stringify(v))
            .then(v => this.bufferOutput(v))
            .then(() => this.bufferOutput("// " + moment.duration(moment().diff(this._start)).format("hh:mm:ss", 3) + "\n"))
            .then(() => this.appendOutput())
            .then(() => val);
    }

    public err(val: any) {
        this.bufferOutput("\n// ERROR:\n");
        this.stringify(val)
            .then(v => this.bufferOutput(v))
            .then(() => this.appendOutput())
            .then(() => val);
    }

    private resolve(val: any) {
        return Promise.resolve(val)
            .then(v => v instanceof Cursor ? v.toArray() : v);
    }

    private stringify(val: any, comment: boolean = false) {
        return this.resolve(val)
            .then(v => (typeof v === "string") ? <string>v : util.inspect(v, { depth: 9 }))
            .then(v => comment ? v.split("\n").join("\n// ") : v)
            .then(v => {
                if (!/\n\s*$/.test(v)) {
                    v += "\n";
                }
                return v;
            });
    }
}
