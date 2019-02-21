import { AuthorizationActions, AuthorizationActionTypes } from './authorization.actions';


export enum AuthorizationStatus {
  Authorized,
  Authorizing,
  Unauthorized,
  Error,
}
export interface StateAuthorized {
  status: AuthorizationStatus.Authorized;
  login: string;
  token: string;
}

export interface StateAuthorizing {
  status: AuthorizationStatus.Authorizing;
  login: string;
}

export interface StateError {
  status: AuthorizationStatus.Error;
  login: string;
  error: string;
}

export interface StateUnauthorized {
  status: AuthorizationStatus.Unauthorized;
}

export type State = StateAuthorized | StateAuthorizing | StateUnauthorized | StateError;

export const initialState: StateUnauthorized = {
  status: AuthorizationStatus.Unauthorized
};

export function reducer(state: State = initialState, action: AuthorizationActions): State {
  switch (action.type) {
    case AuthorizationActionTypes.Logout: {
      return initialState;
    }

    case AuthorizationActionTypes.LoginStart: {
      return {
        status: AuthorizationStatus.Authorizing,
        login: action.login
      };
    }

    case AuthorizationActionTypes.LoginDone: {
      if (state.status !== AuthorizationStatus.Authorizing) {
        throw new Error('LoginDone action should be called at AuthorizationStatus.Authorizing state');
      }

      return {
        status: AuthorizationStatus.Authorized,
        login: state.login,
        token: action.token
      };
    }

    case AuthorizationActionTypes.LoginFailed: {
      if (state.status !== AuthorizationStatus.Authorizing) {
        throw new Error('LoginFailed action should be called at AuthorizationStatus.Authorizing state');
      }

      return {
        status: AuthorizationStatus.Error,
        login: state.login,
        error: action.error
      };
    }

    default:
      const exhaustiveCheck: never = action;
      return state;
  }
}
