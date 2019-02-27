import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Swagger​: ​https://diabolocom-exercise.herokuapp.com/explorer/
// Login account:​ username: test / password: test4321

const url = 'https://diabolocom-exercise.herokuapp.com/api/';

export interface LoginResponse {
    id: string;
    ttl: number;
    created: string;
    userId: string;    
}

export interface CallWrapupAgent {
    id: number;
    login: string;
}

export interface CallWrapup {
    agent: CallWrapupAgent;
    wrapupName: string;
    wrapupComment: string;
}

export interface Call {
    callId: number;
    ​callStart​: string;
    ​callDuration: number;
    ​callWrapups: CallWrapup[];
}

export interface ApiError {
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class ServerApiService {

    constructor(
        private http: HttpClient
    ) { }

    public login(login: string, password: string): Observable<LoginResponse> {
        return this.http.post(
            url + 'Users/login',
            {
                username: login,
                password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ) as Observable<LoginResponse>;
    }

    public getCalls(accessToken: string): Observable<Call[]> {
        return this.http.get(
            url + 'Calls?access_token=' + accessToken, 
            {
                headers: {
                    'Accept': 'application/json'
                }            
            }
        ) as Observable<Call[]>;
    }

    public getCall(callId: number, accessToken: string): Observable<Call> {
        return this.http.get(
            url + 'Calls/' + callId + '?access_token=' + accessToken, 
            {
                headers: {
                    'Accept': 'application/json'
                }            
            }
        ) as Observable<Call>;
    }

    public logout(token: string) {
    }
}
