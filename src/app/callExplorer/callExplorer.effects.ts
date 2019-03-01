import { of, EMPTY, merge, throwError, Observable } from 'rxjs';
import { filter, catchError, switchMap, map, concatMap, withLatestFrom } from 'rxjs/operators';
import { isType } from 'typescript-fsa';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { ServerApiService, ApiError } from '../serverApi';
import { selectAuthorization, AuthorizationStatus } from '../authorization';
import { LoadAll, LoadOne, Update } from './callExplorer.actions';
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

  updateStarted$ = this.actions$.pipe(
    filter(Update.started.match)
  );

  explorerStatus$ = this.store.pipe(map(selectStatus));
  authorization$ = this.store.pipe(map(selectAuthorization));

  unauthErrorMessage$ = this.translate.get('Unauthorized attempt to load');

  @Effect()
  update$ = this.updateStarted$.pipe(
    withLatestFrom(
      this.authorization$,
      this.unauthErrorMessage$,
    ),
    concatMap(([action, authorization, unauthErrorMessage]) => {
      if (authorization.status === AuthorizationStatus.Authorized) {
        return this.api.updateCall(action.payload, authorization.id).pipe(
          map(
            result => Update.done({
              params: action.payload,
              result: {
                data: result,
                isUpdating: false
              }
            }),
          ),
          catchError((error: ApiError) => of(Update.failed({
            params: action.payload,
            error
          })))
        );
      } else {
        return throwError({
          message: unauthErrorMessage
        } as ApiError);
      }
    })
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
      this.unauthErrorMessage$,
    ),
    switchMap(([action, explorerStatus, authorization, state, unauthErrorMessage]) => {
      if (authorization.status === AuthorizationStatus.Authorized) {
        if (explorerStatus === LoadStatus.LoadedAll) {
          return emptyActions;
        } else if (isType(action, LoadAll.started)) {
          return this.api.getCalls(authorization.id).pipe(
            map(
              result => LoadAll.done({
                params: action.payload,
                result: result.map(data => ({
                  data,
                  isUpdating: false
                }))
              }),
            ),
            catchError((error: ApiError) => of(LoadAll.failed({
              params: action.payload,
              error
            })))
          );
        } else if (isType(action, LoadOne.started)) {
          const id = action.payload;
          const call = createCallByIdSelector(id)(state);
          if (call) {
            return emptyActions;
          } else {
            return this.api.getCall(id, authorization.id).pipe(
              map(
                result => LoadOne.done({
                  params: action.payload,
                  result: {
                    data: result,
                    isUpdating: false
                  }
                }),
              ),
              catchError((error: ApiError) => of(LoadOne.failed({
                params: action.payload,
                error
              })))
            );
          }
        }
      } else {
        return throwError({
          message: unauthErrorMessage
        } as ApiError);
      }
    })
  );

  constructor(
    private actions$: Actions,
    private api: ServerApiService,
    private store: Store<StateSegmentWithDeps>,
    private translate: TranslateService,
  ) {}
}
