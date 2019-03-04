import { createSelector } from '@ngrx/store';

import { StateSegment } from './localization.reducer';

export const selectLocalizaion = (state: StateSegment) => state.localization;

export const selectLanguage = createSelector(
  selectLocalizaion,
  localization => localization.language
);
