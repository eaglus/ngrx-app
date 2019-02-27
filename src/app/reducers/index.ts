import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { AuthorizationState, authorizationReducer } from '../authorization';
import { CallExplorerState, callExplorerReducer } from '../callExplorer';

import { environment } from '../../environments/environment';

export interface State {
  authorization: AuthorizationState;
  callExplorer: CallExplorerState;
  router: RouterReducerState;
}
export const reducers: ActionReducerMap<State> = {
  authorization: authorizationReducer,
  callExplorer: callExplorerReducer,
  router: routerReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
