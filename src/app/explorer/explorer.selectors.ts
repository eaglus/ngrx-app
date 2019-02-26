import { createSelector } from '@ngrx/store';

import { AuthorizationStateSegment } from '../authorization';
import { Call } from '../serverApi';

import { StateSegment } from './explorer.reducer';

export const selectExplorer = (state: StateSegment & AuthorizationStateSegment) => state.explorer;

export const selectCalls = createSelector(
    selectExplorer,
    explorer => explorer.calls
);

export const selectCallById = createSelector(
    selectCalls,
    (calls: Call[], callId: number) => calls.find(item => item.callId === callId)
);

export const selectExplorerStatus = createSelector(
    selectExplorer,
    explorer => explorer.status
);
