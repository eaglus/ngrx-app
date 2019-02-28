import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';
import { Login, Logout } from './authorization.actions';


export enum AuthorizationStatus {
  Authorized,
  Authorizing,
  Unauthorized,
  Error,
}
export interface StateAuthorized {
  status: AuthorizationStatus.Authorized;
  login: string;
  id: string;
  userId: string;
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

export interface StateSegment {
  authorization: State;
}

export const initialState: StateUnauthorized = {
  status: AuthorizationStatus.Unauthorized
};

export function reducer(state: State = initialState, action: Action): State {
  if (isType(action, Login.started)) {
    return {
      status: AuthorizationStatus.Authorizing,
      login: action.payload.login
    };
  } else if (isType(action, Login.done)) {
    const { payload: { params, result } } = action;
    return {
      status: AuthorizationStatus.Authorized,
      login: params.login,
      id: result.id,
      userId: result.userId,
    };
  } else if (isType(action, Login.failed)) {
    const { payload } = action;
    return {
      status: AuthorizationStatus.Error,
      login: payload.params.login,
      error: payload.error.message
    };
  } else if (isType(action, Logout.done)) {
    return initialState;
  } else {
    return state;
  }
}
