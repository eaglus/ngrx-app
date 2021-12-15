import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
    Call,
    CallData,
    CallWrapupAgent,
    CallWrapup,
    ApiErrorCode,
    ApiError,
    UNAUTHORIZED_CODE,
    LoginResponse,
    ApiErrorResponse
} from './interfaces';

// Swagger: https://diabolocom-exercise.herokuapp.com/explorer/
// Login account: username: test / password: test4321

const url = 'https://diabolocom-exercise.herokuapp.com/api/';


const mapError = <T>() => catchError<T, ApiError>((response: ApiErrorResponse) => {
    const { error: { error } } = response;
    const result = new ApiError(
        error.message,
        error.statusCode === UNAUTHORIZED_CODE
          ? ApiErrorCode.Unauthorized
          : ApiErrorCode.Unknown
    );
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
