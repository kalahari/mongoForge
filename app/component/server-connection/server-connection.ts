"use strict";

import * as util from "util";
import "moment-duration-format";
import {Component, Input, ViewChild, ElementRef, OnChanges, SimpleChange, AfterViewInit} from "angular2/core";
import {ResizeBar, IResizeDelta} from "../resize-bar/resize-bar";
import {CollectionList} from "../collection-list/collection-list";
import {SessionState} from "../../model/session-state";
// import "ace-builds/src-noconflict/ace";

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
    
    private get _leftBarWidth() {
        return (this.sessionState ? this.sessionState.leftBarWidth : MIN_LEFT_BAR_WIDTH);
    }
    private get _inputPaneHeight() {
        return (this.sessionState ? this.sessionState.inputPanelHeight : MIN_INPUT_HEIGHT);
    }

    public get leftBarWidth() {
        return this._leftBarWidth + "px";
    }
    public get rightPanelLeft() {
        return (this._leftBarWidth + this._resizeLeftBarWidth) + "px";
    }
    public get inputPaneHeight() {
        return this._inputPaneHeight + "px";
    }
    public get controlsTop() {
        return (this._inputPaneHeight + this._resizeInputPaneHeight) + "px";
    }
    public get outputPaneTop() {
        return (this._inputPaneHeight + this._resizeInputPaneHeight + this._controlsHeight) + "px";
    }

    public get collectionList() {
        return this.sessionState ? this.sessionState.collectionList : null;
    }

    private newOutputListener = () => this.scrollOutputToBottom();

    private _editorsInited = false;

    public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        // console.log("changes: " + util.inspect(changes, false, 9));
        var sessionChanges = changes["sessionState"];
        if(sessionChanges) {
            let oldSession: SessionState = sessionChanges.previousValue;
            if(oldSession && oldSession instanceof SessionState) {
                oldSession.removeListener("newOutput", this.newOutputListener);
            }
            if(this.sessionState && this.sessionState instanceof SessionState) {
                this.sessionState.addListener("newOutput", this.newOutputListener);
                if (this._editorsInited) {
                    this.setEditorSessions();
                    setImmediate(() => this.editorsResized());
                }
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
        if (!this.controls || !this.controls.nativeElement) {
            let message = "Nothig found for controls: " + util.inspect(this.controls);
            return Promise.reject(new Error(message));
        }
        let newHeight = this.controls.nativeElement.clientHeight;
        // debug("resize newHeight: %s, _controlsHeight: %s",
        //     newHeight, this._controlsHeight);
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
        this.sessionState.leftBarWidth += delta.x;
        if (this.sessionState.leftBarWidth < MIN_LEFT_BAR_WIDTH) {
            this.sessionState.leftBarWidth = MIN_LEFT_BAR_WIDTH;
        }
    }

    public resizeInput(delta: IResizeDelta) {
        this.sessionState.inputPanelHeight += delta.y;
        if (this.sessionState.inputPanelHeight < MIN_INPUT_HEIGHT) {
            this.sessionState.inputPanelHeight = MIN_INPUT_HEIGHT;
        }
    }
}
