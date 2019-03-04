import {
  reducer,
  initialState,
  StateAuthorized,
  StateAuthorizing,
  StateError,
  AuthorizationStatus,
} from './authorization.reducer';
import { Logout, Login } from './authorization.actions';

describe('Authorization Reducer', () => {

  const login = 'login';
  const password = 'password';
  const id = 'id';
  const userId = 'userId';
  const authorizedState: StateAuthorized = {
    id,
    login,
    status: AuthorizationStatus.Authorized,
    userId
  };

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('Login action', () => {
    const loginParams = {
      login,
      password
    };

    it('Login.started should set authorizing state', () => {
      const result = reducer(initialState, Login.started(loginParams));

      expect(result).toEqual({
        login,
        status: AuthorizationStatus.Authorizing
      } as StateAuthorizing);
    });

    it('Login.done should set authorized state', () => {
      const result = reducer(initialState, Login.done({
        params: loginParams,
        result: {
          created: 'created',
          id,
          ttl: 1234,
          userId,
        }
      }));

      expect(result).toEqual(authorizedState);
    });

    it('Login.failed should set error state', () => {
      const errorMessage = 'errorMessage';
      const result = reducer(initialState, Login.failed({
        params: loginParams,
        error: {
          message: errorMessage
        }
      }));

      expect(result).toEqual({
        status: AuthorizationStatus.Error,
        error: errorMessage,
        login
      } as StateError);
    });
  });

  describe('Logout action', () => {
    it('Logout should set initial (unauthorized) state', () => {
      const result = reducer(authorizedState, Logout.done);
      expect(result).toEqual(initialState);
    });
  });
});
