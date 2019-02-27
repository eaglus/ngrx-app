import { createSelector } from '@ngrx/store';

import { Call } from '../serverApi';

import { StateSegment, LoadStatus } from './callExplorer.reducer';

export const selectState = (state: StateSegment) => state.callExplorer;

export const selectCalls = createSelector(
    selectState,
    explorer => explorer.calls
);

export const createCallByIdSelector = (callId: number) => createSelector(
    selectCalls,
    (calls: Call[]) => calls.find(item => item.callId === callId)
);

export const selectStatus = createSelector(
    selectState,
    explorer => explorer.status
);

export const selectIsLoading = createSelector(
    selectStatus,
    status => status === LoadStatus.Loading || status === LoadStatus.Nothing
);
