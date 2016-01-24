"use strict";

import * as Debug from 'debug';
import {EventEmitter} from 'events'
import {ConnectionState} from './connection';
import {ConnectionTab} from '../data/connection';

const DEFAULT_LEFT_BAR_WIDTH = 150;
const DEFAULT_INPUT_PANEL_HEIGHT = 350;

export class WorkspaceState extends EventEmitter {
    connections: ConnectionState[] = [];
    currentConnection: ConnectionState;
    
    get currentLeftBarWidth() {
        if(this.currentConnection) {
            return this.currentConnection.leftBarWidth || DEFAULT_LEFT_BAR_WIDTH;
        }
        return DEFAULT_LEFT_BAR_WIDTH;
    }
    set currentLeftBarWidth(val: number) {
        this.currentConnection.leftBarWidth = val;
    }
    
    get currentInputPanelHeight() {
        if(this.currentConnection) {
            return this.currentConnection.inputHeight || DEFAULT_INPUT_PANEL_HEIGHT;
        }
        return DEFAULT_INPUT_PANEL_HEIGHT;
    }
    set currentInputPanelHeight(val: number) {
        this.currentConnection.inputHeight = val;
    }
    
    get currentCollectionList() {
        if(this.currentConnection) {
            return this.currentConnection.collectionList;
        }
        return null;
    }
    
    swapState(newTab: ConnectionTab) {
        let newConnection = this.connections.find(c => c.tab === newTab);
        if(newConnection === undefined) {
            newConnection = new ConnectionState();
            this.connections.push(newConnection);
            
            newConnection.on("newOutput", () => this.newConnectionOutput(newConnection));
            newConnection.input = ace.createEditSession(`// insert and find some documents
var test = db.collection('test');

test.insert({ a: 1 });
test.insert({ a: 2 });
test.insert({ a: 3, b: 'one' });
test.insert({ a: 4, b: 'two' });
test.insert({ a: 5, c: new Date() });
test.insert({ a: 1 });

test.find({})
    .sort({ a: 1, b: 1 })
    .toArray();`, "ace/mode/javascript");
            newConnection.output = ace.createEditSession("", "ace/mode/javascript");
            newConnection.tab = newTab;
            newConnection.leftBarWidth = DEFAULT_LEFT_BAR_WIDTH;
            newConnection.inputHeight = DEFAULT_INPUT_PANEL_HEIGHT;

            newConnection.connect();
        }
        this.currentConnection = newConnection;
        if(newConnection.newOutput) {
            setImmediate(() => this.newConnectionOutput(newConnection));
        }
    }
    
    newConnectionOutput(connection: ConnectionState) {
        if(connection === this.currentConnection) {
            this.emit("newOutput")
            connection.newOutput = false;
        }
    }
}