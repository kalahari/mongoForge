"use strict";

import * as Debug from "debug";
import * as util from "util";
import "moment-duration-format";
import {Component, Input, ViewChild, ElementRef, /*ViewEncapsulation,*/ AfterViewInit} from "angular2/core";
import {ResizeBar, IResizeDelta} from "./resize-bar";
import {CollectionList} from "./collection-list";
import {ConnectionTab} from "../../data/connection";
import {WorkspaceState} from "../../model/workspace";
// import "ace-builds/src-noconflict/ace";

let debug = Debug("mf:component/layout/ServerConnection");
let error = Debug("mf:component/layout/ServerConnection:error");

const MIN_LEFT_BAR_WIDTH = 25;
const MIN_INPUT_HEIGHT = 40;

@Component({
    directives: [ResizeBar, CollectionList],
    // encapsulation: ViewEncapsulation.Native,
    // moduleId: module.id,
    selector: "server-connection",
    styleUrls: ["component/layout/server-connection.css"],
    templateUrl: "component/layout/server-connection.html",
})

export class ServerConnection implements AfterViewInit {
    @ViewChild("controls") public controls: ElementRef;
    @ViewChild("inputEditor") public inputEditorElement: ElementRef;
    @ViewChild("outputEditor") public outputEditorElement: ElementRef;

    public state = new WorkspaceState();

    public inputEditor: AceAjax.Editor;
    public outputEditor: AceAjax.Editor;

    private _resizeLeftBarWidth = 5;
    private _resizeInputPaneHeight = 5;
    private _controlsHeight = 20;

    get leftBarWidth() {
        debug("leftBarWidth()");
        return this.state.currentLeftBarWidth + "px";
    }
    get rightPanelLeft() {
        debug("rightPanelLeft()");
        return (this.state.currentLeftBarWidth + this._resizeLeftBarWidth) + "px";
    }
    get inputPaneHeight() {
        debug("inputPaneHeight()");
        return this.state.currentInputPanelHeight + "px";
    }
    get controlsTop() {
        debug("controlsTop()");
        return (this.state.currentInputPanelHeight + this._resizeInputPaneHeight) + "px";
    }
    get outputPaneTop() {
        debug("outputPaneTop()");
        return (this.state.currentInputPanelHeight + this._resizeInputPaneHeight + this._controlsHeight) + "px";
    }

    get collectionList() {
        debug("collectionList()");
        return this.state.currentCollectionList;
    }

    private _editorsInited = false;

    @Input() public set tab(val: ConnectionTab) {
        this.state.swapState(val);
        if (this._editorsInited) {
            this.setEditorSessions();
            setImmediate(() => this.editorsResized());
        }
    }

    // constructor() {
    //     debug("constructor");
    // }

    public setEditorSessions() {
        this.inputEditor.setSession(this.state.currentConnection.input);
        this.outputEditor.setSession(this.state.currentConnection.output);
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
                this.state.on("newOutput", () => this.scrollOutputToBottom());
                if (this.state.currentConnection) {
                    this.setEditorSessions();
                }
            });
    }

    public resizeLeftBar(delta: IResizeDelta) {
        debug("resizeLeftBar(delta: %s)", delta);
        this.state.currentLeftBarWidth += delta.x;
        if (this.state.currentLeftBarWidth < MIN_LEFT_BAR_WIDTH) {
            this.state.currentLeftBarWidth = MIN_LEFT_BAR_WIDTH;
        }
    }

    public resizeInput(delta: IResizeDelta) {
        debug("resizeInput(delta: %s)", delta);
        this.state.currentInputPanelHeight += delta.y;
        if (this.state.currentInputPanelHeight < MIN_INPUT_HEIGHT) {
            this.state.currentInputPanelHeight = MIN_INPUT_HEIGHT;
        }
    }
}
