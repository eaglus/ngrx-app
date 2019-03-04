import { Action } from '@ngrx/store';
import { isType } from 'typescript-fsa';

import { SetLanguage } from './localization.actions';

export interface State {
  language: string;
}

const initialState = {
  language: undefined
};

export const languagesAvaiable = [
  {
    code: 'en',
    name: 'English'
  },
  {
    code: 'ru',
    name: 'Русский'
  },
];

export const defaultLanguageCode = 'en';

export interface StateSegment {
  localization: State;
}

export function reducer(state: State = initialState, action: Action): State {
  if (isType(action, SetLanguage)) {
    return {
      ...state,
      language: action.payload
    };
  } else {
    return state;
  }
}
