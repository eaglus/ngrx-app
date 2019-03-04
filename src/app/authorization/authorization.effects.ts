import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { AnyAction } from 'typescript-fsa';

import { ServerApiService, ApiError } from '../serverApi';
import { SaveState } from '../localStorage';
import { Navigate } from '../routing';

import { Login, Logout } from './authorization.actions';
import { selectAuthorization } from './authorization.selectors';
import { StateSegment, AuthorizationStatus } from './authorization.reducer';


@Injectable()
export class AuthorizationEffects {

  authorization$ = this.store.pipe(map(selectAuthorization));

  @Effect()
  login$ = this.actions$
    .pipe(
      filter(Login.started.match),
      switchMap(action => {
          const params = action.payload;
          const {login, password} = params;
          return this.api.login(login, password).pipe(
            mergeMap(response => response instanceof ApiError
              ? [
                Login.failed({
                  params,
                  error: {
                    message: response.message
                  }
                })
              ] as AnyAction[]
              : [
                Login.done({
                  params,
                  result: response
                }),
                SaveState(),
                Navigate([''])
              ]
            )
          );
      }),
    );

    @Effect()
    logout$ = this.actions$
      .pipe(
        filter(Logout.started.match),
        withLatestFrom(this.authorization$),
        mergeMap(([_, authorization]) =>
          authorization.status === AuthorizationStatus.Authorized
           ? this.api.logout(authorization.id)
           : [undefined]
        ),
        mergeMap(() => [
          Logout.done({
            params: undefined,
            result: undefined
          }),
          SaveState(),
          Navigate(['login'])
        ])
      );

  constructor(
    private actions$: Actions,
    private api: ServerApiService,
    private store: Store<StateSegment>,
  ) {
  }
}
