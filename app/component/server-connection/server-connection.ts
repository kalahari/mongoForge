"use strict";

import * as util from "util";
import "moment-duration-format";
import {Component, Input, ViewChild, ElementRef, OnChanges, SimpleChange, AfterViewInit} from "angular2/core";
import {ResizeBar, IResizeDelta} from "../resize-bar/resize-bar";
import {CollectionList} from "../collection-list/collection-list";
import {StatusBar} from "../status-bar/status-bar";
import {DataViz} from "../data-viz/data-viz";
import {Tabs} from "../tabs/tabs";
import {Tab, TabType} from "../../model/tab";
import {SessionState} from "../../model/session-state";
// import "ace-builds/src-noconflict/ace";

const MIN_LEFT_BAR_WIDTH = 25;
const MIN_INPUT_HEIGHT = 40;

@Component({
    directives: [ResizeBar, CollectionList, StatusBar, DataViz, Tabs],
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
    @ViewChild("tabs") public tabs: Tabs;

    @Input() public sessionState: SessionState;

    public inputEditor: AceAjax.Editor;
    public outputEditor: AceAjax.Editor;

    private _resizeLeftBarWidth = 5;
    private _resizeInputPaneHeight = 5;
    private _controlsHeight = 20;

    private _editorsInited = false;

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

    public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        // console.log("changes: " + util.inspect(changes, false, 9));
        /* tslint:disable:no-string-literal */
        let sessionChanges = changes["sessionState"];
        /* tslint:enable:no-string-literal */
        if (sessionChanges) {
            let oldSession: SessionState = sessionChanges.previousValue;
            if (oldSession && oldSession instanceof SessionState) {
                oldSession.removeListener("newOutput", this.newOutputListener);
            }
            if (this.sessionState && this.sessionState instanceof SessionState) {
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
                this.inputEditor = this.setupEditor(this.inputEditorElement);
                this.outputEditor = this.setupEditor(this.outputEditorElement);
                this.outputEditor.setReadOnly(true);
                this._editorsInited = true;
                if (this.sessionState) {
                    this.setEditorSessions();
                }
                let textTab = new Tab("Text", TabType.textResult);
                this.tabs.addTab(textTab);
                let tableTab = new Tab("Table", TabType.tableResult);
                this.tabs.addTab(tableTab);
                this.tabs.selectTab(textTab);
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

    public tabSelected(tab: Tab) {
        switch (tab.type) {
            case TabType.textResult:
                this.sessionState.viz = false;
                this.setEditorSessions();
                break;
            case TabType.tableResult:
                this.sessionState.viz = true;
                break;
            default:
                break;
        }
    }

    private newOutputListener = () => this.scrollOutputToBottom();

    private setupEditor(element: ElementRef) {
        // console.log(util.inspect(ace));
        let editor = ace.edit(element.nativeElement);
        editor.setTheme("ace/theme/cobalt");
        return editor;
    }
}
