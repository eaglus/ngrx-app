import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';

import { AuthorizationStateSegment } from '../authorization';
import { Call } from '../serverApi';
import { LoadAll, LoadOne } from './callExplorer.actions';

export enum LoadStatus {
    Nothing,
    Loading,
    LoadedAll,
    LoadedPartial,
    Error,
}

export interface State {
    status: LoadStatus;
    calls: Call[];
    error?: string;
}

export interface StateSegment {
  callExplorer: State;
}

export type StateSegmentWithDeps = StateSegment & AuthorizationStateSegment;

export const initialState: State = {
  status: LoadStatus.Nothing,
  calls: []
};

export function reducer(state: State = initialState, action: Action): State {
  if (isType(action, LoadAll.started) || isType(action, LoadOne.started)) {
    if (state.status !== LoadStatus.LoadedAll && state.status !== LoadStatus.Loading) {
      return {
        ...state,
        status: LoadStatus.Loading,
      };
    } else {
      return state;
    }
  } else if (isType(action, LoadAll.done)) {
    const { payload: { result } } = action;
    return {
        ...state,
        status: LoadStatus.LoadedAll,
        calls: result
    };
  } else if (isType(action, LoadAll.failed) || isType(action, LoadOne.failed)) {
    const { error } = action.payload;
    return {
        ...state,
        status: LoadStatus.Error,
        error: error.message
    };
  } else if (isType(action, LoadOne.done)) {
    const { payload: { result: call } } = action;
    const { calls } = state;
    const idx = calls.findIndex(item => item.callId === call.callId);
    const newCalls = idx === -1
      ? [call, ...calls]
      : [...calls.slice(0, idx), call, ...calls.slice(idx + 1)];

    return {
        ...state,
        status: LoadStatus.LoadedPartial,
        calls: newCalls
    };
  } else {
    return state;
  }
}
