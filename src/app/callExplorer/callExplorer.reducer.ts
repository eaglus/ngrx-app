import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';

import { AuthorizationStateSegment } from '../authorization';
import { Call } from '../serverApi';
import { LoadAll, LoadOne, Update } from './callExplorer.actions';

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

const createCallUpdater = (state: State) => (id: number, updater: (call: Call) => Call[]) => {
  const { calls } = state;
  const idx = calls.findIndex(item => item.data.callId === id);
  const found = idx !== -1;
  const insertCalls = updater(found ? calls[idx] : null);
  const newCalls = found
    ? [
      ...calls.slice(0, idx),
      ...insertCalls,
      ...calls.slice(idx + 1)
    ]
    : [
      ...calls,
      ...insertCalls,
    ];

  return {
    ...state,
    calls: newCalls
  };
};

export function reducer(state: State = initialState, action: Action): State {
  const callUpdater = createCallUpdater(state);

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

    return {
        ...callUpdater(call.data.callId, () => [call]),
        status: LoadStatus.LoadedPartial,
    };
  } else if (isType(action, Update.started)) {
    const { payload: call } = action;
    return {
        ...state,
        ...callUpdater(call.data.callId, () => [{
          ...call,
          isUpdating: true
        }]),
    };
  } else if (isType(action, Update.done)) {
    const { payload: { result: call } } = action;
    return {
        ...state,
        ...callUpdater(call.data.callId, () => [{
          ...call,
          isUpdating: false
        }]),
    };
  } else if (isType(action, Update.failed)) {
    const { payload: { params: call, error } } = action;
    return {
        ...state,
        ...callUpdater(call.data.callId, () => [{
          ...call,
          isUpdating: false
        }]),
        status: LoadStatus.Error,
        error: error.message
    };
  } else {
    return state;
  }
}
