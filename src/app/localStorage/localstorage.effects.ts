import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { filter, tap, ignoreElements, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { State } from '../reducers';
import { SaveState } from './localstorage.actions';
import { StateSaver } from './stateSaver.service';

@Injectable()
export class LocalStorageEffects {

  @Effect()
  save$ = this.actions$.pipe(
    filter(SaveState.match),
    withLatestFrom(this.store),
    tap(([_, state]) => {
      const toSave: Partial<State> = {
        authorization: state.authorization,
        localization: state.localization,
      };

      this.stateSaver.save(toSave);
    }),
    ignoreElements()
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private stateSaver: StateSaver
  ) {}
}
