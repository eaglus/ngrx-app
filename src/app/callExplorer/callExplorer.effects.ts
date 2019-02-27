import { of, EMPTY, merge, throwError, Observable } from 'rxjs';
import { sample, filter, catchError, switchMap, map, take, withLatestFrom } from 'rxjs/operators';
import { isType } from 'typescript-fsa';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';

import { ServerApiService, ApiError } from '../serverApi';
import { selectAuthorization, AuthorizationStatus } from '../authorization';
import { LoadAll, LoadOne } from './callExplorer.actions';
import { StateSegmentWithDeps, LoadStatus } from './callExplorer.reducer';
import { createCallByIdSelector, selectStatus } from './callExplorer.selectors';

const emptyActions = EMPTY as Observable<Action>;

@Injectable()
export class CallExplorerEffects {

  loadAllStarted$ = this.actions$.pipe(
    filter(LoadAll.started.match)
  );

  loadOneStarted$ = this.actions$.pipe(
    filter(LoadOne.started.match)
  );

  explorerStatus$ = this.store.pipe(map(selectStatus));
  authorization$ = this.store.pipe(map(selectAuthorization));

  @Effect()
  load$ = merge(
    this.loadAllStarted$,
    this.loadOneStarted$,
  ).pipe(
    withLatestFrom(
      this.explorerStatus$,
      this.authorization$,
      this.store
    ),
    switchMap(([action, explorerStatus, authorization, state]) => {
      if (authorization.status === AuthorizationStatus.Authorized) {
        if (explorerStatus === LoadStatus.LoadedAll) {
          return emptyActions;
        } else if (isType(action, LoadAll.started)) {
          return this.api.getCalls(authorization.id).pipe(
            map(
              result => LoadAll.done({
                params: action.payload,
                result
              }),
            ),
            catchError((error: ApiError) => of(LoadAll.failed({
              params: action.payload,
              error
            })))
          );
        } else if (isType(action, LoadOne.started)) {
          const callId = action.payload;
          const call = createCallByIdSelector(callId)(state);
          if (call) {
            return emptyActions;
          } else {
            return this.api.getCall(callId, authorization.id).pipe(
              map(
                result => LoadOne.done({
                  params: action.payload,
                  result
                }),
              ),
              catchError((error: ApiError) => of(LoadOne.failed({
                params: action.payload,
                error: error
              })))
            );
          }
        }
      } else {
        return throwError({
          message: 'Unauthorized attempt to load'
        } as ApiError);
      }
    })
  );

  constructor(
    private actions$: Actions,
    private api: ServerApiService,
    private store: Store<StateSegmentWithDeps>
  ) {}
}
