import { EMPTY, merge, Observable } from 'rxjs';
import { filter, switchMap, map, mergeMap, concatMap, withLatestFrom } from 'rxjs/operators';
import { isType, AnyAction } from 'typescript-fsa';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { ServerApiService, ApiError, ApiErrorCode } from '../serverApi';
import { navigateToLogin } from '../routing';
import { selectAuthorization, AuthorizationStatus, Logout } from '../authorization';
import { LoadAll, LoadOne, Update } from './callExplorer.actions';
import { StateSegmentWithDeps, LoadStatus } from './callExplorer.reducer';
import { createCallByIdSelector, selectStatus } from './callExplorer.selectors';

const emptyActions = EMPTY as Observable<Action>;

const logoutAndNavigate = [
  Logout.done(undefined),
  navigateToLogin
] as AnyAction[];

@Injectable()
export class CallExplorerEffects {

  loadAllStarted$ = this.actions$.pipe(
    filter(LoadAll.started.match)
  );

  loadOneStarted$ = this.actions$.pipe(
    filter(LoadOne.started.match)
  );

  updateStarted$ = this.actions$.pipe(
    filter(Update.started.match)
  );

  explorerStatus$ = this.store.pipe(map(selectStatus));
  authorization$ = this.store.pipe(map(selectAuthorization));

  @Effect()
  update$ = this.updateStarted$.pipe(
    withLatestFrom(
      this.authorization$,
    ),
    concatMap(([action, authorization]) =>
      authorization.status === AuthorizationStatus.Authorized
        ? this.api.updateCall(action.payload, authorization.id).pipe(
          mergeMap(
            result => result instanceof ApiError
            ? result.code === ApiErrorCode.Unauthorized
              ? logoutAndNavigate
              : [Update.failed({
                  params: action.payload,
                  error: result
                })]
            : [Update.done({
                params: action.payload,
                result: {
                  data: result,
                  isUpdating: false
                }
              })],
          )
        )
        : [navigateToLogin] as AnyAction[]
    )
  );

  @Effect()
  load$ = merge(
    this.loadAllStarted$,
    this.loadOneStarted$,
  ).pipe(
    withLatestFrom(
      this.explorerStatus$,
      this.authorization$,
      this.store,
    ),
    switchMap(([action, explorerStatus, authorization, state]) => {
      if (authorization.status === AuthorizationStatus.Authorized) {
        if (explorerStatus === LoadStatus.LoadedAll) {
          return emptyActions;
        } else if (isType(action, LoadAll.started)) {
          return this.api.getCalls(authorization.id).pipe(
            mergeMap(
              result => result instanceof ApiError
                ? result.code === ApiErrorCode.Unauthorized
                  ? logoutAndNavigate
                  : [LoadAll.failed({
                      params: action.payload,
                      error: result
                    })]
                : [LoadAll.done({
                    params: action.payload,
                    result: result.map(data => ({
                      data,
                      isUpdating: false
                    }))
                  })],
            ),
          );
        } else if (isType(action, LoadOne.started)) {
          const id = action.payload;
          const call = createCallByIdSelector(id)(state);
          if (call) {
            return emptyActions;
          } else {
            return this.api.getCall(id, authorization.id).pipe(
              mergeMap(
                result => result instanceof ApiError
                  ? result.code === ApiErrorCode.Unauthorized
                    ? logoutAndNavigate
                    : [LoadOne.failed({
                        params: action.payload,
                        error: result
                      })]
                  : [LoadOne.done({
                      params: action.payload,
                      result: {
                        data: result,
                        isUpdating: false
                      }
                    })],
              ),
            );
          }
        }
      } else {
        return [navigateToLogin];
      }
    })
  );

  constructor(
    private actions$: Actions,
    private api: ServerApiService,
    private store: Store<StateSegmentWithDeps>,
  ) {}
}
