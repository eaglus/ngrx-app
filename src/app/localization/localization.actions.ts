import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('localization');

export const SetLanguage = actionCreator<string>('setLanguage');
