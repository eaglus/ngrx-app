import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Call, CallData, ApiError, LoginResponse } from './interfaces';

let lastId = 0;

const wrapups = [{
  agent: {
    id: 11,
    login: 'agent1'
  },
  wrapupName: 'wrapupName1',
  wrapupComment: 'wrapupComment1'
}, {
  agent: {
    id: 22,
    login: 'agent2'
  },
  wrapupName: 'wrapupName2',
  wrapupComment: 'wrapupComment2'
}, {
  agent: {
    id: 33,
    login: 'agent3'
  },
  wrapupName: 'wrapupName3',
  wrapupComment: 'wrapupComment3'
}];

let calls = [
  {
    id: '1',
    callId: 1,
    callStart: '1',
    callDuration: 1000,
    callWrapups: [wrapups[0]]
  },
  {
    id: '2',
    callId: 2,
    callStart: '2',
    callDuration: 2000,
    callWrapups: [wrapups[1]]
  },
  {
    id: '3',
    callId: 3,
    callStart: '3',
    callDuration: 3000,
    callWrapups: [wrapups[2]]
  }
];

@Injectable({
    providedIn: 'root',
})
export class ServerApiService {

    constructor() { }

    public login(login: string, password: string): Observable<LoginResponse | ApiError> {
        lastId++;

        console.log('Login ', login, password);
        return of({
            id: String(lastId),
            ttl: 100000,
            created: 'today',
            userId: login
        });
    }

    public getCalls(accessToken: string): Observable<CallData[] | ApiError> {
        console.log('Get calls ', accessToken);
        return of(calls);
    }

    public getCall(id: string, accessToken: string): Observable<CallData | ApiError> {
        console.log('Get call ', id, accessToken);
        const call = calls.find(item => item.id === id);
        return of(call);
    }

    public updateCall(call: Call, accessToken: string): Observable<CallData | ApiError> {
        console.log('Update call ', call, accessToken);
        calls = calls.map(item => item.id === call.data.id ? call.data : item);
        return of(call.data);
    }

    public logout(accessToken: string): Observable<undefined | ApiError> {
        console.log('Logout ', accessToken);
        return of(undefined);
    }
}
