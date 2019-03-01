import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

export interface CallData {
    id: string;
    callId: number;
    ​callStart​: string;
    ​callDuration: number;
    ​callWrapups: CallWrapup[];
}

export interface Call {
    data: CallData;
    isUpdating: boolean;
}

export enum ApiErrorCode {
    Unauthorized,
    Unknown
}

export class ApiError {
    constructor(public message: string, public code: ApiErrorCode) {}
}

const mapError = <T>() => catchError<T, ApiError>((error: any) => {
    const result = new ApiError(error.message, ApiErrorCode.Unknown);
    return [result];
});

@Injectable({
    providedIn: 'root',
})
export class ServerApiService {

    constructor(
        private http: HttpClient
    ) { }

    public login(login: string, password: string): Observable<LoginResponse | ApiError> {
        const result = this.http.post(
            url + 'Users/login',
            {
                username: login,
                password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        ) as Observable<LoginResponse>;

        return result.pipe(mapError<LoginResponse>());
    }

    public getCalls(accessToken: string): Observable<CallData[] | ApiError> {
        const result = this.http.get(
            url + 'Calls?access_token=' + accessToken,
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        ) as Observable<CallData[]>;
        return result.pipe(mapError<CallData[]>());
    }

    public getCall(id: string, accessToken: string): Observable<CallData | ApiError> {
        const result = this.http.get(
            url + 'Calls/' + id + '?access_token=' + accessToken,
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        ) as Observable<CallData>;

        return result.pipe(mapError<CallData>());
    }

    public updateCall(call: Call, accessToken: string): Observable<CallData | ApiError> {
        const result = this.http.put(
            url + 'Calls/' + call.data.id + '?access_token=' + accessToken,
            call.data,
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        ) as Observable<CallData>;
        return result.pipe(mapError<CallData>());
    }

    public logout(accessToken: string): Observable<undefined | ApiError> {
        return this.http.post(
            url + 'Users/logout?access_token=' + accessToken, 
            null
        ).pipe(map(() => undefined));
    }
}
