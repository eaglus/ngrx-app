import { Observable, of } from 'rxjs';
import { AnyAction } from 'typescript-fsa';
import { StoreModule } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jasmine';

import { ServerApiService, ApiError, ApiErrorCode, Call, CallData } from '../serverApi';
import { navigateToLogin } from '../routing';

import { AuthorizationStatus } from '../authorization';
import { LoadAll, Update, LoadOne } from './callExplorer.actions';
import { StateSegmentWithDeps, LoadStatus } from './callExplorer.reducer';
import { CallExplorerEffects } from './callExplorer.effects';

describe('Call explorer Effects', () => {
  let effects: CallExplorerEffects;

  let actions: Observable<AnyAction>;
  let apiService: ServerApiService;
  let state: StateSegmentWithDeps;

  const accessTokenId = 'accessToken';

  const id = 'id';
  const callId = 123;

  const authorizedState = {
    authorization: {
      id: accessTokenId,
      status: AuthorizationStatus.Authorized
    }
  } as StateSegmentWithDeps;

  const unauthorizedState = {
    authorization: {
      status: AuthorizationStatus.Unauthorized
    }
  } as StateSegmentWithDeps;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          authorization: () => state.authorization,
          callExplorer: () => state.callExplorer,
        }),
      ],
      providers: [
        CallExplorerEffects,
        provideMockActions(() => actions),
        {
          provide: ServerApiService,
          useFactory:  () => apiService
        },
      ],
    });
  });

  describe('Update', marbles(m => {
    const requestCall = {
      data: {
        id,
        callId
      },
      isUpdating: false,
    } as Call;

    const responseCallData = {
      ...requestCall.data,
      callStart: 'bebebe'
    } as CallData;

    actions = m.cold('a--', {
      a: Update.started(requestCall),
    });

    it('successfull update scenario', () => {
      apiService = {
        updateCall: (call, accessToken) => {
          expect(accessToken).toBe(accessTokenId);
          expect(call).toEqual(requestCall);
          return of(responseCallData);
        }
      } as ServerApiService;

      state = authorizedState;

      const expected = m.cold('a--', {
        a: Update.done({
          params: requestCall,
          result: {
            data: responseCallData,
            isUpdating: false,
          }
        }),
      });

      effects = TestBed.get(CallExplorerEffects);

      m.expect(effects.update$).toBeObservable(expected);
    });

    it('update in unauthorized state should redirect to login', () => {
      state = unauthorizedState;

      apiService = {
      } as ServerApiService;

      const expected = m.cold('a--', {
        a: navigateToLogin,
      });

      effects = TestBed.get(CallExplorerEffects);

      m.expect(effects.update$).toBeObservable(expected);
    });

    it('unauthorized api error should redirect to login', () => {
      state = authorizedState;

      apiService = {
        updateCall: (call, accessToken) => {
          expect(accessToken).toBe(accessTokenId);
          expect(call).toEqual(requestCall);
          return of(new ApiError('error', ApiErrorCode.Unauthorized));
        }
      } as ServerApiService;

      const expected = m.cold('a--', {
        a: navigateToLogin,
      });

      effects = TestBed.get(CallExplorerEffects);

      m.expect(effects.update$).toBeObservable(expected);
    });

    it('unknown api error should return Update.failed', () => {
      state = authorizedState;

      const error = new ApiError('error', ApiErrorCode.Unknown);
      apiService = {
        updateCall: (call, accessToken) => {
          expect(accessToken).toBe(accessTokenId);
          expect(call).toEqual(requestCall);
          return of(error);
        }
      } as ServerApiService;

      const expected = m.cold('a--', {
        a: Update.failed({
          params: requestCall,
          error
        }),
      });

      effects = TestBed.get(CallExplorerEffects);

      m.expect(effects.update$).toBeObservable(expected);
    });
  }));

  describe('LoadAll/LoadOne', () => {
    const responseCallData = {
      callId,
      id
    } as CallData;

    const reloadableStatuses = [
      LoadStatus.Nothing,
      LoadStatus.Error,
      LoadStatus.LoadedPartial,
      LoadStatus.Loading
    ];

    it('load actions in unauthorized state should redirect to login', marbles(m => {
      state = {
        ...unauthorizedState,
        callExplorer: {
          status: LoadStatus.Nothing
        }
      } as StateSegmentWithDeps;

      apiService = {
      } as ServerApiService;

      const startActions = [
        LoadAll.started(),
        LoadOne.started(id)
      ];

      startActions.forEach(startAction => {
        actions = m.cold('a--', {
          a: startAction,
        });

        const expected = m.cold('a--', {
          a: navigateToLogin,
        });

        effects = TestBed.get(CallExplorerEffects);

        m.expect(effects.load$).toBeObservable(expected);
      });
    }));

    it('load actions does nothing if all calls are loaded', marbles(m => {
      apiService = {
      } as ServerApiService;

      state = {
        ...authorizedState,
        callExplorer: {
          status: LoadStatus.LoadedAll
        }
      } as StateSegmentWithDeps;

      const loadActions = [
        LoadAll.started(),
        LoadOne.started(id)
      ];

      loadActions.forEach(loadAction => () => {
        actions = m.cold('a--|', {
          a: loadAction,
        });

        const expected = m.cold('---|');

        effects = TestBed.get(CallExplorerEffects);

        m.expect(effects.load$).toBeObservable(expected);
      });
    }));

    describe('LoadAll', () => {
      it('LoadAll calls api.getCalls for all reloadable statuses, and returns LoadAll.done ' +
         'for successfull api.getCalls result', marbles(m => {
        apiService = {
          getCalls: (accessToken) => {
            expect(accessToken).toBe(accessTokenId);
            return of([responseCallData]);
          }
        } as ServerApiService;

        reloadableStatuses.forEach(status => {
          state = {
            ...authorizedState,
            callExplorer: {
              status
            }
          } as StateSegmentWithDeps;

          actions = m.cold('a--', {
            a: LoadAll.started(),
          });

          const expected = m.cold('a--', {
            a: LoadAll.done({
              params: undefined,
              result: [{
                data: responseCallData,
                isUpdating: false,
              }]
            }),
          });

          effects = TestBed.get(CallExplorerEffects);

          m.expect(effects.load$).toBeObservable(expected);
        });
      }));

      it('LoadAll calls api.getCalls for all reloadable statuses, and returns LoadAll.failed ' +
         'for api.getCalls result as ApiErrorCode.Unknown', marbles(m => {
        const apiError = new ApiError('error', ApiErrorCode.Unknown);
        apiService = {
          getCalls: (accessToken) => {
            expect(accessToken).toBe(accessTokenId);
            return of(apiError);
          }
        } as ServerApiService;

        reloadableStatuses.forEach(status => {
          state = {
            ...authorizedState,
            callExplorer: {
              status
            }
          } as StateSegmentWithDeps;

          actions = m.cold('a--', {
            a: LoadAll.started(),
          });

          const expected = m.cold('a--', {
            a: LoadAll.failed({
              params: undefined,
              error: apiError
            }),
          });

          effects = TestBed.get(CallExplorerEffects);

          m.expect(effects.load$).toBeObservable(expected);
        });
      }));

      it('LoadAll calls api.getCalls for all reloadable statuses, and returns navigateToLogin ' +
         'for api.getCalls result as ApiErrorCode.Unauthorized', marbles(m => {
        const apiError = new ApiError('error', ApiErrorCode.Unauthorized);
        apiService = {
          getCalls: (accessToken) => {
            expect(accessToken).toBe(accessTokenId);
            return of(apiError);
          }
        } as ServerApiService;

        reloadableStatuses.forEach(status => {
          state = {
            ...unauthorizedState,
            callExplorer: {
              status
            }
          } as StateSegmentWithDeps;

          actions = m.cold('a--', {
            a: LoadAll.started(),
          });

          const expected = m.cold('a--', {
            a: navigateToLogin,
          });

          effects = TestBed.get(CallExplorerEffects);

          m.expect(effects.load$).toBeObservable(expected);
        });
      }));
    });

    describe('LoadOne', () => {
      it('LoadOne calls api.getCall for all reloadable statuses, and returns LoadOne.done ' +
         'for successfull api.getCall result', marbles(m => {
        apiService = {
          getCall: (idArg, accessToken) => {
            expect(idArg).toBe(id);
            expect(accessToken).toBe(accessTokenId);
            return of(responseCallData);
          }
        } as ServerApiService;

        reloadableStatuses.forEach(status => {
          state = {
            ...authorizedState,
            callExplorer: {
              status,
              calls: []
            }
          } as StateSegmentWithDeps;

          actions = m.cold('a--', {
            a: LoadOne.started(id),
          });

          const expected = m.cold('a--', {
            a: LoadOne.done({
              params: id,
              result: {
                data: responseCallData,
                isUpdating: false,
              }
            }),
          });

          effects = TestBed.get(CallExplorerEffects);

          m.expect(effects.load$).toBeObservable(expected);
        });
      }));

      it('LoadOne does nothing if call is already loaded', marbles(m => {
        apiService = {
        } as ServerApiService;

        reloadableStatuses.forEach(status => {
          state = {
            ...authorizedState,
            callExplorer: {
              status,
              calls: [{
                data: responseCallData,
                isUpdating: false
              }]
            }
          } as StateSegmentWithDeps;

          actions = m.cold('a--', {
            a: LoadOne.started(id),
          });

          const expected = m.cold('---');

          effects = TestBed.get(CallExplorerEffects);

          m.expect(effects.load$).toBeObservable(expected);
        });
      }));

      it('LoadOne calls api.getCall for all reloadable statuses, and returns LoadAll.failed ' +
         'for api.getCall result as ApiErrorCode.Unknown', marbles(m => {
        const apiError = new ApiError('error', ApiErrorCode.Unknown);
        apiService = {
          getCall: (idArg, accessToken) => {
            expect(idArg).toBe(id);
            expect(accessToken).toBe(accessTokenId);
            return of(apiError);
          }
        } as ServerApiService;

        reloadableStatuses.forEach(status => {
          state = {
            ...authorizedState,
            callExplorer: {
              status,
              calls: []
            }
          } as StateSegmentWithDeps;

          actions = m.cold('a--', {
            a: LoadOne.started(id),
          });

          const expected = m.cold('a--', {
            a: LoadOne.failed({
              params: id,
              error: apiError
            }),
          });

          effects = TestBed.get(CallExplorerEffects);

          m.expect(effects.load$).toBeObservable(expected);
        });
      }));

      it('LoadOne calls api.getCall for all reloadable statuses, and returns navigateToLogin ' +
         'for api.getCall result as ApiErrorCode.Unauthorized', marbles(m => {
        const apiError = new ApiError('error', ApiErrorCode.Unauthorized);
        apiService = {
          getCall: (idArg, accessToken) => {
            expect(idArg).toBe(id);
            expect(accessToken).toBe(accessTokenId);
            return of(apiError);
          }
        } as ServerApiService;

        reloadableStatuses.forEach(status => {
          state = {
            ...unauthorizedState,
            callExplorer: {
              status,
              calls: []
            }
          } as StateSegmentWithDeps;

          actions = m.cold('a--', {
            a: LoadOne.started(id),
          });

          const expected = m.cold('a--', {
            a: navigateToLogin,
          });

          effects = TestBed.get(CallExplorerEffects);

          m.expect(effects.load$).toBeObservable(expected);
        });
      }));
    });
  });
});
