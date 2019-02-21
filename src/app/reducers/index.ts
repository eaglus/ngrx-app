import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

import {AuthorizationState, authorizationReducer} from '../authorization';

import { environment } from '../../environments/environment';

export interface State {
  authorization: AuthorizationState;
}
export const reducers: ActionReducerMap<State> = {
  authorization: authorizationReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
