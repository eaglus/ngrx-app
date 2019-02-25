import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { filter, map, mapTo, tap, switchMap, catchError, ignoreElements } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Login, Logout } from './authorization.actions';
import { ServerApiService } from '../serverApi';
import { SaveState } from '../localStorage';


@Injectable()
export class AuthorizationEffects {

  @Effect()
  login$ = this.actions$
    .pipe(
      filter(Login.started.match),
      switchMap(action => {
          console.log('Send login start', action);
          const params = action.payload;
          const {login, password} = params;
          return this.api.login(login, password).pipe(
            map(response => Login.done({
              params,
              result: {
                id: response.id,
                userId: response.userId
              }
            })),
            catchError(error => of(Login.failed({
              params,
              error: error
            })))
          );
      }),
    );

    @Effect()
    loginRoute$ = this.actions$
      .pipe(
        filter(Login.done.match),
        tap(() => {
          this.router.navigateByUrl('/');
        }),
        mapTo(SaveState())
      );

    @Effect()
    logoutRoute$ = this.actions$
      .pipe(
        filter(Logout.match),
        tap(() => {
          this.router.navigateByUrl('/login');
        }),
        mapTo(SaveState())
      );

  constructor(
    private actions$: Actions,
    private api: ServerApiService,
    private router: Router,
  ) {}
}
