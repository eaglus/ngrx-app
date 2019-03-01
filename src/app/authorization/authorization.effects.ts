import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { filter, map, mergeMap, mapTo, tap, switchMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ServerApiService, ApiError } from '../serverApi';
import { SaveState } from '../localStorage';

import { Login, Logout } from './authorization.actions';
import { selectAuthorization } from './authorization.selectors';
import { StateSegment, AuthorizationStatus } from './authorization.reducer';


@Injectable()
export class AuthorizationEffects {

  authorization$ = this.store.pipe(map(selectAuthorization));
  unauthErrorMessage$ = this.translate.get('Unauthorized attempt to logout');

  @Effect()
  login$ = this.actions$
    .pipe(
      filter(Login.started.match),
      switchMap(action => {
          const params = action.payload;
          const {login, password} = params;
          return this.api.login(login, password).pipe(
            map(response => Login.done({
              params,
              result: response
            })),
            catchError(error => of(Login.failed({
              params,
              error
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
        filter(Logout.started.match),
        withLatestFrom(this.authorization$, this.unauthErrorMessage$),
        mergeMap(([_, authorization, unauthErrorMessage]) => authorization.status === AuthorizationStatus.Authorized
          ? this.api.logout(authorization.id).pipe(
            catchError(() => undefined)
          )
          : throwError({ message: unauthErrorMessage } as ApiError)
        ),
        tap(() => {
          this.router.navigateByUrl('/login');
        }),
        mergeMap(() => [
          Logout.done({
            params: undefined,
            result: undefined
          }),
          SaveState()
        ])
      );

  constructor(
    private actions$: Actions,
    private api: ServerApiService,
    private router: Router,
    private store: Store<StateSegment>,
    private translate: TranslateService,
  ) {
  }
}
