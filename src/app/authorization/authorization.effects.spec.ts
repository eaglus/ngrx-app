import { Observable, of } from 'rxjs';
import { AnyAction } from 'typescript-fsa';
import { StoreModule } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jasmine';

import { ServerApiService, ApiError, LoginResponse, ApiErrorCode } from '../serverApi';
import { SaveState } from '../localStorage';
import { Navigate } from '../routing';

import {
  initialState,
  StateAuthorized,
  StateAuthorizing,
  StateSegment,
  AuthorizationStatus,
} from './authorization.reducer';
import { Logout, Login } from './authorization.actions';
import { AuthorizationEffects } from './authorization.effects';

describe('Authorization Effects', () => {
  let effects: AuthorizationEffects;

  let actions: Observable<AnyAction>;
  let apiService: ServerApiService;
  let state: StateSegment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          authorization: () => state,
        }),
      ],
      providers: [
        AuthorizationEffects,
        provideMockActions(() => actions),
        {
          provide: ServerApiService,
          useFactory:  () => apiService
        },
      ],
    });
  });

  const login = 'login';
  const password = 'password';

  describe('login', () => {
    const loginParams = {
      login,
      password
    };

    const responseExpected = {
      id: login,
      userId: login
    } as LoginResponse;

    it('successfull login scenario', marbles(m => {
      actions = m.hot('a--', {
        a: Login.started(loginParams),
      });

      const expected = m.cold('(abc)--', {
        a: Login.done({
          params: loginParams,
          result: responseExpected
        }),
        b: SaveState(),
        c: Navigate([''])
      });

      apiService = {
        login: (login, _password) => of({
          id: login,
          userId: login
        } as LoginResponse)
      } as ServerApiService;

      effects = TestBed.get(AuthorizationEffects);

      m.expect(effects.login$).toBeObservable(expected);
    }));

    it('failed login scenario', marbles(m => {
      const error = 'unknown error';

      actions = m.hot('a--', {
        a: Login.started(loginParams),
      });

      const expected = m.cold('a--', {
        a: Login.failed({
          params: loginParams,
          error: {
            message: error
          }
        }),
      });

      apiService = {
        login: (login, _password) => of(new ApiError(
          error,
          ApiErrorCode.Unknown
        ))
      } as ServerApiService;

      effects = TestBed.get(AuthorizationEffects);

      m.expect(effects.login$).toBeObservable(expected);
    }));
  });

  describe('logout', () => {

    it('logout scenarios, successful/failed, from all states', marbles(m => {
      actions = m.hot('a--', {
        a: Logout.started(),
      });

      const expected = m.cold('(abc)--', {
        a: Logout.done({
          params: undefined,
          result: undefined
        }),
        b: SaveState(),
        c: Navigate(['login'])
      });

      const logoutApiResults = [
        undefined,
        new ApiError('unauthorized', ApiErrorCode.Unauthorized),
        new ApiError('unknown', ApiErrorCode.Unknown),
      ];

      const states = [
        {
          status: AuthorizationStatus.Authorized
        } as StateAuthorized,

        initialState,

        {
          status: AuthorizationStatus.Authorizing
        } as StateAuthorizing,
      ];

      logoutApiResults.forEach(logoutApiResult => {
        states.forEach(authState => {
          apiService = {
            logout: (_) => of(logoutApiResult)
          } as ServerApiService;

          state = {
            authorization: authState
          };

          effects = TestBed.get(AuthorizationEffects);

          m.expect(effects.logout$).toBeObservable(expected);
        });
      });
    }));

  });
});
