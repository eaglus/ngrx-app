import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Swagger​: ​https://diabolocom-exercise.herokuapp.com/explorer/
// Login account:​ username: test / password: test4321

const url = 'https://diabolocom-exercise.herokuapp.com/api/';

interface LoginResponse {
    id: string;
    ttl: number;
    created: string;
    userId: string;    
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
        ).pipe(
            map(response => response as LoginResponse)
        );
    }

    public logout(token: string) {

    }
}