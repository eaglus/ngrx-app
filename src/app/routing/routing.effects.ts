import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { filter, tap, ignoreElements } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Navigate } from './routing.actions';

@Injectable()
export class RoutingEffects {

  @Effect()
  route$ = this.actions$.pipe(
    filter(Navigate.match),
    tap(action => this.router.navigate(action.payload)),
    ignoreElements()
  );

  constructor(
    private actions$: Actions,
    private router: Router,
  ) {}
}
