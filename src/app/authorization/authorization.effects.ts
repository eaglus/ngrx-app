import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, tap, ignoreElements } from 'rxjs/operators';

import { Login } from './authorization.actions';

@Injectable()
export class AuthorizationEffects {

  @Effect()
  login$ = this.actions$
    .pipe(
      ofType(Login.started.type),
      tap(action => {
          console.log('Send login start', action);
      }),
      ignoreElements()
    );

  constructor(
    private actions$: Actions,
  ) {}
}
