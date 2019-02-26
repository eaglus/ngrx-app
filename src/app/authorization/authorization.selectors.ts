import { createSelector } from '@ngrx/store';
import {StateSegment, AuthorizationStatus} from './authorization.reducer';

export const selectAuthorization = (state: StateSegment) => state.authorization;

export const selectAuthorizedUser = createSelector(
  selectAuthorization,
  authorization => authorization.status === AuthorizationStatus.Authorized
    ? authorization
    : undefined
);

export const selectIsAuthorized = createSelector(
  selectAuthorization,
  authorization => authorization.status === AuthorizationStatus.Authorized
);
