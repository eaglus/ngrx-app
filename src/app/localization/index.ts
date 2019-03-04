export { SetLanguage } from './localization.actions';
export {
  StateSegment as LocalizationSegment,
  State as LocalizationState,
  languagesAvaiable,
  reducer as localizationReducer,
} from './localization.reducer';

export { selectLanguage } from './localization.selector';

export { LocalizationEffects } from './localization.effects';
