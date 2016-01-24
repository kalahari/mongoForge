declare module AceAjax {
    interface Ace {
        createEditSession(text: string, mode: string): IEditSession;
    }
    interface Editor {
        getSelectedText(): string;
    }
}

declare module 'ace-builds/src/ace' {
    //export = AceAjax;
    var ace: AceAjax.Ace;
    export = ace;
}