
export enum TabType {
    hello = 1,
    connection,
}

export const HELLO_TAB_ID = 1;

export class Tab {
    public get id() {
        return this._id;
    }
    
    private _id: number;
    
    private static _nextTabId: number = HELLO_TAB_ID + 1;
    private static _helloTab: Tab = null;
    
    constructor(public title: string, public type: TabType = TabType.connection) {
        this._id = Tab._nextTabId++;
    }
    
    public static HelloTab() {
        if(!Tab._helloTab) {
            Tab._helloTab = new Tab("Hello!", TabType.hello);
            Tab._helloTab._id = HELLO_TAB_ID;
        }
        return Tab._helloTab;
    }
}
