"use strict";

import {Injectable} from "angular2/core";
import {SessionState} from "../model/session-state"
import {HELLO_TAB_ID} from "../model/tab"

@Injectable()
export class SessionService {
    private static sessions: SessionState[] = [];
    
    public getSession(id: number) {
        if(id === HELLO_TAB_ID) return null;
        let session = SessionService.sessions.find(s => s.id === id);
        if(!session) {
            session = this.newSession(id);
            SessionService.sessions.push(session);
        }
        return session;
    }
    
    private newSession(id: number) {
        var session = new SessionState(id);
        return session
    }
}
