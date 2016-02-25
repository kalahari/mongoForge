"use strict";

import * as Debug from "debug";
import * as util from "util";
import "moment-duration-format";
import {Component, Input, ViewChild, ElementRef, OnChanges, SimpleChange, AfterViewInit} from "angular2/core";
import {ResizeBar, IResizeDelta} from "../resize-bar/resize-bar";
import {CollectionList} from "../collection-list/collection-list";
import {SessionState} from "../../model/session-state";
// import "ace-builds/src-noconflict/ace";

let debug = Debug("mf:component/server-connection/ServerConnection");
let error = Debug("mf:component/server-connection/ServerConnection:error");

const MIN_LEFT_BAR_WIDTH = 25;
const MIN_INPUT_HEIGHT = 40;

@Component({
    directives: [ResizeBar, CollectionList],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "server-connection",
    styleUrls: ["component/server-connection/server-connection.css"],
    templateUrl: "component/server-connection/server-connection.html",
})

export class ServerConnection implements AfterViewInit, OnChanges {
    @ViewChild("controls") public controls: ElementRef;
    @ViewChild("inputEditor") public inputEditorElement: ElementRef;
    @ViewChild("outputEditor") public outputEditorElement: ElementRef;

    @Input() public sessionState: SessionState;

    public inputEditor: AceAjax.Editor;
    public outputEditor: AceAjax.Editor;

    private _resizeLeftBarWidth = 5;
    private _resizeInputPaneHeight = 5;
    private _controlsHeight = 20;

    get leftBarWidth() {
        debug("leftBarWidth()");
        return this.sessionState.leftBarWidth + "px";
    }
    get rightPanelLeft() {
        debug("rightPanelLeft()");
        return (this.sessionState.leftBarWidth + this._resizeLeftBarWidth) + "px";
    }
    get inputPaneHeight() {
        debug("inputPaneHeight()");
        return this.sessionState.inputPanelHeight + "px";
    }
    get controlsTop() {
        debug("controlsTop()");
        return (this.sessionState.inputPanelHeight + this._resizeInputPaneHeight) + "px";
    }
    get outputPaneTop() {
        debug("outputPaneTop()");
        return (this.sessionState.inputPanelHeight + this._resizeInputPaneHeight + this._controlsHeight) + "px";
    }

    get collectionList() {
        debug("collectionList()");
        return this.sessionState.collectionList;
    }

    private newOutputListener = () => this.scrollOutputToBottom();

    private _editorsInited = false;

    // constructor() {
    //     debug("constructor");
    // }
    
    public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        var sessionChanges = changes["sessionState"];
        if(sessionChanges) {
            let oldSession: SessionState = sessionChanges.previousValue;
            if(oldSession) {
                oldSession.removeListener("newOutput", this.newOutputListener);
            }
            this.sessionState.addListener("newOutput", this.newOutputListener);
            if (this._editorsInited) {
                this.setEditorSessions();
                setImmediate(() => this.editorsResized());
            }
        }
    }

    public setEditorSessions() {
        this.inputEditor.setSession(this.sessionState.input);
        this.outputEditor.setSession(this.sessionState.output);
    }

    public editorsResized() {
        this.inputEditor.resize();
        this.outputEditor.resize();
    }

    public scrollOutputToBottom() {
        this.outputEditor.scrollToLine(this.outputEditor.getSession().getLength() - 1, false, false, undefined);
    }

    public resize() {
        debug("resize()");
        if (!this.controls || !this.controls.nativeElement) {
            let message = "Nothig found for controls: " + util.inspect(this.controls);
            error(message);
            return Promise.reject(new Error(message));
        }
        let newHeight = this.controls.nativeElement.clientHeight;
        debug("resize newHeight: %s, _controlsHeight: %s",
            newHeight, this._controlsHeight);
        if (this._controlsHeight !== newHeight) {
            return new Promise<void>((resolve, reject) => {
                // setImmediate prevents mutate after check exception
                setImmediate(() => {
                    this._controlsHeight = newHeight;
                    resolve();
                });
            });
        }
        return Promise.resolve();
    }

    public ngAfterViewInit() {
        this.resize()
            .then(() => {
                // console.log(util.inspect(ace));
                this.inputEditor = ace.edit(this.inputEditorElement.nativeElement);
                this.inputEditor.setTheme("ace/theme/cobalt");
                // this.inputEditor.getSession().setMode("ace/mode/javascript");
                this.outputEditor = ace.edit(this.outputEditorElement.nativeElement);
                this.outputEditor.setTheme("ace/theme/cobalt");
                this.outputEditor.setReadOnly(true);
                // this.outputEditor.getSession().setMode("ace/mode/javascript");
                this._editorsInited = true;
                if (this.sessionState) {
                    this.setEditorSessions();
                }
            });
    }

    public resizeLeftBar(delta: IResizeDelta) {
        debug("resizeLeftBar(delta: %s)", delta);
        this.sessionState.leftBarWidth += delta.x;
        if (this.sessionState.leftBarWidth < MIN_LEFT_BAR_WIDTH) {
            this.sessionState.leftBarWidth = MIN_LEFT_BAR_WIDTH;
        }
    }

    public resizeInput(delta: IResizeDelta) {
        debug("resizeInput(delta: %s)", delta);
        this.sessionState.inputPanelHeight += delta.y;
        if (this.sessionState.inputPanelHeight < MIN_INPUT_HEIGHT) {
            this.sessionState.inputPanelHeight = MIN_INPUT_HEIGHT;
        }
    }
}
