import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import {AuthorizationState, authorizationReducer} from '../authorization';

import { environment } from '../../environments/environment';

export interface State {
  authorization: AuthorizationState;
  router: RouterReducerState;
}
export const reducers: ActionReducerMap<State> = {
  authorization: authorizationReducer,
  router: routerReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
