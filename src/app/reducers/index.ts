import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import { AuthorizationState, authorizationReducer } from '../authorization';
import { ExplorerState, explorerReducer } from '../explorer';

import { environment } from '../../environments/environment';

export interface State {
  authorization: AuthorizationState;
  explorer: ExplorerState;
  router: RouterReducerState;
}
export const reducers: ActionReducerMap<State> = {
  authorization: authorizationReducer,
  explorer: explorerReducer,
  router: routerReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
