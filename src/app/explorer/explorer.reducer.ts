import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';

import { Load } from './explorer.actions';

export enum LoadStatus {
    Nothing,
    Loading,
    Loaded,
    Error,
}

export interface StateNothing {
    status: LoadStatus.Nothing;
}

export interface StateLoading {
    status: LoadStatus.Loading;
}

export interface StateLoaded {
    status: LoadStatus.Loaded;
    data: any[];
}

export interface StateError {
    status: LoadStatus.Error;
    error: string;
}

export type State = StateNothing | StateLoading | StateLoaded | StateError;

export interface StateSegment {
  explorer: State;
}

export const initialState: StateNothing = {
  status: LoadStatus.Nothing
};

export function reducer(state: State = initialState, action: Action): State {
  if (isType(action, Load.started)) {
    return {
      status: LoadStatus.Loading,
    };
  } else if (isType(action, Load.done)) {
    const { payload: { result } } = action;
    return {
        status: LoadStatus.Loaded,
        data: result
    };
  } else if (isType(action, Load.failed)) {
    const { payload, error } = action;
    return {
        status: LoadStatus.Error,
        error
    };
  } else if (isType(action, Logout)) {
    return initialState;
  } else {
    return state;
  }
}
