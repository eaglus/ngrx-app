import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { combineLatest } from 'rxjs';
import { filter, tap, ignoreElements, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { State } from '../reducers';
import { SaveState } from './localstorage.actions';

export const storageKey = 'ngrx-app';

function saveState(state: State) {
    const toSave: Partial<State> = {
        authorization: state.authorization,
    };

    localStorage[storageKey] = JSON.stringify(toSave);
}

@Injectable()
export class LocalStorageEffects {

  private saveState$ = this.actions$
    .pipe(
      filter(SaveState.match),
    );

  @Effect()
  save$ = this.store.pipe(
    switchMap(state =>
      this.saveState$.pipe(
        tap(() => saveState(state))
      )
    ),
    ignoreElements()
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
  ) {}
}
